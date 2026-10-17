import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import DeckPage from '../pages/decks/[id].vue'

// nuxt-og-image is off in the test env (no SSR), so its auto-import is missing.
vi.hoisted(() => vi.stubGlobal('defineOgImage', () => {}))

const row = vi.hoisted(() => ({
  id: 'decks/decks/networking-talk.md',
  stem: 'decks/networking-talk',
  path: '/decks/networking-talk',
  title: 'Networking',
  tags: ['career'],
  durationMinutes: 30,
  revealBasePath: '/reveals/networking-talk',
  currentVersion: 1,
  versions: [{ version: 1, label: 'Original', date: '2025-01-01', revealFile: 'v1.html' }],
}))

mockNuxtImport('queryCollection', () => () => {
  const q = { select: () => q, where: () => q, all: async () => [row], first: async () => row }
  return q
})

// #67: separator glyphs used border tokens as text colour (1.27–1.48:1 in light mode).
describe('#67 deck page separators are legible', () => {
  it('no text is coloured with a border token', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/networking-talk' })
    expect(wrapper.find('nav[aria-label="Breadcrumb"]').exists()).toBe(true) // page rendered, not vacuous
    expect(wrapper.html()).not.toMatch(/text-\[var\(--sw-border(-2)?\)\]/)
  })

  it('the | divider after Back uses the readable meta colour', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/networking-talk' })
    const pipe = wrapper.findAll('span[aria-hidden="true"]').find(s => s.text() === '|')
    expect(pipe).toBeDefined()
    expect(pipe!.classes()).toContain('text-[var(--sw-text-3)]')
  })

  it('breadcrumb slashes use the shared separator class and stay hidden from AT', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/networking-talk' })
    const seps = wrapper.findAll('nav[aria-label="Breadcrumb"] .sw-breadcrumb__separator')
    expect(seps).toHaveLength(2)
    for (const s of seps) expect(s.element.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
