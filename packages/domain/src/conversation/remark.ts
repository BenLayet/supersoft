/**
 * What participants say about a precise part of the specification.
 * See docs/domain/conversation.md.
 */
import type { ParticipantId } from "../project/participant";
import type { Revision, StatementId } from "../specification/statement";

export type RemarkId = string;

/**
 * A remark is never simply closed. It ends in one of three ways: it changes
 * the specification, it is refused with a stated reason, or it stays open and
 * waiting for someone. Silently dropping a remark is the failure this part of
 * the product exists to prevent, so there is no fourth way out of this type.
 */
export type RemarkOutcome =
  | { readonly kind: "open" }
  | { readonly kind: "changed_the_specification"; readonly revision: Revision }
  | { readonly kind: "refused"; readonly reason: string };

export interface Remark {
  readonly id: RemarkId;
  readonly author: ParticipantId;
  /** A remark is always attached to something. */
  readonly on: StatementId;
  readonly said: string;
  readonly at: Date;
  readonly outcome: RemarkOutcome;
  /**
   * A question is a remark that names who must answer it before the work can
   * go on. A remark that names nobody is not a question.
   */
  readonly mustAnswer?: ParticipantId;
}

export function isQuestion(remark: Remark): boolean {
  return remark.mustAnswer !== undefined;
}

export function isResolved(remark: Remark): boolean {
  return remark.outcome.kind !== "open";
}

/** A question nobody has answered yet: it stands on the statement it is attached to. */
export function isUnansweredQuestion(remark: Remark): boolean {
  return isQuestion(remark) && !isResolved(remark);
}

export function remarksOn(remarks: readonly Remark[], statementId: StatementId): Remark[] {
  return remarks.filter((remark) => remark.on === statementId);
}
