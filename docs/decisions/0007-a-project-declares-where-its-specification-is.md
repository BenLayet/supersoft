# 0007 — A project declares where its specification is, in one optional file

**Status**: accepted (2026-09)

## Context

[ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md) point 1 decided that no schema is imposed on a project's prose, and that **which sections carry statements is declared once per project**, because the headings are in the project's own language. It did not say where that declaration lives or what it contains, and a reader cannot find a single statement without it.

The forces at play:

- **The headings belong to the project.** An existing specification has a rules section called `Règles` and a vocabulary section called `Vocabulaire`. Asking a project to rename its own headings so a tool can find them inverts the whole product, whose point is that the specification is written in the customer's words.
- **This is not business.** By the writing conventions of [`docs/domain/`](../domain/README.md), those documents mention no tool and change only when the business changes. Where a reader should look is not a fact about the business and cannot live there.
- **One place, not one per document.** A project renaming its rules section should say so once. Front matter in every document means the same sentence repeated in seven files, drifting.
- **A project must stay usable with nothing.** By [ADR 0001](0001-specification-lives-in-the-project-repository.md) point 5 and the standing rule that no part of a project may depend on Supersoft continuing to exist, this file must be inert: deleting it may cost a tool its bearings, never a project a business fact.
- **Most projects should not have to write it.** A specification started with the tooling in hand has English headings and needs no declaration at all; an existing one written by hand, in another language, needs three lines.

## Decision

1. **One file at the root of the project's repository, `supersoft.yaml`**, holding where to read and nothing else. It is the only file in a project's repository that carries a tool's name.

2. **It declares three things**: the directory holding the domain documents, the heading of the section whose list items are statements, and the heading of the section whose items define terms.

   ```yaml
   specification:
     documents: docs/domaine
     statements: Règles
     terms: Vocabulaire
   ```

3. **The file is optional, and so is every key in it.** What is missing takes the default: `docs/domain`, `Rules`, `Vocabulary`. A project with no such file is read, not refused.

4. **Headings are matched on their text**, trimmed and case-insensitively, at any heading level. A project's heading structure is its own, and a reader has no business requiring `##`.

5. **Every `.md` file directly in the declared directory is a document.** A document with no statements section simply carries no statements — an index or an overview is not an error and needs no exclusion list.

6. **Nothing else is configurable.** Sidecars sit beside their document and agreements live in `docs/agreements/`, both fixed by [ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md). One layout for the files the tooling itself writes, so that a maker reading an unfamiliar project already knows where they are.

## Consequences

Easier:

- An existing hand-written specification, in any language, becomes readable by adding a five-line file, with no rewriting and no renaming — which is the test [ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md) set itself.
- Nothing is added to the business documents, which keep changing only when the business changes.
- The declaration holds no business fact. It can be rewritten in a minute by opening the documents, so losing it loses nothing.

Harder / accepted costs:

- **One tool name enters the customer's repository.** Accepted, and kept to a single inert file that any developer can delete without consequence to the project.
- **One set of headings per project.** A project whose documents disagree with each other about what the rules section is called cannot be expressed. Accepted: a specification with two words for the same thing has a bigger problem than the reader.
- **Defaults are English**, so they serve a project started with the tooling and not one written by hand in another language. That project writes the file, which is precisely what it is for.
- **A heading renamed in the prose silently stops matching**, and the statements in it disappear from the reader's view rather than failing loudly. Validation ([ADR 0004](0004-structure-rides-in-the-prose-and-a-sidecar.md) point 8) is what turns that into a build failure, by noticing that identifiers and agreements now name statements nobody can find.

## Notes

Two alternatives were rejected. **Front matter in each document**, which duplicates the declaration per file and puts tooling keys in the customer's editing surface for something that is not about that document. **Convention with no declaration at all**, which works only for projects that write in English and would have made an existing specification unreadable without renaming its sections — the one thing this product must not ask.

What a generator eventually needs to be told about a project is not settled here. If it needs configuration, it gets its own key in this file and its own ADR.
