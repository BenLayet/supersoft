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

/**
 * What Supersoft would find where someone keeps their projects. The third one
 * is there on purpose: a project Supersoft cannot read is named as such.
 */
const found: readonly AvailableProject[] = [
  {
    id: 'supersoft',
    name: 'Supersoft',
    owner: 'ben',
    openToEveryone: true,
    inTheForm: true,
    guardians: ['ben'],
  },
  {
    id: 'medito',
    name: 'Medito',
    owner: 'ben',
    openToEveryone: false,
    inTheForm: true,
    guardians: ['ben'],
  },
  {
    id: 'bakery-site',
    name: 'bakery-site',
    owner: 'ben',
    openToEveryone: true,
    inTheForm: false,
    guardians: ['ben'],
  },
]

export const inMemoryProjectStore: ProjectStore = {
  async available(account?: Account) {
    return found.filter(
      (project) => project.openToEveryone || (account && project.guardians.includes(account.handle)),
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
