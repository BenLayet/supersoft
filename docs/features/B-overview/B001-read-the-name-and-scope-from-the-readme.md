# Read the name and scope from the README

**As a** maker, **I want** a project's name and scope to be the ones its `README.md` gives, **so that** the project says what it is for in its own words, in one place.

- Business Value: L
- Effort: XS
- State: to do
- Blocked by: A001

## Path

The name is the title of the `README.md`; the scope is the first paragraph under it. A project with no `README.md` is named by its address, and its scope is empty.

## Before the story

A project can be opened from the address of its repository. Its overview shows only the address where it is kept.

## After the story

The overview also shows the project's name and scope, read from its `README.md`.

## Tests

- Opening this repository shows a project named "Clarée", whose scope is the first paragraph of its README.
- Opening a repository with no `README.md` shows a project named by its address, with an empty scope.
