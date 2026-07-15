import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(__dirname, '..')

describe('#8 Privacy-respecting analytics', () => {
  it('useAnalytics composable exists', () => {
    expect(existsSync(resolve(root, 'composables/useAnalytics.ts'))).toBe(true)
  })

  it('useAnalytics exports trackDeckView function', () => {
    const src = readFileSync(resolve(root, 'composables/useAnalytics.ts'), 'utf-8')
    expect(src).toContain('trackDeckView')
    expect(src).toContain('export function useAnalytics')
  })

  it('Netlify Edge Function for tracking exists', () => {
    expect(existsSync(resolve(root, 'netlify/edge-functions/track-deck-view.ts'))).toBe(true)
  })

  it('Edge Function posts to /.netlify/functions/track-deck-view', () => {
    const src = readFileSync(resolve(root, 'netlify/edge-functions/track-deck-view.ts'), 'utf-8')
    expect(src).toContain('/.netlify/functions/track-deck-view')
  })

  it('Deck detail page calls trackDeckView', () => {
    const src = readFileSync(resolve(root, 'pages/decks/[id].vue'), 'utf-8')
    expect(src).toContain('trackDeckView')
    expect(src).toContain('useAnalytics')
  })

  it('ANALYTICS_SETUP.md with Supabase schema exists', () => {
    expect(existsSync(resolve(root, 'ANALYTICS_SETUP.md'))).toBe(true)
    const content = readFileSync(resolve(root, 'ANALYTICS_SETUP.md'), 'utf-8')
    expect(content).toContain('deck_views')
    expect(content).toContain('SUPABASE_URL')
  })

  it('.env.example has Supabase placeholders', () => {
    expect(existsSync(resolve(root, '.env.example'))).toBe(true)
    const content = readFileSync(resolve(root, '.env.example'), 'utf-8')
    expect(content).toContain('SUPABASE_URL')
    expect(content).toContain('SUPABASE_ANON_KEY')
  })
})
