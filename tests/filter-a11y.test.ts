import { describe, it, expect } from 'vitest'

async function src(path: string): Promise<string> {
  const mod = await import(`../${path}?raw`)
  return mod.default as string
}

describe('#24/#26 filter pills and sort accessibility', () => {
  it('filter pill buttons use aria-pressed (not aria-checked)', async () => {
    const text = await src('components/DecksSection.vue')
    expect(text).toContain('aria-pressed')
    expect(text).not.toContain('role="radio"')
    expect(text).not.toContain('aria-checked')
  })

  it('sort select has a visible label element', async () => {
    const text = await src('components/DecksSection.vue')
    expect(text).toContain('<label')
    expect(text).toContain('for="sort-select"')
  })

  it('result count is announced to screen readers', async () => {
    const text = await src('components/DecksSection.vue')
    // Result count para with aria-live or role=status
    expect(text).toMatch(/aria-live|role="status"/)
    // Specifically the result count block
    expect(text).toContain('filteredDecks.length')
    expect(text).toContain('totalCount')
  })

  it('filter group has accessible label', async () => {
    const text = await src('components/DecksSection.vue')
    expect(text).toContain('aria-label')
  })
})
