import { inMemoryProjectFiles } from "@supersoft/project-files";
import { describe, expect, it } from "vitest";
import { readAgreements } from "./agreements";

describe("readAgreements", () => {
  it("holds no agreements for a project that has recorded none", async () => {
    // A project with no recorded agreements at all is a perfectly good
    // project; one that treats silence as approval is not.
    const read = await readAgreements(inMemoryProjectFiles({}));
    expect(read.agreements).toEqual([]);
    expect(read.problems).toEqual([]);
  });

  it("reads who agreed to what version, and when", async () => {
    const read = await readAgreements(
      inMemoryProjectFiles({
        "docs/agreements/2026-09.yaml":
          "agreements:\n  - statementId: adhesions-r2\n    revision: sha256:5f2b8c1d4e7a9031\n    givenBy: marie\n    on: 2026-09-01\n",
      }),
    );
    expect(read.agreements).toHaveLength(1);
    expect(read.agreements[0]?.agreement).toEqual({
      statementId: "adhesions-r2",
      revision: "sha256:5f2b8c1d4e7a9031",
      givenBy: "marie",
      on: new Date("2026-09-01"),
    });
    expect(read.agreements[0]?.file).toBe("docs/agreements/2026-09.yaml");
  });

  it("unions every file, so two makers never write to the same one", async () => {
    const read = await readAgreements(
      inMemoryProjectFiles({
        "docs/agreements/2026-09-01-adhesions-r2.yaml":
          "agreements:\n  - statementId: adhesions-r2\n    revision: sha256:5f2b8c1d4e7a9031\n    givenBy: marie\n    on: 2026-09-01\n",
        "docs/agreements/2026-09-04-adhesions-r3.yaml":
          "agreements:\n  - statementId: adhesions-r3\n    revision: sha256:11223344aabbccdd\n    givenBy: marie\n    on: 2026-09-04\n",
      }),
    );
    expect(read.agreements.map(({ agreement }) => agreement.statementId)).toEqual([
      "adhesions-r2",
      "adhesions-r3",
    ]);
  });

  it("says what an incomplete agreement is missing, and reads the rest of the file", async () => {
    const read = await readAgreements(
      inMemoryProjectFiles({
        "docs/agreements/2026-09.yaml":
          "agreements:\n  - statementId: adhesions-r2\n    givenBy: marie\n  - statementId: adhesions-r3\n    revision: sha256:11223344aabbccdd\n    givenBy: marie\n    on: 2026-09-04\n",
      }),
    );
    expect(read.problems[0]).toMatchObject({
      kind: "file_not_understood",
      file: "docs/agreements/2026-09.yaml",
    });
    expect(read.problems[0]).toMatchObject({ detail: expect.stringContaining("revision, on") });
    expect(read.agreements).toHaveLength(1);
  });

  it("ignores files that are not agreements", async () => {
    const read = await readAgreements(
      inMemoryProjectFiles({ "docs/agreements/README.md": "# Agreements\n" }),
    );
    expect(read.agreements).toEqual([]);
    expect(read.problems).toEqual([]);
  });
});
