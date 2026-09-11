/**
 * Where a project's specification is, as the project itself declares it.
 * See docs/decisions/0007-a-project-declares-where-its-specification-is.md.
 *
 * The headings are in the project's own language, so they cannot be guessed;
 * the declaration is optional, so a project that says nothing is read with
 * the English defaults rather than refused.
 */
import type { ProjectFiles } from "@supersoft/domain";
import { parse } from "yaml";
import type { SpecificationProblem } from "./problems";

export interface SpecificationLayout {
  /** The directory holding the domain documents. */
  readonly documents: string;
  /** The heading of the section whose list items are statements. */
  readonly statements: string;
  /** The heading of the section whose items define terms. */
  readonly terms: string;
}

export const defaultLayout: SpecificationLayout = {
  documents: "docs/domain",
  statements: "Rules",
  terms: "Vocabulary",
};

/** The one file in a project's repository that carries a tool's name. */
export const layoutFile = "supersoft.yaml";

/** Fixed by ADR 0004: what the tooling itself writes has one place. */
export const agreementsDirectory = "docs/agreements";

function declaredText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

export async function readLayout(
  files: ProjectFiles,
): Promise<{ layout: SpecificationLayout; problems: SpecificationProblem[] }> {
  const text = await files.read(layoutFile);
  if (text === undefined) return { layout: defaultLayout, problems: [] };

  let declared: unknown;
  try {
    declared = parse(text);
  } catch (error) {
    return {
      layout: defaultLayout,
      problems: [
        {
          kind: "file_not_understood",
          file: layoutFile,
          detail: `${(error as Error).message}. Read with the default layout instead.`,
        },
      ],
    };
  }

  const section = (declared as { specification?: unknown } | null)?.specification;
  if (section === undefined || section === null) return { layout: defaultLayout, problems: [] };
  if (typeof section !== "object" || Array.isArray(section)) {
    return {
      layout: defaultLayout,
      problems: [
        {
          kind: "file_not_understood",
          file: layoutFile,
          detail: "specification: should hold documents, statements and terms. Read with the default layout instead.",
        },
      ],
    };
  }

  const { documents, statements, terms } = section as Record<string, unknown>;
  return {
    layout: {
      documents: declaredText(documents) ?? defaultLayout.documents,
      statements: declaredText(statements) ?? defaultLayout.statements,
      terms: declaredText(terms) ?? defaultLayout.terms,
    },
    problems: [],
  };
}
