import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import TopicsIndex from '../pages/topics/index.vue'

// Eight topics with distinct deck counts, so the grid order (sorted by count)
// differs from TAG_LIST order — the case that broke per-topic colouring.
const decks = vi.hoisted(() => {
  const counts: Record<string, number> = { community: 8, career: 7, vue: 6, css: 5, react: 4, design: 3, beginner: 2, workshop: 1 }
  const rows: { id: string, stem: string, tags: string[] }[] = []
  for (let i = 0; i < 8; i++) rows.push({ id: `d${i}`, stem: `decks/d${i}`, tags: Object.keys(counts).filter(t => counts[t] > i) })
  return rows
})
mockNuxtImport('queryCollection', () => () => {
  const q = { select: () => q, where: () => q, all: async () => decks, first: async () => decks[0] }
  return q
})

// Light-theme token values, to compare what tiles actually render.
const css = readFileSync(resolve(__dirname, '../assets/css/tokens.css'), 'utf8')
const rootVars = Object.fromEntries([...css.matchAll(/:root\s*\{([^}]*)\}/g)].flatMap(b => [...b[1].matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()])))
const hexOf = (name: string): string | undefined => { const v = rootVars[name]; const m = v?.match(/^var\((--[\w-]+)\)$/); return m ? hexOf(m[1]) : v }

describe('#71 /topics grid colours tiles by position', () => {
  it('tiles within four places of each other never share a swatch', async () => {
    const tiles = (await mountSuspended(TopicsIndex, { global: { renderStubDefaultSlot: true } })).findAll('.grid > *')
    expect(tiles.length).toBe(8)
    // Resolve each tile's text colour through the tokens it references.
    const colour = tiles.map(t => hexOf(t.attributes('style')?.match(/var\((--tag-[a-z-]+-text)\)/)?.[1] ?? ''))
    expect(colour.every(c => /^#[0-9a-f]{6}$/i.test(c ?? ''))).toBe(true)
    for (let i = 0; i < colour.length; i++) for (let j = i + 1; j <= Math.min(colour.length - 1, i + 4); j++)
      expect(colour[i], `tile ${i} vs ${j}`).not.toBe(colour[j])
  })
})
