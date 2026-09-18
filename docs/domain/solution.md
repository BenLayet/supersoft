# The solution

The **solution** is what the application does about the [domain](domain.md). It is described as features and delivered as versions — never as anything else: a solution that cannot be told as things people do is not understood yet.

## Features

A **feature** is one thing the application offers, named in a way the customer would use in a sentence: the video library, registering for an event.

**Rule.** A feature with no story describes nothing. It is an intention until someone can say who wants what, and why.

A feature is **in progress** as soon as one of its stories is, and **done** when all of them are.

## Stories

A **story** describes one thing a person wants to do, and why:

> As a *member*, I want to *watch a guided meditation from my phone*, so that *I can practise wherever I am*.

The reason is the part most often dropped and the part that matters most: it lets a maker propose something better than what was asked, and it lets everyone notice later when a story no longer serves anything.

Stories use the words of the [lexicon](domain.md). A story that introduces a new concept is not a story yet — the concept is defined first.

**Rule.** Every story belongs to exactly one feature.

Each story carries a priority — **essential** (the application has no purpose without it), **expected** (its absence would be felt as a defect), or **later** (wanted, and explicitly not now).

**Rule.** Priority is set by the customer. The maker's contribution is the cost, stated before the priority is chosen.

A story is **to do**, then **in progress**, then **done**. It is done when the customer could see it working, not when the code exists.

**Rule.** What comes next is the most important story still to do. A project always knows what it is doing next, and it is one thing.

## Prototypes

A **prototype** is the application as the customer and the people who will use it can try it, before it is real. Making it is a shared work: they try it, say what is smooth and what is not, and it changes while that is still cheap.

**Rule.** A prototype applies the rules of the [domain](domain.md); it never holds one of its own. Trying it refines the rules, and the rules refine it: a rule found while trying a prototype is written in the description before the prototype uses it.

Once it is right, a prototype is refined into realistic **mock-ups**. That is already a first version of the application: a **demonstration**, connected to nothing outside it.

**Rule.** A demonstration depends on nothing outside itself. It can be shown at any moment, by anyone, with no consequence.

## Versions

A **version** gathers stories that are finished, so that they can be put in front of real people together.

**Rule.** Only a validated demonstration is connected to the outside world — where information is kept, how messages are sent — to become a version real people use.

**Rule.** A version contains only done stories. Work in progress waits for the next one.

A version is **planned**, then **deploying**, then **in real use** — or it **failed**, which is a state like any other and is said out loud.

**Rule.** A project always knows which version real people are using. A version nobody can name is a version nobody can fix.

**Rule.** A story that has gone out names the version that carried it. Asking when something reached real people is asking about a story, not about a log.

**Rule.** Once a version is in real use, a change still starts as a change to the [domain](domain.md). Every new feature, and every new part of the business, goes through the same steps — lexicon, rules, prototype, mock-ups, then a version. The order is the same on day one and in year five.
