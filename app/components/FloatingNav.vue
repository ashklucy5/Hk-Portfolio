<script setup lang="ts">
import { profile } from '~/data/profile'

const items = [
  ['About', '#about'],
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Contact', '#contact']
] as const

const activeHash = ref('#top')
let observer: IntersectionObserver | undefined

onMounted(() => {
  const targets = ['#top', ...items.map(([, href]) => href)]
    .map((selector) => document.querySelector<HTMLElement>(selector))
    .filter(Boolean) as HTMLElement[]

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) activeHash.value = `#${visible.target.id}`
    },
    { rootMargin: '-30% 0px -58% 0px', threshold: [0, 0.2, 0.5, 0.8] }
  )

  targets.forEach((target) => observer?.observe(target))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <header class="floating-nav" aria-label="Primary navigation">
    <a
  class="brand"
  href="#top"
  :aria-label="`${profile.name} — Back to top`"
>
  <span
    class="brand-mark"
    aria-hidden="true"
  >
    <span class="brand-dot" />
  </span>

  <span class="brand-name">
    {{ profile.name }}
  </span>
</a>

    <nav class="nav-links" aria-label="Portfolio sections">
      <a
        v-for="([label, href]) in items"
        :key="href"
        :href="href"
        :class="{ active: activeHash === href }"
      >
        <span>{{ label }}</span>
      </a>
    </nav>

    <a class="nav-resume" href="/resume.pdf" download>
      Résumé
      <span class="nav-arrow" aria-hidden="true">↘</span>
    </a>
  </header>
</template>
