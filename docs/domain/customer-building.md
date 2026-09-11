# Building by the customer

Some customers want to change their application themselves, and some of them should. A customer who can add a field at the moment they realise they need it stays engaged in a way no meeting achieves.

The whole difficulty is letting them do it without losing the one thing that makes the project maintainable.

## The rule that contains everything

**A customer changes the [specification](specification.md), never the application.**

Not a screen, not a rule, not a piece of wording, not a setting hidden somewhere. The specification is the only surface a customer edits, and the application follows from it.

This is what keeps the project from splitting in two. The alternative — a customer editing the application directly while the specification describes something else — produces a system nobody can maintain and nobody can hand over, which is the ordinary end state of tools that let non-developers build software.

## No levels

A customer who wants to change something changes it. There is no ladder of permissions to climb, no level to be granted, and nobody has to ask to be allowed to fix a word.

This is deliberate. A product that decides in advance what each kind of person may touch is wrong about real projects in both directions at once: it stops a domain expert from correcting the sentence only they can write, and it lets someone with the right label change something they do not understand. The question that actually matters is never *who is this*, it is *what does this change reach* — see [what needs care](projects.md).

## What is decided by more than one person

Three kinds of change are never decided alone, whoever is asking:

- a rule with consequences the person cannot see — anything about **money**, **personal data**, or **who is allowed to see what**;
- a connection to anything outside the application;
- anything already in **real use** by real people.

**Rule.** These are not a matter of skill or trust, and holding any role does not lift them. They are where a mistake is expensive, irreversible, or someone else's harm.

## Proposals

A change made by a customer becomes a **proposal**.

- It changes the **prototype immediately**, so its author sees what they meant and can judge it.
- It does **not** reach real use until someone other than its author has looked at it.
- That person accepts it, or refuses it with a stated reason, in the [conversation](conversation.md) — never silently.

This is the honest version of the promise. The customer really does build: they see their idea running, in their own application, within moments. What they do not do is put it in front of real people unreviewed.

**Rule.** Nothing a customer does can break the application that real people are using.
