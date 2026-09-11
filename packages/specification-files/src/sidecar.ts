/**
 * The sidecar of a document: what a statement has to say for itself beyond
 * its own words. See ADR 0004 point 5.
 *
 * It is optional and records only what departs from the default. No sidecar
 * at all means every statement is proposed, none is withdrawn and no state
 * has been recorded — which is exactly what a freshly hand-written
 * specification is.
 *
 *     statements:
 *       adhesions-r2:
 *         state: to_confirm
 *       adhesions-r7:
 *         state: withdrawn
 *         withdrawalReason: The association stopped taking bookings by phone.
 */
import type { ProjectFiles, RecordedState, StatementId } from "@supersoft/domain";
import { parse } from "yaml";
import type { SpecificationProblem } from "./problems";

/**
 * What one statement has to say for itself. A withdrawal carries its reason
 * in the type, so the reader cannot produce a withdrawal without one.
 */
export type SidecarEntry =
  | { readonly state?: Exclude<RecordedState, "withdrawn"> }
  | { readonly state: "withdrawn"; readonly withdrawalReason: string };

export interface Sidecar {
  readonly path: string;
  readonly entries: ReadonlyMap<StatementId, SidecarEntry>;
  readonly problems: readonly SpecificationProblem[];
}

const recordedStates: readonly RecordedState[] = [
  "proposed",
  "to_confirm",
  "questioned",
  "withdrawn",
];

function isRecordedState(value: unknown): value is RecordedState {
  return typeof value === "string" && (recordedStates as readonly string[]).includes(value);
}

/** Beside the document, same basename: `adhesions.md` and `adhesions.spec.yaml`. */
export function sidecarPathFor(documentPath: string): string {
  return documentPath.replace(/\.md$/, "") + ".spec.yaml";
}

export async function readSidecar(files: ProjectFiles, documentPath: string): Promise<Sidecar> {
  const path = sidecarPathFor(documentPath);
  const entries = new Map<StatementId, SidecarEntry>();
  const problems: SpecificationProblem[] = [];

  const text = await files.read(path);
  if (text === undefined) return { path, entries, problems };

  let written: unknown;
  try {
    written = parse(text);
  } catch (error) {
    problems.push({ kind: "file_not_understood", file: path, detail: (error as Error).message });
    return { path, entries, problems };
  }

  const statements = (written as { statements?: unknown } | null)?.statements;
  if (statements === undefined || statements === null) return { path, entries, problems };
  if (typeof statements !== "object" || Array.isArray(statements)) {
    problems.push({
      kind: "file_not_understood",
      file: path,
      detail: "statements: should hold one entry per statement, keyed by identifier.",
    });
    return { path, entries, problems };
  }

  for (const [statementId, entry] of Object.entries(statements as Record<string, unknown>)) {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      problems.push({
        kind: "file_not_understood",
        file: path,
        detail: `${statementId}: should hold what this statement has to say for itself, such as its state.`,
      });
      continue;
    }
    const { state, withdrawalReason } = entry as Record<string, unknown>;
    const reason = typeof withdrawalReason === "string" && withdrawalReason.trim() !== ""
      ? withdrawalReason.trim()
      : undefined;

    if (state === undefined || state === null) {
      // A reason with no withdrawal says nothing: the statement is proposed.
      entries.set(statementId, {});
      continue;
    }
    if (!isRecordedState(state)) {
      problems.push({
        kind: "state_not_recognised",
        statementId,
        sidecar: path,
        state: String(state),
      });
      continue;
    }
    // A statement is withdrawn with its reason or not at all: the reason is
    // often re-discovered later, and is the point of keeping it.
    if (state === "withdrawn") {
      if (reason === undefined) {
        problems.push({ kind: "withdrawal_without_reason", statementId, sidecar: path });
        continue;
      }
      entries.set(statementId, { state, withdrawalReason: reason });
      continue;
    }
    entries.set(statementId, { state });
  }

  return { path, entries, problems };
}
