import { describe, expect, it } from "vitest";
import { inMemoryProjectFiles } from "./in-memory";

const project = inMemoryProjectFiles({
  "supersoft.yaml": "specification:\n  documents: docs/domaine\n",
  "docs/domaine/adhesions.md": "# Adhésions\n",
  "docs/domaine/adhesions.spec.yaml": "statements: {}\n",
  "docs/agreements/2026-09.yaml": "agreements: []\n",
});

describe("inMemoryProjectFiles", () => {
  it("reads a file by its project-relative path", async () => {
    expect(await project.read("docs/domaine/adhesions.md")).toBe("# Adhésions\n");
  });

  it("reads nothing for a file the project does not have", async () => {
    expect(await project.read("docs/domaine/formations.md")).toBeUndefined();
  });

  it("lists the files directly in a directory, and not those below it", async () => {
    expect((await project.list("docs")).length).toBe(0);
    expect(await project.list("docs/domaine")).toEqual([
      "docs/domaine/adhesions.md",
      "docs/domaine/adhesions.spec.yaml",
    ]);
  });

  it("lists the files at the root of the project", async () => {
    expect(await project.list("")).toEqual(["supersoft.yaml"]);
  });

  it("holds no files for a directory the project does not have", async () => {
    // A project is entitled to have written nothing yet.
    expect(await project.list("docs/agreements/2027")).toEqual([]);
  });

  it("refuses a path that climbs out of the project", async () => {
    await expect(project.read("../other-project/docs/domaine/adhesions.md")).rejects.toThrow(
      /leaves the project/,
    );
  });
});
