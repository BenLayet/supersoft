# The solution

The **solution** is what the application does about the [business](business.md). It is described as features and delivered as versions — never as anything else: a solution that cannot be told as things people do is not understood yet.

## Features

A **feature** is one thing the application offers, named in a way the customer would use in a sentence: the video library, registering for an event.

**Rule.** A feature with no story describes nothing. It is an intention until someone can say who wants what, and why.

A feature is **in progress** as soon as one of its stories is, and **done** when all of them are.

## Stories

A **story** describes one thing a person wants to do, and why:

> As a *member*, I want to *watch a guided meditation from my phone*, so that *I can practise wherever I am*.

The reason is the part most often dropped and the part that matters most: it lets a maker propose something better than what was asked, and it lets everyone notice later when a story no longer serves anything.

Stories use the words of the [lexicon](business.md). A story that introduces a new concept is not a story yet — the concept is defined first.

**Rule.** Every story belongs to exactly one feature.

Each story carries two sizes: its **business value**, what it is worth to the business, and its **effort**, what it costs to build. A size is one of **XXS, XS, S, M, L, XL**, and stands for a number so that the two can be weighed against each other: 1, 2, 3, 5, 8, 13. The gaps widen on purpose — the larger something is, the less precisely it is known.

**Rule.** Business value is set by the customer. Effort is stated by the maker, before the value is chosen.

A story is **to do**, then **in progress**, then **done**. It is done when the customer could see it working, not when the code exists.

A story can be **blocked by** other stories: it needs what they bring before it can be done. It stays blocked until every one of them is done.

**Rule.** What comes next is the story still to do, and blocked by nothing, that brings the most value for its effort; between two that bring as much, the one worth more. A project always knows what it is doing next, and it is one thing.

## Prototypes

A **prototype** is the application as the customer and the people who will use it can try it, before it is real. Making it is a shared work: they try it, say what is smooth and what is not, and it changes while that is still cheap.

**Rule.** Every prototype belongs to exactly one feature: it lets people try what that feature's stories ask for.

**Rule.** A prototype applies the rules of the [business](business.md); it never holds one of its own. Trying it refines the rules, and the rules refine it: a rule found while trying a prototype is written in the description before the prototype uses it.

A prototype is **being tried** until the customer **validates** it. Like any agreement, validation is an act, by the customer, on a date.

Once it is right, a prototype is refined into realistic **mock-ups**. That is already a first version of the application: a **demonstration**, connected to nothing outside it.

**Rule.** A demonstration depends on nothing outside itself. It can be shown at any moment, by anyone, with no consequence.

## Versions

A **version** gathers stories that are finished, so that they can be put in front of real people together.

**Rule.** Only a validated demonstration is connected to the outside world — where information is kept, how messages are sent — to become a version real people use.

**Rule.** A version contains only done stories. Work in progress waits for the next one.

**Rule.** A story that has gone out names the version that carried it. Asking when something reached real people is asking about a story, not about a log.

**Rule.** Once a version is in real use, a change still starts as a change to the [business](business.md). Every new feature, and every new part of the business, goes through the same steps — lexicon, rules, prototype, mock-ups, then a version. The order is the same on day one and in year five.
