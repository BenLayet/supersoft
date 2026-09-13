import type { Project } from '../project'

/**
 * Where a project is kept. The domain never knows whether that is memory,
 * files or anything else — one port, and a mock adapter for it.
 */
export interface ProjectStore {
  load(): Promise<Project>
  save(project: Project): Promise<void>
}
