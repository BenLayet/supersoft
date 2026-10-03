/** Someone who has arrived, and who they are where their projects live. */
export interface Account {
  readonly handle: string
  readonly name: string
}

/** A project the platform found and can offer. */
export interface AvailableProject {
  readonly id: string
  readonly name: string
  readonly owner: string
  /** Where its project owner keeps it. */
  readonly address: string
  /** A public project is read without saying who you are. */
  readonly isPublic: boolean
  /** Who the project already recognises. The platform grants nothing of its own. */
  readonly guardians: readonly string[]
}

/**
 * Changing anything means saying who you are, and being someone the project
 * already recognises.
 */
export const mayChange = (project: AvailableProject, account?: Account): boolean =>
  account !== undefined && project.guardians.includes(account.handle)

/** A public project is read without saying who you are; a private one, only by the people it recognises. */
export const mayOpen = (project: AvailableProject, account?: Account): boolean =>
  project.isPublic || mayChange(project, account)

/**
 * Someone's projects: the ones they added and can open. Adding grants nothing,
 * so one that cannot be opened is not one of them.
 */
export const projectsFor = (
  found: readonly AvailableProject[],
  added: readonly string[],
  account?: Account,
): readonly AvailableProject[] =>
  found.filter((project) => added.includes(project.id) && mayOpen(project, account))
