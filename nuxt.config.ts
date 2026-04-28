// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/decks/**': { ssr: true },
    '/topics/**': { ssr: true },
  },

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@pinia/nuxt',
  ],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  content: {
    highlight: false,
    navigation: {
      fields: ['tags', 'tier', 'currentVersion'],
    },
  },

  nitro: {
    prerender: {
      routes: [
        '/about',
        '/topics/vue',
        '/topics/nuxt',
        '/topics/javascript',
        '/topics/typescript',
        '/topics/career',
        '/topics/soft-skills',
        '/topics/fundamentals',
        '/topics/architecture',
        '/topics/accessibility',
        '/topics/community',
      ],
    },
  },

  css: ['~/assets/css/main.css'],


  app: {
    head: {
      title: 'Slide Warehouse',
      meta: [
        { name: 'description', content: 'Browse, search, and share Reveal.js presentations by @Nerajno' },
        { property: 'og:site_name', content: 'Slide Warehouse' },
      ],
      script: [
        {
          children: `(function(){try{var t=localStorage.getItem('sw-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`,
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },
})
