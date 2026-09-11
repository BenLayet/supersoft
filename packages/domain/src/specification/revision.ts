/**
 * How the text of a statement is reduced before it is hashed into a
 * Revision. See docs/decisions/0006-a-revision-is-the-hash-of-normalised-text.md.
 *
 * Three rules, and nothing more: Unicode normal form, whitespace runs to a
 * single space, ends trimmed. Everything else the text carries is
 * significant — a revision that stays the same while the words changed
 * would display "agreed" over a sentence the customer never read.
 *
 * This function knows nothing of documents, lists, emphasis or comments: it
 * takes a sentence and returns a sentence. Whatever belongs to the document
 * rather than to the statement is removed before it gets here, by whatever
 * read the document.
 */
export function normaliseStatementText(text: string): string {
  return text.normalize("NFC").replace(/\s+/gu, " ").trim();
}

/** Do these two texts say the same thing, to the letter? */
export function isSameStatementText(one: string, other: string): boolean {
  return normaliseStatementText(one) === normaliseStatementText(other);
}
