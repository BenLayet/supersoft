/**
 * Reading a project's specification from the files of its own repository.
 *
 * This is what ADR 0001 and ADR 0004 amount to in one function: the prose is
 * the specification, the identifier in the prose is the identity of a
 * statement, the sidecar holds what departs from the default, agreements are
 * their own files, and the revision is computed from the text rather than
 * written anywhere.
 *
 * Nothing here throws on a project's own files. What cannot be read comes
 * back as a problem, for the build step to fail on.
 */
import type {
  Agreement,
  ProjectFiles,
  Specification,
  Statement,
  StatementId,
  Term,
} from "@supersoft/domain";
import { readAgreements } from "./agreements";
import { readDocument } from "./document";
import { readLayout, type SpecificationLayout } from "./layout";
import type { SpecificationProblem } from "./problems";
import { revisionOf } from "./revision";
import { readSidecar } from "./sidecar";

/** Where a statement is written, for whoever has to go and read or fix it. */
export interface StatementOrigin {
  readonly document: string;
  readonly line: number;
}

export interface SpecificationInFiles {
  readonly specification: Specification;
  readonly agreements: readonly Agreement[];
  readonly layout: SpecificationLayout;
  readonly origins: ReadonlyMap<StatementId, StatementOrigin>;
  /** Empty means the files say what they mean. See describeProblem. */
  readonly problems: readonly SpecificationProblem[];
}

export async function readSpecification(files: ProjectFiles): Promise<SpecificationInFiles> {
  const problems: SpecificationProblem[] = [];
  const statements: Statement[] = [];
  const terms: Term[] = [];
  const origins = new Map<StatementId, StatementOrigin>();
  const definedIn = new Map<string, string>();

  const { layout, problems: layoutProblems } = await readLayout(files);
  problems.push(...layoutProblems);

  const documents = (await files.list(layout.documents))
    .filter((path) => path.endsWith(".md"))
    .sort();

  for (const path of documents) {
    const markdown = await files.read(path);
    if (markdown === undefined) continue;

    const document = readDocument(path, markdown, layout);
    const sidecar = await readSidecar(files, path);
    problems.push(...sidecar.problems);

    const inThisDocument = new Set<StatementId>();

    for (const inProse of document.statements) {
      // A rule nobody has named yet is not a statement: an agreement could
      // not name it either, which is why this is a problem and not a silence.
      if (inProse.statementId === undefined) {
        problems.push({
          kind: "statement_without_identifier",
          document: path,
          line: inProse.line,
          text: inProse.text,
        });
        continue;
      }

      const already = origins.get(inProse.statementId);
      if (already !== undefined) {
        problems.push({
          kind: "identifier_used_twice",
          statementId: inProse.statementId,
          document: path,
          line: inProse.line,
          firstIn: already.document,
          firstLine: already.line,
        });
        continue;
      }

      const entry = sidecar.entries.get(inProse.statementId);
      const base = {
        id: inProse.statementId,
        revision: revisionOf(inProse.text),
        text: inProse.text,
      };
      // No entry means proposed: the default is not written down anywhere.
      statements.push(
        entry !== undefined && entry.state === "withdrawn"
          ? { ...base, state: "withdrawn", withdrawalReason: entry.withdrawalReason }
          : { ...base, state: entry?.state ?? "proposed" },
      );
      origins.set(inProse.statementId, { document: path, line: inProse.line });
      inThisDocument.add(inProse.statementId);
    }

    for (const statementId of sidecar.entries.keys()) {
      if (!inThisDocument.has(statementId)) {
        problems.push({ kind: "entry_without_statement", statementId, sidecar: sidecar.path });
      }
    }

    for (const term of document.terms) {
      const key = term.name.toLocaleLowerCase();
      const first = definedIn.get(key);
      if (first !== undefined) {
        problems.push({ kind: "term_defined_twice", term: term.name, document: path, firstIn: first });
        continue;
      }
      definedIn.set(key, path);
      terms.push(term);
    }
  }

  const { agreements: found, problems: agreementProblems } = await readAgreements(files);
  problems.push(...agreementProblems);
  for (const { agreement, file } of found) {
    // An agreement naming a statement nobody can find cannot be checked, and
    // an agreement that cannot be checked is exactly what the product sells
    // against.
    if (!origins.has(agreement.statementId)) {
      problems.push({
        kind: "agreement_without_statement",
        statementId: agreement.statementId,
        file,
      });
    }
  }

  return {
    specification: { statements, terms },
    agreements: found.map(({ agreement }) => agreement),
    layout,
    origins,
    problems,
  };
}
