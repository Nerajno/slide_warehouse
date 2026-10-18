import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { hiddenRevealPaths, removeHiddenReveals } from '../modules/hide-reveals'

const md = (slug: string, extra: string, versions = '  - version: 1\n    label: "One"\n    date: "2026-01-01"\n    revealFile: "v1.html"\n') =>
  `---\nid: "${slug}"\ntitle: "${slug}"\nrevealBasePath: "/reveals/${slug}"\ncurrentVersion: 1\nversions:\n${versions}${extra}---\n\nBody.\n`

let dir: string
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'hide-reveals-')) })
afterEach(() => rmSync(dir, { recursive: true, force: true }))

describe('hiddenRevealPaths', () => {
  it('returns the whole folder of a hidden deck', () => {
    writeFileSync(join(dir, 'a.md'), md('a', 'displayedStatus: false\n'))
    expect(hiddenRevealPaths(dir)).toEqual(['reveals/a'])
  })

  it('returns nothing for visible decks', () => {
    writeFileSync(join(dir, 'a.md'), md('a', 'displayedStatus: true\n'))
    writeFileSync(join(dir, 'b.md'), md('b', ''))
    expect(hiddenRevealPaths(dir)).toEqual([])
  })

  it('returns only the files of hidden versions', () => {
    writeFileSync(join(dir, 'a.md'), md('a', '', [
      '  - version: 1\n    label: "One"\n    date: "2026-01-01"\n    revealFile: "v1.html"\n    displayedStatus: false\n',
      '  - version: 2\n    label: "Two"\n    date: "2026-02-01"\n    revealFile: "v2.html"\n',
    ].join('')))
    expect(hiddenRevealPaths(dir)).toEqual(['reveals/a/v1.html'])
  })

  it('returns the whole folder when every version is hidden', () => {
    writeFileSync(join(dir, 'a.md'), md('a', '', '  - version: 1\n    label: "One"\n    date: "2026-01-01"\n    revealFile: "v1.html"\n    displayedStatus: false\n'))
    expect(hiddenRevealPaths(dir)).toEqual(['reveals/a'])
  })

  it('matches the real content: exactly the imported 2026-* decks', () => {
    const paths = hiddenRevealPaths(resolve('content/decks'))
    const hidden = readdirSync(resolve('content/decks')).filter(f => f.startsWith('2026-')).map(f => `reveals/${f.replace(/\.md$/, '')}`)
    expect(paths.sort()).toEqual(hidden.sort())
  })
})

describe('removeHiddenReveals', () => {
  it('deletes hidden paths from the output and keeps the rest', () => {
    const content = join(dir, 'content')
    const out = join(dir, 'out')
    mkdirSync(content)
    writeFileSync(join(content, 'hidden.md'), md('hidden', 'displayedStatus: false\n'))
    writeFileSync(join(content, 'shown.md'), md('shown', ''))
    for (const slug of ['hidden', 'shown']) {
      mkdirSync(join(out, 'reveals', slug, 'assets'), { recursive: true })
      writeFileSync(join(out, 'reveals', slug, 'v1.html'), '<html></html>')
    }

    expect(removeHiddenReveals(content, out)).toBe(1)
    expect(existsSync(join(out, 'reveals/hidden'))).toBe(false)
    expect(existsSync(join(out, 'reveals/shown/v1.html'))).toBe(true)
  })

  it('refuses paths that escape the output folder', () => {
    const content = join(dir, 'content')
    mkdirSync(content)
    writeFileSync(join(content, 'evil.md'), md('../../etc', 'displayedStatus: false\n'))
    expect(() => removeHiddenReveals(content, join(dir, 'out'))).toThrow(/outside/)
  })
})
