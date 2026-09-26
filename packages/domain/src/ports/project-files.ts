/**
 * What is kept at a project's address, read as it was when the project was
 * opened. Paths start at the root of the project; nothing outside it is read.
 */
export interface KeptFiles {
  readonly address: string
  /** Where a person looks at the repository without Supersoft; nothing when a browser cannot open it. */
  readonly link?: string
  /** The text of the file at this path, or nothing when there is none. */
  read(path: string): Promise<string | undefined>
}

/**
 * Where Supersoft reads a project. It opens what already exists and never
 * writes there — one port, and a mock adapter for it.
 */
export interface ProjectFiles {
  /** Nothing when the address cannot be read: nothing is there, or it is private. */
  open(address: string): Promise<KeptFiles | undefined>
}
