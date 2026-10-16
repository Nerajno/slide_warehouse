import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { deckSlug, withSlug } from '../utils/deck'
import DeckCard from '../components/DeckCard.vue'
import DecksSection from '../components/DecksSection.vue'
import HeroSection from '../components/HeroSection.vue'
import type { DeckFrontmatter } from '../types'

// Nuxt Content v3 fills `id` with the source path, which is what produced
// `/decks/decks/decks/networking-talk.md` links in production.
const DECK_URL = /^\/decks\/[a-z0-9-]+$/

// Rows shaped like real v3 output: `id` is the path, `stem` carries the slug.
const rows = vi.hoisted(() => [
  { id: 'decks/decks/networking-talk.md', stem: 'decks/networking-talk', title: 'Networking', tags: ['career'], slideCount: 30, createdAt: '2026-01-01', mostRecent: true, featured: true, versions: [] },
  { id: 'decks/decks/back-to-basics.md', stem: 'decks/back-to-basics', title: 'Back to Basics', tags: ['vue'], slideCount: 40, createdAt: '2025-01-01', versions: [] },
])

mockNuxtImport('queryCollection', () => () => {
  const q = {
    select: () => q,
    where: () => q,
    order: () => q,
    all: async () => rows,
    first: async () => rows[0],
  }
  return q
})

// NuxtLink is stubbed in tests/setup.ts and renders `to`, real links render `href`.
const deckLinks = (html: string) =>
  [...html.matchAll(/(?:href|to)="(\/decks\/[^"#?]*)"/g)].map(m => m[1])

describe('deck URLs', () => {
  it('deckSlug takes the slug from stem', () => {
    expect(deckSlug({ stem: 'decks/networking-talk', id: 'decks/decks/networking-talk.md' })).toBe('networking-talk')
  })

  it('deckSlug falls back to the v3 id path and strips .md', () => {
    expect(deckSlug({ id: 'decks/decks/networking-talk.md' })).toBe('networking-talk')
  })

  it('withSlug re-keys id to the slug and tolerates null', () => {
    expect(withSlug([rows[1]])[0].id).toBe('back-to-basics')
    expect(withSlug(null)).toEqual([])
  })

  it('DeckCard links to /decks/<slug>', async () => {
    const deck = { id: 'networking-talk', title: 'Networking', tags: [] } as unknown as DeckFrontmatter
    const wrapper = await mountSuspended(DeckCard, { props: { deck } })
    expect(deckLinks(wrapper.html())).toContain('/decks/networking-talk')
  })

  it.each([
    ['DecksSection', DecksSection],
    ['HeroSection', HeroSection],
  ])('%s turns v3 rows into /decks/<slug> links', async (_, component) => {
    const wrapper = await mountSuspended(component)
    // deckStore's useAsyncData isn't awaited, so cards land after mount.
    await vi.waitFor(() => expect(deckLinks(wrapper.html()).length).toBeGreaterThan(0))
    const links = deckLinks(wrapper.html())
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) expect(link).toMatch(DECK_URL)
  })
})
