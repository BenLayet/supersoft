/**
 * Who takes part in a project.
 * See docs/domain/projects.md.
 *
 * A role says what someone knows and what they are there for. It is not a
 * permission: nothing in this package refuses an action because of the role
 * its author holds. What needs care is decided by what a change reaches —
 * money, personal data, access rights, anything in real use, anything
 * irreversible — and never by who is asking.
 */

export type ParticipantId = string;

/**
 * One person may hold several roles: on a small project the customer, the
 * domain expert and the end user are frequently the same person, and in an
 * organisation with no budget the person who knows the business is often the
 * person doing the work.
 */
export type Role = "maker" | "customer" | "domainExpert" | "endUser";

export interface Participant {
  readonly id: ParticipantId;
  readonly name: string;
  readonly roles: readonly Role[];
}

export function hasRole(participant: Participant, role: Role): boolean {
  return participant.roles.includes(role);
}
