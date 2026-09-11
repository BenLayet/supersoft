/**
 * Minting an identifier for a rule that has none.
 * See docs/decisions/0008-how-an-identifier-is-minted.md.
 *
 * An identifier is `<slug>-r<number>`, the slug read from the document's
 * basename so that a person meeting it in a file can guess what it names.
 * The number is above every number ever seen with that slug — in prose, in
 * sidecars and in agreements — because a number handed out twice is what
 * would attach an existing agreement to a rule nobody agreed to.
 */
import type { StatementId } from "@supersoft/domain";

/** A document whose basename holds nothing to fold gets this instead. */
const fallbackSlug = "statement";

const minted = /^(.+)-r(\d+)$/;

export function slugFor(documentPath: string): string {
  const basename = documentPath.slice(documentPath.lastIndexOf("/") + 1).replace(/\.md$/i, "");
  const folded = basename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return folded === "" ? fallbackSlug : folded;
}

/**
 * The next identifier for this document. `used` holds every identifier the
 * project has ever mentioned, so a deleted rule never gives its number back.
 */
export function nextIdentifier(slug: string, used: ReadonlySet<StatementId>): StatementId {
  let highest = 0;
  for (const identifier of used) {
    const match = identifier.match(minted);
    if (match?.[1] === slug) {
      highest = Math.max(highest, Number(match[2]));
    }
  }
  return `${slug}-r${highest + 1}`;
}
