# See the stories written in the files

**As a** maker, **I want** to see the features and stories written in the project's files, with their business value, effort and state, **so that** what comes next is decided by the files, not by Supersoft.

- Business Value: XL
- Effort: M
- State: to do

## Path

Every folder in `docs/features/` is a feature. Its folder starts with a letter, given in the order features were written and never changed: that letter identifies the feature. The title of its `README.md` is its name, its first paragraph what it is for.

Every other file in the folder is a story. Its file starts with the feature's letter and a number, given in the order the feature's stories were written and never changed or reused: `D002` is the story. The rest of the file name, and the title, can change freely.

## Before the story

A project opened from a directory shows its overview: its address, name and scope. Nothing of its features or stories.

## After the story

The project shows its features and their stories as written in `docs/features/`, with their business value, effort and state, and the story that comes next.

## Tests

- Opening this repository shows its five features and their stories; business and versions have none yet, and say so.
- Features are shown in the order of their letters; the letter is not part of their name, and says nothing about what comes next.
- A story whose title and file name change, and whose letter and number do not, is the same story.
- What comes next is the story still to do, and blocked by nothing, that brings the most value for its effort.
- A story with a line `- Blocked by: A001` is not what comes next until A001 is done; several stories are separated by commas.
- The sections a story has beyond its sentence and its lines (path, tests) stay in the file and are not shown yet.
