import type { Business } from './business'
import type { Feature } from './feature'
import type { Prototype } from './prototype'
import type { Story } from './story'
import type { Version } from './version'

/** Who someone is on a project — what they know, never what they may touch. */
export type Role = 'domainExpert' | 'maker'

export interface Participant {
  readonly name: string
  readonly role: Role
}

/** One application, built for its domain experts. */
export interface Project {
  /** How the project is named where it lives. */
  readonly id: string
  readonly name: string
  /** The language it is written in: its domain experts'. Clarée never translates it. */
  readonly language: string
  /** What the application is for, and what it is not: short, broad, deliberately vague. */
  readonly scope: string
  readonly participants: readonly Participant[]
  readonly business: Business
  readonly features: readonly Feature[]
  readonly stories: readonly Story[]
  readonly prototypes: readonly Prototype[]
  readonly versions: readonly Version[]
}

/** Agreement is an act by a domain expert. Nobody else's yes settles a rule. */
export const mayAgree = (participant: Participant): boolean => participant.role === 'domainExpert'

/**
 * A project's name and scope, in its own words: the title of its README and
 * the first paragraph under it. With no README or no title, it is named by its
 * address; with no paragraph under the title, its scope is empty.
 */
export const nameAndScope = (
  address: string,
  readme: string | undefined,
): Pick<Project, 'name' | 'scope'> => {
  const lines = (readme ?? '').split(/\r?\n/)
  const titleAt = lines.findIndex((line) => /^#\s+\S/.test(line))
  const title = lines[titleAt]
  if (title === undefined) return { name: address, scope: '' }
  const name = title.replace(/^#\s+/, '').replace(/\s+#*\s*$/, '')
  const paragraph: string[] = []
  for (const line of lines.slice(titleAt + 1)) {
    if (line.trim() === '' && paragraph.length === 0) continue
    if (line.trim() === '' || /^#{1,6}\s/.test(line)) break
    paragraph.push(line.trim())
  }
  return { name, scope: paragraph.join(' ') }
}
