import { describe, it, expect, vi } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import LegacyDeckGrid from '../components/LegacyDeckGrid.vue'

const rows = vi.hoisted(() => [
  {
    id: 'legacy/legacy/with-thumb.md',
    title: 'With Thumb',
    description: 'Has a thumbnail.',
    tags: ['career'],
    format: 'PDF',
    fileUrl: '/legacy-files/with-thumb.pdf',
    thumbnailUrl: '/legacy-thumbnails/with-thumb.jpg',
    conference: 'Conf',
    date: '2025-03-01',
  },
  {
    id: 'legacy/legacy/no-thumb.md',
    title: 'No Thumb',
    description: 'No thumbnail.',
    tags: [],
    format: 'PDF',
    fileUrl: '/legacy-files/no-thumb.pdf',
    conference: 'Conf',
    date: '2024-01-01',
  },
])

mockNuxtImport('queryCollection', () => () => ({ all: async () => rows }))

describe('legacy deck grid', () => {
  it('shows a lazy 16:9 thumbnail with alt text when one is set', async () => {
    const wrapper = await mountSuspended(LegacyDeckGrid)
    const imgs = wrapper.findAll('img')
    expect(imgs).toHaveLength(1)
    const img = imgs[0]!
    expect(img.attributes('src')).toBe('/legacy-thumbnails/with-thumb.jpg')
    expect(img.attributes('alt')).toBe('Title slide of With Thumb')
    expect(img.attributes('loading')).toBe('lazy')
    expect(img.attributes('width')).toBe('1280')
    expect(img.attributes('height')).toBe('720')
  })

  it('hides a thumbnail that fails to load', async () => {
    const wrapper = await mountSuspended(LegacyDeckGrid)
    const img = wrapper.find('img')
    await img.trigger('error')
    expect((img.element as HTMLImageElement).hidden).toBe(true)
  })

  it('still renders cards without a thumbnail', async () => {
    const wrapper = await mountSuspended(LegacyDeckGrid)
    expect(wrapper.findAll('article')).toHaveLength(2)
  })
})

describe('legacy content files', () => {
  const dir = resolve('content/legacy')
  // The three original entries are placeholders whose files were never added.
  const placeholders = new Set(['css-mastery-2020.md', 'intro-to-javascript-2018.md', 'react-patterns-2019.md'])
  const files = readdirSync(dir).filter(f => f.endsWith('.md') && !placeholders.has(f))
  // Double-quoted YAML scalar; values may contain escaped quotes.
  const field = (text: string, key: string) => text.match(new RegExp(`^${key}: "((?:[^"\\\\]|\\\\.)+)"$`, 'm'))?.[1]

  it('has the recovered talks', () => {
    expect(files.length).toBeGreaterThanOrEqual(7)
  })

  it('every fileUrl and thumbnailUrl exists under public/ and stays small', () => {
    for (const file of files) {
      const text = readFileSync(resolve(dir, file), 'utf-8')
      for (const key of ['fileUrl', 'thumbnailUrl']) {
        const url = field(text, key)
        expect(url, `${file} has no ${key}`).toBeTruthy()
        const path = resolve('public', `.${url}`)
        expect(existsSync(path), `${file}: ${url}`).toBe(true)
        expect(statSync(path).size, `${file}: ${url} is over 25 MB`).toBeLessThan(25 * 1024 * 1024)
      }
    }
  })

  it('has the required fields', () => {
    for (const file of files) {
      const text = readFileSync(resolve(dir, file), 'utf-8')
      for (const key of ['id', 'title', 'description', 'format', 'conference', 'date']) {
        expect(field(text, key), `${file} is missing ${key}`).toBeTruthy()
      }
      expect(field(text, 'id')).toBe(file.replace(/\.md$/, ''))
    }
  })
})
