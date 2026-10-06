<script setup lang="ts">
import { profile } from '~/data/profile'
import SkillIcon from '~/components/SkillIcon.vue'
</script>

<template>
  <section class="section role-section">
    <!-- ===================================================
         LEFT / STICKY INTRO
         =================================================== -->

    <div class="role-sticky">
      <!-- Cinematic section marker -->
      <div class="role-kicker">
  <span class="role-kicker-index">
    01
  </span>

  <span
    class="role-kicker-line"
    aria-hidden="true"
  />

  <span class="role-kicker-label">
    Developer × Marketing
  </span>
</div>

      <h2>
        Two disciplines.
        <br>
        <em>One outcome.</em>
      </h2>

      <p class="role-sticky-copy">
        I do not hand the product off to “marketing” after launch.
        Product decisions, positioning, discoverability and measurement
        belong in the same conversation.
      </p>

      <div
        class="role-axis"
        aria-hidden="true"
      >
        <span>
          build
        </span>

        <i />

        <span>
          grow
        </span>
      </div>
    </div>

    <!-- ===================================================
         RIGHT / CHAPTERS
         =================================================== -->

    <div class="role-chapters">
      <!-- Development -->

      <article
        id="developer"
        class="role-chapter developer-chapter"
        data-scene="1"
        data-parallax="0.025"
      >
        <div class="chapter-number">
          01
        </div>

        <div class="chapter-label">
          Developer
        </div>

        <h3>
          Turn complexity into something that feels obvious.
        </h3>

        <p>
          I design and build fast, maintainable digital products
          where architecture, interaction and performance support
          the same idea.
        </p>

        <div
          class="tag-row skill-tag-row"
          aria-label="Development technologies"
        >
          <span
            v-for="skill in profile.developerSkills"
            :key="skill"
            class="skill-pill"
          >
            <SkillIcon :label="skill" />

            <span class="skill-pill-label">
              {{ skill }}
            </span>
          </span>
        </div>

        <div
          class="chapter-signal"
          aria-hidden="true"
        >
          <span
            v-for="n in 7"
            :key="n"
            :style="{ '--i': n }"
          />
        </div>
      </article>

      <!-- Marketing -->

      <article
        id="marketing"
        class="role-chapter marketing-chapter"
        data-scene="2"
        data-parallax="0.04"
      >
        <div class="chapter-number">
          02
        </div>

        <div class="chapter-label">
          Marketing specialist
        </div>

        <h3>
          Turn attention into measurable momentum.
        </h3>

        <p>
          I connect positioning, search, content, analytics and
          conversion so growth is designed into the system instead
          of bolted on afterwards.
        </p>

        <div
          class="tag-row skill-tag-row"
          aria-label="Marketing capabilities"
        >
          <span
            v-for="skill in profile.marketingSkills"
            :key="skill"
            class="skill-pill"
          >
            <SkillIcon :label="skill" />

            <span class="skill-pill-label">
              {{ skill }}
            </span>
          </span>
        </div>

        <div
          class="chapter-wave"
          aria-hidden="true"
        >
          <span
            v-for="n in 8"
            :key="n"
            :style="{ '--i': n }"
          />
        </div>
      </article>
    </div>
  </section>
</template>