import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const decksDir = resolve('content/decks')

describe('#10 no empty placeholder fields in deck content', () => {
  const files = readdirSync(decksDir).filter(f => f.endsWith('.md'))

  it('no deck has conferenceUrl set to empty string', () => {
    for (const file of files) {
      const text = readFileSync(resolve(decksDir, file), 'utf-8')
      expect(text, `${file} has conferenceUrl: ""`).not.toMatch(/^conferenceUrl: ""$/m)
    }
  })

  it('no deck has videoUrl set to empty string', () => {
    for (const file of files) {
      const text = readFileSync(resolve(decksDir, file), 'utf-8')
      expect(text, `${file} has videoUrl: ""`).not.toMatch(/^videoUrl: ""$/m)
    }
  })

  it('no deck has conference set to empty string', () => {
    for (const file of files) {
      const text = readFileSync(resolve(decksDir, file), 'utf-8')
      expect(text, `${file} has conference: ""`).not.toMatch(/^conference: ""$/m)
    }
  })

  it('no deck has location set to empty string', () => {
    for (const file of files) {
      const text = readFileSync(resolve(decksDir, file), 'utf-8')
      expect(text, `${file} has location: ""`).not.toMatch(/^location: ""$/m)
    }
  })
})
