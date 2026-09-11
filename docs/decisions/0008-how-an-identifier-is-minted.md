# 0008 — How an identifier is minted, and the only edit the tooling makes to prose

**Status**: accepted (2026-09)

## Context

[ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md) point 3 decided that each statement carries a stable identifier written in the prose, assigned once, never reused and never renumbered. It also named the write as its ugliest consequence: **assigning identifiers is a write to the customer's document**, so the tooling edits prose it does not own, and it may only ever add a comment, never touch a word.

What it did not say is what an identifier looks like, where the next one comes from, and what "may only ever add a comment" means precisely enough to be tested. A reader that is wrong can be fixed and run again; an identifier is written into a customer's file and named by [agreements](../domain/conversation.md) from then on. A bad one is permanent.

The forces at play:

- **It has to be legible to someone who never heard of Supersoft.** The whole abandonment argument of [ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md) rests on a developer years later seeing `<!-- @adhesions-r2 -->` and understanding that this rule has a name and that something elsewhere refers to it.
- **Never reused means never, including for rules that are gone.** A number handed out twice is the one failure that can attach an existing agreement to a rule nobody ever agreed to. So the next number cannot come from counting what the prose holds today: a rule can be deleted, and its identifier still be named by a sidecar entry or an agreement.
- **Position is not identity.** The number cannot be the position in the list, except by coincidence the first time a document is assigned.
- **Documents get renamed, split and merged.** Identity must not move when a file does.
- **The prose belongs to the customer** ([ADR 0002](0002-customer-edits-the-specification-never-the-code.md)), and they can read the diff. The write has to be provably minimal, not approximately minimal.
- **Identifiers travel.** They are YAML keys in sidecars and in agreement files, and they are read aloud in conversations. ASCII, no spaces.

## Decision

1. **An identifier is `<slug>-r<number>`.** The slug comes from the document's basename, folded to ASCII, lowercased, with every run of other characters becoming a single `-`: `adhésions.md` gives `adhesions`, `calendrier-inscriptions.md` gives `calendrier-inscriptions`. The number is a decimal counted from 1.

2. **The next number is above every number ever seen with that slug** — in the prose of any document, in any sidecar, and in any agreement file. A deleted rule does not give its number back. This is why assigning is a write that requires a full read of the project first.

3. **An identifier already written in the prose is never touched, whatever its shape.** A maker who assigned `dunning-keeps-access` by hand wrote a valid identifier; this decision governs minting, not what counts as an identifier.

4. **A renamed document keeps its statements' identifiers**, and new rules in it are minted with the new slug. One document may then carry several prefixes, and that is correct: the slug is a readability aid for people, never a fact the tooling reads. Identity is the whole identifier, and nothing anywhere may take it apart.

5. **The only edit ever made to a document is the insertion of ` <!-- @… -->` after the last non-whitespace character of the line that ends a statement.** Never a word, never a reflow, never a renumbering, never a deletion, and never a line the tooling did not have to name. The property is exact and testable: **remove the inserted comments and the file is byte for byte what it was**, its line endings, its trailing spaces and its final newline included.

6. **A document where nothing was assigned is not written to.** Assignment produces the smallest possible diff, or no diff at all.

## Consequences

Easier:

- An identifier can be guessed, read aloud, and assigned by hand by a maker who would rather type it than run anything.
- A number is never handed out twice, so an agreement can never end up attached to a rule that is not the one it was given on — including when a rule is deleted and a new one takes its place in the list.
- Taking an existing hand-written specification in hand is one pass over its documents, adding one invisible comment per rule and changing nothing else. A customer reading that diff sees their own words untouched.
- The minimal-write property is a test rather than a promise, so the rule cannot rot quietly.

Harder / accepted costs:

- **Prefixes drift from filenames.** After a rename, a document holds identifiers with two prefixes and the slug no longer describes the file. Accepted: the alternative is rewriting identifiers, which is the one thing that must never happen.
- **Two documents can fold to the same slug** (`adhésions.md` and `adhesions.md`). Harmless, since numbers are counted per slug across the whole project, but the prefix then says less than it appears to.
- **A basename in a non-Latin script folds to nothing**, and its rules get the fallback slug `statement`. That is uninformative, and it deserves a better answer the day a project writes its filenames that way.
- **A write needs a full read first**, agreements and sidecars included, to know which numbers are spent. Assigning identifiers is therefore never a cheap local edit.

## Notes

Recording an agreement is also a write to a project's files, and is not this decision: it appends a file of its own and touches no prose.

Splitting or merging a statement — where the identifiers go when one rule becomes two — is still open, as [ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md) left it.
