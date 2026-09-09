# 0004 — Stable identifiers in the prose, everything else in a sidecar

**Status**: accepted (2026-09)

## Context

[ADR 0001](0001-specification-lives-in-the-project-repository.md) settled that a specification is files in the project's repository, that prose is primary, and that machine-readable structure rides along in front matter and sidecar files. It did not say what that structure is, and nothing can read a real specification until it does.

An existing project, written entirely by hand with no tooling, shows what the prose already looks like. Six of its seven domain documents share the same shape: a vocabulary section defining terms, a needs section in ordinary paragraphs, a **numbered list of rules**, and a section of open questions. States are written inline in the customer's own language — one rule ends "*— to confirm (maximum duration?)*". The structure is already there; nobody designed it, and no customer had to be taught it.

That is the encouraging half. The forces that make this hard:

- **A statement must keep its identity when its words change.** The whole [agreement](../domain/conversation.md) model rests on it: an agreement covers one version of a named statement, and a rewritten statement must be recognisable as *the same rule, now different* rather than as a new rule. No parser can infer that from text alone — the question "is this the old rule reworded, or a new rule?" has no answer in the file.
- **Position is not identity.** Rules are a numbered list. Insert a rule at position 2 and everything below renumbers. If identity is position, one insertion invalidates every agreement below it, silently. This is the failure mode that would make the product untrustworthy fastest.
- **The prose belongs to the customer.** [ADR 0002](0002-customer-edits-the-specification-never-the-code.md) makes it their editing surface. Anything we write into it, they can move, break or delete.
- **The project must survive us.** By [ADR 0001](0001-specification-lives-in-the-project-repository.md) point 5, a project is fully usable with an editor and git and no portal at all, and by the standing rule, no part of a project may depend on Supersoft continuing to exist.
- **A statement's state is not the business.** `docs/domain/` changes only when the business changes. A rule moving from proposed to questioned is not the business changing, and must not churn the document.

## Decision

1. **The prose stays Markdown, and stays what it already is.** Conventional sections, a numbered list of rules, definitions for terms. No schema is imposed on how a project writes its business down. Which sections carry statements is declared once per project, because the section headings are in the project's own language.

2. **A statement is one item of a rules list; a term is one definition in a vocabulary section.** These are the addressable elements. Paragraphs of context around them are read by people and are not addressed.

3. **Each statement carries a stable identifier, written in the prose**, as a Markdown comment immediately after it:

   ```markdown
   2. A member in payment dunning keeps every access. <!-- @adhesions-r2 -->
   ```

   It is invisible when rendered, so the customer never sees it in the portal. It is assigned once, never reused, and never renumbered: it survives insertion, reordering, and any rewrite of the sentence it names.

4. **The revision of a statement is the hash of its own normalised text**, computed, never written down. A statement changes revision when its own words change, and at no other time — not when a neighbouring rule is edited, not when the file is reformatted, not when history is rewritten. This is what `Revision` is in the domain, which never inspects it and only compares it.

5. **Everything else lives in a sidecar** beside the document, same basename: `adhesions.md` and `adhesions.spec.yaml`. Recorded state, the reason a statement was withdrawn, who must answer a question, whatever a generator needs. Keyed by identifier, so the sidecar never dictates order and never duplicates the prose.

   **The sidecar is optional, and records only what departs from the default.** No sidecar at all means every statement is proposed, none is withdrawn and no question is recorded — which is exactly what a freshly hand-written specification is. An entry appears the day a statement has something to say for itself. A file that only ever repeats the defaults grows with every rule, drifts, and never tells anyone anything.

6. **Agreements are their own files**, under `docs/agreements/`, append-only, each naming a statement, a revision, a customer and a date. They are business events rather than edits, and they are written by a different person than the one who writes the prose.

7. **YAML** for front matter and sidecars, because a person must be able to read and repair them with an editor. Parsing is an adapter's job; the domain receives values already parsed.

8. **Validation is a build step**, alongside the tests: identifiers unique and present, every sidecar entry naming a statement that exists, every agreement naming a statement that exists. The reverse is not required — a statement with no entry is simply proposed. A specification that does not validate fails the build, exactly as a failing test does.

## Consequences

Easier:

- An agreement survives every edit that is not an edit to the statement it covers. Inserting a rule at the top of a list invalidates nothing.
- Identity is a fact stored in the file, in plain sight, in a standard format. Another developer reading the repository years later, with no access to Supersoft and no idea what it was, can see that a rule has a name and that something elsewhere refers to it. No algorithm has to be reimplemented to recover it.
- The business documents stop churning: a statement changing state touches the sidecar, not the prose.
- The prose of an existing hand-written specification is already close enough to be adopted by adding identifiers to it, with no rewriting.

Harder / accepted costs:

- **The prose is no longer entirely the customer's.** It carries tokens that are not for them. They are invisible when rendered, but a maker editing raw Markdown sees them, and a customer editing raw Markdown can delete one. Validation catches it; the identifier is then genuinely lost and the agreements naming it have to be re-established. This is the ugliest consequence of this decision, and it is accepted because every alternative was worse.
- **A second file per document once one is needed**, which must be edited with the first and can disagree with it between commits.
- **A sidecar entry deleted by accident is silent.** The statement falls back to proposed rather than failing validation, since absence is legitimate. Accepted: a lost state is re-recorded in a moment, where a lost identifier costs agreements.
- **Hashing is literal.** Correcting a typo produces a new revision and drops the agreement, exactly as [decided](../domain/conversation.md). The interface has to make re-agreeing cheap; the format will not soften it.
- **Assigning identifiers is a write to the customer's document**, so the tooling edits prose it does not own. It may only ever add a comment, never touch a word.

## Notes

Two alternatives were rejected.

**Identity in the sidecar, anchored to the prose by matching text and position.** It keeps the prose pristine, which is genuinely attractive. It fails on abandonment: recovering which rule is which then requires a re-anchoring algorithm that only Supersoft implements, so a project's own files stop being self-explanatory the moment the tool is gone. It also has no answer when a commit both inserts a rule and rewords another.

**Identity by position** — cheapest, and wrong for the reason given above.

Inline state markers written in the customer's own language, as an existing project writes them, stay perfectly good prose. They are simply not the machine-readable source: the tooling reads them once, when a specification is first taken in hand, and records what it found in the sidecar.

Left open, and each deserving its own ADR: the normalisation rule for hashing, whether a statement can be split or merged without losing its history, and what the sidecar owes a generator — none of which can be settled before a generator exists.
