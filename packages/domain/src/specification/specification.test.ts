import { describe, expect, it } from "vitest";
import type { Statement } from "./statement";
import { statementById, termNamed, type Specification } from "./specification";

const dunning: Statement = {
  id: "membership-r2",
  revision: "sha256:0f1e2d3c4b5a6978",
  text: "A member in payment dunning keeps every access.",
  state: "proposed",
};

const specification: Specification = {
  statements: [dunning],
  terms: [
    { name: "Member", definition: "Anyone the association knows, whether a subscriber or not." },
    { name: "Dunning", definition: "The period following a failed payment." },
  ],
};

describe("statementById", () => {
  it("finds a statement by the identifier its own document carries", () => {
    expect(statementById(specification, "membership-r2")).toBe(dunning);
  });

  it("finds nothing for an identifier no document carries", () => {
    expect(statementById(specification, "membership-r9")).toBeUndefined();
  });
});

describe("termNamed", () => {
  it("finds a term whatever case it is written in", () => {
    expect(termNamed(specification, "member")?.name).toBe("Member");
    expect(termNamed(specification, "  MEMBER ")?.name).toBe("Member");
  });

  it("finds nothing for a word the specification never defined", () => {
    expect(termNamed(specification, "Subscription")).toBeUndefined();
  });
});
