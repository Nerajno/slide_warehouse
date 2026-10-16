import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import DeckPage from '../pages/decks/[id].vue'

// nuxt-og-image is off in the test env (no SSR), so its auto-import is missing.
vi.hoisted(() => vi.stubGlobal('defineOgImage', () => {}))

// v3-shaped row: two deliveries (versions) of one 30-minute talk.
const row = vi.hoisted(() => ({
  id: 'decks/decks/networking-talk.md',
  stem: 'decks/networking-talk',
  path: '/decks/networking-talk',
  title: 'Networking',
  tags: ['career'],
  tier: '30min',
  durationMinutes: 30,
  revealBasePath: '/reveals/networking-talk',
  currentVersion: 2,
  versions: [
    { version: 1, label: 'Original', date: '2025-01-01', revealFile: 'v1.html' },
    { version: 2, label: 'Boise', date: '2026-01-01', revealFile: 'boise.html' },
  ],
}))

mockNuxtImport('queryCollection', () => () => {
  const q = {
    select: () => q,
    where: () => q,
    all: async () => [row],
    first: async () => row,
  }
  return q
})

describe('#59 deck page talk length', () => {
  it('has no duration switcher that claims a choice', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/networking-talk' })
    expect(wrapper.find('[aria-label="Select talk duration"]').exists()).toBe(false)
    expect(wrapper.findAll('button[aria-pressed]').filter(b => /min/.test(b.text()))).toHaveLength(0)
  })

  it('shows the real length as text', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/networking-talk' })
    expect(wrapper.text()).toContain('Talk length: 30 min')
  })

  it('iframe still loads the current version', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/networking-talk' })
    expect(wrapper.find('iframe').attributes('src')).toBe('/reveals/networking-talk/boise.html')
  })
})
