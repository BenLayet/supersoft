/**
 * @supersoft/domain — the business rules of Supersoft, as pure functions.
 *
 * This package has ZERO runtime dependencies: no framework, no ORM, no SDK,
 * no clock and no network. Everything the outside world provides arrives as
 * an argument, or through a port declared in ./ports.
 *
 * The source of truth for what is written here is ../../../docs/domain/,
 * and the names come from ../../../docs/glossary.md. A rule that is not in
 * those documents does not exist; a concept gets its glossary entry before
 * it gets a name here.
 */
export * from "./project/participant";
export * from "./specification/statement";
export * from "./specification/specification";
export * from "./specification/revision";
export * from "./conversation/remark";
export * from "./conversation/agreement";
export * from "./conversation/open-point";
export type * from "./ports";
