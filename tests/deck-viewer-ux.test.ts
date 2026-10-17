import { describe, it, expect } from 'vitest'

async function src(path: string): Promise<string> {
  const mod = await import(`../${path}?raw`)
  return mod.default as string
}

describe('#4 deck viewer UX — version switch + slide counter (US-2.5)', () => {
  it('revealSrc computed uses selectedVersion to build iframe URL', async () => {
    const text = await src('pages/decks/[id].vue')
    expect(text).toContain('revealBasePath')
    expect(text).toContain('selectedVersion')
    // Pattern: `${basePath}/v${selectedVersion}.html`
    expect(text).toMatch(/revealBasePath.*selectedVersion|selectedVersion.*revealBasePath/s)
  })

  it('useRecentDecks composable exists', async () => {
    const text = await src('composables/useRecentDecks.ts')
    expect(text).toContain('addRecent')
  })
})
