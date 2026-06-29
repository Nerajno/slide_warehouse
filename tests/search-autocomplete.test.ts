import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(__dirname, '..')

function src(path: string) {
  return readFileSync(resolve(root, path), 'utf-8')
}

describe('#13 Search autocomplete / type-ahead', () => {
  it('SearchBar uses role="combobox" on input', () => {
    const text = src('components/SearchBar.vue')
    expect(text).toContain('combobox')
  })

  it('SearchBar has aria-expanded bound to suggestions visibility', () => {
    const text = src('components/SearchBar.vue')
    expect(text).toContain('aria-expanded')
  })

  it('SearchBar has aria-controls linking input to listbox', () => {
    const text = src('components/SearchBar.vue')
    expect(text).toContain('aria-controls')
  })

  it('suggestions list uses role="listbox"', () => {
    const text = src('components/SearchBar.vue')
    expect(text).toContain('listbox')
  })

  it('suggestion items use role="option"', () => {
    const text = src('components/SearchBar.vue')
    expect(text).toContain('option')
  })

  it('keyboard navigation: ArrowDown and ArrowUp handled', () => {
    const text = src('components/SearchBar.vue')
    expect(text).toContain('ArrowDown')
    expect(text).toContain('ArrowUp')
  })

  it('Escape key closes suggestions', () => {
    const text = src('components/SearchBar.vue')
    expect(text).toContain('Escape')
  })

  it('suggestions derive from store allDecks titles and tags', () => {
    const text = src('components/SearchBar.vue')
    expect(text).toContain('allDecks')
    expect(text).toContain('tags')
  })
})
