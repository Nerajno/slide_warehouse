import { describe, it, expect, vi } from 'vitest'

// Netlify serves the site statically. Any route that isn't prerendered falls
// through the netlify.toml catch-all to the homepage and hydrates as `/`, so
// a shared deck link lands on the homepage (#75).
vi.stubGlobal('defineNuxtConfig', (c: unknown) => c)
const { default: config } = await import('../nuxt.config')

describe('#75 directly-loadable routes are prerendered', () => {
  it.each(['/', '/about', '/legacy', '/decks/**', '/topics/**'])('%s is prerendered', (route) => {
    expect(config.routeRules?.[route]?.prerender).toBe(true)
  })

  it('crawls links so new decks are prerendered without a route list', () => {
    expect(config.nitro?.prerender?.crawlLinks).toBe(true)
  })
})
