import { describe, expect, it } from "vitest";
import { isQuestion, isResolved, isUnansweredQuestion, type Remark, remarksOn } from "./remark";

const day = new Date("2026-03-03T10:00:00Z");

function remark(overrides: Partial<Remark> = {}): Remark {
  return {
    id: "m1",
    author: "p1",
    on: "s1",
    said: "The colours feel cold.",
    at: day,
    outcome: { kind: "open" },
    ...overrides,
  };
}

describe("a question is a remark that names who must answer", () => {
  it("is a question when it names someone", () => {
    expect(isQuestion(remark({ mustAnswer: "p2" }))).toBe(true);
  });

  it("is not a question when it names nobody", () => {
    expect(isQuestion(remark())).toBe(false);
  });
});

describe("a remark is never simply closed", () => {
  it("is resolved when it changed the specification", () => {
    expect(isResolved(remark({ outcome: { kind: "changed_the_specification", revision: "r8" } })))
      .toBe(true);
  });

  it("is resolved when it was refused with a stated reason", () => {
    expect(isResolved(remark({ outcome: { kind: "refused", reason: "Out of scope for now." } })))
      .toBe(true);
  });

  it("is not resolved while it is still waiting for someone", () => {
    expect(isResolved(remark())).toBe(false);
  });
});

describe("isUnansweredQuestion", () => {
  it("holds for a question still waiting", () => {
    expect(isUnansweredQuestion(remark({ mustAnswer: "p2" }))).toBe(true);
  });

  it("stops holding once the question is dealt with", () => {
    const answered = remark({
      mustAnswer: "p2",
      outcome: { kind: "changed_the_specification", revision: "r8" },
    });
    expect(isUnansweredQuestion(answered)).toBe(false);
  });

  it("does not hold for an open remark naming nobody", () => {
    expect(isUnansweredQuestion(remark())).toBe(false);
  });
});

describe("remarksOn", () => {
  it("keeps only what is attached to that statement", () => {
    const here = remark({ id: "m1" });
    const elsewhere = remark({ id: "m2", on: "s2" });
    expect(remarksOn([here, elsewhere], "s1")).toEqual([here]);
  });
});
