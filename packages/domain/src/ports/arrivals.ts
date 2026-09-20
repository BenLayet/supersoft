import type { Account } from '../arrival'

/**
 * Who has arrived. Everything this holds can be thrown away without any
 * project losing anything.
 */
export interface Arrivals {
  whoIsHere(): Promise<Account | undefined>
  arrive(account: Account): Promise<void>
  leave(): Promise<void>
  /** The projects this person added, kept for them alone. */
  addedProjects(): Promise<readonly string[]>
  addProject(projectId: string): Promise<void>
  removeProject(projectId: string): Promise<void>
}
