import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import HeroSection from '../components/HeroSection.vue'

const data = vi.hoisted(() => ({
  decks: [
    { id: 'decks/decks/a.md', stem: 'decks/a', slideCount: 30 },
    { id: 'decks/decks/b.md', stem: 'decks/b', slideCount: 40 },
  ],
  speaker: { stats: { totalTalks: 12, conferencesCount: 9 } },
}))

mockNuxtImport('queryCollection', () => (name: 'decks' | 'speaker') => {
  const q = {
    select: () => q,
    where: () => q,
    all: async () => data[name],
    first: async () => (name === 'speaker' ? data.speaker : data.decks[0]),
  }
  return q
})

describe('#66 hero stats render real values', () => {
  it('first render shows real numbers, not 0', async () => {
    const wrapper = await mountSuspended(HeroSection)
    const numbers = wrapper.findAll('.sw-stat-block__number').map(n => n.text())
    // 2 decks, 70 slides, 12 deliveries, 9 conferences
    expect(numbers).toEqual(['2', '70', '12', '9'])
  })
})
