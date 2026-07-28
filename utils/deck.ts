import type { DeckFrontmatter } from '~/types'

/**
 * Nuxt Content v3 owns the `id` column on `type: 'page'` collections and fills
 * it with the source path (`decks/decks/networking-talk.md`). Our frontmatter
 * `id` is silently dropped, so `deck.id` was neither the slug nor usable in a
 * route — every `/decks/${deck.id}` link was malformed and the detail page's
 * `where('id','=',slug)` never matched.
 *
 * `stem` is the clean, stable value (`decks/networking-talk`); its last segment
 * is the slug the routes use.
 */
export function deckSlug(deck: { stem?: string; id?: string }): string {
  const stem = deck.stem ?? deck.id ?? ''
  return stem.split('/').pop()?.replace(/\.md$/, '') ?? ''
}

/** Re-key a collection result so `deck.id` is the route slug. */
export function withSlug<T extends { stem?: string; id?: string }>(decks: T[] | null): T[] {
  return (decks ?? []).map(d => ({ ...d, id: deckSlug(d) }))
}

export type { DeckFrontmatter }
