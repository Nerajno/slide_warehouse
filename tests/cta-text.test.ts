import { describe, it, expect } from 'vitest'

async function src(path: string): Promise<string> {
  const mod = await import(`../${path}?raw`)
  return mod.default as string
}

const CORRECT_ARROW = '<span aria-hidden="true">→</span>'

describe('#22 CTA button text consistency', () => {
  it('HeroSection "Open deck" CTA uses aria-hidden arrow span', async () => {
    const text = await src('components/HeroSection.vue')
    expect(text).toContain(`Open deck ${CORRECT_ARROW}`)
  })

  it('SpeakerOverview "Open deck" CTA uses aria-hidden arrow span', async () => {
    const text = await src('components/SpeakerOverview.vue')
    expect(text).toContain(`Open deck ${CORRECT_ARROW}`)
  })

  it('DecksSection "Open deck" CTA uses aria-hidden arrow span', async () => {
    const text = await src('components/DecksSection.vue')
    expect(text).toContain(`Open deck ${CORRECT_ARROW}`)
  })

  it('FeaturedDeck "Open deck" CTA already uses correct pattern', async () => {
    const text = await src('components/FeaturedDeck.vue')
    expect(text).toContain(`Open deck ${CORRECT_ARROW}`)
  })
})
