# 0002 — The customer's editing surface is the specification, never the code

**Status**: accepted (2026-07)

## Context

Supersoft offers low-code and no-code building to customers. This is the part of the product most likely to destroy the rest of it.

The ordinary failure of no-code platforms is well known and worth stating plainly, because avoiding it is a structural decision rather than a matter of care:

- the customer edits the running application through a visual tool;
- the written specification, if there ever was one, stops describing reality within weeks;
- what the application does now exists only inside the platform's own storage, in a form no one can read, review or reason about;
- the project cannot be handed over, cannot be reviewed, and cannot be left — because leaving means losing the only remaining description of the system.

At that point the platform has become load-bearing, which [ADR 0001](0001-specification-lives-in-the-project-repository.md) forbids.

The forces at play:

- **Customers genuinely should be able to change things.** A customer who can act at the moment they realise what they need stays engaged, and their engagement is what the whole product is for.
- **There must remain exactly one source of truth.** Two editable surfaces means drift, and drift means no one can answer what the application does.
- **A change must be visible immediately** to be worth making. Feedback that arrives after a review cycle is not building.
- **Some changes are dangerous** in ways their author cannot see: money, personal data, and who may see what.

## Decision

1. **The specification is the only surface a customer edits.** There is no visual editor over the running application, no settings screen holding business rules, and no configuration that overrides what the specification says. A customer's change is a change to specification files ([ADR 0001](0001-specification-lives-in-the-project-repository.md)).

2. **A customer edit produces a proposal**: it regenerates that customer's prototype immediately, so its author sees their own idea running within moments, and it reaches real use only after a maker has reviewed it — accepted, or refused with a stated reason.

3. **Reserved decisions require more than one person**, whoever is asking: anything touching money, personal data, or access rights; any connection to an outside service. This is enforced by the system, not by convention.

4. **The generated application is code, in the repository, reviewable.** Generation produces readable source that a maker reads and may edit by hand; it is not an interpreted description executed by a runtime. A project must remain a normal codebase that any developer can pick up and continue **without Supersoft**.

5. **Hand edits are not overwritten.** Where generated and hand-written code meet is a boundary the generator respects; regeneration never silently discards a maker's work. The mechanism is a future ADR — the constraint is decided here.

## Consequences

Easier:

- One source of truth survives contact with customers editing their own application. The specification stays true by construction, not by discipline.
- Every change, including a customer's, arrives as a reviewable diff with an author and a reason.
- The customer's autonomy is real and immediate at the prototype, which is where their judgement is actually useful.
- A project remains an ordinary codebase, so it can be handed to any developer, and Supersoft can be abandoned without the project dying.

Harder / accepted costs:

- **The no-code editor is constrained.** It can only offer what can be expressed in the specification. Things that would be trivial to expose as an application-level setting are not exposed at all.
- **"Change it yourself and it is live" is not offered**, and competitors will offer it. This is a deliberate refusal, and it must be stated to customers plainly rather than discovered by them.
- **The generator becomes load-bearing**: specification quality determines application quality, and a specification the generator cannot express is a product gap rather than a customer error.
- **Regeneration alongside hand-written code is genuinely hard**, and this decision commits to solving it rather than avoiding it by making generated code untouchable.

## Notes

The commercially tempting version of this product lets customers edit the running application directly, because it demonstrates better. It also produces systems that cannot be handed over — which, for an organisation with no budget and no leverage, is the specific harm Supersoft exists to avoid. The refusal is the product.
