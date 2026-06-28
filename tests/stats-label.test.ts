import { describe, it, expect } from 'vitest'

async function src(path: string): Promise<string> {
  const mod = await import(`../${path}?raw`)
  return mod.default as string
}

describe('#25 stats label consistency', () => {
  it('HeroSection uses "Deliveries" not "Talks"', async () => {
    const text = await src('components/HeroSection.vue')
    expect(text).toContain('Deliveries')
    expect(text).not.toContain("'Talks'")
    expect(text).not.toContain('"Talks"')
  })

  it('SpeakerOverview uses "Deliveries" not "Talks"', async () => {
    const text = await src('components/SpeakerOverview.vue')
    expect(text).toContain('Deliveries')
    expect(text).not.toContain('>Talks<')
  })

  it('about.vue uses "Deliveries" not "Talks"', async () => {
    const text = await src('pages/about.vue')
    expect(text).toContain('Deliveries')
    expect(text).not.toContain('>Talks<')
  })
})
