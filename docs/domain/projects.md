# Projects and participants

## Project

A **project** is one application built for one customer. It gathers, in one place and for its whole life: the [specification](specification.md), the [conversation](conversation.md) around it, the [prototypes](prototype.md) produced from it, and the application itself.

A project belongs to its customer. This is true from the first day, before anything is built, and it stays true if the maker changes or disappears — see [real use and handover](delivery.md).

## Participants

- The **customer** — the organisation or person who commissions the application and owns it. They decide what is wanted and give [agreement](conversation.md).
- The **maker** — the person who builds and maintains the application. They write the specification down, keep it honest, and are the only participant who changes the code.
- The **domain expert** — the person who knows how the business actually works and whose words the specification must use. Often someone inside the customer's organisation, and often not the person who signs.
- The **end user** — the person who will use the application. Not always present in the conversation; the [stories](stories.md) exist so that they are represented in it anyway.

One person may hold several roles. On a small project the customer, the domain expert and the end user are frequently the same person; naming the roles separately still matters, because the questions each one answers are different.

## Who may do what

- Anyone taking part may leave a **remark** on any part of the specification.
- Only the **customer** may give or withdraw [agreement](conversation.md).
- Only the **maker** changes the code, whatever a customer may change in the specification — see [building by the customer](customer-building.md).
- The **domain expert** is the authority on business vocabulary: when a term is disputed, their usage wins.

## The life of a project

A project moves through recognisable moments, but not in a straight line:

1. **Exploration** — the business is discovered and written down for the first time; most of the specification is uncertain.
2. **Agreement** — enough of the specification is agreed to be worth building against.
3. **Prototype** — a runnable application is shown, discussed, and changed; this is where most of the specification is actually corrected.
4. **Real use** — real people and real data arrive. The rules change; see [real use and handover](delivery.md).
5. **Maintenance** — the business evolves, the specification is kept true, the application follows.

Steps 2, 3 and 4 repeat for as long as the project lives. A project that has been in real use for years still goes back to the specification before it changes.

**Rule.** A project is never in a state where the running application and the specification disagree without that disagreement being written down as an [open point](conversation.md).
