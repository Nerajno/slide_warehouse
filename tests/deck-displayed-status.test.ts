import { describe, it, expect, vi, beforeEach } from 'vitest'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import DeckPage from '../pages/decks/[id].vue'
import { currentVersionOf, isDisplayed, visibleVersions, withSlug } from '../utils/deck'

// nuxt-og-image is off in the test env (no SSR), so its auto-import is missing.
vi.hoisted(() => vi.stubGlobal('defineOgImage', () => {}))

type Row = Record<string, unknown>
const state = vi.hoisted(() => ({ row: {} as Row }))

mockNuxtImport('queryCollection', () => () => {
  const q = {
    select: () => q,
    where: () => q,
    all: async () => [state.row],
    first: async () => state.row,
  }
  return q
})

const v = (version: number, displayedStatus?: boolean) => ({
  version,
  label: `Event ${2024 + version}`,
  date: `${2024 + version}-05-01`,
  revealFile: `v${version}.html`,
  ...(displayedStatus === undefined ? {} : { displayedStatus }),
})

const deck = (extra: Row = {}): Row => ({
  id: 'decks/decks/vue-router.md',
  stem: 'decks/vue-router',
  path: '/decks/vue-router',
  title: 'Vue Router',
  tags: ['vue'],
  durationMinutes: 60,
  revealBasePath: '/reveals/vue-router',
  currentVersion: 2,
  versions: [v(1), v(2)],
  ...extra,
})

describe('displayedStatus helpers', () => {
  it('shows a deck when displayedStatus is true or absent', () => {
    expect(isDisplayed(deck())).toBe(true)
    expect(isDisplayed(deck({ displayedStatus: true }))).toBe(true)
  })

  it('hides a deck when displayedStatus is false', () => {
    expect(isDisplayed(deck({ displayedStatus: false }))).toBe(false)
  })

  it('hides a deck whose every version is hidden', () => {
    expect(isDisplayed(deck({ versions: [v(1, false), v(2, false)] }))).toBe(false)
  })

  it('drops hidden versions', () => {
    expect(visibleVersions(deck({ versions: [v(1), v(2, false), v(3)] })).map(x => x.version)).toEqual([1, 3])
  })

  it('falls back to the newest visible version when the current one is hidden', () => {
    expect(currentVersionOf(deck({ currentVersion: 2, versions: [v(1), v(2, false)] }))).toBe(1)
    expect(currentVersionOf(deck())).toBe(2)
  })

  it('withSlug leaves hidden decks out of lists', () => {
    const rows = [
      deck({ stem: 'decks/shown' }),
      deck({ stem: 'decks/hidden', displayedStatus: false }),
    ]
    expect(withSlug(rows).map(d => d.id)).toEqual(['shown'])
  })
})

describe('deck page honours displayedStatus', () => {
  beforeEach(() => { state.row = deck() })

  it('404s a hidden deck', async () => {
    state.row = deck({ displayedStatus: false })
    await expect(mountSuspended(DeckPage, { route: '/decks/vue-router' })).rejects.toMatchObject({ statusCode: 404 })
  })

  it('leaves hidden versions out of the picker and opens the newest visible one', async () => {
    state.row = deck({ currentVersion: 3, versions: [v(1), v(2), v(3, false)] })
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/vue-router' })
    await flushPromises()
    const options = wrapper.findAll('select#version-select option').map(o => o.text())
    expect(options).toEqual(['Event 2025', 'Event 2026 (current)'])
    expect(wrapper.find('iframe').attributes('src')).toBe('/reveals/vue-router/v2.html')
  })

  it('ignores ?v= pointing at a hidden version', async () => {
    state.row = deck({ versions: [v(1, false), v(2)] })
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/vue-router?v=1' })
    await flushPromises()
    expect(wrapper.find('iframe').attributes('src')).toBe('/reveals/vue-router/v2.html')
  })
})

describe('deck content files', () => {
  const dir = resolve('content/decks')
  const files = readdirSync(dir).filter(f => f.endsWith('.md'))

  it('every revealFile exists under public/', () => {
    for (const file of files) {
      const text = readFileSync(resolve(dir, file), 'utf-8')
      const base = text.match(/^revealBasePath: "([^"]+)"$/m)?.[1]
      expect(base, `${file} has no revealBasePath`).toBeTruthy()
      for (const [, name] of text.matchAll(/revealFile: "([^"]+)"/g)) {
        expect(existsSync(resolve('public', `.${base}`, name)), `${file}: ${base}/${name}`).toBe(true)
      }
    }
  })

  it('displayedStatus, when set, is a boolean', () => {
    for (const file of files) {
      const text = readFileSync(resolve(dir, file), 'utf-8')
      for (const [, value] of text.matchAll(/displayedStatus: (\S+)/g)) {
        expect(['true', 'false'], `${file} displayedStatus: ${value}`).toContain(value)
      }
    }
  })
})
