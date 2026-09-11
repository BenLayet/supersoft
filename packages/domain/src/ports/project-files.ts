/**
 * The files of a project, as the outside world holds them.
 *
 * A project's specification is a set of files in the project's own
 * repository (docs/decisions/0001-specification-lives-in-the-project-repository.md),
 * so everything Supersoft reads about a project arrives through this port:
 * a working copy on a disk, a repository host answering over the network, or
 * a map held in memory for a demonstration or a test. The domain knows none
 * of those, and there is nothing here about branches, commits or authors —
 * when a slice of the product needs them, they get their own port.
 *
 * Paths are relative to the root of the project, separated by "/", and never
 * begin with one: "docs/domain/membership.md".
 */
export interface ProjectFiles {
  /**
   * The files directly in a directory, as project-relative paths, in no
   * particular order. A directory that does not exist holds no files; it is
   * not an error, because a project is entitled to have written nothing yet.
   */
  list(directory: string): Promise<readonly string[]>;

  /** The text of a file, or undefined when the project has no such file. */
  read(path: string): Promise<string | undefined>;
}

/**
 * The files of a project, when they can be written back.
 *
 * Reading and writing are separated because most of what Supersoft does is
 * reading, and a source that can only be read — a repository someone else
 * owns, a revision out of the history — is a legitimate thing to hold. Only
 * the acts that change a project ask for this one.
 *
 * Nothing here knows about commits, branches or pull requests: writing a
 * file is as much as this port promises, and how those writes reach a
 * repository is the concern of whatever satisfies it.
 */
export interface WritableProjectFiles extends ProjectFiles {
  /** Writes the whole text of a file, creating it if the project has none. */
  write(path: string, text: string): Promise<void>;
}
