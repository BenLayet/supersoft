# 0005 — Authority is by consequence, never by role

**Status**: accepted (2026-09)

Refines [ADR 0002](0002-customer-edits-the-specification-never-the-code.md), point 3.

## Context

The business documents carried two theories of authority at once.

**By role.** Four roles — maker, customer, domain expert, end user — and four levels of participation on top of them: reader, commenter, editor, builder. "Only the maker changes the code." "Only the customer may give agreement."

**By consequence.** A short list of changes nobody decides alone, because a mistake there is expensive, irreversible, or someone else's harm: money, personal data, who is allowed to see what, anything already in real use.

The second was always the better one, and it was already written. The first had been added on top of it, and had begun to rot:

- Four roles against four levels is sixteen combinations, none of which any document explained, because there was nothing to explain.
- The two systems already deferred to each other in circles. The `commenter` level was defined as "leaves remarks, and gives agreement *if they are the customer*" — the level handing the only decision that matters back to the role, so it decided nothing.
- It is wrong about real projects in both directions at once. It stops a domain expert from correcting the one sentence only they can write, and it lets someone holding the right label change something they do not understand.
- It is wrong about the people this product exists for. In an organisation with no budget, the person who knows the business is very often the person doing the work, and a maker is the domain expert for the first months of every project. A caste system makes the ordinary case illegal.

Underneath all of it: a permission system is a guess, made in advance, by people who are not in the room, about who deserves to be trusted. The reason a change is dangerous has never been who is making it.

## Decision

1. **Roles describe, they never gate.** A role says what someone knows and what they are there for. Nothing in the domain refuses an action because of the role its author holds.

2. **Participation levels are removed**, entirely, with no replacement. There is no ladder to climb and nobody has to be granted anything to fix a word.

3. **Three kinds of change are decided by more than one person, whoever is asking**: money, personal data and access rights; anything real people are already using; anything that cannot be undone. These are the only constraint the product imposes, and no role lifts them.

4. **Agreement is a definition, not a permission.** Nobody is prevented from agreeing and no title is checked. An agreement records who gave it, and is worth what that person's word is worth. A maker approving their own sentence has recorded something true about themselves and nothing about the business.

5. **Everything else belongs to the people on the project.** Who may touch what, beyond point 3, is a question of skill and trust between them, and this product has no opinion about it.

## Consequences

Easier:

- One theory of authority instead of two, and it is the one that survives contact with a two-person project, a volunteer who can code, and a maker who is also the domain expert.
- Four terms and an entire permission system leave the vocabulary, and the domain loses a class of refusal it could not justify.
- The constraint that remains is the one people accept without argument, because it is about harm rather than about status.

Harder / accepted costs:

- **A project can record a worthless agreement**, given by someone with no standing to give it. Nothing stops it; the record says who, and reading that is a human judgement. Accepted: the alternative was a check that would have been wrong more often than this is.
- **Customers may expect a permissions screen**, because every comparable product has one, and its absence has to be explained rather than discovered.
- **Point 3 now carries the whole weight.** It was one safeguard among several and is now the only one, so getting its boundaries right matters more than it used to. What counts as "already in real use" and "cannot be undone" will need sharpening the first time a real project argues about it.

## Notes

The rejected middle path was keeping roles as gates and softening the wording. It would have left both theories in place, which is what produced the incoherence in the first place, and would have kept the product in the business of guessing who deserves to be trusted.

[ADR 0002](0002-customer-edits-the-specification-never-the-code.md) point 3 is superseded in its wording, not in its substance: reserved decisions still require more than one person. They no longer require *a maker*, and there is no longer a customer's level for them to override.
