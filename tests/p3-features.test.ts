import { describe, it, expect } from 'vitest'

async function src(path: string): Promise<string> {
  const mod = await import(`../${path}?raw`)
  return mod.default as string
}

describe('#28 copy link per deck card', () => {
  it('DecksSection has copy-path button with aria-label', async () => {
    const text = await src('components/DecksSection.vue')
    expect(text).toContain('aria-label="Copy deck path"')
  })

  it('DecksSection uses Clipboard API with absolute URL', async () => {
    const text = await src('components/DecksSection.vue')
    expect(text).toContain('navigator.clipboard.writeText')
    expect(text).toContain('window.location.origin')
  })

  it('DecksSection has aria-live toast for copy confirmation', async () => {
    const text = await src('components/DecksSection.vue')
    expect(text).toContain('aria-live="polite"')
    expect(text).toContain('Link copied!')
  })
})

describe('#29 scroll-animated stat counters with prefers-reduced-motion', () => {
  it('HeroSection uses IntersectionObserver for animation trigger', async () => {
    const text = await src('components/HeroSection.vue')
    expect(text).toContain('IntersectionObserver')
    expect(text).toContain('requestAnimationFrame')
  })

  it('HeroSection respects prefers-reduced-motion', async () => {
    const text = await src('components/HeroSection.vue')
    expect(text).toContain('prefers-reduced-motion')
    expect(text).toContain('prefersReducedMotion')
  })

  it('HeroSection stat numbers have accessible aria-label with value', async () => {
    const text = await src('components/HeroSection.vue')
    expect(text).toContain(':aria-label="`${stat.value}')
  })
})

describe('#30 Book a Talk in persistent nav', () => {
  it('SiteNav desktop has Book a Talk link', async () => {
    const text = await src('components/SiteNav.vue')
    const desktopNav = text.match(/Desktop nav[\s\S]*?Mobile hamburger/)?.[0] ?? ''
    expect(desktopNav).toContain('Book a Talk')
  })

  it('SiteNav mobile menu has Book a Talk link', async () => {
    const text = await src('components/SiteNav.vue')
    const mobileMenu = text.match(/Mobile menu[\s\S]*?<\/header>/)?.[0] ?? ''
    expect(mobileMenu).toContain('Book a Talk')
  })
})

describe('#31 breadcrumb on deck pages', () => {
  it('deck [id] page has nav with aria-label="Breadcrumb"', async () => {
    const text = await src('pages/decks/[id].vue')
    expect(text).toContain('aria-label="Breadcrumb"')
  })

  it('breadcrumb uses ol list markup', async () => {
    const text = await src('pages/decks/[id].vue')
    expect(text).toContain('<ol')
    expect(text).toContain('aria-current="page"')
  })

  it('breadcrumb nav is not on homepage', async () => {
    const text = await src('pages/index.vue')
    expect(text).not.toContain('aria-label="Breadcrumb"')
  })
})
