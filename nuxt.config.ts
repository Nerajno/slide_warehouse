// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://slides.developingdvlpr.com'

// Dialects' theme script, inlined before first paint. It sets .light/.dark,
// data-theme and data-surface on <html> from the saved choice or the OS.
const themeInit = readFileSync(createRequire(import.meta.url).resolve('@nerajno/dialects/theme-init.js'), 'utf8')

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  runtimeConfig: {
    public: {
      siteUrl,
    },
  },

  // Netlify serves this site as static files, so every route a visitor can
  // land on directly must be prerendered. Anything else falls through the
  // netlify.toml catch-all to the homepage and hydrates as `/`.
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/legacy': { prerender: true },
    '/decks/**': { prerender: true },
    '/topics/**': { prerender: true },
  },

  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@pinia/nuxt',
    '@nuxtjs/sitemap',
    '@nuxt/eslint',
    'nuxt-og-image',
  ],

  site: {
    url: 'https://slides.developingdvlpr.com',
    name: 'Slide Warehouse',
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  nitro: {
    prerender: {
      // The homepage links every deck, so new decks are picked up without
      // editing a list. The routes below stay as a floor for tag pages.
      crawlLinks: true,
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
      // teach surface (Dialects): server-rendered too, so the first paint is right
      // before theme-init.js runs.
      htmlAttrs: { lang: 'en', 'data-surface': 'teach' },
      title: 'Slide Warehouse',
      meta: [
        { name: 'description', content: 'Browse, search, and share Reveal.js presentations by @Nerajno' },
        { property: 'og:site_name', content: 'Slide Warehouse' },
        { property: 'og:image', content: `${siteUrl}/og-default.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: `${siteUrl}/og-default.png` },
      ],
      script: [
        {
          // `innerHTML`, not `children` — the latter is not part of the head
          // script schema and was the source of a long-standing TS2353.
          innerHTML: themeInit,
          'data-surface': 'teach',
        },
      ],
    },
  },
})
