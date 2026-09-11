/**
 * The revision of a statement: the hash of its own text, normalised.
 * See docs/decisions/0006-a-revision-is-the-hash-of-normalised-text.md.
 *
 * The domain normalises and compares; it never computes one, which is why
 * hashing lives here, in the code that reads the files, and is not a port.
 */
import { createHash } from "node:crypto";
import { normaliseStatementText, type Revision } from "@supersoft/domain";

/** Named in the value, so a change of algorithm is legible years later. */
const algorithm = "sha256";

/**
 * Sixteen hexadecimal characters: an agreement names a statement as well as
 * a revision, so collisions would have to happen between two versions of one
 * rule, and 64 bits is far past what that needs.
 */
const length = 16;

export function revisionOf(text: string): Revision {
  const hash = createHash(algorithm).update(normaliseStatementText(text), "utf8").digest("hex");
  return `${algorithm}:${hash.slice(0, length)}`;
}
