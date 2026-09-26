import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { gitProjectFiles } from './git-project-files'

const scratch = mkdtempSync(join(tmpdir(), 'supersoft-test-'))
const repository = join(scratch, 'medito')
/** A repository whose host sends every file, whatever it is asked for. */
const unfiltered = join(scratch, 'unfiltered')
const large = 3 * 1024 * 1024

const git = (cwd: string, ...args: string[]) =>
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.org', ...args], { cwd })

const commit = (at: string, files: Record<string, string | Buffer>) => {
  for (const [path, content] of Object.entries(files)) writeFileSync(join(at, path), content)
  git(at, 'add', '.')
  git(at, 'commit', '--quiet', '-m', 'change')
}

/** Bytes that do not compress, so a copy's size says what was fetched. */
const noise = (size: number) => Buffer.from(Array.from({ length: size }, () => Math.floor(Math.random() * 256)))

/** The bytes under a directory, counted as Supersoft counts them. */
const du = (path: string): number =>
  readdirSync(path, { withFileTypes: true }).reduce((size, entry) => {
    const inside = join(path, entry.name)
    return size + (entry.isDirectory() ? du(inside) : statSync(inside).size)
  }, 0)

const copies = (cache: string) => {
  try {
    return readdirSync(cache)
  } catch {
    return []
  }
}

beforeAll(() => {
  for (const at of [repository, unfiltered]) execFileSync('git', ['init', '--quiet', at])
  git(repository, 'config', 'uploadpack.allowFilter', 'true')
  commit(repository, { 'README.md': '# Medito', 'recording.bin': noise(large) })
  commit(unfiltered, { 'README.md': '# Unfiltered', 'recording.bin': noise(large) })
})

afterAll(() => rmSync(scratch, { recursive: true, force: true }))

let caches = 0
const aCache = () => join(scratch, `cache-${++caches}`)

describe('projects read from their repository', () => {
  const files = gitProjectFiles({ cache: aCache(), local: true })

  it('opens a repository at its address and reads its files', async () => {
    const opened = await files.open(repository)
    expect(opened?.address).toBe(repository)
    expect(await opened?.read('README.md')).toBe('# Medito')
  })

  it('links to nothing for a repository on this machine', async () => {
    expect((await files.open(repository))?.link).toBeUndefined()
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
    const at = join(scratch, 'changing')
    execFileSync('git', ['init', '--quiet', at])
    commit(at, { 'README.md': '# Medito' })
    const before = await files.open(at)
    commit(at, { 'README.md': '# Changed' })
    const after = await files.open(at)
    expect(await before?.read('README.md')).toBe('# Medito')
    expect(await after?.read('README.md')).toBe('# Changed')
  })

  it('opens nothing on this machine unless asked to', async () => {
    const cache = aCache()
    expect(await gitProjectFiles({ cache }).open(repository)).toBeUndefined()
    expect(await gitProjectFiles({ cache }).open(`file://${repository}`)).toBeUndefined()
  })

  it('opens nothing it would need a key or a password for', async () => {
    expect(await files.open('ssh://git@example.org/medito.git')).toBeUndefined()
  })
})

describe('opening an address without putting Supersoft at risk', () => {
  it('fetches no file larger than 1 MB, and nothing when a file is read', async () => {
    const cache = aCache()
    const opened = await gitProjectFiles({ cache, local: true }).open(repository)
    expect(du(cache)).toBeLessThan(large / 4)
    expect(await opened?.read('README.md')).toBe('# Medito')
    expect(du(cache)).toBeLessThan(large / 4)
  })

  it('reads no file larger than 1 MB', async () => {
    const cache = aCache()
    const opened = await gitProjectFiles({ cache, local: true }).open(repository)
    expect(await opened?.read('recording.bin')).toBeUndefined()
    expect(du(cache)).toBeLessThan(large / 4)
  })

  it('opens no repository whose copy grows too large, and keeps nothing of it', async () => {
    const cache = aCache()
    const files = gitProjectFiles({ cache, local: true, maxCopyBytes: 1024 * 1024 })
    expect(await files.open(unfiltered)).toBeUndefined()
    expect(copies(cache)).toEqual([])
  })

  it('opens no repository that takes too long', async () => {
    const cache = aCache()
    expect(await gitProjectFiles({ cache, local: true, timeoutMs: 1 }).open(repository)).toBeUndefined()
    expect(copies(cache)).toEqual([])
  })

  it('keeps nothing of an address that could not be opened', async () => {
    const cache = aCache()
    expect(await gitProjectFiles({ cache, local: true }).open(join(scratch, 'nowhere'))).toBeUndefined()
    expect(copies(cache)).toEqual([])
  })

  it('opens nothing on this machine or a private network, over https', async () => {
    const files = gitProjectFiles({ cache: aCache(), lookup: async () => ['10.0.0.7'] })
    expect(await files.open('https://inside.example.org/medito')).toBeUndefined()
    expect(await files.open('https://localhost/medito')).toBeUndefined()
    expect(await files.open('https://169.254.169.254/medito')).toBeUndefined()
    expect(await files.open('https://example.org:8443/medito')).toBeUndefined()
  })

  it('drops the copies opened least recently when the cache is full', async () => {
    const cache = aCache()
    const other = join(scratch, 'other')
    execFileSync('git', ['init', '--quiet', other])
    commit(other, { 'README.md': '# Other' })

    await gitProjectFiles({ cache, local: true }).open(repository)
    const one = du(cache)
    const [first] = copies(cache)
    await new Promise((later) => setTimeout(later, 20))

    const files = gitProjectFiles({ cache, local: true, maxCacheBytes: one })
    const opened = await files.open(other)
    expect(copies(cache)).not.toContain(first)
    expect(copies(cache)).toHaveLength(1)
    expect(await opened?.read('README.md')).toBe('# Other')
  })

  it('reads a repository the same whatever is configured on this machine', async () => {
    const configured = join(scratch, 'gitconfig')
    writeFileSync(configured, `[url "${join(scratch, 'nowhere')}/"]\n\tinsteadOf = ${scratch}/\n`)
    const before = process.env.GIT_CONFIG_GLOBAL
    process.env.GIT_CONFIG_GLOBAL = configured
    try {
      const opened = await gitProjectFiles({ cache: aCache(), local: true }).open(repository)
      expect(await opened?.read('README.md')).toBe('# Medito')
    } finally {
      if (before === undefined) delete process.env.GIT_CONFIG_GLOBAL
      else process.env.GIT_CONFIG_GLOBAL = before
    }
  })
})
