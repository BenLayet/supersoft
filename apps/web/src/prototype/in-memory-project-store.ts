import type { Account, AvailableProject, Project, ProjectStore } from '@supersoft/domain'
import { medito } from './medito'
import { supersoft } from './supersoft'

/**
 * The mock adapter every port owes: the projects held in memory, seeded with
 * fictional data. Nothing is written anywhere, so the prototype can be shown
 * at any moment, by anyone, with no consequence.
 */
const held = new Map<string, Project>([
  [supersoft.id, supersoft],
  [medito.id, medito],
])

/** What Supersoft would find where someone keeps their projects. */
const found: readonly AvailableProject[] = [
  {
    id: 'supersoft',
    name: 'Supersoft',
    owner: 'ben',
    address: 'https://github.com/BenLayet/supersoft',
    isPublic: true,
    guardians: ['ben'],
  },
  {
    id: 'medito',
    name: 'Medito',
    owner: 'ben',
    address: 'https://github.com/BenLayet/medito',
    isPublic: false,
    guardians: ['ben'],
  },
]

export const inMemoryProjectStore: ProjectStore = {
  async available(account?: Account) {
    return found.filter(
      (project) => project.isPublic || (account && project.guardians.includes(account.handle)),
    )
  },
  async load(projectId: string) {
    return held.get(projectId)
  },
  async save(project: Project) {
    held.set(project.id, project)
  },
}

/** What was found for this person, whether or not Supersoft can open it. */
export const findProject = async (
  projectId: string,
  account?: Account,
): Promise<AvailableProject | undefined> =>
  (await inMemoryProjectStore.available(account)).find((project) => project.id === projectId)
