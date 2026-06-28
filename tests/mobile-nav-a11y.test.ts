import { describe, it, expect } from 'vitest'

async function src(path: string): Promise<string> {
  const mod = await import(`../${path}?raw`)
  return mod.default as string
}

describe('#27 mobile nav accessibility', () => {
  it('mobile menu wrapper has aria-hidden binding', async () => {
    const text = await src('components/SiteNav.vue')
    expect(text).toContain(':aria-hidden="!isOpen"')
  })

  it('mobile links have tabindex="-1" when closed', async () => {
    const text = await src('components/SiteNav.vue')
    expect(text).toContain(':tabindex="isOpen ? 0 : -1"')
  })

  it('toggle button has aria-controls pointing to mobile menu id', async () => {
    const text = await src('components/SiteNav.vue')
    expect(text).toContain('aria-controls="mobile-nav"')
    expect(text).toContain('id="mobile-nav"')
  })

  it('toggle button has aria-expanded binding', async () => {
    const text = await src('components/SiteNav.vue')
    expect(text).toContain(':aria-expanded="isOpen"')
  })

  it('SiteNav manages focus on open/close', async () => {
    const text = await src('components/SiteNav.vue')
    // watch isOpen and call focus()
    expect(text).toContain('watch(isOpen')
    expect(text).toContain('.focus()')
  })

  it('Escape key closes mobile menu', async () => {
    const text = await src('components/SiteNav.vue')
    expect(text).toContain("'Escape'")
    expect(text).toContain('isOpen = false')
  })
})
