import { describe, expect, it } from "vitest";
import type { Participant } from "../project/participant";
import type { Statement } from "../specification/statement";
import type { Remark } from "./remark";
import {
  type Agreement,
  decideAgreement,
  isAgreed,
  stateOf,
  withdrawAgreement,
} from "./agreement";

const customer: Participant = {
  id: "p1",
  name: "Camille",
  roles: ["customer", "domainExpert"],
  level: "editor",
};
const maker: Participant = { id: "p2", name: "Alex", roles: ["maker"], level: "builder" };

const day = new Date("2026-03-03T10:00:00Z");

const statement: Statement = {
  id: "s1",
  revision: "r7",
  text: "Members can cancel up to 48 hours before.",
  state: "proposed",
};

function agreementOn(revision: string): Agreement {
  return { statementId: "s1", revision, givenBy: customer.id, on: day };
}

function question(overrides: Partial<Remark> = {}): Remark {
  return {
    id: "q1",
    author: customer.id,
    on: "s1",
    said: "Is 48 hours counted from the start of the session?",
    at: day,
    outcome: { kind: "open" },
    mustAnswer: maker.id,
    ...overrides,
  };
}

describe("an agreement covers one version and nothing else", () => {
  it("holds for the version it was given on", () => {
    expect(isAgreed(statement, [agreementOn("r7")])).toBe(true);
    expect(stateOf(statement, [agreementOn("r7")])).toBe("agreed");
  });

  it("does not carry over to a later version of the same statement", () => {
    const rewritten: Statement = { ...statement, revision: "r8", text: "Members can cancel." };
    expect(isAgreed(rewritten, [agreementOn("r7")])).toBe(false);
    expect(stateOf(rewritten, [agreementOn("r7")])).toBe("proposed");
  });

  it("does not leak onto another statement of the same version", () => {
    const other: Statement = { ...statement, id: "s2" };
    expect(isAgreed(other, [agreementOn("r7")])).toBe(false);
  });
});

describe("stateOf", () => {
  it("returns the recorded state when nothing has been agreed", () => {
    expect(stateOf(statement, [])).toBe("proposed");
    expect(stateOf({ ...statement, state: "to_confirm" }, [])).toBe("to_confirm");
    expect(stateOf({ ...statement, state: "questioned" }, [])).toBe("questioned");
  });

  it("never reports a withdrawn or questioned statement as agreed", () => {
    const agreements = [agreementOn("r7")];
    expect(stateOf({ ...statement, state: "questioned" }, agreements)).toBe("questioned");
    expect(
      stateOf(
        { ...statement, state: "withdrawn", withdrawalReason: "Out of scope." },
        agreements,
      ),
    ).toBe("withdrawn");
  });
});

describe("decideAgreement", () => {
  it("records the customer, the version and the date", () => {
    const decision = decideAgreement(statement, customer, [], day);
    expect(decision).toEqual({
      allowed: true,
      agreement: { statementId: "s1", revision: "r7", givenBy: "p1", on: day },
    });
  });

  it("refuses anyone who is not the customer", () => {
    const decision = decideAgreement(statement, maker, [], day);
    expect(decision).toEqual({ allowed: false, reason: "not_the_customer" });
  });

  it("refuses a withdrawn statement", () => {
    const withdrawn: Statement = {
      ...statement,
      state: "withdrawn",
      withdrawalReason: "Out of scope.",
    };
    expect(decideAgreement(withdrawn, customer, [], day)).toEqual({
      allowed: false,
      reason: "statement_withdrawn",
    });
  });

  it("refuses while a question stands on the statement", () => {
    expect(decideAgreement(statement, customer, [question()], day)).toEqual({
      allowed: false,
      reason: "question_standing",
    });
  });

  it("allows it once that question is answered", () => {
    const answered = question({ outcome: { kind: "refused", reason: "Yes, from the start." } });
    expect(decideAgreement(statement, customer, [answered], day).allowed).toBe(true);
  });

  it("is not blocked by a question standing on another statement", () => {
    expect(decideAgreement(statement, customer, [question({ on: "s2" })], day).allowed).toBe(
      true,
    );
  });

  it("is not blocked by an open remark that names nobody", () => {
    const remark = question({ mustAnswer: undefined, said: "The wording feels harsh." });
    expect(decideAgreement(statement, customer, [remark], day).allowed).toBe(true);
  });
});

describe("withdrawAgreement", () => {
  it("removes the agreement covering the current version", () => {
    expect(withdrawAgreement([agreementOn("r7")], statement, customer)).toEqual([]);
  });

  it("leaves agreements on other versions alone", () => {
    const kept = agreementOn("r6");
    expect(withdrawAgreement([kept, agreementOn("r7")], statement, customer)).toEqual([kept]);
  });

  it("does nothing when anyone but the customer asks", () => {
    const agreements = [agreementOn("r7")];
    expect(withdrawAgreement(agreements, statement, maker)).toEqual(agreements);
  });
});
