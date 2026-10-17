import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { config } from '@vue/test-utils'
import DeckCard from '../components/DeckCard.vue'
import DecksSection from '../components/DecksSection.vue'
import FeaturedDeck from '../components/FeaturedDeck.vue'
import type { DeckFrontmatter } from '../types'

const row = vi.hoisted(() => ({
  id: 'decks/decks/networking-talk.md',
  stem: 'decks/networking-talk',
  title: 'Networking',
  description: 'How to network',
  tags: ['career', 'soft-skills'],
  slideCount: 30,
  createdAt: '2026-01-01',
  featured: true,
  versions: [],
}))

mockNuxtImport('queryCollection', () => () => {
  const q = { select: () => q, where: () => q, order: () => q, all: async () => [row], first: async () => row }
  return q
})

// NuxtLink is stubbed in tests/setup.ts as <nuxt-link-stub to="…">. Render the
// stub's slot so link contents (and anything nested in them) show up in html().
config.global.renderStubDefaultSlot = true

const tagLinks = (html: string) => [...html.matchAll(/<nuxt-link-stub[^>]*to="(\/topics\/[^"]+)"/g)].map(m => m[1])
const nestedLink = (html: string) => /<nuxt-link-stub[^>]*>(?:(?!<\/nuxt-link-stub>)[\s\S])*<(?:nuxt-link-stub|a|button)\b/.test(html)

describe('#62 tag chips link to topic pages', () => {
  it('DeckCard: each tag links to /topics/<tag>, deck link intact, no nesting', async () => {
    const deck = { ...row, id: 'networking-talk' } as unknown as DeckFrontmatter
    const html = (await mountSuspended(DeckCard, { props: { deck } })).html()
    expect(tagLinks(html)).toEqual(['/topics/career', '/topics/soft-skills'])
    expect(html).toContain('to="/decks/networking-talk"')
    expect(nestedLink(html)).toBe(false)
  })

  it('DeckCard: each tag is raised above the stretched link, the row is not', async () => {
    const deck = { ...row, id: 'networking-talk' } as unknown as DeckFrontmatter
    const wrapper = await mountSuspended(DeckCard, { props: { deck } })
    const tag = wrapper.find('nuxt-link-stub[to="/topics/career"]')
    expect(tag.classes()).toContain('z-raised')
    expect(tag.element.parentElement!.className).not.toMatch(/\bz-raised\b/)
  })

  it('links carry a "Topic:" label for screen readers', async () => {
    const deck = { ...row, id: 'networking-talk' } as unknown as DeckFrontmatter
    const wrapper = await mountSuspended(DeckCard, { props: { deck } })
    const tag = wrapper.find('nuxt-link-stub[to="/topics/career"]')
    expect(tag.find('.sr-only').text()).toBe('Topic:')
    expect(tag.text()).toBe('Topic: career')
  })

  it('tag values are URL-encoded', async () => {
    const deck = { ...row, id: 'networking-talk', tags: ['web perf'] } as unknown as DeckFrontmatter
    const wrapper = await mountSuspended(DeckCard, { props: { deck } })
    expect(tagLinks(wrapper.html())).toEqual(['/topics/web%20perf'])
  })

  it('nesting check catches a nested link (guards against a vacuous pass)', () => {
    expect(nestedLink('<nuxt-link-stub to="/decks/x"><a href="/topics/y">y</a></nuxt-link-stub>')).toBe(true)
    expect(nestedLink('<nuxt-link-stub to="/decks/x"><button>b</button></nuxt-link-stub>')).toBe(true)
    expect(nestedLink('<nuxt-link-stub to="/decks/x">x</nuxt-link-stub><a href="/topics/y">y</a>')).toBe(false)
  })

  it('FeaturedDeck: tags link to topics, no nesting', async () => {
    const wrapper = await mountSuspended(FeaturedDeck)
    await vi.waitFor(() => expect(tagLinks(wrapper.html()).length).toBeGreaterThan(0))
    expect(tagLinks(wrapper.html())).toEqual(['/topics/career', '/topics/soft-skills'])
    expect(nestedLink(wrapper.html())).toBe(false)
  })

  it('DecksSection: per-card tags link to topics; filter pills stay buttons', async () => {
    const wrapper = await mountSuspended(DecksSection)
    await vi.waitFor(() => expect(tagLinks(wrapper.html()).length).toBeGreaterThan(0))
    expect(tagLinks(wrapper.html())).toEqual(['/topics/career', '/topics/soft-skills'])
    expect(wrapper.findAll('[aria-label="Filter by tag"] button').length).toBeGreaterThan(0)
    expect(nestedLink(wrapper.html())).toBe(false)
  })
})
