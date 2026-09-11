/**
 * Assigning an identifier to a rule that has none — the one write Supersoft
 * makes to prose it does not own.
 * See docs/decisions/0008-how-an-identifier-is-minted.md.
 *
 * The edit is a single insertion per rule, after the last non-whitespace
 * character of the line the rule ends on. Nothing else in the document is
 * touched: not a word, not a list number, not a line ending, not the
 * trailing spaces that make a hard line break, not the final newline. Remove
 * the comments this adds and the file is byte for byte what it was.
 *
 * Planning is separate from writing, so that a diff can be shown to the
 * person whose document it is before anything happens to it.
 */
import type {
  ProjectFiles,
  StatementId,
  WritableProjectFiles,
} from "@supersoft/domain";
import { readAgreements } from "./agreements";
import { readDocument, type DocumentInProse } from "./document";
import { nextIdentifier, slugFor } from "./identifier";
import { readLayout, type SpecificationLayout } from "./layout";
import type { SpecificationProblem } from "./problems";
import { readSidecar } from "./sidecar";

export interface IdentifierAssigned {
  readonly statementId: StatementId;
  readonly document: string;
  /** The line the identifier was written on: where the rule ends. */
  readonly line: number;
  readonly text: string;
}

export interface DocumentToWrite {
  readonly path: string;
  /** The document as it would be after the write. */
  readonly text: string;
  readonly assigned: readonly IdentifierAssigned[];
}

export interface IdentifierPlan {
  /** Only documents with something to assign: elsewhere there is no diff. */
  readonly documents: readonly DocumentToWrite[];
  readonly problems: readonly SpecificationProblem[];
}

/** Where each line starts in the text, so an insertion can be placed exactly. */
function lineStarts(text: string): number[] {
  const starts = [0];
  for (let index = 0; index < text.length; index++) {
    if (text[index] === "\n") starts.push(index + 1);
  }
  return starts;
}

/**
 * After the last non-whitespace character of that line — before the trailing
 * spaces rather than after them, so that a Markdown hard line break written
 * as two spaces at the end of a line stays a hard line break.
 */
function endOfContent(text: string, starts: readonly number[], line: number): number | undefined {
  const start = starts[line - 1];
  if (start === undefined) return undefined;
  const end = starts[line] ?? text.length + 1;
  let position = Math.min(end - 1, text.length);
  while (position > start && /\s/.test(text[position - 1] ?? "")) position--;
  return position;
}

/**
 * The document as it would be once every rule that has none carries an
 * identifier. `mint` hands out the next one, and is the only thing that knows
 * which numbers are already spent.
 */
export function withIdentifiers(
  path: string,
  markdown: string,
  layout: SpecificationLayout,
  mint: () => StatementId,
  read: DocumentInProse = readDocument(path, markdown, layout),
): DocumentToWrite {
  const starts = lineStarts(markdown);
  const insertions: { at: number; comment: string }[] = [];
  const assigned: IdentifierAssigned[] = [];

  for (const statement of read.statements) {
    // A rule already named keeps its name, whatever shape that name has.
    if (statement.statementId !== undefined) continue;
    // A list item with no words is not a rule anyone can agree to.
    if (statement.text === "") continue;

    const at = endOfContent(markdown, starts, statement.endLine);
    if (at === undefined) continue;

    const statementId = mint();
    insertions.push({ at, comment: ` <!-- @${statementId} -->` });
    assigned.push({ statementId, document: path, line: statement.endLine, text: statement.text });
  }

  // Applied from the end, so that every offset still means what it meant.
  let text = markdown;
  for (const insertion of [...insertions].reverse()) {
    text = text.slice(0, insertion.at) + insertion.comment + text.slice(insertion.at);
  }

  return { path, text, assigned };
}

/**
 * What assigning would do, without doing it. Reading the whole project first
 * is not an accident: the numbers already spent are in the prose, in the
 * sidecars and in the agreements, and a deleted rule never gives its number
 * back.
 */
export async function planIdentifiers(files: ProjectFiles): Promise<IdentifierPlan> {
  const problems: SpecificationProblem[] = [];
  const { layout, problems: layoutProblems } = await readLayout(files);
  problems.push(...layoutProblems);

  const paths = (await files.list(layout.documents)).filter((path) => path.endsWith(".md")).sort();
  const documents: { path: string; text: string; read: DocumentInProse }[] = [];
  const used = new Set<StatementId>();

  for (const path of paths) {
    const text = await files.read(path);
    if (text === undefined) continue;

    const read = readDocument(path, text, layout);
    for (const statement of read.statements) {
      if (statement.statementId !== undefined) used.add(statement.statementId);
    }

    const sidecar = await readSidecar(files, path);
    problems.push(...sidecar.problems);
    for (const statementId of sidecar.entries.keys()) used.add(statementId);

    documents.push({ path, text, read });
  }

  const { agreements, problems: agreementProblems } = await readAgreements(files);
  problems.push(...agreementProblems);
  for (const { agreement } of agreements) used.add(agreement.statementId);

  const planned: DocumentToWrite[] = [];
  for (const document of documents) {
    const slug = slugFor(document.path);
    const toWrite = withIdentifiers(
      document.path,
      document.text,
      layout,
      () => {
        const statementId = nextIdentifier(slug, used);
        used.add(statementId);
        return statementId;
      },
      document.read,
    );
    if (toWrite.assigned.length > 0) planned.push(toWrite);
  }

  return { documents: planned, problems };
}

export interface IdentifiersAssigned {
  readonly assigned: readonly IdentifierAssigned[];
  /** Documents actually written: a document with nothing to assign is left alone. */
  readonly documentsWritten: readonly string[];
  readonly problems: readonly SpecificationProblem[];
}

export async function assignIdentifiers(
  files: WritableProjectFiles,
): Promise<IdentifiersAssigned> {
  const plan = await planIdentifiers(files);
  for (const document of plan.documents) {
    await files.write(document.path, document.text);
  }
  return {
    assigned: plan.documents.flatMap((document) => document.assigned),
    documentsWritten: plan.documents.map((document) => document.path),
    problems: plan.problems,
  };
}
