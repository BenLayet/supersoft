/**
 * The ProjectFiles port over a working copy on a disk: a repository someone
 * has cloned, which is how a maker works and how the tooling runs in a
 * project's own build.
 */
import { readdir, readFile } from "node:fs/promises";
import { join as joinOnDisk, resolve } from "node:path";
import type { ProjectFiles } from "@supersoft/domain";
import { join, leavesTheProject, normalisePath } from "./paths";

function isMissing(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return code === "ENOENT" || code === "ENOTDIR";
}

/** `root` is the directory holding the project, as an absolute path. */
export function fileSystemProjectFiles(root: string): ProjectFiles {
  const projectRoot = resolve(root);

  function onDisk(path: string): string {
    if (leavesTheProject(path)) {
      throw new Error(`Path leaves the project: ${path}`);
    }
    return joinOnDisk(projectRoot, normalisePath(path));
  }

  return {
    async list(directory) {
      try {
        const entries = await readdir(onDisk(directory), { withFileTypes: true });
        return entries
          .filter((entry) => entry.isFile())
          .map((entry) => join(directory, entry.name));
      } catch (error) {
        // A project is entitled to have written nothing yet.
        if (isMissing(error)) return [];
        throw error;
      }
    },

    async read(path) {
      try {
        return await readFile(onDisk(path), "utf8");
      } catch (error) {
        if (isMissing(error)) return undefined;
        throw error;
      }
    },
  };
}
