/**
 * @supersoft/specification-files — reading a project's specification from the
 * files of its own repository.
 *
 * Prose is the specification; the identifier written in the prose is the
 * identity of a statement; the sidecar records only what departs from the
 * default; agreements are their own files; and a revision is computed from
 * the text of a statement rather than written down anywhere.
 *
 * ADR 0001 (the specification lives in the project's repository),
 * ADR 0004 (identifiers in the prose, everything else in a sidecar),
 * ADR 0006 (a revision is the hash of the normalised text) and
 * ADR 0007 (a project declares where its specification is) are what this
 * package implements. It is the only code allowed to know the format.
 */
export { readSpecification, type SpecificationInFiles, type StatementOrigin } from "./read";
export {
  assignIdentifiers,
  planIdentifiers,
  withIdentifiers,
  type DocumentToWrite,
  type IdentifierAssigned,
  type IdentifierPlan,
  type IdentifiersAssigned,
} from "./assign";
export { nextIdentifier, slugFor } from "./identifier";
export {
  agreementsDirectory,
  defaultLayout,
  layoutFile,
  readLayout,
  type SpecificationLayout,
} from "./layout";
export { readDocument, type DocumentInProse, type StatementInProse } from "./document";
export { readSidecar, sidecarPathFor, type Sidecar, type SidecarEntry } from "./sidecar";
export { readAgreements, type AgreementInFiles } from "./agreements";
export { revisionOf } from "./revision";
export { describeProblem, type SpecificationProblem } from "./problems";
