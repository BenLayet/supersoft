import type { Domain } from './domain'
import type { Feature } from './feature'
import type { Story } from './story'
import type { Version } from './version'

/** Who someone is on a project — what they know, never what they may touch. */
export type Role = 'customer' | 'maker'

export interface Participant {
  readonly name: string
  readonly role: Role
}

/** One application, built for one customer. */
export interface Project {
  /** How the project is named where it lives. */
  readonly id: string
  readonly name: string
  readonly participants: readonly Participant[]
  readonly domain: Domain
  readonly features: readonly Feature[]
  readonly stories: readonly Story[]
  readonly versions: readonly Version[]
}

/** Agreement is an act by the customer. Nobody else's yes settles a rule. */
export const mayAgree = (participant: Participant): boolean => participant.role === 'customer'
