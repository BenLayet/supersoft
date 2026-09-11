# 0006 — A revision is the hash of the statement's text, normalised for whitespace only

**Status**: accepted (2026-09)

## Context

[ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md) point 4 decided that the [revision](../domain/specification.md) of a statement is the hash of its own normalised text, computed rather than written down. It left the normalisation rule open, and named it as deserving its own decision. Nothing can compute a revision — so nothing can tell whether an [agreement](../domain/conversation.md) still holds — until it is settled.

The forces at play:

- **A revision must change when the rule changes, and at no other time.** Every agreement in the product rests on that sentence. An edit that changes nothing anyone reads must not drop an agreement; an edit that changes what the rule says must drop it.
- **A false negative is cheap, a false positive is a lie.** A revision that changes when it did not need to costs one act of re-agreement. A revision that stays the same while the words changed means the product displays "agreed" over a sentence the customer never read. When in doubt, change the revision.
- **The domain must not know the format.** By [ADR 0003](0003-hexagonal-monorepo-pure-domain.md) the domain imports nothing and knows nothing of documents, Markdown or files. A normalisation rule that has to recognise emphasis, list markers or comments is not implementable there.
- **Files move between editors.** Re-wrapping a paragraph, trailing whitespace stripped on save, an editor rewriting accented characters in a different Unicode form: all of these change the bytes of a document without changing a word of it.
- **It has to be reimplementable by hand.** By the standing rule, a project outlives Supersoft. Someone holding only the repository must be able to recompute a revision from the file with ordinary tools, or the agreements become unverifiable folklore.
- **A revision is read by people.** It is written into agreement files, next to a name and a date.

## Decision

1. **Normalisation is three rules over plain text, and nothing more**: put the text in Unicode normal form NFC, replace every run of whitespace (spaces, tabs, newlines) with a single space, and trim the ends.

2. **Everything else in the text is significant.** Case, punctuation, wording, and any markup still present. There is no list of edits deemed cosmetic.

3. **The domain normalises; it does not know what it is normalising.** The function takes a sentence and returns a sentence. Removing what belongs to the document rather than to the statement — the list marker, the identifier comment, the inline state marker written in the project's own language — happens before, in the adapter that reads the document, which is the only thing allowed to know the format.

4. **The revision is `sha256:` followed by the first 16 hexadecimal characters** of the SHA-256 of the normalised text in UTF-8. The algorithm is named in the value so that a future change of algorithm is legible in files written years apart, and readable next to a name and a date.

5. **Hashing is not a port.** The domain never computes a revision — it compares them ([ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md) point 4) — so nothing in the domain needs a hash function, and there is no adapter to keep honest on both sides. The code that reads a specification from files computes the revision as it reads.

## Consequences

Easier:

- Re-wrapping a rule over two lines, stripping trailing spaces, indenting a list differently, or an editor rewriting accents: no revision change, no agreement lost. These are the edits that happen to a file without anyone deciding anything.
- The rule fits in one sentence, so a person with the repository and no tooling can recompute a revision and check an agreement themselves.
- The domain keeps knowing nothing about documents.

Harder / accepted costs:

- **Markup counts.** Bolding a term inside a rule, or putting a word in backticks, changes the revision although nobody reads the rule differently. Accepted: the alternative teaches the domain what emphasis is, and costs more than the re-agreement it saves.
- **A typo correction drops the agreement**, as [ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md) already accepted. This decision does not soften it, and the interface owes the customer a cheap way to agree again.
- **16 hexadecimal characters is a truncation**, chosen for legibility. Collisions only matter between versions of one statement, since an agreement names a statement as well as a revision, and 64 bits is far past what that needs.
- **The reader is trusted with a preparation step.** What it strips before hashing is part of the definition of a revision in practice, and it is not visible in the domain.

## Notes

If we ever decide that bolding a term should not drop an agreement, that decision belongs to the reader — it would strip markup before handing the sentence over — and not to the domain, whose rule stays the three above.

Left open by [ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md) and still open: whether a statement can be split or merged without losing its history.
