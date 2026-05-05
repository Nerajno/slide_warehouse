# Slide Warehouse — Claude Configuration

## Stack Overview
- **Framework**: Nuxt 3 with Vue 3
- **Styling**: Tailwind CSS
- **State**: Pinia
- **Content**: Nuxt Content
- **Deploy**: Netlify
- **Presentations**: Reveal.js + Legacy formats (PPTX, PDF, Keynote)

## Key NPM Scripts
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

## Code Style Rules
- **Vue 3 Composition API only** - No Options API
- **Use `<script setup>`** - Always prefer script setup syntax
- **Typed props** - Use `defineProps<T>()` for type safety
- **TypeScript** - All new code should be typed

## Workflow Rules
1. **Typecheck after changes** - Run `npm run typecheck` before committing
2. **Single tests only** - Don't run full test suites for single changes
3. **Lint before PR** - Run `npm run lint` before creating pull requests
4. **Small commits** - Keep changes focused and atomic

## Common Claude Mistakes
- Using Options API instead of Composition API
- Missing TypeScript types for props
- Running full test suites unnecessarily
- Creating overly large commits
- Not running typecheck before changes
