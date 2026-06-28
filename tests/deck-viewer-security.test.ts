import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DeckViewer from '../components/DeckViewer.vue'

const props = { src: '/reveals/test/v1.html', title: 'Test Deck' }

describe('#6 DeckViewer iframe security', () => {
  it('iframe sandbox does not include allow-same-origin', async () => {
    const wrapper = await mountSuspended(DeckViewer, { props })
    const iframe = wrapper.find('iframe')
    const sandbox = iframe.attributes('sandbox') ?? ''
    expect(sandbox).not.toContain('allow-same-origin')
    expect(sandbox).toContain('allow-scripts')
  })

  it('postMessage to iframe uses site origin, not wildcard', async () => {
    // Verify the component source does not send postMessage to '*'
    // (structural test — runtime check not feasible in unit env)
    const src = (await import('../components/DeckViewer.vue?raw')).default as string
    expect(src).not.toContain("postMessage({ method: 'prev' }, '*')")
    expect(src).not.toContain("postMessage({ method: 'next' }, '*')")
  })

  it('message event listener validates origin', async () => {
    const src = (await import('../components/DeckViewer.vue?raw')).default as string
    expect(src).toContain('e.origin')
  })
})
