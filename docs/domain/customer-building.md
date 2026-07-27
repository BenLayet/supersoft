# Building by the customer

Some customers want to change their application themselves, and some of them should. A customer who can add a field at the moment they realise they need it stays engaged in a way no meeting achieves.

The whole difficulty is letting them do it without losing the one thing that makes the project maintainable.

## The rule that contains everything

**A customer changes the [specification](specification.md), never the application.**

Not a screen, not a rule, not a piece of wording, not a setting hidden somewhere. The specification is the only surface a customer edits, and the application follows from it.

This is what keeps the project from splitting in two. The alternative — a customer editing the application directly while the specification describes something else — produces a system nobody can maintain and nobody can hand over, which is the ordinary end state of tools that let non-developers build software.

## Levels

A participant holds one level on a project:

- **reader** — sees the specification and the [prototypes](prototype.md);
- **commenter** — leaves [remarks](conversation.md) and questions, and gives agreement if they are the customer;
- **editor** — changes wording, the [brand](brand.md), and [stories](stories.md);
- **builder** — adds to the domain itself: a new field on an existing concept, a new state, a new screen assembled from [patterns](shared-patterns.md) already in the project.

Levels are granted by the customer, not by the maker. Someone who commissions an application decides who in their organisation may shape it.

## What always needs the maker

Whatever their level, a customer does not decide alone on:

- a rule with consequences they cannot see — anything about **money**, **personal data**, or **who is allowed to see what**;
- a connection to anything outside the application;
- anything already in **real use** by real people, until a maker has reviewed it.

**Rule.** These three are not a matter of skill or trust. They are where a mistake is expensive, irreversible, or someone else's harm.

## Proposals

A change made by a customer becomes a **proposal**.

- It changes the **prototype immediately**, so its author sees what they meant and can judge it.
- It does **not** reach real use until a maker has reviewed it.
- The maker accepts it, or refuses it with a stated reason, in the [conversation](conversation.md) — never silently.

This is the honest version of the promise. The customer really does build: they see their idea running, in their own application, within moments. What they do not do is put it in front of real people unreviewed.

**Rule.** Nothing a customer does can break the application that real people are using.
