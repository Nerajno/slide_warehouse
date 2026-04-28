import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { DeckFrontmatter } from '~/types'

export default defineEventHandler((): DeckFrontmatter[] => {
  const raw = readFileSync(resolve('data/decks.json'), 'utf-8')
  return JSON.parse(raw)
})
