<script setup lang="ts">
const props = defineProps<{
  label: string
}>()

const key = computed(
  () =>
    props.label
      .trim()
      .toLowerCase()
)
</script>

<template>
  <!-- Vue / Nuxt -->
  <svg
    v-if="key.includes('vue') || key.includes('nuxt')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M3.5 17.5 9.2 7.6c.6-1 2-1 2.6 0l1.4 2.4 1.5-2.7c.6-1 2-1 2.6 0l3.2 5.6c.6 1-.2 2.3-1.3 2.3H15l-1.8 3.1c-.6 1-2 1-2.6 0l-.8-1.4H4.8c-1.2 0-1.9-1.3-1.3-2.4Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linejoin="round"
    />
  </svg>

  <!-- React / Next -->
  <svg
    v-else-if="key.includes('react') || key.includes('next')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="1.8"
      fill="currentColor"
    />

    <ellipse
      cx="12"
      cy="12"
      rx="8.5"
      ry="3.4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
    />

    <ellipse
      cx="12"
      cy="12"
      rx="8.5"
      ry="3.4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      transform="rotate(60 12 12)"
    />

    <ellipse
      cx="12"
      cy="12"
      rx="8.5"
      ry="3.4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      transform="rotate(120 12 12)"
    />
  </svg>

  <!-- TypeScript -->
  <svg
    v-else-if="key.includes('typescript')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <rect
      x="3.5"
      y="3.5"
      width="17"
      height="17"
      rx="4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    />

    <path
      d="M7.5 9h6M10.5 9v7M14 15.4c.7.6 1.5.9 2.4.9 1.1 0 1.9-.5 1.9-1.3 0-1.9-4-.8-4-3.4 0-1.4 1.2-2.3 2.8-2.3.8 0 1.5.2 2.1.6"
      fill="none"
      stroke="currentColor"
      stroke-width="1.35"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <!-- Go -->
  <svg
    v-else-if="key === 'go'"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M3 8.5h5M2 11.5h5M3 14.5h4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />

    <path
      d="M10.5 9.3c.9-1 2.2-1.6 3.7-1.6 2.9 0 5.1 1.8 5.1 4.4s-2.2 4.4-5.1 4.4c-2.8 0-4.9-1.7-4.9-4.3 0-1.1.4-2.1 1.2-2.9Zm3.8 1.2c-1 0-1.8.7-1.8 1.7s.8 1.7 1.8 1.7 1.8-.7 1.8-1.7-.8-1.7-1.8-1.7Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.35"
      stroke-linejoin="round"
    />
  </svg>

  <!-- Python -->
  <svg
    v-else-if="key.includes('python')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M12 3.5c-4.6 0-4.5 2-4.5 2v3.1h4.6v1H5.7S3 9.3 3 13.5c0 4.1 2.4 4 2.4 4h2.2v-3.1s-.1-2.4 2.4-2.4h4c2.3 0 2.3-2.2 2.3-2.2V5.7s.3-2.2-4.3-2.2Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linejoin="round"
    />

    <path
      d="M12 20.5c4.6 0 4.5-2 4.5-2v-3.1h-4.6v-1h6.4S21 14.7 21 10.5c0-4.1-2.4-4-2.4-4h-2.2v3.1s.1 2.4-2.4 2.4h-4c-2.3 0-2.3 2.2-2.3 2.2v4.1s-.3 2.2 4.3 2.2Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linejoin="round"
    />

    <circle cx="11" cy="6.5" r=".8" fill="currentColor" />
    <circle cx="13" cy="17.5" r=".8" fill="currentColor" />
  </svg>

  <!-- Node -->
  <svg
    v-else-if="key.includes('node')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="m12 3 7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />

    <path
      d="M9 15V9l6 6V9"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <!-- Flutter -->
  <svg
    v-else-if="key.includes('flutter')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="m15.5 3-9 9 3 3 12-12h-6Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />

    <path
      d="m12.5 12-3 3 5.8 6h6l-8.8-9Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
  </svg>

  <!-- REST APIs -->
  <svg
    v-else-if="key.includes('api')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M8 7 4 12l4 5M16 7l4 5-4 5M14 5l-4 14"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <!-- PostgreSQL / databases -->
  <svg
    v-else-if="key.includes('postgres')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <ellipse
      cx="12"
      cy="6"
      rx="7"
      ry="3"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    />

    <path
      d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    />
  </svg>

  <!-- Redis -->
  <svg
    v-else-if="key.includes('redis')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="m12 4 8 4-8 4-8-4 8-4Zm-8 8 8 4 8-4M4 16l8 4 8-4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
  </svg>

  <!-- Docker -->
  <svg
    v-else-if="key.includes('docker')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M4 11h15c-.5 4.8-3.5 7-8.2 7C6.6 18 4.3 15.6 4 11Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linejoin="round"
    />

    <path
      d="M7 8h3v3H7V8Zm3-3h3v3h-3V5Zm0 3h3v3h-3V8Zm3 0h3v3h-3V8Zm3 0h3v3h-3V8Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.25"
    />

    <path
      d="M19 10c1.4-.1 2.2-.7 2.7-1.5"
      fill="none"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />
  </svg>

  <!-- AI -->
  <svg
    v-else-if="key.includes('ai')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="2" fill="currentColor" />

    <circle cx="6" cy="7" r="1.4" fill="none" stroke="currentColor" stroke-width="1.4" />
    <circle cx="18" cy="7" r="1.4" fill="none" stroke="currentColor" stroke-width="1.4" />
    <circle cx="6" cy="17" r="1.4" fill="none" stroke="currentColor" stroke-width="1.4" />
    <circle cx="18" cy="17" r="1.4" fill="none" stroke="currentColor" stroke-width="1.4" />

    <path
      d="m7.1 7.9 3.4 3M16.9 7.9l-3.4 3M7.1 16.1l3.4-3M16.9 16.1l-3.4-3"
      fill="none"
      stroke="currentColor"
      stroke-width="1.25"
    />
  </svg>

  <!-- SEO -->
  <svg
    v-else-if="key.includes('seo')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      cx="10.5"
      cy="10.5"
      r="5.5"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    />

    <path
      d="m14.8 14.8 4.7 4.7M8 11l1.7 1.7 3.5-4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <!-- Analytics -->
  <svg
    v-else-if="key.includes('analytics')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M5 19V13M10 19V9M15 19V12M20 19V5"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
    />
  </svg>

  <!-- Content -->
  <svg
    v-else-if="key.includes('content')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M6 4h9l3 3v13H6V4Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />

    <path
      d="M9 10h6M9 13h6M9 16h4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
    />
  </svg>

  <!-- Campaigns -->
  <svg
    v-else-if="key.includes('campaign')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M4 13V9l11-4v12L4 13Z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />

    <path
      d="M7 14v5h4l-1-4M18 8c1 .8 1.5 1.7 1.5 3S19 13.2 18 14"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>

  <!-- Conversion -->
  <svg
    v-else-if="key.includes('conversion')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="8"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
    />

    <circle
      cx="12"
      cy="12"
      r="4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
    />

    <path
      d="m12 12 6-6M16 6h2v2"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <!-- Growth -->
  <svg
    v-else-if="key.includes('growth')"
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M4 18 9 13l3 3 7-8"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      d="M15 8h4v4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <!-- Generic fallback -->
  <svg
    v-else
    class="skill-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M8.5 4.5 4 12l4.5 7.5M15.5 4.5 20 12l-4.5 7.5M14 3l-4 18"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>