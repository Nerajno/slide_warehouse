import { readdirSync, readFileSync, rmSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { defineNuxtModule, useLogger } from '@nuxt/kit'
import { parse } from 'yaml'

interface Frontmatter {
  revealBasePath?: string
  displayedStatus?: boolean
  versions?: { revealFile?: string; displayedStatus?: boolean }[]
}

function frontmatter(file: string): Frontmatter {
  const m = readFileSync(file, 'utf-8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return m ? (parse(m[1]) ?? {}) : {}
}

/**
 * Reveal paths (relative to the public folder) that belong to hidden decks or
 * hidden versions. Mirrors `isDisplayed` in utils/deck.ts: a deck with every
 * version hidden is hidden as a whole.
 */
export function hiddenRevealPaths(contentDir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(contentDir).filter(f => f.endsWith('.md')).sort()) {
    const fm = frontmatter(join(contentDir, name))
    if (!fm.revealBasePath) continue
    const base = fm.revealBasePath.replace(/^\/+/, '')
    const versions = fm.versions ?? []
    const hidden = versions.filter(v => v.displayedStatus === false)
    if (fm.displayedStatus === false || (versions.length && hidden.length === versions.length)) {
      out.push(base)
      continue
    }
    for (const v of hidden) if (v.revealFile) out.push(`${base}/${v.revealFile}`)
  }
  return out
}

/** Delete hidden reveal paths from a built public folder. Returns how many were removed. */
export function removeHiddenReveals(contentDir: string, publicDir: string): number {
  const root = resolve(publicDir)
  const paths = hiddenRevealPaths(contentDir).map(p => resolve(root, p))
  // Frontmatter is input: never let a revealBasePath reach outside the output.
  const bad = paths.find(p => p === root || relative(root, p).startsWith(`..${sep}`) || relative(root, p) === '..')
  if (bad) throw new Error(`hide-reveals: ${bad} is outside ${root}`)
  for (const p of paths) rmSync(p, { recursive: true, force: true })
  return paths.length
}

/**
 * `public/` is copied into the build as-is, so a hidden deck's raw HTML would
 * still be served. Strip it from the output once Nitro has compiled.
 */
export default defineNuxtModule({
  meta: { name: 'hide-reveals' },
  setup(_, nuxt) {
    if (nuxt.options.dev) return
    const logger = useLogger('hide-reveals')
    const contentDir = join(nuxt.options.rootDir, 'content/decks')
    nuxt.hook('nitro:init', (nitro) => {
      nitro.hooks.hook('compiled', () => {
        const n = removeHiddenReveals(contentDir, nitro.options.output.publicDir)
        logger.info(`hid ${n} reveal path${n === 1 ? '' : 's'}`)
      })
    })
  },
})
