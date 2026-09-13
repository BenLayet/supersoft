import type { Project, ProjectStore } from '@supersoft/domain'
import { fictionalProject } from './fictional-project'

/**
 * The mock adapter every port owes: one project, held in memory, seeded with
 * fictional data. Nothing is written anywhere, so the prototype can be shown
 * at any moment, by anyone, with no consequence.
 */
let held: Project = fictionalProject

export const inMemoryProjectStore: ProjectStore = {
  async load() {
    return held
  },
  async save(project: Project) {
    held = project
  },
}
