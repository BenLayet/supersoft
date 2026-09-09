/**
 * The customer stating that a part of the specification reflects what they
 * want. See docs/domain/conversation.md and docs/domain/specification.md.
 */
import { isCustomer, type Participant, type ParticipantId } from "../project/participant";
import type { Revision, Statement, StatementId, StatementState } from "../specification/statement";
import { isUnansweredQuestion, type Remark, remarksOn } from "./remark";

/**
 * An agreement is given on one version of an element, and covers that version
 * only. Nothing here expires: when the statement changes, the new version
 * simply carries no agreement.
 */
export interface Agreement {
  readonly statementId: StatementId;
  readonly revision: Revision;
  readonly givenBy: ParticipantId;
  readonly on: Date;
}

export function agreementFor(
  statement: Statement,
  agreements: readonly Agreement[],
): Agreement | undefined {
  return agreements.find(
    (agreement) =>
      agreement.statementId === statement.id && agreement.revision === statement.revision,
  );
}

/** Is this statement, as it is written now, agreed? */
export function isAgreed(statement: Statement, agreements: readonly Agreement[]): boolean {
  return agreementFor(statement, agreements) !== undefined;
}

/**
 * The state everyone sees. The statement carries four of the five states; the
 * fifth, `agreed`, is read from the agreements covering its current version.
 */
export function stateOf(
  statement: Statement,
  agreements: readonly Agreement[],
): StatementState {
  if (statement.state === "proposed" && isAgreed(statement, agreements)) {
    return "agreed";
  }
  return statement.state;
}

export type AgreementRefusal =
  | "not_the_customer"
  | "statement_withdrawn"
  | "question_standing";

export type AgreementDecision =
  | { readonly allowed: true; readonly agreement: Agreement }
  | { readonly allowed: false; readonly reason: AgreementRefusal };

/**
 * Agreeing is an act, by the customer, on a named statement as it is written
 * that day, on a date. Nothing here ever produces an agreement from silence:
 * the caller must have a participant, a statement and a date in hand.
 */
export function decideAgreement(
  statement: Statement,
  participant: Participant,
  remarks: readonly Remark[],
  now: Date,
): AgreementDecision {
  if (!isCustomer(participant)) {
    return { allowed: false, reason: "not_the_customer" };
  }
  if (statement.state === "withdrawn") {
    return { allowed: false, reason: "statement_withdrawn" };
  }
  // A question standing on a statement prevents it from becoming agreed.
  if (remarksOn(remarks, statement.id).some(isUnansweredQuestion)) {
    return { allowed: false, reason: "question_standing" };
  }
  return {
    allowed: true,
    agreement: {
      statementId: statement.id,
      revision: statement.revision,
      givenBy: participant.id,
      on: now,
    },
  };
}

/**
 * Withdrawing an agreement. A customer discovering on a prototype that what
 * they agreed to is not what they meant is the system working, not a failure.
 */
export function withdrawAgreement(
  agreements: readonly Agreement[],
  statement: Statement,
  participant: Participant,
): Agreement[] {
  if (!isCustomer(participant)) {
    return [...agreements];
  }
  return agreements.filter(
    (agreement) =>
      !(agreement.statementId === statement.id && agreement.revision === statement.revision),
  );
}
