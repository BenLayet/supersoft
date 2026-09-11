/**
 * Reading one domain document: prose written for a customer, from which the
 * rules and the terms can be picked out without anything being imposed on
 * how the project writes.
 * See docs/decisions/0004-structure-rides-in-the-prose-and-a-sidecar.md.
 *
 * A statement is one item of the rules list; a term is one definition in the
 * vocabulary section. The paragraphs around them are read by people and are
 * not addressed here.
 */
import { normaliseStatementText, type StatementId, type Term } from "@supersoft/domain";
import type { SpecificationLayout } from "./layout";

export interface StatementInProse {
  /** The identifier written after the rule, absent until one is assigned. */
  readonly statementId?: StatementId;
  /** The sentence, with what belongs to the document taken out. */
  readonly text: string;
  /** Where it starts, for a person who has to go and fix something. */
  readonly line: number;
  /**
   * The line the statement ends on, which is where an identifier is written
   * when one is assigned. A rule wrapped over three lines ends on the third.
   */
  readonly endLine: number;
}

export interface DocumentInProse {
  readonly path: string;
  readonly statements: readonly StatementInProse[];
  readonly terms: readonly Term[];
}

const heading = /^(#{1,6})\s+(.*)$/;
const fence = /^\s*(?:```|~~~)/;
const numberedItem = /^ {0,3}\d+[.)]\s+(.*)$/;
const bulletItem = /^ {0,3}[-*+]\s+(.*)$/;
const comment = /<!--[\s\S]*?-->/g;
const identifierComment = /<!--\s*@([A-Za-z0-9][A-Za-z0-9._-]*)\s*-->/g;
const boldName = /^\s*(?:\*\*|__)(.+?)(?:\*\*|__)\s*([\s\S]*)$/;
const definitionSeparator = /^[\s:：—–-]+/;

/** Headings are matched on their text: level, case and emphasis are the project's. */
function headingKey(text: string): string {
  return normaliseStatementText(text)
    .replace(/[*_`#]/g, "")
    .replace(/[:：]+$/, "")
    .trim()
    .toLocaleLowerCase();
}

type Section = "statements" | "terms" | "elsewhere";

function sectionOf(title: string, layout: SpecificationLayout): Section {
  const key = headingKey(title);
  if (key === headingKey(layout.statements)) return "statements";
  if (key === headingKey(layout.terms)) return "terms";
  return "elsewhere";
}

function statementIn(item: string, line: number, endLine: number): StatementInProse {
  const identifiers = [...item.matchAll(identifierComment)].map((match) => match[1]);
  const text = normaliseStatementText(item.replace(comment, " "));
  const statementId = identifiers.at(-1);
  return statementId === undefined
    ? { text, line, endLine }
    : { statementId, text, line, endLine };
}

/**
 * A vocabulary item defines a term when it names it: "**Member** — anyone the
 * association knows". An item that names nothing is prose in a list, and the
 * reader leaves it alone rather than inventing a term out of it.
 */
function termIn(item: string): Term | undefined {
  const named = item.replace(comment, " ").match(boldName);
  if (named === null) return undefined;
  const name = normaliseStatementText(named[1] ?? "");
  const definition = normaliseStatementText((named[2] ?? "").replace(definitionSeparator, ""));
  return name === "" ? undefined : { name, definition };
}

export function readDocument(
  path: string,
  markdown: string,
  layout: SpecificationLayout,
): DocumentInProse {
  const statements: StatementInProse[] = [];
  const terms: Term[] = [];

  let section: Section = "elsewhere";
  let insideFence = false;
  let item: { line: number; endLine: number; parts: string[] } | undefined;
  let afterBlankLine = false;

  const close = (): void => {
    if (item !== undefined) {
      const text = item.parts.join(" ");
      if (section === "statements") {
        statements.push(statementIn(text, item.line, item.endLine));
      } else if (section === "terms") {
        const term = termIn(text);
        if (term !== undefined) terms.push(term);
      }
    }
    item = undefined;
    afterBlankLine = false;
  };

  const lines = markdown.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    if (fence.test(line)) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const title = line.match(heading);
    if (title !== null) {
      close();
      section = sectionOf(title[2] ?? "", layout);
      continue;
    }
    if (section === "elsewhere") continue;

    if (line.trim() === "") {
      afterBlankLine = true;
      continue;
    }

    const wanted = section === "statements" ? numberedItem : bulletItem;
    const started = line.match(wanted);
    if (started !== null) {
      close();
      item = { line: index + 1, endLine: index + 1, parts: [started[1] ?? ""] };
      continue;
    }

    // A list of the other kind is a new block of its own, not the rest of the
    // item above — unless it is indented under it.
    const indented = /^\s{2,}/.test(line);
    const otherKind = (section === "statements" ? bulletItem : numberedItem).test(line);
    if (item !== undefined && !(otherKind && !indented) && (indented || !afterBlankLine)) {
      // A rule wrapped over two lines, or a paragraph belonging to it.
      item.parts.push(line.trim());
      item.endLine = index + 1;
      afterBlankLine = false;
      continue;
    }
    close();
  }
  close();

  return { path, statements, terms };
}
