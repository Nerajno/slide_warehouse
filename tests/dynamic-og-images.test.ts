import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(__dirname, '..')

function src(path: string) {
  return readFileSync(resolve(root, path), 'utf-8')
}

describe('#15 Per-deck dynamic OG images', () => {
  it('nuxt-og-image is in package.json dependencies', () => {
    const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    expect(deps).toHaveProperty('nuxt-og-image')
  })

  it('nuxt.config.ts includes nuxt-og-image module', () => {
    const config = src('nuxt.config.ts')
    expect(config).toContain('nuxt-og-image')
  })

  it('OgImage/DeckCard.vue template component exists', () => {
    expect(existsSync(resolve(root, 'components/OgImage/DeckCard.vue'))).toBe(true)
  })

  it('OgImage/DeckCard.vue uses defineProps with title and description', () => {
    const text = src('components/OgImage/DeckCard.vue')
    expect(text).toContain('title')
    expect(text).toContain('description')
    expect(text).toContain('defineProps')
  })

  it('pages/decks/[id].vue calls defineOgImage', () => {
    const text = src('pages/decks/[id].vue')
    expect(text).toContain('defineOgImage')
  })

  it('pages/decks/[id].vue passes deck title and description to defineOgImage', () => {
    const text = src('pages/decks/[id].vue')
    expect(text).toContain('deck.value?.title')
    expect(text).toContain('deck.value?.description')
  })
})
