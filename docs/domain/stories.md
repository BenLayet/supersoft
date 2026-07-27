# Stories and journeys

## Story

A **story** describes one thing a person wants to do with the application, and why:

> As a *member*, I want to *find the course I started last week*, so that *I can carry on without searching*.

A story names a person, an intention, and a reason. The reason is the part that matters most and the part most often dropped: it is what lets a maker propose a better solution than the one the customer asked for, and what lets everyone notice, later, when a feature no longer serves any purpose.

Stories use the words of the domain, as defined in the [specification](specification.md). A story that introduces a new concept is not a story yet — the concept is defined in the domain first.

## Journey

A **journey** is an ordered set of stories that together complete something real for one person: joining, registering for an event, publishing a piece of content.

Journeys are how a specification is checked for holes. A complete list of stories that does not add up to a complete journey is the most common way to build an application that does everything except work.

## Acceptance

Each story states how we will know it is done, in terms a customer can check by using the application — what they will see, not what will exist inside it.

Acceptance is written when the story is written, not afterwards. A story whose acceptance cannot be written is not understood well enough to build.

## Priority

Each story carries one of:

- **essential** — the application has no purpose without it;
- **expected** — its absence would be felt as a defect;
- **later** — wanted, and explicitly not now.

**Rule.** Priority is set by the customer, not by the maker. The maker's contribution is the cost, and the cost is stated before the priority is chosen.

## The rules that matter

**Every story belongs to a named person**, one of the roles described in [projects and participants](projects.md) or in the domain. A story that no one in particular wants is a feature looking for a justification.

**A story is not a screen.** It says what someone wants to accomplish; how the application offers it is a design decision, discussed on the [prototype](prototype.md) where it can actually be seen.
