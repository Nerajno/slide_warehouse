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

const before = (a: Element, b: Element) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)

// #65: Tab was never trapped (measured in a browser), but keyboard users had no
// way to skip the deck's own links and no hint that arrow keys drive the slides.
// Focus movement, full screen and layout are verified in the browser (see PR).
describe('#65 deck keyboard access', () => {
  it('a skip link before the deck targets a named, focusable point after it', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/test' })
    const skip = wrapper.find('a[href="#after-deck"]').element
    const iframe = wrapper.find('iframe').element
    const target = wrapper.find('#after-deck')
    expect(target.attributes('tabindex')).toBe('-1')
    expect(target.text()).toBe('End of presentation')
    expect(before(skip, iframe)).toBe(true)
    expect(before(iframe, target.element)).toBe(true)
  })

  it('the iframe is described by a keyboard hint naming the keys', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/test' })
    expect(wrapper.find('iframe').attributes('aria-describedby')).toBe('deck-keyboard-hint')
    const keys = wrapper.findAll('#deck-keyboard-hint kbd').map(k => k.text())
    expect(keys).toEqual(expect.arrayContaining(['←', '→', 'F', 'Tab']))
  })
})
