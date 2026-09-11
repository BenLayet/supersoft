/**
 * A specification: what must be built, in the words of the people who
 * commissioned it. See docs/domain/specification.md.
 *
 * It is made of statements — the rules — and of the terms those rules use.
 * Nothing here says where it was read from or how it is stored: that is the
 * concern of whatever hands these values over.
 */
import type { Statement, StatementId } from "./statement";
import { normaliseStatementText } from "./revision";

/**
 * One concept of the business, defined once, in the customer's own words.
 * A concept has exactly one name, which is why finding a term is a lookup by
 * name and never a search.
 */
export interface Term {
  readonly name: string;
  readonly definition: string;
}

export interface Specification {
  readonly statements: readonly Statement[];
  readonly terms: readonly Term[];
}

export const emptySpecification: Specification = { statements: [], terms: [] };

export function statementById(
  specification: Specification,
  id: StatementId,
): Statement | undefined {
  return specification.statements.find((statement) => statement.id === id);
}

/**
 * Terms are named by people writing prose, so "Member" and "member" are the
 * same term. Two spellings of one concept are a fault in the specification,
 * not a pair of terms.
 */
export function termNamed(specification: Specification, name: string): Term | undefined {
  const wanted = termKey(name);
  return specification.terms.find((term) => termKey(term.name) === wanted);
}

/** The form under which two spellings of a term name count as the same. */
export function termKey(name: string): string {
  return normaliseStatementText(name).toLocaleLowerCase();
}
