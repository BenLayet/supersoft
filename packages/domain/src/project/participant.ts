/**
 * Who takes part in a project, and what that entitles them to.
 * See docs/domain/projects.md.
 */

export type ParticipantId = string;

/**
 * One person may hold several roles: on a small project the customer, the
 * domain expert and the end user are frequently the same person. The roles
 * are named separately because the questions each one answers differ.
 */
export type Role = "maker" | "customer" | "domainExpert" | "endUser";

export type ParticipationLevel = "reader" | "commenter" | "editor" | "builder";

export interface Participant {
  readonly id: ParticipantId;
  readonly name: string;
  readonly roles: readonly Role[];
  readonly level: ParticipationLevel;
}

export function hasRole(participant: Participant, role: Role): boolean {
  return participant.roles.includes(role);
}

/** Only the customer may give or withdraw an agreement. */
export function isCustomer(participant: Participant): boolean {
  return hasRole(participant, "customer");
}

/** Only the maker changes the code, whatever the customer changes in the specification. */
export function isMaker(participant: Participant): boolean {
  return hasRole(participant, "maker");
}

/** The authority on business vocabulary: when a term is disputed, their usage wins. */
export function isDomainExpert(participant: Participant): boolean {
  return hasRole(participant, "domainExpert");
}
