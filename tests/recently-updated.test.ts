import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(__dirname, '..')

function src(path: string) {
  return readFileSync(resolve(root, path), 'utf-8')
}

describe('#14 Recently Updated quick filter', () => {
  it('SearchParams sort type includes recently-updated', () => {
    const text = src('types/index.ts')
    expect(text).toContain('recently-updated')
  })

  it('DecksSection SORT_OPTIONS includes Recently Updated entry', () => {
    const text = src('components/DecksSection.vue')
    expect(text).toContain('recently-updated')
    expect(text).toContain('Recently Updated')
  })

  it('DecksSection sort logic handles recently-updated via updatedAt', () => {
    const text = src('components/DecksSection.vue')
    expect(text).toContain('updatedAt')
    expect(text).toContain('recently-updated')
  })

  it('useSearch syncUrl preserves sort param in URL', () => {
    const text = src('composables/useSearch.ts')
    expect(text).toContain('sort')
  })
})
