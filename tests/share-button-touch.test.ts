import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DeckCard from '../components/DeckCard.vue'
import type { DeckFrontmatter } from '../types'

// #88: the share control was opacity-0 until hover, so on touch devices it was
// invisible but still tappable. Visibility per device is checked in a browser
// (see PR); this guards the class wiring.
describe('#88 card share button on touch', () => {
  it('keeps the desktop reveal and is always visible where hover is unavailable', async () => {
    const deck = { id: 'networking-talk', title: 'Networking', tags: [] } as unknown as DeckFrontmatter
    const wrapper = await mountSuspended(DeckCard, { props: { deck } })
    const reveal = wrapper.find('button[aria-label="Copy link to this deck"]').element.parentElement!
    const cls = reveal.className.split(/\s+/)
    expect(cls).toEqual(expect.arrayContaining(['opacity-0', 'group-hover:opacity-100', 'focus-within:opacity-100', '[@media(hover:none)]:opacity-100']))
  })
})
