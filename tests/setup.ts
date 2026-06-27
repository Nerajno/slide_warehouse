import { config } from '@vue/test-utils'
import { vi } from 'vitest'

config.global.stubs = {
  NuxtLink: true,
  NuxtImg: true,
}

// Make defineNuxtConfig available for config import tests
vi.stubGlobal('defineNuxtConfig', (config: unknown) => config)
