/** Someone who has arrived, and who they are where their projects live. */
export interface Account {
  readonly handle: string
  readonly name: string
}

/** A project Supersoft found and can offer — whether or not it can read it. */
export interface AvailableProject {
  readonly id: string
  readonly name: string
  readonly owner: string
  /** Read without saying who you are. */
  readonly openToEveryone: boolean
  /** Written in the form Supersoft reads. When it is not, it is named as such. */
  readonly inTheForm: boolean
  /** Who the project already recognises. Supersoft grants nothing of its own. */
  readonly guardians: readonly string[]
}

/**
 * Changing anything means saying who you are, and being someone the project
 * already recognises.
 */
export const mayChange = (project: AvailableProject, account?: Account): boolean =>
  account !== undefined && project.guardians.includes(account.handle)

/** A project open to everyone is read without saying who you are. */
export const mayOpen = (project: AvailableProject, account?: Account): boolean =>
  project.inTheForm && (project.openToEveryone || mayChange(project, account))
