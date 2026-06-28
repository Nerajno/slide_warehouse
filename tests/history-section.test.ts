import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HistorySection from '../components/HistorySection.vue'

describe('#21 HistorySection', () => {
  it('renders without throwing', async () => {
    const wrapper = await mountSuspended(HistorySection)
    expect(wrapper.exists()).toBe(true)
  })

  it('shows event count stat block', async () => {
    const wrapper = await mountSuspended(HistorySection)
    // Counter element must exist — either 0 or populated
    const counter = wrapper.find('[aria-label]')
    expect(counter.exists()).toBe(true)
  })

  it('shows empty state when no events load', async () => {
    const wrapper = await mountSuspended(HistorySection)
    // If list is empty, empty state message must appear (not bare "0 Events")
    const text = wrapper.text()
    if (!text.includes('Events') || text.includes('0')) {
      expect(text).toMatch(/coming soon|no events|past events/i)
    }
  })
})
