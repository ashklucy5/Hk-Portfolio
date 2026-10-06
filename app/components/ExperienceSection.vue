<script setup lang="ts">
import { profile } from '~/data/profile'
</script>

<template>
  <section id="experience" class="section experience-section" data-scene="4.2">
    <div class="experience-heading">
      <p class="eyebrow">Experience</p>
      <h2>Where the two sides <em>came together.</em></h2>
    </div>

    <div class="timeline">
      <article v-for="item in profile.experience" :key="`${item.period}-${item.role}`" class="timeline-row">
        <div class="timeline-dot" />
        <p class="timeline-period">{{ item.period }}</p>
        <div>
          <h3>{{ item.role }}</h3>
          <p>{{ item.company }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
