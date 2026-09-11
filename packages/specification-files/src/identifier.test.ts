import { describe, expect, it } from "vitest";
import { nextIdentifier, slugFor } from "./identifier";

describe("slugFor", () => {
  it("reads the slug from the document's basename, so a person can guess what it names", () => {
    expect(slugFor("docs/domaine/adhesions.md")).toBe("adhesions");
    expect(slugFor("docs/domaine/calendrier-inscriptions.md")).toBe("calendrier-inscriptions");
  });

  it("folds a basename to ASCII, since an identifier is read aloud and typed", () => {
    expect(slugFor("docs/domaine/adhésions.md")).toBe("adhesions");
    expect(slugFor("docs/domain/Real use & handover.md")).toBe("real-use-handover");
  });

  it("falls back when a basename folds to nothing", () => {
    expect(slugFor("docs/domaine/会員.md")).toBe("statement");
  });
});

describe("nextIdentifier", () => {
  it("starts at one for a document nothing has named yet", () => {
    expect(nextIdentifier("adhesions", new Set())).toBe("adhesions-r1");
  });

  it("counts above every number ever seen for that slug", () => {
    expect(nextIdentifier("adhesions", new Set(["adhesions-r1", "adhesions-r7"]))).toBe(
      "adhesions-r8",
    );
  });

  it("never hands back the number of a rule that is gone", () => {
    // The identifier of a deleted rule is still named by the agreements given
    // on it. Handing the number out again would attach them to another rule.
    const everMentioned = new Set(["adhesions-r1", "adhesions-r2", "adhesions-r3"]);
    expect(nextIdentifier("adhesions", everMentioned)).toBe("adhesions-r4");
  });

  it("counts per document, so two documents do not fight over numbers", () => {
    const used = new Set(["adhesions-r4", "formations-r1"]);
    expect(nextIdentifier("formations", used)).toBe("formations-r2");
  });

  it("leaves an identifier of another shape out of the counting", () => {
    // A maker who wrote `dunning-keeps-access` by hand wrote a valid
    // identifier; it simply says nothing about which numbers are spent.
    expect(nextIdentifier("adhesions", new Set(["dunning-keeps-access", "adhesions-r2"]))).toBe(
      "adhesions-r3",
    );
  });
});
