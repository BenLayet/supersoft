/**
 * One addressable element of a specification, and the state it carries.
 * See docs/domain/specification.md.
 */

export type StatementId = string;

/**
 * Identifies one version of a statement. Opaque here: the domain never reads
 * it, only compares it. What it is made of belongs to whatever keeps the
 * history of the specification, outside this package.
 */
export type Revision = string;

/**
 * The four states a statement carries by itself. `agreed` is deliberately
 * absent: it is not recorded on a statement, it follows from an agreement
 * covering the version now written — see stateOf in ../conversation/agreement.
 */
export type RecordedState = "proposed" | "to_confirm" | "questioned" | "withdrawn";

/** The state as everyone sees it, agreement included. */
export type StatementState = RecordedState | "agreed";

interface StatementBase {
  readonly id: StatementId;
  readonly revision: Revision;
  readonly text: string;
}

/**
 * A withdrawn statement keeps its reason, because the reason is often
 * re-discovered later. The type makes it impossible to withdraw without one.
 */
export type Statement = StatementBase &
  (
    | { readonly state: "proposed" | "to_confirm" | "questioned" }
    | { readonly state: "withdrawn"; readonly withdrawalReason: string }
  );

/** A statement that is questioned or to confirm is an open point. */
export function isOpenPoint(statement: Statement): boolean {
  return statement.state === "questioned" || statement.state === "to_confirm";
}
