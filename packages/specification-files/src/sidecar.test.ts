import { inMemoryProjectFiles } from "@supersoft/project-files";
import { describe, expect, it } from "vitest";
import { readSidecar, sidecarPathFor } from "./sidecar";

describe("sidecarPathFor", () => {
  it("sits beside its document, same basename", () => {
    expect(sidecarPathFor("docs/domaine/adhesions.md")).toBe("docs/domaine/adhesions.spec.yaml");
  });
});

describe("readSidecar", () => {
  it("records nothing when a document has no sidecar", async () => {
    // No sidecar at all is what a freshly hand-written specification is.
    const read = await readSidecar(inMemoryProjectFiles({}), "docs/domain/membership.md");
    expect(read.entries.size).toBe(0);
    expect(read.problems).toEqual([]);
  });

  it("reads the state of the statements that have one", async () => {
    const read = await readSidecar(
      inMemoryProjectFiles({
        "docs/domain/membership.spec.yaml":
          "statements:\n  m-r2:\n    state: to_confirm\n  m-r3:\n    state: questioned\n",
      }),
      "docs/domain/membership.md",
    );
    expect(read.entries.get("m-r2")).toEqual({ state: "to_confirm" });
    expect(read.entries.get("m-r3")).toEqual({ state: "questioned" });
  });

  it("reads a withdrawal with the reason it was withdrawn", async () => {
    const read = await readSidecar(
      inMemoryProjectFiles({
        "docs/domain/membership.spec.yaml":
          "statements:\n  m-r4:\n    state: withdrawn\n    withdrawalReason: The association stopped taking bookings by phone.\n",
      }),
      "docs/domain/membership.md",
    );
    expect(read.entries.get("m-r4")).toEqual({
      state: "withdrawn",
      withdrawalReason: "The association stopped taking bookings by phone.",
    });
  });

  it("refuses a withdrawal with no reason, and leaves the statement proposed", async () => {
    const read = await readSidecar(
      inMemoryProjectFiles({
        "docs/domain/membership.spec.yaml": "statements:\n  m-r4:\n    state: withdrawn\n",
      }),
      "docs/domain/membership.md",
    );
    expect(read.entries.has("m-r4")).toBe(false);
    expect(read.problems).toEqual([
      {
        kind: "withdrawal_without_reason",
        statementId: "m-r4",
        sidecar: "docs/domain/membership.spec.yaml",
      },
    ]);
  });

  it("says so when a state is not one a statement carries", async () => {
    const read = await readSidecar(
      inMemoryProjectFiles({
        "docs/domain/membership.spec.yaml": "statements:\n  m-r5:\n    state: agreed\n",
      }),
      "docs/domain/membership.md",
    );
    // `agreed` is never recorded: it follows from an agreement covering the
    // version now written.
    expect(read.problems[0]).toMatchObject({ kind: "state_not_recognised", state: "agreed" });
  });

  it("says so when the file cannot be read at all", async () => {
    const read = await readSidecar(
      inMemoryProjectFiles({ "docs/domain/membership.spec.yaml": "statements: : :\n" }),
      "docs/domain/membership.md",
    );
    expect(read.problems[0]?.kind).toBe("file_not_understood");
  });
});
