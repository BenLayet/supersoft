/**
 * @supersoft/project-files — adapters for the ProjectFiles port of
 * @supersoft/domain: the files of a project, as the outside world holds them.
 *
 * Two of them, and the mock is not the lesser one: `inMemoryProjectFiles` is
 * what lets a specification be read with no repository, no network and no
 * disk, which is the same guarantee Supersoft makes to its users about their
 * prototypes.
 */
export { inMemoryProjectFiles, type FilesInMemory, type ProjectInMemory } from "./in-memory";
export { fileSystemProjectFiles } from "./file-system";
export { directoryOf, join, nameOf, normalisePath } from "./paths";
