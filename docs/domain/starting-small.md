# How much of this a project needs

Everything described in these documents is what a project can use, not what a project must use. A specification with states nobody set, agreements nobody gave and open points nobody counted is a perfectly good specification. Most projects should start there and never leave.

This document exists because a method that is only correct at its full weight is a method people abandon on the second project.

## The smallest useful thing

Two people, one of whom wants an application and one of whom can build it. They write down what it is for, in the words of the person who wants it. A [prototype](prototype.md) follows from what they wrote, and they look at it together.

That is a whole project. Nothing above is optional to *that*: there is a [specification](specification.md), it is in the customer's words, the prototype is a consequence of it. The rest of these documents is not yet needed and should not yet appear.

## Formality is earned

Each piece of formality answers a problem. Until a project has that problem, the piece is cost with no return, and the honest thing is to leave it out.

- **States on statements** — worth it when the specification is large enough that nobody can hold in their head which parts are settled. Below that, everyone knows.
- **Recorded agreement** — worth it the first time someone says "I never asked for that", and from then on forever. Two people who have never disagreed do not need it; two people who have disagreed once need it permanently.
- **Counted open points** — worth it when the list of things nobody has decided is longer than anyone can recite. A project that can recite its unknowns is already counting them.
- **Review before real use** — worth it the moment real people arrive. Not before.
- **Written change requests** — worth it when a remark has been misunderstood twice.
- **[Shared patterns](shared-patterns.md)** — worth it on the second project with the same need, never on the first.

**Rule.** A project is never told it is doing this wrong because it uses less than all of it. The measure of a project is whether the specification is true, not how much apparatus surrounds it.

## What is never optional

Four things hold whatever the size of the project, because each one prevents a specific harm rather than organising work:

- **The specification is the source of truth**, and the application is a consequence of it. Drop this and there is no method left.
- **Nothing is agreed by silence.** A project with no recorded agreements at all is fine; a project that treats absence of objection as approval is not.
- **A remark is never silently dropped.** It changes the specification, it is refused with a stated reason, or it stays visible as an [open point](conversation.md).
- **Money, personal data, access rights, anything already in real use, anything that cannot be undone** — decided by more than one person, whoever is asking. See [what needs care](projects.md).

These four are what the product is for. Everything else is what the product offers.

## Growing, and shrinking

Formality arrives when it is needed, and a project that has grown some can put it down again when the reason goes away. A project that once needed recorded agreement because two people kept misremembering, and now has one person doing everything, can stop.

Nothing in a project has to be migrated, converted or declared to move between these weights. A specification with no states written on it and a specification with states on every statement are the same kind of thing, and the same project passes between them without announcing it.
