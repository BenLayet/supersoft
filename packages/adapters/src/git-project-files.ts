import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { isAbsolute, join, resolve } from 'node:path'
import type { KeptFiles, ProjectFiles } from '@supersoft/domain'
import { repositoryLink } from './repository-link'

export interface GitProjectFilesOptions {
  /** Where the copies are kept. Anything here can be lost at any restart. */
  readonly cache?: string
  /** Whether an address may be a repository on this machine. Never in production. */
  readonly local?: boolean
  /** How long reading an address may take before it counts as unreadable. */
  readonly timeoutMs?: number
}

const urlLike = /^[a-z][a-z0-9+.-]*:\/\//i

/**
 * Reads a project from its repository. Each address gets one copy in the
 * cache, refreshed on every opening; an opened project reads the commit it was
 * opened at, so it stays as it was even when the copy moves on.
 *
 * Only public repositories over https are read, and repositories on this
 * machine when `local` is set. No credential is ever used or asked for.
 */
export const gitProjectFiles = (options: GitProjectFilesOptions = {}): ProjectFiles => {
  const cache = options.cache ?? join(tmpdir(), 'supersoft-projects')
  const local = options.local ?? false
  const timeout = options.timeoutMs ?? 60_000

  const git = (cwd: string, args: readonly string[], timeoutMs = timeout) =>
    new Promise<string>((done, fail) => {
      execFile(
        'git',
        [
          '-c', 'protocol.allow=never',
          '-c', 'protocol.https.allow=always',
          '-c', `protocol.file.allow=${local ? 'always' : 'never'}`,
          '-c', 'credential.helper=',
          ...args,
        ],
        {
          cwd,
          timeout: timeoutMs,
          maxBuffer: 16 * 1024 * 1024,
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_ASKPASS: '', SSH_ASKPASS: '' },
        },
        (error, stdout) => (error ? fail(error) : done(stdout)),
      )
    })

  // Two openings of the same address never fetch into the same copy at once.
  const queues = new Map<string, Promise<unknown>>()
  const inTurn = <T>(key: string, work: () => Promise<T>): Promise<T> => {
    const next = (queues.get(key) ?? Promise.resolve()).then(work, work)
    queues.set(key, next.catch(() => undefined))
    return next
  }

  return {
    async open(address) {
      const source = urlLike.test(address) ? address : local ? resolve(address) : undefined
      if (source === undefined) return undefined
      const copy = join(cache, createHash('sha256').update(source).digest('hex'))

      const commit = await inTurn(copy, async () => {
        try {
          await mkdir(copy, { recursive: true })
          await git(copy, ['init', '--quiet', '--bare'])
          await git(copy, ['fetch', '--quiet', '--depth', '1', '--', source, 'HEAD'])
          return (await git(copy, ['rev-parse', 'FETCH_HEAD'])).trim()
        } catch {
          return undefined
        }
      })
      if (commit === undefined) return undefined

      const opened: KeptFiles = {
        address,
        link: repositoryLink(address),
        async read(path) {
          const segments = path.split('/')
          if (isAbsolute(path) || segments.some((part) => part === '' || part === '.' || part === '..')) {
            return undefined
          }
          try {
            return await git(copy, ['cat-file', 'blob', `${commit}:${path}`])
          } catch {
            return undefined
          }
        },
      }
      return opened
    },
  }
}
