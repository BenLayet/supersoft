# Open a project at its address

**As a** maker, **I want** to open a project at the address where it is kept, **so that** what I see is what its files say.

- Business Value: XL
- Effort: M
- State: done

## Path
1. The maker opens the app, which shows an input box for the address of a project.
2. The maker adds a project, giving the address of its repository. For now, only a public repository can be opened.
3. Clarée opens it, for now showing only the overview of the project, with only the address where it is kept.

## Before the story
No app exists yet.

## After the story
The app can be started locally, and a project can be opened from the address of its repository, whether that repository is online or on the maker's machine.

## Tests

- Adding the address of this repository opens it.
- An address that cannot be read, because nothing is there or the repository is private, cannot be added, and Clarée says why.
- Nothing in the project can be changed from Clarée yet: no button offers it.
- It answers at Clarée's production address, deployed from `main`.
