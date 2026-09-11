/**
 * The mock adapter of the ProjectFiles port: a project held in a map.
 *
 * Every port has one (docs/decisions/0003-hexagonal-monorepo-pure-domain.md
 * point 4), so that Supersoft runs end to end with no outside service — for
 * demonstrations, for prototyping and for tests. This one is also how a
 * project's files are described in a test: as the files themselves.
 */
import type { WritableProjectFiles } from "@supersoft/domain";
import { directoryOf, leavesTheProject, normalisePath } from "./paths";

/** Project-relative path to the text of the file, as in a repository. */
export type FilesInMemory = Readonly<Record<string, string>>;

export interface ProjectInMemory extends WritableProjectFiles {
  /** Every file of the project as it stands, for whoever is watching it. */
  snapshot(): FilesInMemory;
}

export function inMemoryProjectFiles(files: FilesInMemory): ProjectInMemory {
  const contents = new Map<string, string>(
    Object.entries(files).map(([path, text]) => [normalisePath(path), text]),
  );

  return {
    async list(directory) {
      const wanted = normalisePath(directory);
      return [...contents.keys()].filter((path) => directoryOf(path) === wanted);
    },

    async read(path) {
      if (leavesTheProject(path)) {
        throw new Error(`Path leaves the project: ${path}`);
      }
      return contents.get(normalisePath(path));
    },

    async write(path, text) {
      if (leavesTheProject(path)) {
        throw new Error(`Path leaves the project: ${path}`);
      }
      contents.set(normalisePath(path), text);
    },

    snapshot() {
      return Object.fromEntries(contents);
    },
  };
}
