import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { fileSystemProjectFiles } from "./file-system";

let root: string;

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), "supersoft-project-"));
  await mkdir(join(root, "docs/domaine"), { recursive: true });
  await writeFile(join(root, "docs/domaine/adhesions.md"), "# Adhésions\n", "utf8");
  await writeFile(join(root, "docs/domaine/adhesions.spec.yaml"), "statements: {}\n", "utf8");
});

describe("fileSystemProjectFiles", () => {
  it("reads a file of a working copy", async () => {
    const project = fileSystemProjectFiles(root);
    expect(await project.read("docs/domaine/adhesions.md")).toBe("# Adhésions\n");
  });

  it("reads nothing for a file that is not there", async () => {
    const project = fileSystemProjectFiles(root);
    expect(await project.read("docs/domaine/formations.md")).toBeUndefined();
  });

  it("lists files as project-relative paths, leaving directories out", async () => {
    const project = fileSystemProjectFiles(root);
    expect([...(await project.list("docs/domaine"))].sort()).toEqual([
      "docs/domaine/adhesions.md",
      "docs/domaine/adhesions.spec.yaml",
    ]);
    expect(await project.list("docs")).toEqual([]);
  });

  it("holds no files for a directory that is not there", async () => {
    const project = fileSystemProjectFiles(root);
    expect(await project.list("docs/agreements")).toEqual([]);
  });

  it("refuses a path that climbs out of the project", async () => {
    const project = fileSystemProjectFiles(root);
    await expect(project.read("../elsewhere.md")).rejects.toThrow(/leaves the project/);
  });

  it("answers the same questions as the mock adapter", async () => {
    // The mock is not a lesser adapter: a reading that works against one
    // works against the other, which is what makes running with no outside
    // service a guarantee rather than a hope.
    const project = fileSystemProjectFiles(root);
    expect(await project.read("docs/domaine/adhesions.md")).toBe("# Adhésions\n");
    expect(await project.list("docs/domaine")).toHaveLength(2);
  });
});

describe("fileSystemProjectFiles, written to", () => {
  it("writes a file, making the directories it needs", async () => {
    const project = fileSystemProjectFiles(root);
    await project.write("docs/agreements/2026-09.yaml", "agreements: []\n");
    expect(await project.read("docs/agreements/2026-09.yaml")).toBe("agreements: []\n");
    expect(await project.list("docs/agreements")).toEqual(["docs/agreements/2026-09.yaml"]);
  });

  it("replaces the whole text of a file that is already there", async () => {
    const project = fileSystemProjectFiles(root);
    await project.write("docs/domaine/adhesions.md", "# Adhésions\n\n## Règles\n");
    expect(await project.read("docs/domaine/adhesions.md")).toBe("# Adhésions\n\n## Règles\n");
  });

  it("refuses to write outside the project", async () => {
    const project = fileSystemProjectFiles(root);
    await expect(project.write("../elsewhere.md", "nothing")).rejects.toThrow(
      /leaves the project/,
    );
  });
});
