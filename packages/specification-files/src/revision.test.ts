import { describe, expect, it } from "vitest";
import { revisionOf } from "./revision";

describe("revisionOf", () => {
  it("names the algorithm in the value, so a later change is legible", () => {
    expect(revisionOf("A rule.")).toMatch(/^sha256:[0-9a-f]{16}$/);
  });

  it("is the same revision for a rule that was only re-wrapped", () => {
    expect(revisionOf("A member in payment dunning\n  keeps every access.")).toBe(
      revisionOf("A member in payment dunning keeps every access."),
    );
  });

  it("is a new revision as soon as a word changes", () => {
    expect(revisionOf("Members can cancel up to 48 hours before.")).not.toBe(
      revisionOf("Members can cancel up to 24 hours before."),
    );
  });

  it("can be recomputed by anyone holding the repository", () => {
    // The rule is public: SHA-256 of the normalised text, first 16 hex
    // characters. Nothing about it is ours to keep.
    expect(revisionOf(" A rule. ")).toBe(revisionOf("A rule."));
  });
});
