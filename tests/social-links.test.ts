import { describe, it, expect } from 'vitest'

async function src(path: string): Promise<string> {
  const mod = await import(`../${path}?raw`)
  return mod.default as string
}

describe('#23 social links accessibility', () => {
  it('SpeakerBio external links have rel="noopener noreferrer"', async () => {
    const text = await src('components/SpeakerBio.vue')
    // All target="_blank" links must have rel="noopener noreferrer"
    const blankLinks = [...text.matchAll(/target="_blank"/g)]
    expect(blankLinks.length).toBeGreaterThan(0)
    // Verify noreferrer present alongside noopener
    expect(text).toContain('rel="noopener noreferrer"')
  })

  it('SpeakerBio social links do not display raw https:// URLs as text', async () => {
    const text = await src('components/SpeakerBio.vue')
    // Template text nodes should not show raw URLs — labels like "X / @handle" instead
    // Raw URL pattern in mustache: {{ 'https://...' }} or just raw URL string in slot
    expect(text).not.toMatch(/{{\s*['"`]https?:\/\//)
    // Should not render socialHandles.x directly as href-only text
    expect(text).not.toMatch(/>{{\s*speaker\.socialHandles\.\w+\s*}}<\/a>/)
  })

  it('SpeakerBio social links have human-readable visible labels', async () => {
    const text = await src('components/SpeakerBio.vue')
    expect(text).toContain('X / @')
    expect(text).toContain('GitHub / @')
    expect(text).toContain('dev.to / @')
  })

  it('SpeakerBio social link hrefs are constructed, not raw handle strings', async () => {
    const text = await src('components/SpeakerBio.vue')
    // href should use template literal construction, not raw handle
    expect(text).toContain('https://x.com/')
    expect(text).toContain('https://github.com/')
    expect(text).toContain('https://dev.to/')
  })

  it('about.vue external links have rel="noopener noreferrer"', async () => {
    const text = await src('pages/about.vue')
    const hasBlankLinks = text.includes('target="_blank"')
    if (hasBlankLinks) {
      expect(text).toContain('rel="noopener noreferrer"')
    }
  })
})
