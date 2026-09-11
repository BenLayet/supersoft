import { describe, expect, it } from "vitest";
import { isSameStatementText, normaliseStatementText } from "./revision";

describe("normaliseStatementText", () => {
  it("makes a re-wrapped rule the same rule", () => {
    expect(
      isSameStatementText(
        "A member in payment dunning keeps every access.",
        "A member in payment dunning\n   keeps every access.",
      ),
    ).toBe(true);
  });

  it("ignores trailing whitespace and stray indentation", () => {
    expect(normaliseStatementText("  Members can cancel up to 48 hours before.  \t")).toBe(
      "Members can cancel up to 48 hours before.",
    );
  });

  it("makes the two Unicode forms of the same accented word the same word", () => {
    const composed: string = "Adh\u00e9rent \u00e0 jour.";
    const decomposed: string = "Adhe\u0301rent a\u0300 jour.";
    // An editor that rewrites accents changes every byte of the line and not
    // one word of the rule.
    expect(composed === decomposed).toBe(false);
    expect(isSameStatementText(composed, decomposed)).toBe(true);
  });

  it("keeps every difference a reader would see", () => {
    const rule = "Members can cancel up to 48 hours before.";
    // A typo correction, a changed number, a changed case, an added emphasis:
    // each of these is a new revision, deliberately (ADR 0006).
    expect(isSameStatementText(rule, "Members can cancel up to 24 hours before.")).toBe(false);
    expect(isSameStatementText(rule, "members can cancel up to 48 hours before.")).toBe(false);
    expect(isSameStatementText(rule, "Members can cancel up to **48 hours** before.")).toBe(false);
    expect(isSameStatementText(rule, "Members can cancel up to 48 hours before")).toBe(false);
  });

  it("says nothing about lists, comments or emphasis", () => {
    // The function receives a sentence, not a document: what belongs to the
    // document is removed by whatever read it.
    expect(normaliseStatementText("2. A rule. <!-- @membership-r2 -->")).toBe(
      "2. A rule. <!-- @membership-r2 -->",
    );
  });
});
