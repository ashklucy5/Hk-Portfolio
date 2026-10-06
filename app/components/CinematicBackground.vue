<script setup lang="ts">
/**
 * =========================================================
 * CINEMATIC BACKGROUND
 * =========================================================
 *
 * Production motion controller.
 *
 * Performance rules:
 *
 * - scroll work runs at most once per animation frame
 * - pointer work runs at most once per animation frame
 * - document height is cached instead of read every scroll
 * - CSS variables stay on document.documentElement so the
 *   existing parallax CSS receives them exactly as before
 * - unused scroll velocity / wind calculations are removed
 */

let cleanup:
  (() => void) | null =
  null


/* =========================================================
   HELPERS
   ========================================================= */

const clamp = (
  value: number,
  minimum = 0,
  maximum = 1
) => {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  )
}


const smoothstep = (
  start: number,
  end: number,
  value: number
) => {
  const progress =
    clamp(
      (
        value -
        start
      ) /
      (
        end -
        start
      )
    )

  return (
    progress *
    progress *
    (
      3 -
      2 *
      progress
    )
  )
}


/* =========================================================
   CLIENT MOTION
   ========================================================= */

onMounted(() => {
  /*
   * Keep these motion variables on <html>.
   *
   * main.css already consumes:
   *
   * --page-progress
   * --veil-light
   * --veil-middle
   * --veil-dark
   * --scene-pointer-x
   * --scene-pointer-y
   *
   * from this scope.
   */

  const root =
    document.documentElement


  const reducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

  const finePointer =
    window.matchMedia(
      '(pointer: fine)'
    )


  let scrollFrame:
    number | null =
    null

  let pointerFrame:
    number | null =
    null

  let resizeObserver:
    ResizeObserver | null =
    null


  let maximumScroll = 1

  let depthMultiplier = 1


  let pointerX = 0
  let pointerY = 0


  /**
   * Prevent duplicate style writes when the rounded
   * CSS-variable value has not changed.
   */

  const writtenValues =
    new Map<string, string>()


  const setSceneVariable = (
    name: string,
    value: string
  ) => {
    if (
      writtenValues.get(name) ===
      value
    ) {
      return
    }

    writtenValues.set(
      name,
      value
    )

    root.style.setProperty(
      name,
      value
    )
  }


  /* =======================================================
     VIEWPORT METRICS
     ======================================================= */

  const updateMetrics = () => {
    maximumScroll =
      Math.max(
        document
          .documentElement
          .scrollHeight -
        window.innerHeight,
        1
      )

    /**
     * Keep full desktop depth.
     *
     * Mobile receives slightly less movement to reduce GPU
     * work while preserving the visible parallax.
     */

    depthMultiplier =
      window.innerWidth <= 768
        ? 0.88
        : 1
  }


  /* =======================================================
     SCROLL → DEPTH + LIGHTING
     ======================================================= */

  const updateScroll = () => {
    const scrollY =
      Math.max(
        window.scrollY,
        0
      )

    const pageProgress =
      clamp(
        scrollY /
        maximumScroll
      )

    const depthProgress =
      reducedMotion.matches
        ? 0
        : pageProgress *
          depthMultiplier


    /*
     * Drives the individual photographic depth layers.
     */

    setSceneVariable(
      '--page-progress',
      depthProgress.toFixed(4)
    )


    /*
     * Same photographic world.
     *
     * Only the lighting/readability treatment evolves
     * throughout the page.
     */

    const light =
      1 -
      smoothstep(
        0.10,
        0.29,
        pageProgress
      )

    const middleIn =
      smoothstep(
        0.10,
        0.27,
        pageProgress
      )

    const middleOut =
      1 -
      smoothstep(
        0.40,
        0.59,
        pageProgress
      )

    const middle =
      middleIn *
      middleOut

    const dark =
      smoothstep(
        0.30,
        0.56,
        pageProgress
      )


    setSceneVariable(
      '--veil-light',
      light.toFixed(3)
    )

    setSceneVariable(
      '--veil-middle',
      middle.toFixed(3)
    )

    setSceneVariable(
      '--veil-dark',
      dark.toFixed(3)
    )
  }


  /*
   * Browser scroll events can fire many times in one
   * rendering interval.
   *
   * Only perform one update per animation frame.
   */

  const scheduleScrollUpdate =
    () => {
      if (
        scrollFrame !==
        null
      ) {
        return
      }

      scrollFrame =
        requestAnimationFrame(
          () => {
            scrollFrame =
              null

            updateScroll()
          }
        )
    }


  /* =======================================================
     POINTER MICRO-PARALLAX
     ======================================================= */

  const applyPointer =
    () => {
      pointerFrame =
        null

      setSceneVariable(
        '--scene-pointer-x',
        pointerX.toFixed(3)
      )

      setSceneVariable(
        '--scene-pointer-y',
        pointerY.toFixed(3)
      )
    }


  /*
   * Pointer input is also limited to one update
   * per animation frame.
   */

  const schedulePointerUpdate =
    () => {
      if (
        pointerFrame !==
        null
      ) {
        return
      }

      pointerFrame =
        requestAnimationFrame(
          applyPointer
        )
    }


  const updatePointer = (
    event: PointerEvent
  ) => {
    if (
      reducedMotion.matches ||
      !finePointer.matches
    ) {
      return
    }

    pointerX =
      clamp(
        (
          event.clientX /
          window.innerWidth -
          0.5
        ) *
        2,
        -1,
        1
      )

    pointerY =
      clamp(
        (
          event.clientY /
          window.innerHeight -
          0.5
        ) *
        2,
        -1,
        1
      )

    schedulePointerUpdate()
  }


  const resetPointer =
    () => {
      pointerX = 0
      pointerY = 0

      schedulePointerUpdate()
    }


  /* =======================================================
     RESIZE
     ======================================================= */

  const handleResize =
    () => {
      updateMetrics()
      scheduleScrollUpdate()
    }


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  setSceneVariable(
    '--scene-pointer-x',
    '0'
  )

  setSceneVariable(
    '--scene-pointer-y',
    '0'
  )

  /*
   * Keep compatibility with the existing global CSS.
   */

  setSceneVariable(
    '--hero-scene',
    '1'
  )

  setSceneVariable(
    '--lower-scene',
    '0'
  )


  updateMetrics()
  updateScroll()


  /* =======================================================
     EVENTS
     ======================================================= */

  window.addEventListener(
    'scroll',
    scheduleScrollUpdate,
    {
      passive: true
    }
  )


  window.addEventListener(
    'resize',
    handleResize,
    {
      passive: true
    }
  )


  if (
    finePointer.matches
  ) {
    window.addEventListener(
      'pointermove',
      updatePointer,
      {
        passive: true
      }
    )

    document.documentElement
      .addEventListener(
        'pointerleave',
        resetPointer
      )
  }


  /*
   * Document height can change when GitHub projects,
   * images or responsive content finish loading.
   *
   * Recalculate only when layout size actually changes
   * instead of reading scrollHeight every scroll frame.
   */

  if (
    'ResizeObserver' in window
  ) {
    resizeObserver =
      new ResizeObserver(
        () => {
          updateMetrics()
          scheduleScrollUpdate()
        }
      )

    resizeObserver.observe(
      document.documentElement
    )
  }


  reducedMotion.addEventListener(
    'change',
    scheduleScrollUpdate
  )


  /* =======================================================
     CLEANUP
     ======================================================= */

  cleanup =
    () => {
      window.removeEventListener(
        'scroll',
        scheduleScrollUpdate
      )

      window.removeEventListener(
        'resize',
        handleResize
      )

      window.removeEventListener(
        'pointermove',
        updatePointer
      )

      document.documentElement
        .removeEventListener(
          'pointerleave',
          resetPointer
        )

      reducedMotion
        .removeEventListener(
          'change',
          scheduleScrollUpdate
        )

      resizeObserver
        ?.disconnect()


      if (
        scrollFrame !==
        null
      ) {
        cancelAnimationFrame(
          scrollFrame
        )
      }


      if (
        pointerFrame !==
        null
      ) {
        cancelAnimationFrame(
          pointerFrame
        )
      }


      root.style.removeProperty(
        '--scene-pointer-x'
      )

      root.style.removeProperty(
        '--scene-pointer-y'
      )
    }
})


onBeforeUnmount(() => {
  cleanup?.()
})
</script>


<template>
  <div
    class="cinematic-bg"
    aria-hidden="true"
  >
    <!-- ===================================================
         ONE CONTINUOUS PHOTOGRAPHIC WORLD
         =================================================== -->

    <div class="scene scene-hero">
      <!-- farthest -->
      <div
        class="
          layer
          hero-sky
        "
      />

      <!-- distant mountains -->
      <div
        class="
          layer
          hero-mountains-back
        "
      />

      <!-- closer mountains -->
      <div
        class="
          layer
          hero-mountains-front
        "
      />

      <!-- house / architecture -->
      <div
        class="
          layer
          hero-architecture
        "
      />

      <!-- rocks / plants / foreground -->
      <div
        class="
          layer
          hero-foreground
        "
      />
    </div>


    <!-- ===================================================
         LIVING WORLD
         =================================================== -->

    <div class="ambient-frame">
      <!--
        Soft atmospheric haze.

        These are gradients, not large image files.
      -->

      <div
        class="
          air-haze
          air-haze-a
        "
      />

      <div
        class="
          air-haze
          air-haze-b
        "
      />


      <!-- =================================================
           WIND / FOLIAGE

           For now we reuse the transparent foreground
           asset and isolate its edge regions.

           Later we'll replace these with dedicated
           transparent foliage images for even better
           movement.
           ================================================= -->

      <div
        class="
          wind-foliage
          wind-foliage-left
        "
      />

      <div
        class="
          wind-foliage
          wind-foliage-right
        "
      />


      <!-- =================================================
           BIRDS — FLOCK 01
           ================================================= -->

      <div
        class="
          bird-flight
          bird-flight-a
        "
      >
        <span
          class="
            bird
            bird-a
          "
        >
          <svg
            viewBox="0 0 26 14"
            focusable="false"
          >
            <path
              d="M1 8C5 3 9 3 13 8C17 3 21 3 25 8C20 6 17 7 13 11C9 7 6 6 1 8Z"
            />
          </svg>
        </span>

        <span
          class="
            bird
            bird-b
          "
        >
          <svg
            viewBox="0 0 26 14"
            focusable="false"
          >
            <path
              d="M1 8C5 3 9 3 13 8C17 3 21 3 25 8C20 6 17 7 13 11C9 7 6 6 1 8Z"
            />
          </svg>
        </span>

        <span
          class="
            bird
            bird-c
          "
        >
          <svg
            viewBox="0 0 26 14"
            focusable="false"
          >
            <path
              d="M1 8C5 3 9 3 13 8C17 3 21 3 25 8C20 6 17 7 13 11C9 7 6 6 1 8Z"
            />
          </svg>
        </span>
      </div>


      <!-- =================================================
           BIRDS — FLOCK 02
           ================================================= -->

      <div
        class="
          bird-flight
          bird-flight-b
        "
      >
        <span
          class="
            bird
            bird-a
          "
        >
          <svg
            viewBox="0 0 26 14"
            focusable="false"
          >
            <path
              d="M1 8C5 3 9 3 13 8C17 3 21 3 25 8C20 6 17 7 13 11C9 7 6 6 1 8Z"
            />
          </svg>
        </span>

        <span
          class="
            bird
            bird-b
          "
        >
          <svg
            viewBox="0 0 26 14"
            focusable="false"
          >
            <path
              d="M1 8C5 3 9 3 13 8C17 3 21 3 25 8C20 6 17 7 13 11C9 7 6 6 1 8Z"
            />
          </svg>
        </span>
      </div>


      <!-- =================================================
           DISTANT SINGLE BIRD
           ================================================= -->

      <div
        class="
          bird-flight
          bird-flight-c
        "
      >
        <span
          class="
            bird
            bird-single
          "
        >
          <svg
            viewBox="0 0 26 14"
            focusable="false"
          >
            <path
              d="M1 8C5 3 9 3 13 8C17 3 21 3 25 8C20 6 17 7 13 11C9 7 6 6 1 8Z"
            />
          </svg>
        </span>
      </div>
    </div>


    <!-- ===================================================
         READABILITY LIGHTING

         Same picture underneath.
         Only the lighting treatment evolves.
         =================================================== -->

    <div
      class="
        reading-veil
        reading-veil-light
      "
    />

    <div
      class="
        reading-veil
        reading-veil-middle
      "
    />

    <div
      class="
        reading-veil
        reading-veil-dark
      "
    />


    <!-- subtle final atmospheric treatment -->
    <div class="cinematic-atmosphere" />
  </div>
</template>


<style scoped>
/* =========================================================
   AMBIENT WORLD
   ========================================================= */

.ambient-frame {
  position:
    absolute;

  inset:
    -2%;

  z-index:
    8;

  width:
    104%;

  height:
    104%;

  overflow:
    hidden;

  pointer-events:
    none;

  transform:
    translate3d(
      calc(
        var(
          --scene-pointer-x,
          0
        ) *
        -7px
      ),
      calc(
        var(
          --scene-pointer-y,
          0
        ) *
        -4px
      ),
      0
    );

  transition:
  transform
  180ms
  ease-out;
}


/* =========================================================
   AIR / HAZE
   ========================================================= */

.air-haze {
  position:
    absolute;

  pointer-events:
    none;

  will-change:
    transform;

  backface-visibility:
    hidden;
}

.air-haze-a {
  left:
    -14%;

  top:
    18%;

  width:
    62%;

  height:
    36%;

  opacity:
    0.20;

  background:
    radial-gradient(
      ellipse at center,

      rgba(
        255,
        237,
        205,
        0.46
      ),

      rgba(
        255,
        237,
        205,
        0
      )
      68%
    );

  animation:
    cinematic-haze-a
    18s
    ease-in-out
    infinite
    alternate;
}


.air-haze-b {
  right:
    -18%;

  top:
    2%;

  width:
    58%;

  height:
    40%;

  opacity:
    0.13;

  background:
    radial-gradient(
      ellipse at center,

      rgba(
        185,
        208,
        228,
        0.44
      ),

      rgba(
        185,
        208,
        228,
        0
      )
      70%
    );

  animation:
    cinematic-haze-b
    22s
    ease-in-out
    infinite
    alternate;
}


@keyframes cinematic-haze-a {
  from {
    transform:
      translate3d(
        -2vw,
        0,
        0
      )
      scale(1);
  }

  to {
    transform:
      translate3d(
        6vw,
        2vh,
        0
      )
      scale(1.08);
  }
}


@keyframes cinematic-haze-b {
  from {
    transform:
      translate3d(
        3vw,
        -1vh,
        0
      )
      scale(1.04);
  }

  to {
    transform:
      translate3d(
        -5vw,
        2vh,
        0
      )
      scale(1.12);
  }
}


/* =========================================================
   WIND / TREE MOVEMENT
   ========================================================= */

/*
 * These overlays reuse hero-foreground.webp.
 *
 * They only expose the far left/right edge regions so we
 * can create subtle movement around foliage without moving
 * the whole world.
 */

.wind-foliage {
  position:
    absolute;

  inset:
    -4%;

  width:
    108%;

  height:
    108%;

  background-image:
    url(
      '/background/hero-foreground.webp'
    );

  background-repeat:
    no-repeat;

  background-size:
    cover;

  background-position:
    center center;

  opacity:
    0.26;

  pointer-events:
    none;

  will-change:
    transform;

  backface-visibility:
    hidden;
}


.wind-foliage-left {
  clip-path:
    polygon(
      0 0,
      36% 0,
      29% 100%,
      0 100%
    );

  transform-origin:
    12% 48%;

  animation:
    cinematic-wind-left
    6.8s
    ease-in-out
    infinite
    alternate;
}


.wind-foliage-right {
  clip-path:
    polygon(
      74% 0,
      100% 0,
      100% 100%,
      80% 100%
    );

  transform-origin:
    91% 42%;

  animation:
    cinematic-wind-right
    8.2s
    ease-in-out
    infinite
    alternate;
}


@keyframes cinematic-wind-left {
  0% {
    transform:
      translate3d(
        -1px,
        0,
        0
      )
      rotate(-0.12deg)
      scale(1.002);
  }

  35% {
    transform:
      translate3d(
        2px,
        -1px,
        0
      )
      rotate(0.16deg)
      scale(1.004);
  }

  68% {
    transform:
      translate3d(
        -2px,
        1px,
        0
      )
      rotate(-0.08deg)
      scale(1.003);
  }

  100% {
    transform:
      translate3d(
        3px,
        -2px,
        0
      )
      rotate(0.22deg)
      scale(1.005);
  }
}


@keyframes cinematic-wind-right {
  0% {
    transform:
      translate3d(
        1px,
        0,
        0
      )
      rotate(0.10deg)
      scale(1.002);
  }

  42% {
    transform:
      translate3d(
        -3px,
        -1px,
        0
      )
      rotate(-0.20deg)
      scale(1.005);
  }

  72% {
    transform:
      translate3d(
        2px,
        1px,
        0
      )
      rotate(0.12deg)
      scale(1.003);
  }

  100% {
    transform:
      translate3d(
        -2px,
        -2px,
        0
      )
      rotate(-0.16deg)
      scale(1.004);
  }
}


/* =========================================================
   BIRDS
   ========================================================= */

.bird-flight {
  position:
    absolute;

  left:
    0;

  top:
    0;

  z-index:
    12;

  width:
    110px;

  height:
    70px;

  opacity:
    0;

  pointer-events:
    none;

  will-change:
    transform,
    opacity;
}


.bird {
  position:
    absolute;

  display:
    block;

  color:
    rgba(
      22,
      26,
      28,
      0.72
    );

  filter:
    drop-shadow(
      0
      1px
      1px
      rgba(
        255,
        255,
        255,
        0.08
      )
    );
}


.bird svg {
  display:
    block;

  width:
    100%;

  height:
    100%;

  overflow:
    visible;

  fill:
    currentColor;

  transform-origin:
    center;

  animation:
    bird-wing-flap
    850ms
    ease-in-out
    infinite
    alternate;
}


.bird-a {
  left:
    0;

  top:
    8px;

  width:
    26px;

  height:
    14px;
}


.bird-b {
  left:
    38px;

  top:
    27px;

  width:
    20px;

  height:
    11px;

  opacity:
    0.82;
}


.bird-c {
  left:
    72px;

  top:
    2px;

  width:
    16px;

  height:
    9px;

  opacity:
    0.66;
}


.bird-b svg {
  animation-delay:
    -260ms;
}


.bird-c svg {
  animation-delay:
    -510ms;
}


@keyframes bird-wing-flap {
  from {
    transform:
      scaleY(0.68)
      rotate(-1deg);
  }

  to {
    transform:
      scaleY(1.12)
      rotate(1deg);
  }
}


/* ---------------------------------------------------------
   Flight A
   --------------------------------------------------------- */

.bird-flight-a {
  animation:
    bird-flight-a
    24s
    linear
    infinite;

  animation-delay:
    -7s;
}


@keyframes bird-flight-a {
  0% {
    opacity:
      0;

    transform:
      translate3d(
        -14vw,
        24vh,
        0
      )
      scale(0.70)
      rotate(-3deg);
  }

  8% {
    opacity:
      0.72;
  }

  40% {
    transform:
      translate3d(
        38vw,
        16vh,
        0
      )
      scale(0.82)
      rotate(-1deg);
  }

  72% {
    opacity:
      0.72;

    transform:
      translate3d(
        79vw,
        9vh,
        0
      )
      scale(0.90)
      rotate(1deg);
  }

  92% {
    opacity:
      0.55;
  }

  100% {
    opacity:
      0;

    transform:
      translate3d(
        118vw,
        2vh,
        0
      )
      scale(0.96)
      rotate(3deg);
  }
}


/* ---------------------------------------------------------
   Flight B
   --------------------------------------------------------- */

.bird-flight-b {
  top:
    12%;

  transform:
    scale(0.62);

  animation:
    bird-flight-b
    31s
    linear
    infinite;

  animation-delay:
    -20s;
}


@keyframes bird-flight-b {
  0% {
    opacity:
      0;

    transform:
      translate3d(
        112vw,
        16vh,
        0
      )
      scale(0.52);
  }

  10% {
    opacity:
      0.46;
  }

  50% {
    opacity:
      0.52;

    transform:
      translate3d(
        52vw,
        9vh,
        0
      )
      scale(0.58);
  }

  90% {
    opacity:
      0.40;
  }

  100% {
    opacity:
      0;

    transform:
      translate3d(
        -15vw,
        4vh,
        0
      )
      scale(0.64);
  }
}


/* ---------------------------------------------------------
   Distant bird
   --------------------------------------------------------- */

.bird-flight-c {
  animation:
    bird-flight-c
    37s
    linear
    infinite;

  animation-delay:
    -13s;
}


.bird-single {
  left:
    0;

  top:
    0;

  width:
    13px;

  height:
    7px;

  opacity:
    0.48;
}


@keyframes bird-flight-c {
  0% {
    opacity:
      0;

    transform:
      translate3d(
        -8vw,
        11vh,
        0
      )
      scale(0.65);
  }

  12% {
    opacity:
      0.34;
  }

  65% {
    opacity:
      0.40;

    transform:
      translate3d(
        74vw,
        20vh,
        0
      )
      scale(0.78);
  }

  100% {
    opacity:
      0;

    transform:
      translate3d(
        110vw,
        24vh,
        0
      )
      scale(0.84);
  }
}


/* =========================================================
   MOBILE
   ========================================================= */

@media (
  max-width: 768px
) {
  /*
   * Smaller pointer layer because pointer movement isn't
   * relevant on most phones.
   */

  .ambient-frame {
    inset:
      -1%;

    width:
      102%;

    height:
      102%;

    transform:
      none;
  }


  /*
   * Less foliage duplication on mobile.
   */

  .wind-foliage {
  display:
    none;
}

.air-haze-b {
  display:
    none;
}

  /*
   * Keep one bird group visible.
   *
   * This keeps the environment alive without wasting
   * mobile GPU time.
   */

  .bird-flight-b,
  .bird-flight-c {
    display:
      none;
  }


  .bird-flight-a {
    animation-duration:
      27s;
  }


  .air-haze {
    filter:
      blur(18px);
  }
}


/* =========================================================
   VERY SMALL PHONE
   ========================================================= */

@media (
  max-width: 480px
) {
  .bird-flight-a {
    transform:
      scale(0.78);
  }
}


/* =========================================================
   REDUCED MOTION
   ========================================================= */

@media (
  prefers-reduced-motion:
  reduce
) {
  .bird-flight,
  .wind-foliage {
    display:
      none;
  }

  .air-haze {
    animation:
      none;

    transform:
      none;
  }

  .ambient-frame {
    transform:
      none;
  }
}
</style>