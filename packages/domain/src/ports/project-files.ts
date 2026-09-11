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
