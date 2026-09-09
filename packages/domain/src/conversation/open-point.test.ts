import { describe, expect, it } from "vitest";
import type { Statement } from "../specification/statement";
import type { Remark } from "./remark";
import { openPointsOf } from "./open-point";

const day = new Date("2026-03-03T10:00:00Z");

const proposed: Statement = { id: "s1", revision: "r7", text: "…", state: "proposed" };
const toConfirm: Statement = { id: "s2", revision: "r1", text: "…", state: "to_confirm" };
const questioned: Statement = { id: "s3", revision: "r4", text: "…", state: "questioned" };
const withdrawn: Statement = {
  id: "s4",
  revision: "r2",
  text: "…",
  state: "withdrawn",
  withdrawalReason: "Replaced by s1.",
};

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

describe("openPointsOf", () => {
  it("counts statements that are to confirm and questioned, and no others", () => {
    expect(openPointsOf([proposed, toConfirm, questioned, withdrawn], [])).toEqual([
      { kind: "statement_to_confirm", statementId: "s2" },
      { kind: "statement_questioned", statementId: "s3" },
    ]);
  });

  it("counts an unanswered question, naming who must answer", () => {
    const question = remark({ id: "q1", mustAnswer: "p2" });
    expect(openPointsOf([], [question])).toEqual([
      { kind: "unanswered_question", remarkId: "q1", on: "s1", mustAnswer: "p2" },
    ]);
  });

  it("counts an open remark that names nobody", () => {
    expect(openPointsOf([], [remark()])).toEqual([
      { kind: "unresolved_remark", remarkId: "m1", on: "s1" },
    ]);
  });

  it("counts each open remark exactly once", () => {
    const question = remark({ id: "q1", mustAnswer: "p2" });
    expect(openPointsOf([], [question, remark()])).toHaveLength(2);
  });

  it("leaves out remarks that changed the specification or were refused", () => {
    const changed = remark({ id: "m2", outcome: { kind: "changed_the_specification", revision: "r8" } });
    const refused = remark({ id: "m3", outcome: { kind: "refused", reason: "Out of scope." } });
    expect(openPointsOf([], [changed, refused])).toEqual([]);
  });

  it("is empty when the project knows of nothing outstanding", () => {
    expect(openPointsOf([proposed, withdrawn], [])).toEqual([]);
  });
});
