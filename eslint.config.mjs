// Generated config lives in .nuxt/eslint.config.mjs and is produced by
// @nuxt/eslint from the project's actual Nuxt setup (Vue, TS, auto-imports).
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      'node-compile-cache/**',
      'node-jiti/**',
      'public/reveals/**',
      '.worktrees/**',
      '.output/**',
      '.data/**',
    ],
  },
  {
    rules: {
      // Vue 3 supports fragments; pages/index.vue legitimately has three
      // root sections. This rule is a Vue 2 holdover.
      'vue/no-multiple-template-root': 'off',
    },
  },
)
