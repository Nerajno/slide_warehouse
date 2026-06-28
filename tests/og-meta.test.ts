import { describe, it, expect } from 'vitest'

describe('#20 OG URL global fallback', () => {
  it('runtimeConfig.siteUrl fallback is canonical domain, not Netlify preview URL', async () => {
    const { default: config } = await import('../nuxt.config')
    const siteUrl = config.runtimeConfig?.public?.siteUrl as string
    expect(siteUrl).not.toContain('.netlify.app')
    expect(siteUrl).toContain('slides.developingdvlpr.com')
  })

  it('global og:image fallback uses canonical domain, not Netlify preview URL', async () => {
    const { default: config } = await import('../nuxt.config')
    const headMeta = config.app?.head?.meta ?? []
    const ogImageMeta = headMeta.find((m: any) => m.property === 'og:image')
    expect(ogImageMeta).toBeDefined()
    const ogImageUrl = ogImageMeta?.content as string
    expect(ogImageUrl).not.toContain('.netlify.app')
    expect(ogImageUrl).toContain('slides.developingdvlpr.com')
  })

  it('og:image and runtimeConfig.siteUrl use same base URL', async () => {
    const { default: config } = await import('../nuxt.config')
    const siteUrl = (config.runtimeConfig?.public?.siteUrl as string).replace(/\/$/, '')
    const headMeta = config.app?.head?.meta ?? []
    const ogImageUrl = headMeta.find((m: any) => m.property === 'og:image')?.content as string
    expect(ogImageUrl.startsWith(siteUrl)).toBe(true)
  })
})
