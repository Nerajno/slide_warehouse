import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SiteNav from '../components/SiteNav.vue'
import SiteFooter from '../components/SiteFooter.vue'

// NuxtLink is stubbed in tests/setup.ts and renders `to`; plain anchors render `href`.
const targets = (html: string) => [...html.matchAll(/(?:href|to)="([^"]*)"/g)].map(m => m[1])

describe('#61 /topics and /legacy are reachable', () => {
  it('nav links Topics on desktop and in the mobile menu', async () => {
    const links = targets((await mountSuspended(SiteNav)).html())
    expect(links.filter(l => l === '/topics')).toHaveLength(2)
  })

  it('nav section links work from any page, not only the homepage', async () => {
    const links = targets((await mountSuspended(SiteNav)).html())
    expect(links).not.toContain('#decks')
    expect(links).not.toContain('#history')
    expect(links.filter(l => l === '/#decks')).toHaveLength(2)
    expect(links.filter(l => l === '/#history')).toHaveLength(2)
  })

  it('footer links Topics and Legacy', async () => {
    const links = targets((await mountSuspended(SiteFooter)).html())
    expect(links).toContain('/topics')
    expect(links).toContain('/legacy')
  })
})
