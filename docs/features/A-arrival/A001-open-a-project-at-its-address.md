# Open a project at its address

**As a** maker, **I want** to open a project at the address where it is kept, **so that** what I see is what its files say.

- Business Value: XL
- Effort: M
- State: to do

## Path
1. The maker opens the app, which shows an input box for the address of a project.
2. The maker adds a project, giving the address where it is kept.
3. Supersoft opens it, for now showing only the overview of the project, with only the address where it is kept.

## Before the story
No app exists yet.

## After the story
The app can be started locally, and a project can be opened from a directory.

## Tests

- Adding the address of this repository opens it.
- An address with no `README.md` cannot be added, and Supersoft says why.
- Nothing in the project can be changed from Supersoft yet: no button offers it.
