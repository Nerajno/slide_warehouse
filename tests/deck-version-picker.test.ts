import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import DeckPage from '../pages/decks/[id].vue'

// nuxt-og-image is off in the test env (no SSR), so its auto-import is missing.
vi.hoisted(() => vi.stubGlobal('defineOgImage', () => {}))

const versions = [
  { version: 1, label: 'VueConf', date: '2025-05-01', revealFile: 'v1.html' },
  { version: 2, label: 'DevNexus 2026', date: '2026-04-01', revealFile: 'v2.html' },
]

const state = vi.hoisted(() => ({ row: {} as Record<string, unknown> }))

mockNuxtImport('queryCollection', () => () => {
  const q = {
    select: () => q,
    where: () => q,
    all: async () => [state.row],
    first: async () => state.row,
  }
  return q
})

const deck = (vs: typeof versions) => ({
  id: 'decks/decks/vue-router.md',
  stem: 'decks/vue-router',
  path: '/decks/vue-router',
  title: 'Vue Router',
  tags: ['vue'],
  durationMinutes: 60,
  revealBasePath: '/reveals/vue-router',
  currentVersion: vs.at(-1)!.version,
  versions: vs,
})

describe('#60 deck version picker', () => {
  beforeEach(() => { state.row = deck(versions) })

  it('lists every version with the current one selected', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/vue-router' })
    const select = wrapper.find('select#version-select')
    expect(select.exists()).toBe(true)
    expect(wrapper.find('label[for="version-select"]').text()).toBe('Version')
    expect(select.findAll('option').map(o => o.text())).toEqual([
      'VueConf · May 2025',
      'DevNexus 2026 (current)',
    ])
    expect((select.element as HTMLSelectElement).value).toBe('2')
    expect(wrapper.find('iframe').attributes('src')).toBe('/reveals/vue-router/v2.html')
  })

  it('switching version loads that version in the viewer', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/vue-router' })
    await wrapper.find('select#version-select').setValue('1')
    expect(wrapper.find('iframe').attributes('src')).toBe('/reveals/vue-router/v1.html')
  })

  it('?v=1 opens that version', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/vue-router?v=1' })
    await flushPromises()
    expect(wrapper.find('iframe').attributes('src')).toBe('/reveals/vue-router/v1.html')
  })

  it('an unknown ?v= falls back to the current version', async () => {
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/vue-router?v=9' })
    await flushPromises()
    expect(wrapper.find('iframe').attributes('src')).toBe('/reveals/vue-router/v2.html')
  })

  it('a single-version deck shows no picker', async () => {
    state.row = deck([versions[0]])
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/vue-router' })
    expect(wrapper.find('select#version-select').exists()).toBe(false)
    expect(wrapper.find('iframe').attributes('src')).toBe('/reveals/vue-router/v1.html')
  })
})
