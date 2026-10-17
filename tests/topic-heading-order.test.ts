import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import TopicPage from '../pages/topics/[tag].vue'

const rows = vi.hoisted(() => [
  { id: 'decks/decks/a.md', stem: 'decks/a', title: 'Deck A', description: 'A', tags: ['career'], slideCount: 10, createdAt: '2026-01-01', versions: [] },
  { id: 'decks/decks/b.md', stem: 'decks/b', title: 'Deck B', description: 'B', tags: ['career'], slideCount: 20, createdAt: '2025-01-01', versions: [] },
])

mockNuxtImport('queryCollection', () => () => {
  const q = { select: () => q, where: () => q, order: () => q, all: async () => rows, first: async () => rows[0] }
  return q
})

// DeckCard's <h3> sits inside a NuxtLink, which tests/setup.ts stubs; render its slot.
const mount = (route: string) => mountSuspended(TopicPage, { route, global: { renderStubDefaultSlot: true } })

const levels = (el: Element) => [...el.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(h => Number(h.tagName[1]))

describe('#64 topic page heading order', () => {
  it('never skips a heading level', async () => {
    const wrapper = await mount('/topics/career')
    const ls = levels(wrapper.element)
    expect(ls).toContain(3) // deck cards rendered, so the check is not vacuous
    expect(ls[0]).toBe(1)
    for (let i = 1; i < ls.length; i++) expect(ls[i] - ls[i - 1]).toBeLessThanOrEqual(1)
  })

  it('names the deck list for screen readers', async () => {
    const wrapper = await mount('/topics/career')
    const h2 = wrapper.find('h2')
    expect(h2.text()).toBe('Decks tagged Career')
    expect(h2.classes()).toContain('sr-only')
  })

  it('keeps a valid outline for a topic with no decks', async () => {
    const wrapper = await mount('/topics/react')
    expect(levels(wrapper.element)).toEqual([1, 2])
    expect(wrapper.find('h2').text()).toBe('Decks tagged React')
  })

  it('title-cases hyphenated tags in the heading', async () => {
    const wrapper = await mount('/topics/soft-skills')
    expect(wrapper.find('h2').text()).toBe('Decks tagged Soft Skills')
  })
})
