# General presentation — key points

> Start from a business need and arrive, step by step, at a solution that fits the business precisely: **easy to use, and easy to evolve.**

[Video](presentation.mp4) · [Transcript in French](general%20presentation%20transcript%20-%20French.txt) · [Transcript in English](general%20presentation%20transcript%20-%20English.txt)

## 1. Understand the business

- **Understand the user's domain** before anything else.
- **Write a scope document.** Very short, broad, deliberately vague. It hardly changes over the life of the application.
- **Define the features from a vision**, by understanding each of the user's domains. 
  - Example: for a non-profit, membership, events and registrations...

## 2. Describe a feature precisely

- **A reference lexicon.** Each domain is described with absolutely precise words. The same words are used in the code and in every description, so developers know exactly what each term means.
- **Business rules.** Unambiguous, and written in those same terms. They become the core of the application: precise, testable code, with no interface yet, or any external system.
    - Example: only members can register to events

## 3. Prototype with the people who will use it

- **Prototype the interfaces** with the customer and the users. It is a co-creation: test what feels smooth and what works.
- **The prototypes use the business rules**, which are easy to develop and to understand.
  - the prototype can help refine the rules, and the rules can help refine the prototype.
- **Refine into realistic mock-ups.** This is already a first version: a demonstration application, disconnected from any external system.

## 4. Go to production

- Once everything is validated, **connect the interface** to a database, an email system and so on, and the tool runs in production.

## 5. Keep going, the same way

- **Each new feature or domain** goes through the same steps: lexicon, rules, prototypes, mock-ups, then a new version.

