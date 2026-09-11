/**
 * Project-relative paths, as the ProjectFiles port defines them: separated
 * by "/", never starting with one, never containing "." or "..".
 */

export function normalisePath(path: string): string {
  const parts = path.split("/").filter((part) => part !== "" && part !== ".");
  return parts.join("/");
}

export function directoryOf(path: string): string {
  const normalised = normalisePath(path);
  const lastSeparator = normalised.lastIndexOf("/");
  return lastSeparator === -1 ? "" : normalised.slice(0, lastSeparator);
}

export function nameOf(path: string): string {
  const normalised = normalisePath(path);
  return normalised.slice(normalised.lastIndexOf("/") + 1);
}

export function join(directory: string, name: string): string {
  const parent = normalisePath(directory);
  return parent === "" ? normalisePath(name) : `${parent}/${normalisePath(name)}`;
}

/**
 * A path that climbs out of the project is not a path this port can answer.
 * Nothing in Supersoft builds one, so meeting one means something else is
 * wrong; refusing it keeps a reading of one project from reaching another.
 */
export function leavesTheProject(path: string): boolean {
  return path.split("/").includes("..");
}
