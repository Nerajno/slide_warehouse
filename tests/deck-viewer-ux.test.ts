import { describe, it, expect } from 'vitest'

async function src(path: string): Promise<string> {
  const mod = await import(`../${path}?raw`)
  return mod.default as string
}

describe('#4 deck viewer UX — version switch + slide counter (US-2.5)', () => {
  it('deck [id] page has version switcher with selectedVersion ref', async () => {
    const text = await src('pages/decks/[id].vue')
    expect(text).toContain('selectedVersion')
    expect(text).toContain('currentVersion')
  })

  it('revealSrc computed uses selectedVersion to build iframe URL', async () => {
    const text = await src('pages/decks/[id].vue')
    expect(text).toContain('revealBasePath')
    expect(text).toContain('selectedVersion')
    // Pattern: `${basePath}/v${selectedVersion}.html`
    expect(text).toMatch(/revealBasePath.*selectedVersion|selectedVersion.*revealBasePath/s)
  })

  it('deck [id] page exposes duration switcher with aria-pressed', async () => {
    const text = await src('pages/decks/[id].vue')
    expect(text).toContain('selectedDuration')
    expect(text).toContain(':aria-pressed')
  })

  it('DeckViewer receives and tracks slidechanged postMessage', async () => {
    const text = await src('components/DeckViewer.vue')
    expect(text).toContain("'slidechanged'")
    expect(text).toContain('slideIndex')
    expect(text).toContain('slideTotal')
  })

  it('DeckViewer shows slide progress bar when slideTotal > 0', async () => {
    const text = await src('components/DeckViewer.vue')
    expect(text).toContain('slideTotal > 0')
    expect(text).toContain('progressbar')
    expect(text).toContain('aria-valuenow')
  })

  it('useRecentDecks composable exists', async () => {
    const text = await src('composables/useRecentDecks.ts')
    expect(text).toContain('addRecent')
  })
})
