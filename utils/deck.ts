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

type VersionLike = { version: number; displayedStatus?: boolean }
type DeckLike = { displayedStatus?: boolean; currentVersion?: number; versions?: VersionLike[] }

/**
 * `displayedStatus` defaults to `true` in the content schema; compare against
 * `false` so rows that never went through the schema (tests, old caches) still show.
 */
export function visibleVersions<V extends VersionLike>(deck: { versions?: V[] }): V[] {
  return (deck.versions ?? []).filter(v => v.displayedStatus !== false)
}

/** A deck shows when it isn't switched off and has at least one visible version. */
export function isDisplayed(deck: DeckLike): boolean {
  if (deck.displayedStatus === false) return false
  return !deck.versions?.length || visibleVersions(deck).length > 0
}

/** `currentVersion`, or the newest visible version when that one is hidden. */
export function currentVersionOf(deck: DeckLike): number | undefined {
  const shown = visibleVersions(deck)
  if (!deck.versions?.length) return deck.currentVersion
  return shown.some(v => v.version === deck.currentVersion)
    ? deck.currentVersion
    : shown.at(-1)?.version
}

/**
 * The deck as visitors see it: hidden versions removed and `currentVersion`
 * pointing at a visible one, so cards, the picker and `?v=` need no checks.
 */
export function forDisplay<T extends { stem?: string; id?: string } & DeckLike>(deck: T): T {
  if (!deck.versions) return { ...deck, id: deckSlug(deck) }
  return { ...deck, id: deckSlug(deck), versions: visibleVersions(deck), currentVersion: currentVersionOf(deck) }
}

/** Re-key a collection result so `deck.id` is the route slug, dropping hidden decks. */
export function withSlug<T extends { stem?: string; id?: string } & DeckLike>(decks: T[] | null): T[] {
  return (decks ?? []).filter(isDisplayed).map(forDisplay)
}

export type { DeckFrontmatter }
