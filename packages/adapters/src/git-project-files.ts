import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readdir, rm, stat, utimes } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import type { KeptFiles, ProjectFiles } from '@supersoft/domain'
import { atMost } from './at-most'
import { type Lookup, publicAddress, systemLookup } from './public-address'
import { repositoryLink } from './repository-link'

export interface GitProjectFilesOptions {
  /** Where the copies are kept. Anything here can be lost at any restart. */
  readonly cache?: string
  /** Whether an address may be a repository on this machine. Never in production. */
  readonly local?: boolean
  /** How long opening an address, or reading one file, may take before it counts as unreadable. */
  readonly timeoutMs?: number
  /** The largest file read. */
  readonly maxFileBytes?: number
  /** The largest copy of one repository; beyond it, the repository cannot be opened. */
  readonly maxCopyBytes?: number
  /** The most the copies may take together; beyond it, the least recently opened are dropped. */
  readonly maxCacheBytes?: number
  /** How many addresses are opened at once; the others wait their turn. */
  readonly atOnce?: number
  /** The addresses a name stands for. */
  readonly lookup?: Lookup
}

const MB = 1024 * 1024
const urlLike = /^[a-z][a-z0-9+.-]*:\/\//i

/** Where to fetch a repository from, and the settings every command on its copy is run with. */
interface Source {
  readonly url: string
  readonly settings: readonly string[]
}

/** The bytes under a directory; nothing there counts as none. */
const sizeOf = async (path: string): Promise<number> => {
  let entries
  try {
    entries = await readdir(path, { withFileTypes: true })
  } catch {
    return 0
  }
  let size = 0
  for (const entry of entries) {
    const inside = join(path, entry.name)
    if (entry.isDirectory()) size += await sizeOf(inside)
    else size += await stat(inside).then((found) => found.size, () => 0)
  }
  return size
}

/**
 * Reads a project from its repository. Each address gets one copy in the
 * cache, refreshed on every opening; an opened project reads the commit it was
 * opened at, so it stays as it was even when the copy moves on.
 *
 * Opening fetches the last commit, with every file of at most 1 MB and none
 * larger; reading never fetches anything. Only public repositories over https are read, from the machine
 * that was checked to be public, and repositories on this machine when `local`
 * is set. No credential is ever used or asked for, and nothing configured on
 * this machine changes how a repository is read.
 */
export const gitProjectFiles = (options: GitProjectFilesOptions = {}): ProjectFiles => {
  const cache = options.cache ?? join(tmpdir(), 'supersoft-projects')
  const local = options.local ?? false
  const timeout = options.timeoutMs ?? 20_000
  const maxFileBytes = options.maxFileBytes ?? 1 * MB
  const maxCopyBytes = options.maxCopyBytes ?? 50 * MB
  const maxCacheBytes = options.maxCacheBytes ?? 1024 * MB
  const lookup = options.lookup ?? systemLookup
  const opening = atMost(options.atOnce ?? 4)

  const git = (cwd: string, source: Source, args: readonly string[], signal?: AbortSignal) =>
    new Promise<string>((done, fail) => {
      execFile(
        'git',
        [
          '-c', 'protocol.allow=never',
          '-c', 'protocol.https.allow=always',
          '-c', `protocol.file.allow=${local ? 'always' : 'never'}`,
          '-c', 'credential.helper=',
          '-c', 'http.followRedirects=false',
          ...source.settings,
          ...args,
        ],
        {
          cwd,
          timeout,
          signal,
          maxBuffer: 2 * maxFileBytes,
          env: {
            PATH: process.env.PATH,
            NODE_ENV: process.env.NODE_ENV,
            GIT_CONFIG_NOSYSTEM: '1',
            GIT_CONFIG_GLOBAL: '/dev/null',
            GIT_TERMINAL_PROMPT: '0',
            // Only opening fetches: nothing read afterwards reaches the network.
            GIT_NO_LAZY_FETCH: '1',
          },
        },
        (error, stdout) => (error ? fail(error) : done(stdout)),
      )
    })

  const sourceOf = async (address: string): Promise<Source | undefined> => {
    if (!urlLike.test(address)) return local ? { url: resolve(address), settings: [] } : undefined
    if (local && address.startsWith('file://')) return { url: address, settings: [] }
    const found = await publicAddress(address, lookup)
    if (found === undefined) return undefined
    const ip = found.ip.includes(':') ? `[${found.ip}]` : found.ip
    return { url: found.url, settings: ['-c', `http.curloptResolve=${found.hostname}:443:${ip}`] }
  }

  /**
   * Some hosts answer an address without `.git` only with a redirection, which
   * is never followed: the same address with `.git`, on the same machine, is
   * tried instead.
   */
  const withSuffix = (source: Source): Source[] => {
    if (!source.url.startsWith('https://')) return []
    const url = new URL(source.url)
    if (url.pathname.endsWith('.git') || url.search !== '' || url.hash !== '') return []
    url.pathname = `${url.pathname.replace(/\/+$/, '')}.git`
    return [{ ...source, url: url.href }]
  }

  // Two openings of the same copy never work on it at once.
  const queues = new Map<string, Promise<unknown>>()
  const inTurn = <T>(key: string, work: () => Promise<T>): Promise<T> => {
    const next = (queues.get(key) ?? Promise.resolve()).then(work, work)
    queues.set(key, next.catch(() => undefined))
    return next
  }

  /**
   * Fetches the last commit of the repository into its copy, with every file of
   * at most `maxFileBytes` and none larger, and stops as soon as the copy grows too large.
   */
  const fetchInto = async (copy: string, source: Source): Promise<string> => {
    const tooLarge = new AbortController()
    const watch = setInterval(() => {
      void sizeOf(copy).then((size) => size > maxCopyBytes && tooLarge.abort())
    }, 200)
    try {
      await mkdir(copy, { recursive: true })
      await git(copy, source, ['init', '--quiet', '--bare', '--template='])
      await git(copy, source, ['config', 'remote.origin.url', source.url])
      await git(
        copy,
        source,
        ['fetch', '--quiet', '--no-tags', '--no-write-fetch-head', '--depth', '1', `--filter=blob:limit=${maxFileBytes}`,
          'origin', '+HEAD:refs/heads/opened'],
        tooLarge.signal,
      )
    } finally {
      clearInterval(watch)
    }
    if ((await sizeOf(copy)) > maxCopyBytes) throw new Error('too large')
    await utimes(copy, new Date(), new Date())
    return (await git(copy, source, ['rev-parse', 'refs/heads/opened'])).trim()
  }

  /** Drops the copies opened least recently until they fit in the cache, never the one just opened. */
  const makeRoom = async (kept: string) => {
    const copies = await Promise.all(
      (await readdir(cache).catch(() => [] as string[])).map(async (name) => {
        const copy = join(cache, name)
        return { copy, size: await sizeOf(copy), opened: (await stat(copy)).mtimeMs }
      }),
    )
    let total = copies.reduce((sum, { size }) => sum + size, 0)
    for (const { copy, size } of copies.sort((a, b) => a.opened - b.opened)) {
      if (total <= maxCacheBytes) break
      if (copy === kept) continue
      await inTurn(copy, () => rm(copy, { recursive: true, force: true }))
      total -= size
    }
  }

  return {
    async open(address) {
      const found = await sourceOf(address)
      if (found === undefined) return undefined

      let opened: { source: Source; copy: string; commit: string } | undefined
      for (const source of [found, ...withSuffix(found)]) {
        const copy = join(cache, createHash('sha256').update(source.url).digest('hex'))
        const commit = await opening(() =>
          inTurn(copy, async () => {
            try {
              return await fetchInto(copy, source)
            } catch {
              await rm(copy, { recursive: true, force: true })
              return undefined
            }
          }),
        )
        if (commit !== undefined) {
          opened = { source, copy, commit }
          break
        }
      }
      if (opened === undefined) return undefined
      const { source, copy, commit } = opened
      await makeRoom(copy)

      const kept: KeptFiles = {
        address,
        link: repositoryLink(address),
        async read(path) {
          const segments = path.split('/')
          if (segments.some((part) => part === '' || part === '.' || part === '..')) return undefined
          try {
            const entry = await git(copy, source, ['ls-tree', '-l', commit, '--', path])
            const size = /^\d+ blob [0-9a-f]+ +(\d+)\t/.exec(entry)?.[1]
            if (size === undefined || Number(size) > maxFileBytes) return undefined
            return await git(copy, source, ['cat-file', 'blob', `${commit}:${path}`])
          } catch {
            return undefined
          }
        },
      }
      return kept
    },
  }
}
