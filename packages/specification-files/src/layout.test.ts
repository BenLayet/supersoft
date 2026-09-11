import { inMemoryProjectFiles } from "@supersoft/project-files";
import { describe, expect, it } from "vitest";
import { defaultLayout, readLayout } from "./layout";

describe("readLayout", () => {
  it("reads a project with no declaration with the defaults, and does not complain", async () => {
    const read = await readLayout(inMemoryProjectFiles({}));
    expect(read.layout).toEqual(defaultLayout);
    expect(read.problems).toEqual([]);
  });

  it("reads the headings a project writes in its own language", async () => {
    const read = await readLayout(
      inMemoryProjectFiles({
        "supersoft.yaml":
          "specification:\n  documents: docs/domaine\n  statements: Règles\n  terms: Vocabulaire\n",
      }),
    );
    expect(read.layout).toEqual({
      documents: "docs/domaine",
      statements: "Règles",
      terms: "Vocabulaire",
    });
  });

  it("takes the default for whatever a declaration leaves out", async () => {
    const read = await readLayout(
      inMemoryProjectFiles({ "supersoft.yaml": "specification:\n  documents: specification\n" }),
    );
    expect(read.layout).toEqual({ ...defaultLayout, documents: "specification" });
    expect(read.problems).toEqual([]);
  });

  it("reads a project whose declaration cannot be understood, and says so", async () => {
    const read = await readLayout(
      inMemoryProjectFiles({ "supersoft.yaml": "specification: [not, a, declaration]\n" }),
    );
    expect(read.layout).toEqual(defaultLayout);
    expect(read.problems[0]?.kind).toBe("file_not_understood");
  });
});
