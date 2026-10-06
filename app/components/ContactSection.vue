<script setup lang="ts">
import { profile } from '~/data/profile'
</script>

<template>
  <section id="contact" class="section contact-section" data-scene="5">
    <p class="eyebrow">One last question</p>
    <div class="contact-question glass-panel" data-parallax="0.035">What are we building next?</div>
    <h2>Let’s make something<br><em>useful enough to matter.</em></h2>
    <div class="contact-actions">
      <a class="button button-dark" :href="`mailto:${profile.email}`">Start a conversation ↗</a>
      <a class="button button-glass" href="/resume.pdf" download>Download résumé ↘</a>
    </div>
    <footer>
      <p>© {{ new Date().getFullYear() }} {{ profile.name }}</p>
      <div>
        <a :href="profile.githubUrl" target="_blank" rel="noreferrer">GitHub</a>
        <a :href="profile.linkedinUrl" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </footer>
  </section>
</template>
