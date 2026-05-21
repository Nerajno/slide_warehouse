// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://stellular-duckanoo-18bf92.netlify.app',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/decks/**': { ssr: true },
    '/topics/**': { ssr: true },
  },

  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@pinia/nuxt',
    '@nuxtjs/sitemap',
  ],

  site: {
    url: 'https://slides.developingdvlpr.com',
    name: 'Slide Warehouse',
  },

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
        '/topics',
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
      htmlAttrs: { lang: 'en' },
      title: 'Slide Warehouse',
      meta: [
        { name: 'description', content: 'Browse, search, and share Reveal.js presentations by @Nerajno' },
        { property: 'og:site_name', content: 'Slide Warehouse' },
        { property: 'og:image', content: `${process.env.NUXT_PUBLIC_SITE_URL || 'https://stellular-duckanoo-18bf92.netlify.app'}/og-default.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://slides.developingdvlpr.com/og-default.png' },
      ],
      script: [
        {
          children: `(function(){try{var t=localStorage.getItem('sw-theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){document.documentElement.classList.add('dark')}})()`,
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
