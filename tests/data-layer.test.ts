import { describe, it, expect } from 'vitest'

async function src(path: string): Promise<string> {
  const mod = await import(`../${path}?raw`)
  return mod.default as string
}

describe('#5 data layer source of truth', () => {
  it('deckStore does not call $fetch(/api/decks)', async () => {
    const text = await src('stores/deckStore.ts')
    expect(text).not.toContain("'/api/decks'")
    expect(text).toContain('queryCollection')
  })

  it('SpeakerOverview does not call $fetch(/api/decks)', async () => {
    const text = await src('components/SpeakerOverview.vue')
    expect(text).not.toContain("'/api/decks'")
  })

  it('about.vue does not call $fetch(/api/decks)', async () => {
    const text = await src('pages/about.vue')
    expect(text).not.toContain("'/api/decks'")
  })

  it('topics/index.vue does not call $fetch(/api/decks)', async () => {
    const text = await src('pages/topics/index.vue')
    expect(text).not.toContain("'/api/decks'")
  })

  it('decks/[id].vue does not call $fetch(/api/decks)', async () => {
    const text = await src('pages/decks/[id].vue')
    expect(text).not.toContain("'/api/decks'")
  })

  it('server/api/decks.get.ts is deleted', async () => {
    await expect(src('server/api/decks.get.ts')).rejects.toThrow()
  })
})
