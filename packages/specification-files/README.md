# @supersoft/specification-files

Reading a project's specification from the files of its own repository. This
is the only code in Supersoft allowed to know the format.

```ts
const files = fileSystemProjectFiles("/path/to/the/project");
const { specification, agreements, origins, problems } = await readSpecification(files);
```

Nothing here throws on a project's own files. What cannot be read comes back
in `problems`, each with enough of a location that a person can open the file
and fix it — `describeProblem` turns one into a line for a build log.
Validation is a build step, exactly as the tests are
([ADR 0004](../../docs/decisions/0004-structure-rides-in-the-prose-and-a-sidecar.md) point 8).

## What it reads

**The prose** — every `.md` file directly in the declared directory. The items
of the rules section are the statements; the definitions of the vocabulary
section are the terms. The paragraphs around them are read by people and are
not addressed. Nothing is imposed on how a project writes: headings are
matched on their text, at any level, in the project's own language.

```markdown
## Règles

1. Un membre en relance de paiement garde tous ses accès. <!-- @adhesions-r2 -->
```

**The identifier in the prose** is the identity of the statement, and the only
structure that lives in the customer's document. It survives insertion,
reordering and any rewrite of the sentence it names.

**The revision** is computed, never written down: SHA-256 of the statement's
own text, normalised for whitespace only, first 16 hexadecimal characters
([ADR 0006](../../docs/decisions/0006-a-revision-is-the-hash-of-normalised-text.md)).
Re-wrapping a rule changes nothing; changing a word changes the revision, and
an agreement given on the old wording stops holding.

**The sidecar**, `adhesions.spec.yaml` beside `adhesions.md`, records only what
departs from the default. No sidecar means every statement is proposed, which
is exactly what a freshly hand-written specification is.

```yaml
statements:
  adhesions-r2:
    state: to_confirm
  adhesions-r7:
    state: withdrawn
    withdrawalReason: The association stopped taking bookings by phone.
```

`agreed` is not a state a sidecar can record: it follows from an agreement
covering the version now written.

**The agreements**, any number of files under `docs/agreements/`, unioned.

```yaml
agreements:
  - statementId: adhesions-r2
    revision: sha256:5f2b8c1d4e7a9031
    givenBy: marie
    on: 2026-09-01
```

**The declaration**, `supersoft.yaml` at the root of the project, optional,
saying where to look when a project does not write in English
([ADR 0007](../../docs/decisions/0007-a-project-declares-where-its-specification-is.md)).

```yaml
specification:
  documents: docs/domaine
  statements: Règles
  terms: Vocabulaire
```

## What it does not do yet

- **Writing.** Assigning an identifier to a rule that has none, and recording
  an agreement, are writes to a project's files. They need the write half of
  the port, and they come with the slice that needs them.
- **Identifiers on terms.** A term is an addressable element too
  ([ADR 0004](../../docs/decisions/0004-structure-rides-in-the-prose-and-a-sidecar.md)
  point 2), but what identifies one is not decided. Terms are read by name.
- **Remarks.** Where a remark lives is not decided: agreements are files by
  [ADR 0001](../../docs/decisions/0001-specification-lives-in-the-project-repository.md),
  remarks are not yet anything.
- **Inline state markers.** A rule ending "— **À confirmer** (durée maximale ?)"
  is perfectly good prose and is read as part of the statement. Turning what a
  project already wrote into recorded state is a one-off reading, for the day
  a specification is first taken in hand.
