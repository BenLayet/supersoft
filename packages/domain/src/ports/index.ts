/**
 * The interfaces the domain expects the outside world to satisfy.
 * See docs/decisions/0003-hexagonal-monorepo-pure-domain.md: one external
 * service is one port here and one adapter outside, and every port has a
 * mock adapter so that Supersoft runs end to end with no outside service.
 */
export type * from "./project-files";
