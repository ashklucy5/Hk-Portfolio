<script setup lang="ts">
import { profile } from '~/data/profile'
import CinematicBackground from '~/components/CinematicBackground.vue'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'

/**
 * ---------------------------------------------------------
 * SITE URL
 * ---------------------------------------------------------
 *
 * Once a production domain is available, set
 * runtimeConfig.public.siteUrl to that domain.
 *
 * Until then, useRequestURL() keeps canonical/social URLs
 * working locally and on the deployed hostname.
 */

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()

const siteUrl =
  String(
    runtimeConfig.public.siteUrl || ''
  ).replace(/\/$/, '') ||
  `${requestUrl.protocol}//${requestUrl.host}`

const canonicalUrl =
  `${siteUrl}/`

const ogImageUrl =
  `${siteUrl}/og-image.jpg`

const profileImageUrl =
  `${siteUrl}/images/profile/me-portrait.webp`


/**
 * ---------------------------------------------------------
 * SEO META
 * ---------------------------------------------------------
 */

useSeoMeta({
  title:
    profile.seo.title,

  description:
    profile.seo.description,

  robots:
    'index, follow',

  author:
    profile.name,

  /**
   * Open Graph
   */
  ogType:
    'profile',

  ogTitle:
    profile.seo.title,

  ogDescription:
    profile.seo.description,

  ogUrl:
    canonicalUrl,

  ogImage:
    ogImageUrl,

  ogImageAlt:
    `${profile.name} — Full-Stack Developer and Marketing Specialist`,

  /**
   * X / Twitter
   */
  twitterCard:
    'summary_large_image',

  twitterTitle:
    profile.seo.title,

  twitterDescription:
    profile.seo.description,

  twitterImage:
    ogImageUrl,

  twitterImageAlt:
    `${profile.name} — Full-Stack Developer and Marketing Specialist`
})


/**
 * ---------------------------------------------------------
 * STRUCTURED SEO DATA
 * ---------------------------------------------------------
 */

const sameAs = [
  profile.githubUrl,
  profile.linkedinUrl
].filter(Boolean)

const structuredData = {
  '@context':
    'https://schema.org',

  '@type':
    'ProfilePage',

  '@id':
    `${canonicalUrl}#profile`,

  url:
    canonicalUrl,

  name:
    profile.seo.title,

  description:
    profile.seo.description,

  mainEntity: {
    '@type':
      'Person',

    '@id':
      `${canonicalUrl}#person`,

    name:
      profile.name,

    url:
      canonicalUrl,

    image:
      profileImageUrl,

    email:
      `mailto:${profile.email}`,

    jobTitle: [
      'Full-Stack Developer',
      'Marketing Specialist'
    ],

    address: {
      '@type':
        'PostalAddress',

      addressLocality:
        'Shenzhen',

      addressRegion:
        'Guangdong',

      addressCountry:
        'CN'
    },

    alumniOf: {
      '@type':
        'CollegeOrUniversity',

      name:
        profile.education.institution
    },

    sameAs,

    knowsAbout: [
      ...profile.developerSkills,
      ...profile.marketingSkills
    ]
  }
}


/**
 * ---------------------------------------------------------
 * HEAD
 * ---------------------------------------------------------
 */

useHead({
  htmlAttrs: {
    lang: 'en'
  },

  link: [
  {
    rel: 'canonical',
    href: canonicalUrl
  },

  {
    rel: 'icon',
    type: 'image/svg+xml',
    href: '/favicon.svg'
  },

  {
    rel: 'shortcut icon',
    href: '/favicon.svg'
  }
],

  meta: [
    {
      name:
        'keywords',

      content:
        profile.seo.keywords.join(', ')
    },

    {
      name:
        'theme-color',

      content:
        '#111111'
    }
  ],

  script: [
    {
      type:
        'application/ld+json',

      innerHTML:
        JSON.stringify(
          structuredData
        )
    }
  ]
})
</script>


<template>
  <div class="site-shell">
    <!--
      Continuous cinematic photographic environment.

      This now handles:
      - scenery
      - depth/parallax
      - atmospheric haze
      - foliage movement
      - birds
      - readability lighting
    -->
    <CinematicBackground />

    <!--
      SceneCanvas has intentionally been removed.

      The Three.js renderer was hidden visually but could
      still initialize WebGL and consume GPU/CPU resources.
      We can reintroduce it later only if we build a useful
      transparent 3D enhancement.
    -->

    <!-- Floating liquid-glass navigation -->
    <FloatingNav />

    <!-- Semantic portfolio content -->
    <main>
      <HeroSection />

      <RoleSection />

      <AboutSection />

      <ProjectsSection />

      <ExperienceSection />

      <ContactSection />
    </main>
  </div>
</template>