import { describe, expect, it } from 'vitest'
import { inMemoryProjectFiles } from './in-memory-project-files'

const address = 'https://example.org/medito'

describe('projects held in memory', () => {
  it('opens a project at its address and reads its files', async () => {
    const files = inMemoryProjectFiles({ [address]: { 'README.md': '# Medito' } })
    const opened = await files.open(address)
    expect(opened?.address).toBe(address)
    expect(await opened?.read('README.md')).toBe('# Medito')
  })

  it('opens nothing where nothing is kept', async () => {
    expect(await inMemoryProjectFiles({}).open(address)).toBeUndefined()
  })

  it('reads nothing where a project has no such file', async () => {
    const opened = await inMemoryProjectFiles({ [address]: {} }).open(address)
    expect(await opened?.read('README.md')).toBeUndefined()
  })

  it('keeps a project as it was when it was opened', async () => {
    const kept: Record<string, string> = { 'README.md': '# Medito' }
    const opened = await inMemoryProjectFiles({ [address]: kept }).open(address)
    kept['README.md'] = '# Changed'
    expect(await opened?.read('README.md')).toBe('# Medito')
  })
})
