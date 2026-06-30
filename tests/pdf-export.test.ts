import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(__dirname, '..')

function src(path: string) {
  return readFileSync(resolve(root, path), 'utf-8')
}

describe('#16 PDF export GitHub Actions workflow', () => {
  it('workflow file exists at .github/workflows/pdf-export.yml', () => {
    expect(existsSync(resolve(root, '.github/workflows/pdf-export.yml'))).toBe(true)
  })

  it('workflow has workflow_dispatch trigger for manual runs', () => {
    const text = src('.github/workflows/pdf-export.yml')
    expect(text).toContain('workflow_dispatch')
  })

  it('workflow installs decktape', () => {
    const text = src('.github/workflows/pdf-export.yml')
    expect(text).toContain('decktape')
  })

  it('workflow uploads PDFs as artifact', () => {
    const text = src('.github/workflows/pdf-export.yml')
    expect(text).toContain('upload-artifact')
  })

  it('workflow targets public/pdfs output directory', () => {
    const text = src('.github/workflows/pdf-export.yml')
    expect(text).toContain('public/pdfs')
  })
})
