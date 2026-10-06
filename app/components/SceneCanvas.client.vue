<script setup lang="ts">
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const canvas = ref<HTMLCanvasElement | null>(null)

let cleanup: (() => void) | undefined

onBeforeUnmount(() => {
  cleanup?.()
})

onMounted(() => {
  if (!canvas.value) return

  gsap.registerPlugin(ScrollTrigger)

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  const coarsePointer = window.matchMedia(
    '(pointer: coarse)'
  ).matches

  /* =========================================================
     THREE.JS SETUP
     ========================================================= */

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance'
  })

  renderer.outputColorSpace = THREE.SRGBColorSpace

  const getPixelRatio = () => {
    return Math.min(
      window.devicePixelRatio || 1,
      coarsePointer ? 1 : 1.25
    )
  }

  renderer.setPixelRatio(getPixelRatio())

  renderer.setSize(
    window.innerWidth,
    window.innerHeight,
    false
  )

  const scene = new THREE.Scene()

  const camera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    0,
    1
  )

  const geometry = new THREE.PlaneGeometry(2, 2)

  /* =========================================================
     SHADER UNIFORMS
     ========================================================= */

  const uniforms = {
    uTime: {
      value: 0
    },

    uStage: {
      value: 0
    },

    uScroll: {
      value: 0
    },

    uVelocity: {
      value: 0
    },

    uAspect: {
      value:
        window.innerWidth /
        window.innerHeight
    },

    uPointer: {
      value: new THREE.Vector2(0.5, 0.5)
    }
  }

  /* =========================================================
     SHADER
     ========================================================= */

  const material = new THREE.ShaderMaterial({
    uniforms,

    vertexShader: /* glsl */ `
      varying vec2 vUv;

      void main() {
        vUv = uv;

        gl_Position = vec4(
          position.xy,
          0.0,
          1.0
        );
      }
    `,

    fragmentShader: /* glsl */ `
      precision highp float;

      varying vec2 vUv;

      uniform float uTime;
      uniform float uStage;
      uniform float uScroll;
      uniform float uVelocity;
      uniform float uAspect;
      uniform vec2 uPointer;

      #define PI 3.14159265359

      /* -------------------------------------------------------
         RANDOM / NOISE
         ------------------------------------------------------- */

      float hash21(vec2 p) {
        p = fract(
          p * vec2(
            123.34,
            456.21
          )
        );

        p += dot(
          p,
          p + 45.32
        );

        return fract(
          p.x * p.y
        );
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);

        f =
          f *
          f *
          (
            3.0 -
            2.0 * f
          );

        return mix(
          mix(
            hash21(i),
            hash21(
              i +
              vec2(1.0, 0.0)
            ),
            f.x
          ),

          mix(
            hash21(
              i +
              vec2(0.0, 1.0)
            ),
            hash21(
              i +
              vec2(1.0, 1.0)
            ),
            f.x
          ),

          f.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;

        for (
          int i = 0;
          i < 5;
          i++
        ) {
          value +=
            amplitude *
            noise(p);

          p *= 2.03;

          amplitude *= 0.5;
        }

        return value;
      }

      /* -------------------------------------------------------
         SHAPE HELPERS
         ------------------------------------------------------- */

      float lineMask(
        float value,
        float width
      ) {
        return 1.0 -
          smoothstep(
            width,
            width + 0.015,
            abs(value)
          );
      }

      float ring(
        vec2 p,
        vec2 centre,
        float radius,
        float width
      ) {
        return 1.0 -
          smoothstep(
            width,
            width + 0.012,
            abs(
              length(
                p -
                centre
              ) -
              radius
            )
          );
      }

      float stageMask(
        float stage,
        float centre,
        float spread
      ) {
        float distanceFromStage =
          abs(
            stage -
            centre
          );

        return 1.0 -
          smoothstep(
            spread * 0.2,
            spread,
            distanceFromStage
          );
      }

      /* -------------------------------------------------------
         PAGE COLOUR STATES

         0    Intro
         1    Developer
         2    Marketing
         2.65 About / merge
         3.4  Projects
         4.2  Experience
         5    Contact
         ------------------------------------------------------- */

      vec3 basePalette(float stage) {
        vec3 intro =
          vec3(
            0.945,
            0.938,
            0.910
          );

        vec3 developer =
          vec3(
            0.902,
            0.920,
            0.920
          );

        vec3 marketing =
          vec3(
            0.944,
            0.918,
            0.873
          );

        vec3 merge =
          vec3(
            0.921,
            0.923,
            0.905
          );

        vec3 projects =
          vec3(
            0.914,
            0.916,
            0.902
          );

        vec3 experience =
          vec3(
            0.888,
            0.906,
            0.904
          );

        vec3 contact =
          vec3(
            0.949,
            0.938,
            0.906
          );

        vec3 colour =
          mix(
            intro,
            developer,
            smoothstep(
              0.0,
              1.0,
              stage
            )
          );

        colour =
          mix(
            colour,
            marketing,
            smoothstep(
              1.0,
              2.0,
              stage
            )
          );

        colour =
          mix(
            colour,
            merge,
            smoothstep(
              2.0,
              2.65,
              stage
            )
          );

        colour =
          mix(
            colour,
            projects,
            smoothstep(
              2.65,
              3.4,
              stage
            )
          );

        colour =
          mix(
            colour,
            experience,
            smoothstep(
              3.4,
              4.2,
              stage
            )
          );

        colour =
          mix(
            colour,
            contact,
            smoothstep(
              4.2,
              5.0,
              stage
            )
          );

        return colour;
      }

      /* =======================================================
         MAIN
         ======================================================= */

      void main() {
        vec2 uv = vUv;

        vec2 centred =
          uv * 2.0 -
          1.0;

        vec2 p = centred;

        p.x *= uAspect;

        float time =
          uTime * 0.14;

        float stage =
          clamp(
            uStage,
            0.0,
            5.0
          );

        vec3 colour =
          basePalette(stage);

        vec3 ink =
          vec3(
            0.07,
            0.075,
            0.075
          );

        vec3 red =
          vec3(
            0.72,
            0.055,
            0.065
          );

        vec3 steel =
          vec3(
            0.12,
            0.27,
            0.34
          );

        vec3 amber =
          vec3(
            0.61,
            0.34,
            0.12
          );

        /* -----------------------------------------------------
           GLOBAL ATMOSPHERE
           ----------------------------------------------------- */

        float atmosphere =
          fbm(
            p * 0.48 +
            vec2(
              time * 0.09,
              -time * 0.035
            )
          );

        colour +=
          vec3(
            0.04,
            0.038,
            0.03
          ) *
          atmosphere *
          0.44;

        /* =====================================================
           HERO
           Large orbital structure on right side.
           ===================================================== */

        float hero =
          stageMask(
            stage,
            0.0,
            1.12
          );

        vec2 heroCentre =
          vec2(
            0.56 * uAspect,
            0.04
          );

        float orbit1 =
          ring(
            p,
            heroCentre,
            0.58,
            0.006
          );

        float orbit2 =
          ring(
            p,
            heroCentre,
            0.82,
            0.004
          );

        float orbit3 =
          ring(
            p,
            heroCentre,
            1.05,
            0.003
          );

        float orbitMask =
          smoothstep(
            -0.15,
            0.62,
            centred.x
          );

        colour =
          mix(
            colour,
            steel,
            (
              orbit1 * 0.22 +
              orbit2 * 0.12 +
              orbit3 * 0.08
            ) *
            hero *
            orbitMask
          );

        /* -----------------------------------------------------
           HERO SIGNAL
           ----------------------------------------------------- */

        float heroWaveY =
          0.19 *
          sin(
            p.x * 2.0 +
            time * 1.25
          ) +

          0.05 *
          sin(
            p.x * 6.0 -
            time * 0.8
          );

        float heroSignal =
          lineMask(
            p.y -
            heroWaveY,
            0.012
          );

        colour +=
          red *
          heroSignal *
          hero *
          orbitMask *
          0.27;

        /* -----------------------------------------------------
           PARTICLE / SIGNAL CLOUD
           ----------------------------------------------------- */

        vec2 particleGrid =
          centred *
          vec2(
            16.0,
            13.0
          );

        vec2 particleCell =
          floor(
            particleGrid
          );

        vec2 particleLocal =
          fract(
            particleGrid
          ) -
          0.5;

        float randomValue =
          hash21(
            particleCell
          );

        float particle =
          1.0 -
          smoothstep(
            0.035,
            0.09,
            length(
              particleLocal
            )
          );

        particle *=
          step(
            0.69,
            randomValue
          );

        float waveShape =
          sin(
            centred.x * 4.0 +
            time
          ) *
          0.22;

        particle *=
          1.0 -
          smoothstep(
            0.14,
            0.6,
            abs(
              centred.y -
              waveShape
            )
          );

        colour =
          mix(
            colour,
            ink,
            particle *
            (
              0.20 +
              hero * 0.24
            )
          );

        /* =====================================================
           DEVELOPMENT
           Technical coordinate system.
           ===================================================== */

        float developer =
          stageMask(
            stage,
            1.0,
            0.85
          );

        vec2 devPosition =
          p +
          vec2(
            time * 0.06,
            -time * 0.025
          );

        vec2 gridPosition =
          abs(
            fract(
              devPosition *
              3.15
            ) -
            0.5
          );

        float fineGrid =
          1.0 -
          smoothstep(
            0.485,
            0.499,
            max(
              gridPosition.x,
              gridPosition.y
            )
          );

        colour -=
          ink *
          fineGrid *
          developer *
          0.055;

        float diagonalA =
          lineMask(
            sin(
              p.x * 3.1 +
              p.y * 2.5 +
              time
            ),
            0.052
          );

        float diagonalB =
          lineMask(
            sin(
              p.x * 4.7 -
              p.y * 3.2 -
              time * 0.7
            ),
            0.035
          );

        colour +=
          steel *
          (
            diagonalA * 0.11 +
            diagonalB * 0.075
          ) *
          developer;

        /* =====================================================
           MARKETING
           Fluid growth / signal field.
           ===================================================== */

        float marketing =
          stageMask(
            stage,
            2.0,
            0.95
          );

        float field =
          fbm(
            p * 1.2 +
            vec2(
              time * 0.28,
              -time * 0.16
            )
          );

        float fluidA =
          sin(
            p.x * 3.3 +
            p.y * 2.0 +
            field * 3.6 +
            time
          );

        float fluidB =
          sin(
            p.x * 1.8 -
            p.y * 4.6 -
            field * 3.2 -
            time * 0.72
          );

        float fluidRibbon =
          lineMask(
            fluidA * 0.68 +
            fluidB * 0.32,
            0.10
          );

        colour +=
          amber *
          fluidRibbon *
          marketing *
          0.11;

        colour +=
          red *
          fluidRibbon *
          marketing *
          0.07;

        /* =====================================================
           ABOUT / MERGE
           Technology and marketing meet.
           ===================================================== */

        float overlap =
          stageMask(
            stage,
            2.65,
            0.75
          );

        float mergeWave =
          sin(
            p.x * 4.0 +
            fbm(
              p * 1.6 -
              time * 0.12
            ) *
            5.0
          );

        float mergeRibbon =
          lineMask(
            p.y * 2.2 -
            mergeWave * 0.28,
            0.025
          );

        colour +=
          steel *
          mergeRibbon *
          overlap *
          0.10;

        colour +=
          red *
          mergeRibbon *
          overlap *
          0.08;

        /* =====================================================
           PROJECTS
           Quieter orbital architecture.
           ===================================================== */

        float projects =
          stageMask(
            stage,
            3.4,
            0.78
          );

        vec2 projectCentre =
          vec2(
            -0.22 * uAspect,
            0.10
          );

        float projectOrbit1 =
          ring(
            p,
            projectCentre,
            0.52,
            0.004
          );

        float projectOrbit2 =
          ring(
            p,
            projectCentre,
            0.82,
            0.003
          );

        float projectOrbit3 =
          ring(
            p,
            projectCentre,
            1.16,
            0.002
          );

        colour -=
          ink *
          (
            projectOrbit1 * 0.16 +
            projectOrbit2 * 0.10 +
            projectOrbit3 * 0.06
          ) *
          projects;

        /* =====================================================
           EXPERIENCE
           Contour / topographic system.
           ===================================================== */

        float experience =
          stageMask(
            stage,
            4.2,
            0.82
          );

        float terrain =
          fbm(
            p * 1.4 +
            vec2(
              -time * 0.13,
              0.0
            )
          );

        float contours =
          1.0 -
          smoothstep(
            0.035,
            0.08,
            abs(
              fract(
                (
                  terrain +
                  p.y * 0.45
                ) *
                11.0
              ) -
              0.5
            )
          );

        colour =
          mix(
            colour,
            steel,
            contours *
            experience *
            0.055
          );

        /* =====================================================
           CONTACT
           Final convergence.
           ===================================================== */

        float contact =
          stageMask(
            stage,
            5.0,
            0.88
          );

        float horizonY =
          -0.19 +

          0.09 *
          sin(
            p.x * 1.8 +
            time * 0.65
          );

        float horizon =
          lineMask(
            p.y -
            horizonY,
            0.013
          );

        colour +=
          red *
          horizon *
          contact *
          0.22;

        float contactGlow =
          exp(
            -2.6 *
            length(
              p -
              vec2(
                0.34 * uAspect,
                -0.30
              )
            )
          );

        colour +=
          vec3(
            0.11,
            0.07,
            0.025
          ) *
          contactGlow *
          contact *
          0.25;

        /* =====================================================
           PERSISTENT THREAD
           Runs throughout the whole portfolio.
           ===================================================== */

        float threadY =
          0.12 *
          sin(
            p.x * 2.2 +
            time * 0.8 +
            uScroll * 8.0
          ) +

          0.035 *
          sin(
            p.x * 8.0 -
            time
          );

        float thread =
          lineMask(
            p.y -
            threadY,
            0.004 +
            uVelocity * 0.010
          );

        colour +=
          red *
          thread *
          (
            0.035 +
            stage * 0.018
          );

        /* =====================================================
           POINTER LIGHT
           ===================================================== */

        vec2 pointer =
          (
            uPointer -
            0.5
          ) *
          2.0;

        pointer.x *=
          uAspect;

        float pointerLight =
          exp(
            -3.0 *
            length(
              p -
              pointer
            )
          );

        colour +=
          vec3(
            0.035,
            0.036,
            0.032
          ) *
          pointerLight;

        /* =====================================================
           VIGNETTE
           ===================================================== */

        float vignetteDistance =
          length(
            centred *
            vec2(
              0.83,
              1.0
            )
          );

        float vignette =
          1.0 -
          smoothstep(
            0.14,
            1.35,
            vignetteDistance
          );

        colour *=
          0.965 +
          vignette * 0.045;

        /* =====================================================
           SUBTLE FILM GRAIN
           ===================================================== */

        float grain =
          hash21(
            gl_FragCoord.xy +
            fract(uTime) *
            50.0
          ) -
          0.5;

        colour +=
          grain * 0.006;

        gl_FragColor =
          vec4(
            colour,
            1.0
          );
      }
    `
  })

  const quad = new THREE.Mesh(
    geometry,
    material
  )

  scene.add(quad)

  /* =========================================================
     INTERACTION STATE
     ========================================================= */

  const pointerTarget =
    new THREE.Vector2(
      0.5,
      0.5
    )

  let targetStage = 0
  let targetVelocity = 0

  let previousScroll =
    window.scrollY

  /* =========================================================
     SCROLL SCENE POSITIONS
     ========================================================= */

  type SceneStop = {
    y: number
    stage: number
  }

  let stops: SceneStop[] = []

  const updateStops = () => {
    stops = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-scene]'
      )
    )
      .map(
        (element): SceneStop => ({
          y:
            element.offsetTop +
            element.offsetHeight * 0.25,

          stage: Number(
            element.dataset.scene ?? 0
          )
        })
      )
      .sort(
        (a, b) =>
          a.y - b.y
      )
  }

  const calculateStage = () => {
    const first =
      stops.at(0)

    const last =
      stops.at(-1)

    /*
      If no data-scene sections exist,
      keep the intro state.
    */
    if (!first || !last) {
      targetStage = 0
      return
    }

    const probe =
      window.scrollY +
      window.innerHeight * 0.48

    /*
      Before the first scene.
    */
    if (probe <= first.y) {
      targetStage =
        first.stage

      return
    }

    /*
      Past the final scene.
    */
    if (probe >= last.y) {
      targetStage =
        last.stage

      return
    }

    /*
      Smooth interpolation between
      neighbouring scene markers.
    */
    for (
      let index = 0;
      index < stops.length - 1;
      index++
    ) {
      const current =
        stops[index]

      const next =
        stops[index + 1]

      /*
        Important for strict TypeScript
        and noUncheckedIndexedAccess.
      */
      if (!current || !next) {
        continue
      }

      if (
        probe < current.y ||
        probe > next.y
      ) {
        continue
      }

      const distance =
        next.y -
        current.y

      if (distance <= 0) {
        targetStage =
          next.stage

        return
      }

      let progress =
        (
          probe -
          current.y
        ) /
        distance

      progress =
        THREE.MathUtils.clamp(
          progress,
          0,
          1
        )

      /*
        Smoothstep.

        t² × (3 - 2t)
      */
      progress =
        progress *
        progress *
        (
          3 -
          2 * progress
        )

      targetStage =
        current.stage +
        (
          next.stage -
          current.stage
        ) *
        progress

      return
    }

    targetStage =
      last.stage
  }

  /* =========================================================
     SCROLL
     ========================================================= */

  const updateScroll = () => {
    const current =
      window.scrollY

    const delta =
      Math.abs(
        current -
        previousScroll
      )

    previousScroll =
      current

    targetVelocity =
      Math.min(
        1,
        delta / 70
      )

    const maxScroll =
      Math.max(
        1,
        document.documentElement.scrollHeight -
        window.innerHeight
      )

    uniforms.uScroll.value =
      current /
      maxScroll

    calculateStage()
  }

  /* =========================================================
     POINTER
     ========================================================= */

  const updatePointer = (
    event: PointerEvent
  ) => {
    pointerTarget.set(
      event.clientX /
        window.innerWidth,

      1 -
        event.clientY /
        window.innerHeight
    )
  }

  /* =========================================================
     HTML PARALLAX
     ========================================================= */

  const parallaxTweens:
    gsap.core.Tween[] = []

  if (
    !reduceMotion &&
    !coarsePointer
  ) {
    document
      .querySelectorAll<HTMLElement>(
        '[data-parallax]'
      )
      .forEach((element) => {
        const amount =
          Number(
            element.dataset.parallax ??
            0.03
          )

        const tween =
          gsap.fromTo(
            element,

            {
              yPercent:
                -amount * 100
            },

            {
              yPercent:
                amount * 100,

              ease: 'none',

              scrollTrigger: {
                trigger:
                  element,

                start:
                  'top bottom',

                end:
                  'bottom top',

                scrub:
                  0.8
              }
            }
          )

        parallaxTweens.push(
          tween
        )
      })
  }

  /* =========================================================
     RESIZE
     ========================================================= */

  const onResize = () => {
    renderer.setPixelRatio(
      getPixelRatio()
    )

    renderer.setSize(
      window.innerWidth,
      window.innerHeight,
      false
    )

    uniforms.uAspect.value =
      window.innerWidth /
      window.innerHeight

    updateStops()
    calculateStage()

    ScrollTrigger.refresh()
  }

  /* =========================================================
     START
     ========================================================= */

  updateStops()
  updateScroll()

  window.addEventListener(
    'resize',
    onResize,
    {
      passive: true
    }
  )

  window.addEventListener(
    'scroll',
    updateScroll,
    {
      passive: true
    }
  )

  window.addEventListener(
    'pointermove',
    updatePointer,
    {
      passive: true
    }
  )

  ScrollTrigger.addEventListener(
    'refresh',
    updateStops
  )

  /* =========================================================
     ANIMATION LOOP
     ========================================================= */

  const clock =
    new THREE.Clock()

  renderer.setAnimationLoop(() => {
    /*
      Do not waste GPU resources while
      the browser tab is hidden.
    */
    if (document.hidden) return

    if (!reduceMotion) {
      uniforms.uTime.value =
        clock.getElapsedTime()
    }

    /*
      Ease smoothly into the current
      scroll scene.
    */
    uniforms.uStage.value +=
      (
        targetStage -
        uniforms.uStage.value
      ) *
      (
        reduceMotion
          ? 1
          : 0.055
      )

    /*
      Scroll velocity briefly increases
      the energy of the persistent thread.
    */
    uniforms.uVelocity.value +=
      (
        targetVelocity -
        uniforms.uVelocity.value
      ) *
      0.09

    targetVelocity *=
      0.88

    /*
      Soft mouse tracking.
    */
    uniforms.uPointer.value.lerp(
      pointerTarget,
      0.045
    )

    renderer.render(
      scene,
      camera
    )
  })

  /* =========================================================
     CLEANUP
     ========================================================= */

  cleanup = () => {
    renderer.setAnimationLoop(null)

    window.removeEventListener(
      'resize',
      onResize
    )

    window.removeEventListener(
      'scroll',
      updateScroll
    )

    window.removeEventListener(
      'pointermove',
      updatePointer
    )

    ScrollTrigger.removeEventListener(
      'refresh',
      updateStops
    )

    parallaxTweens.forEach(
      (tween) => {
        tween.kill()
      }
    )

    geometry.dispose()
    material.dispose()
    renderer.dispose()
  }
})
</script>

<template>
  <canvas
    ref="canvas"
    class="scene-canvas"
    aria-hidden="true"
  />
</template>