import type { Account } from '../arrival'

/**
 * Who has arrived, and where they left off. Everything this holds can be
 * thrown away without any project losing anything.
 */
export interface Arrivals {
  whoIsHere(): Promise<Account | undefined>
  arrive(account: Account): Promise<void>
  leave(): Promise<void>
  /** The project this person was last in, so they come back to it. */
  lastOpened(): Promise<string | undefined>
  remember(projectId: string): Promise<void>
}
