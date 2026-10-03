# The business

The **business** is what the application serves, described in the words of the people who know it. It has an informal side and a formal one, and the second is written from the first.

## The informal side

The business is met in **workshops**. A workshop is one working session, held on a **date**, with a **title** that says what it was about, and the **documents** that came out of it.

A **document** is one thing the workshop left behind: slides, a video, a recording, notes, a report, a transcript. Each says what kind it is and where it is kept, so that anyone reading the project can go back to it. A document can also be written directly in the project — notes, a report — and its **text** is then part of the project.

**Rule.** A workshop is dated. It is not a source of truth: it is what was said on one day. What was understood later is a later workshop, or it is written on the formal side, where the domain expert can contradict it.

**Rule.** A document can be added to a workshop after the day it was held — a report or a transcript often comes later — and it is always about that day.

**Rule.** Workshops are read by date, the most recent first.

## The formal side

A business is rarely one thing. Each part of it that has its own words is a **domain**: named as the people inside it would name it, described in a few sentences they would recognise, and owning its own lexicon, its own rules and its own open questions.

**Rule.** A domain is described in business terms only. What the application does about it is the [solution](solution.md), and it is written elsewhere. A description that cannot be read by someone who will never see the application has stopped describing the business.

**Rule.** Every term, every rule and every question belongs to exactly one domain — the part of the business that owns the word, even when the rest of the business uses it. A question that fits in no domain is a part of the business nobody has named yet.

A domain holds two things, both written by the maker and owned by the project owner.

The **lexicon**: every concept of the business, with one name and one definition, in the domain experts' own words. The same name is then used everywhere — in the description, in the stories, on the screens and in the code.

The **description**: what is true of the business, written as sentences a domain expert can confirm or deny. This is the project's main source of truth.

**Rule.** A rule not written in the description does not exist. It will not be built, and nobody is at fault when it is missing.

**Rule.** A rule says what the business requires, never what the application is made of.

**Rule.** The rules are the core of the application. Each one can be checked on its own — before any screen exists, and without anything outside the application — and the rest of the application only uses them.

**Rule.** A rule is **proposed** when it is written, and **agreed** once a domain expert has confirmed it. Rewriting an agreed rule makes it proposed again: agreement is given to a sentence, not to a subject.

A **question** is something the project knows it does not know about its domain. It is written down as soon as it appears and stays visible under that domain until it is answered.

**Rule.** The open questions of a domain are always countable. Building with open questions is normal; not knowing what they are is not.
