<script setup lang="ts">
import { profile } from '~/data/profile'
</script>

<template>
  <section
    id="about"
    class="section about-section"
    data-scene="2.65"
  >
    <div class="about-number">
      02
    </div>

    <figure
      class="about-portrait"
      data-parallax="0.055"
    >
      <div class="about-portrait-frame">
        <img
          src="/images/profile/me-portrait-4x5.webp"
          :alt="`${profile.name}, Developer and Marketing Specialist`"
          width="1122"
          height="1402"
          loading="lazy"
          decoding="async"
        >

        <div
          class="about-portrait-light"
          aria-hidden="true"
        />
      </div>

      <figcaption>
        <span>
          Developer
        </span>

        <i />

        <span>
          Marketing
        </span>
      </figcaption>
    </figure>

    <div
      class="about-copy"
      data-parallax="0.025"
    >
      <p class="eyebrow">
        About me
      </p>

      <h2>
        I sit between
        <em>product</em>
        and
        <em>growth.</em>
      </h2>

      <p>
        {{ profile.about }}
      </p>
    </div>

    <div
      class="principles glass-panel"
      data-parallax="0.045"
    >
      <div>
        <span>01</span>

        <p>
          Make the complicated feel obvious.
        </p>
      </div>

      <div>
        <span>02</span>

        <p>
          Measure outcomes, not activity.
        </p>
      </div>

      <div>
        <span>03</span>

        <p>
          Performance is part of the design.
        </p>
      </div>
    </div>
  </section>
</template>