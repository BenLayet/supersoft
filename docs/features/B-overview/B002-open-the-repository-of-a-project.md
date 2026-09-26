# Open the repository of a project

**As a** maker, **I want** to open a project's repository from its overview, **so that** I reach its files, its code and its history in one click.

- Business Value: M
- Effort: XS
- State: done
- Blocked by: A001

## Path

The overview names where the project is kept its **repository**, not its address: the address is what the maker types, the repository is what they reach. The repository gets its entry in the glossary before its name changes in the code.

When the address is an `https://` address, the repository is a link to it, opened in a new tab. Any other address, such as a path on the maker's machine, is shown as text: there is nothing a browser can open.

## Before the story

The overview shows the address where the project is kept, as text, under "Address".

## After the story

The overview shows the project's repository, under "Repository". The maker opens it in a new tab when it is online.

## Tests

- Opening this repository shows "Repository", with a link to its address, opened in a new tab.
- A project opened from a path on the maker's machine shows its path, with no link.
- An address that does not start with `https://` never becomes a link.
