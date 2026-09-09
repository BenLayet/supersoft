/**
 * Everything a project knows it does not know.
 * See docs/domain/conversation.md.
 */
import type { ParticipantId } from "../project/participant";
import { isOpenPoint, type Statement, type StatementId } from "../specification/statement";
import { isQuestion, isResolved, type Remark, type RemarkId } from "./remark";

export type OpenPoint =
  | {
      readonly kind: "unanswered_question";
      readonly remarkId: RemarkId;
      readonly on: StatementId;
      readonly mustAnswer: ParticipantId;
    }
  | { readonly kind: "unresolved_remark"; readonly remarkId: RemarkId; readonly on: StatementId }
  | { readonly kind: "statement_to_confirm"; readonly statementId: StatementId }
  | { readonly kind: "statement_questioned"; readonly statementId: StatementId };

/**
 * The open points of a project are always countable and always visible.
 * Going into real use with open points is normal; going into real use without
 * knowing what they are is not — so this list is never abridged.
 */
export function openPointsOf(
  statements: readonly Statement[],
  remarks: readonly Remark[],
): OpenPoint[] {
  const fromStatements = statements.filter(isOpenPoint).map((statement): OpenPoint =>
    statement.state === "questioned"
      ? { kind: "statement_questioned", statementId: statement.id }
      : { kind: "statement_to_confirm", statementId: statement.id },
  );

  // A question is a remark, so each open remark is counted exactly once:
  // as a question when it names who must answer, as a remark otherwise.
  const fromRemarks = remarks
    .filter((remark) => !isResolved(remark))
    .map((remark): OpenPoint =>
      isQuestion(remark) && remark.mustAnswer !== undefined
        ? {
            kind: "unanswered_question",
            remarkId: remark.id,
            on: remark.on,
            mustAnswer: remark.mustAnswer,
          }
        : { kind: "unresolved_remark", remarkId: remark.id, on: remark.on },
    );

  return [...fromStatements, ...fromRemarks];
}
