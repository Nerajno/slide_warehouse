import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import DeckPage from '../pages/decks/[id].vue'

// nuxt-og-image is off in the test env (no SSR), so its auto-import is missing.
vi.hoisted(() => vi.stubGlobal('defineOgImage', () => {}))

const row = vi.hoisted(() => ({
  id: 'decks/decks/test.md', stem: 'decks/test', path: '/decks/test', title: 'Test Deck', tags: [],
  revealBasePath: '/reveals/test', currentVersion: 1,
  versions: [{ version: 1, label: 'Original', date: '2025-01-01', revealFile: 'v1.html' }],
}))
mockNuxtImport('queryCollection', () => () => {
  const q = { select: () => q, where: () => q, all: async () => [row], first: async () => row }
  return q
})

// Decks are third-party-authored HTML. Sandboxing without allow-same-origin
// gives the frame an opaque origin, so it can't touch this site's storage,
// cookies or DOM.
describe('#6 deck iframe security', () => {
  it('the deck page iframe runs scripts but is not same-origin', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/test' })
    const sandbox = wrapper.find('iframe').attributes('sandbox') ?? ''
    expect(sandbox).toContain('allow-scripts')
    expect(sandbox).not.toContain('allow-same-origin')
  })
})
