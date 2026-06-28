import { describe, it, expect } from 'vitest'

async function src(path: string): Promise<string> {
  const mod = await import(`../${path}?raw`)
  return mod.default as string
}

describe('#7 WCAG 2.2 verifiable criteria', () => {
  it('DeckViewer iframe has descriptive title attribute', async () => {
    const text = await src('components/DeckViewer.vue')
    expect(text).toMatch(/:title=.*Presentation.*title/)
  })

  it('deck [id] inline iframe has descriptive title attribute', async () => {
    const text = await src('pages/decks/[id].vue')
    expect(text).toMatch(/:title=.*presentation/)
  })

  it('deck [id] inline iframe does not have allow-same-origin in sandbox', async () => {
    const text = await src('pages/decks/[id].vue')
    // The iframe sandbox line
    const iframeLine = text.match(/sandbox="[^"]*"/)?.[0] ?? ''
    expect(iframeLine).not.toContain('allow-same-origin')
  })

  it('HeroSection respects prefers-reduced-motion for stat animations', async () => {
    const text = await src('components/HeroSection.vue')
    expect(text).toContain('prefers-reduced-motion: reduce')
    expect(text).toContain('prefersReducedMotion')
  })

  it('DeckViewer progress bar has full ARIA attributes', async () => {
    const text = await src('components/DeckViewer.vue')
    expect(text).toContain('role="progressbar"')
    expect(text).toContain(':aria-valuenow')
    expect(text).toContain(':aria-valuemax')
    expect(text).toContain('aria-label')
  })

  it('DeckViewer slide nav buttons have aria-label', async () => {
    const text = await src('components/DeckViewer.vue')
    expect(text).toContain('aria-label="Previous slide"')
    expect(text).toContain('aria-label="Next slide"')
  })

  it('all SVG decorative icons are aria-hidden', async () => {
    const text = await src('components/DeckViewer.vue')
    // No SVG without aria-hidden (basic check for this component)
    const svgs = [...text.matchAll(/<svg/g)]
    const hiddenSvgs = [...text.matchAll(/<svg[^>]*aria-hidden/g)]
    expect(hiddenSvgs.length).toBe(svgs.length)
  })
})
