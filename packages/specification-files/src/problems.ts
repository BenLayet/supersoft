/**
 * What can be wrong with the files a specification is written in.
 *
 * Validation is a build step, alongside the tests
 * (docs/decisions/0004-structure-rides-in-the-prose-and-a-sidecar.md point 8):
 * a specification that does not validate fails the build, exactly as a
 * failing test does. So reading never throws on a project's own files — it
 * reads what it can and reports what it could not, with enough of a location
 * that a person can open the file and fix it.
 */
import type { StatementId } from "@supersoft/domain";

export type SpecificationProblem =
  /** A rule with no identifier cannot be agreed to, so it is not a statement yet. */
  | {
      readonly kind: "statement_without_identifier";
      readonly document: string;
      readonly line: number;
      readonly text: string;
    }
  /** Identifiers are assigned once and never reused: two rules cannot share one. */
  | {
      readonly kind: "identifier_used_twice";
      readonly statementId: StatementId;
      readonly document: string;
      readonly line: number;
      readonly firstIn: string;
      readonly firstLine: number;
    }
  /** A sidecar entry naming a statement no document carries: a renamed heading, a deleted rule, a typo. */
  | {
      readonly kind: "entry_without_statement";
      readonly statementId: StatementId;
      readonly sidecar: string;
    }
  /** A statement is withdrawn with its reason or not at all. */
  | {
      readonly kind: "withdrawal_without_reason";
      readonly statementId: StatementId;
      readonly sidecar: string;
    }
  | {
      readonly kind: "state_not_recognised";
      readonly statementId: StatementId;
      readonly sidecar: string;
      readonly state: string;
    }
  /** An agreement naming a statement no document carries: the agreement cannot be checked. */
  | {
      readonly kind: "agreement_without_statement";
      readonly statementId: StatementId;
      readonly file: string;
    }
  /** One concept, one name: a term defined twice has two definitions to disagree. */
  | {
      readonly kind: "term_defined_twice";
      readonly term: string;
      readonly document: string;
      readonly firstIn: string;
    }
  | { readonly kind: "file_not_understood"; readonly file: string; readonly detail: string };

/** One line a person can act on, for the output of the build step. */
export function describeProblem(problem: SpecificationProblem): string {
  switch (problem.kind) {
    case "statement_without_identifier":
      return `${problem.document}:${problem.line}: this rule has no identifier, so nothing can be agreed on it: "${problem.text}"`;
    case "identifier_used_twice":
      return `${problem.document}:${problem.line}: the identifier ${problem.statementId} is already used by ${problem.firstIn}:${problem.firstLine}`;
    case "entry_without_statement":
      return `${problem.sidecar}: ${problem.statementId} is not a statement of the document beside it`;
    case "withdrawal_without_reason":
      return `${problem.sidecar}: ${problem.statementId} is withdrawn with no reason given, and a withdrawal keeps its reason`;
    case "state_not_recognised":
      return `${problem.sidecar}: ${problem.statementId} is in state "${problem.state}", which is not one a statement carries`;
    case "agreement_without_statement":
      return `${problem.file}: an agreement names ${problem.statementId}, which no document carries`;
    case "term_defined_twice":
      return `${problem.document}: the term "${problem.term}" is already defined in ${problem.firstIn}, and a concept has exactly one definition`;
    case "file_not_understood":
      return `${problem.file}: ${problem.detail}`;
  }
}
