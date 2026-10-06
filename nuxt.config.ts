export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  css: [
    '~/assets/css/main.css'
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },

      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, viewport-fit=cover'
        },

        {
          name: 'color-scheme',
          content: 'light'
        }
      ]
    }
  },

  runtimeConfig: {
    /*
     * Server-only.
     *
     * Nuxt automatically maps:
     *
     * NUXT_GITHUB_TOKEN
     *
     * Never expose this through public runtimeConfig.
     */
    githubToken: '',

    public: {
      /*
       * Nuxt automatically maps:
       *
       * NUXT_PUBLIC_GITHUB_USERNAME
       */
      githubUsername: 'ashklucy5',

      /*
       * Nuxt automatically maps:
       *
       * NUXT_PUBLIC_SITE_URL
       *
       * Leave empty during local development.
       * Add the real domain when deployed.
       */
      siteUrl: ''
    }
  },

  nitro: {
    compressPublicAssets: true
  },

  typescript: {
    strict: true,
    typeCheck: false
  }
})