/**
 * Agreements, as their own files under docs/agreements/ (ADR 0004 point 6).
 *
 * They are business events rather than edits, and they are written by a
 * different person than the one who writes the prose — hence their own
 * files, which the reader simply unions: one file per agreement, one per
 * month, or one for the project, as a project prefers.
 *
 *     agreements:
 *       - statementId: adhesions-r2
 *         revision: sha256:5f2b8c1d4e7a9031
 *         givenBy: marie
 *         on: 2026-09-01
 */
import type { Agreement, ProjectFiles } from "@supersoft/domain";
import { parse } from "yaml";
import { agreementsDirectory } from "./layout";
import type { SpecificationProblem } from "./problems";

function dateFrom(value: unknown): Date | undefined {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value;
  if (typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function agreementFrom(
  written: unknown,
): { agreement: Agreement } | { missing: string } {
  if (written === null || typeof written !== "object" || Array.isArray(written)) {
    return { missing: "an agreement should name a statement, a revision, who gave it and when" };
  }
  const { statementId, revision, givenBy, on } = written as Record<string, unknown>;
  const named = text(statementId);
  const version = text(revision);
  const author = text(givenBy);
  const day = dateFrom(on);
  const missing = [
    named === undefined ? "statementId" : undefined,
    version === undefined ? "revision" : undefined,
    author === undefined ? "givenBy" : undefined,
    day === undefined ? "on" : undefined,
  ].filter((key): key is string => key !== undefined);

  if (named === undefined || version === undefined || author === undefined || day === undefined) {
    return { missing: `an agreement is missing ${missing.join(", ")}` };
  }
  return { agreement: { statementId: named, revision: version, givenBy: author, on: day } };
}

/** An agreement and the file it was read from, so a problem can name it. */
export interface AgreementInFiles {
  readonly agreement: Agreement;
  readonly file: string;
}

export async function readAgreements(
  files: ProjectFiles,
): Promise<{ agreements: AgreementInFiles[]; problems: SpecificationProblem[] }> {
  const agreements: AgreementInFiles[] = [];
  const problems: SpecificationProblem[] = [];

  const paths = (await files.list(agreementsDirectory))
    .filter((path) => /\.ya?ml$/.test(path))
    .sort();

  for (const path of paths) {
    const content = await files.read(path);
    if (content === undefined) continue;

    let written: unknown;
    try {
      written = parse(content);
    } catch (error) {
      problems.push({ kind: "file_not_understood", file: path, detail: (error as Error).message });
      continue;
    }

    const listed = (written as { agreements?: unknown } | null)?.agreements;
    if (listed === undefined || listed === null) continue;
    if (!Array.isArray(listed)) {
      problems.push({
        kind: "file_not_understood",
        file: path,
        detail: "agreements: should hold a list of agreements.",
      });
      continue;
    }

    for (const [index, entry] of listed.entries()) {
      const read = agreementFrom(entry);
      if ("agreement" in read) {
        agreements.push({ agreement: read.agreement, file: path });
      } else {
        problems.push({
          kind: "file_not_understood",
          file: path,
          detail: `agreements[${index}]: ${read.missing}.`,
        });
      }
    }
  }

  return { agreements, problems };
}

/** Where a project keeps its agreements. */
export { agreementsDirectory };
