import type { Account, AvailableProject } from '../arrival'
import type { Project } from '../project'

/**
 * Where the projects are. The domain never knows whether that is memory, files
 * or anything else — one port, and a mock adapter for it.
 *
 * Clarée never creates a project here: it opens what already exists.
 */
export interface ProjectStore {
  /** What this person can reach. Without an account, the public directories. */
  available(account?: Account): Promise<readonly AvailableProject[]>
  load(projectId: string): Promise<Project | undefined>
  save(project: Project): Promise<void>
}
