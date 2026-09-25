import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { gitProjectFiles } from './git-project-files'

const scratch = mkdtempSync(join(tmpdir(), 'supersoft-test-'))
const repository = join(scratch, 'medito')
const cache = join(scratch, 'cache')

const git = (...args: string[]) =>
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.org', ...args], {
    cwd: repository,
  })

const commit = (files: Record<string, string>) => {
  for (const [path, text] of Object.entries(files)) writeFileSync(join(repository, path), text)
  git('add', '.')
  git('commit', '--quiet', '-m', 'change')
}

beforeAll(() => {
  execFileSync('git', ['init', '--quiet', repository])
  commit({ 'README.md': '# Medito' })
})

afterAll(() => rmSync(scratch, { recursive: true, force: true }))

describe('projects read from their repository', () => {
  const files = gitProjectFiles({ cache, local: true })

  it('opens a repository at its address and reads its files', async () => {
    const opened = await files.open(repository)
    expect(opened?.address).toBe(repository)
    expect(await opened?.read('README.md')).toBe('# Medito')
  })

  it('opens nothing where nothing is kept', async () => {
    expect(await files.open(join(scratch, 'nowhere'))).toBeUndefined()
  })

  it('reads nothing where a project has no such file', async () => {
    const opened = await files.open(repository)
    expect(await opened?.read('docs/missing.md')).toBeUndefined()
  })

  it('reads nothing outside the project', async () => {
    const opened = await files.open(repository)
    expect(await opened?.read('../medito/README.md')).toBeUndefined()
    expect(await opened?.read('/etc/hostname')).toBeUndefined()
  })

  it('keeps a project as it was when it was opened', async () => {
    const before = await files.open(repository)
    commit({ 'README.md': '# Changed' })
    const after = await files.open(repository)
    expect(await before?.read('README.md')).toBe('# Medito')
    expect(await after?.read('README.md')).toBe('# Changed')
  })

  it('opens nothing on this machine unless asked to', async () => {
    expect(await gitProjectFiles({ cache }).open(repository)).toBeUndefined()
    expect(await gitProjectFiles({ cache }).open(`file://${repository}`)).toBeUndefined()
  })

  it('opens nothing it would need a key or a password for', async () => {
    expect(await files.open('ssh://git@example.org/medito.git')).toBeUndefined()
  })
})
