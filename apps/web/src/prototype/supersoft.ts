import type { Project } from '@supersoft/domain'

/**
 * Supersoft described in its own terms — the project it is built to serve
 * first. Everything here is taken from `docs/domain/`, which is the same
 * business said in prose.
 */
export const supersoft: Project = {
  id: 'supersoft',
  name: 'Supersoft',
  participants: [
    { name: 'Makers building for their own customers', role: 'customer' },
    { name: 'Ben Layet', role: 'maker' },
  ],
  domain: {
    sources: [
      {
        id: 'M1',
        kind: 'note',
        title: 'The first months specified a product nobody had ever run',
        from: 'Ben Layet',
      },
      {
        id: 'M2',
        kind: 'note',
        title: 'An application built with this method before any tooling existed',
        from: 'Ben Layet',
      },
      {
        id: 'M3',
        kind: 'video',
        title: 'Why a non-profit’s software is hard to use, and hard to change',
        from: 'Ben Layet',
        location: '/discovery/20260916%20general%20presentation/presentation.mp4',
      },
    ],
    questions: [
      {
        id: 'Q1',
        asked: 'What does a project keep when it stops using Supersoft?',
        answer: 'Everything. The domain and the solution are the customer’s files, readable without it.',
      },
      { id: 'Q2', asked: 'Who writes the domain when the customer will not write prose?' },
      { id: 'Q3', asked: 'How does a version know which stories real people actually received?' },
    ],
    subdomains: [
      {
        id: 'D1',
        name: 'The project',
        description:
          'A project is one application built for one customer, and it belongs to that customer from the first day. A customer commissions it and knows how the business works; a maker builds it and writes the business down. One person often holds both. A project already exists where its customer keeps it, and it goes on existing whatever happens to the people serving it.',
      },
      {
        id: 'D2',
        name: 'The domain',
        description:
          'The business the application serves, in the words of the people who know it. On one side what they said, as it came out — conversations, recordings, films, notes, and everything nobody knows yet. On the other, written from it, the parts of the business, each with its own words and its own rules. That written side is what everything else answers to.',
      },
      {
        id: 'D3',
        name: 'The solution',
        description:
          'What the application does about the business. It is told as things people want to do and why, gathered into the features that offer them, and delivered in versions that reach real people one at a time. Nothing here decides what the business is; it only answers it.',
      },
    ],
    terms: [
      { name: 'Project', definition: 'One application, built for one customer.', subdomainId: 'D1' },
      {
        name: 'Customer',
        definition: 'The person who commissions the application and owns it.',
        subdomainId: 'D1',
      },
      {
        name: 'Maker',
        definition: 'The person who builds and maintains it, and writes the business down.',
        subdomainId: 'D1',
      },
      {
        name: 'Source',
        definition: 'Informal material, kept as it was given: a note, a recording, a film.',
        subdomainId: 'D2',
      },
      {
        name: 'Subdomain',
        definition: 'One part of the business that has its own words.',
        subdomainId: 'D2',
      },
      {
        name: 'Rule',
        definition: 'One sentence a customer can confirm or deny.',
        subdomainId: 'D2',
      },
      {
        name: 'Feature',
        definition: 'One thing the application offers, named as the customer would say it.',
        subdomainId: 'D3',
      },
      {
        name: 'Story',
        definition: 'One thing a person wants to do with the application, and why.',
        subdomainId: 'D3',
      },
      {
        name: 'Version',
        definition: 'Finished stories, gathered so they reach real people together.',
        subdomainId: 'D3',
      },
    ],
    rules: [
      {
        id: 'R1',
        statement: 'A project belongs to its customer, whatever happens to the maker.',
        state: 'agreed',
        subdomainId: 'D1',
      },
      {
        id: 'R2',
        statement: 'Nothing is agreed by silence. Agreement is an act, on something named, on a date.',
        state: 'agreed',
        subdomainId: 'D1',
      },
      {
        id: 'R3',
        statement: 'A project open to everyone is read without saying who you are.',
        state: 'proposed',
        subdomainId: 'D1',
      },
      {
        id: 'R4',
        statement: 'The written business is the source of truth; the application is a consequence of it.',
        state: 'agreed',
        subdomainId: 'D2',
      },
      {
        id: 'R5',
        statement: 'A rule that is not written down does not exist, and nobody is at fault when it is missing.',
        state: 'agreed',
        subdomainId: 'D2',
      },
      {
        id: 'R6',
        statement: 'Every story belongs to exactly one feature.',
        state: 'agreed',
        subdomainId: 'D3',
      },
      {
        id: 'R7',
        statement: 'A version contains only finished stories. Work in progress waits for the next one.',
        state: 'agreed',
        subdomainId: 'D3',
      },
      {
        id: 'R8',
        statement: 'A story that has gone out names the version that carried it.',
        state: 'proposed',
        subdomainId: 'D3',
      },
    ],
  },
  features: [
    {
      id: 'F1',
      name: 'Arriving at a project',
      purpose: 'someone finds the project they work on, or looks at one that is open to everyone',
    },
    {
      id: 'F2',
      name: 'Reading and writing the business',
      purpose: 'the informal material and the written business stay in one place, and stay true',
    },
    {
      id: 'F3',
      name: 'Following the work',
      purpose: 'everyone can see what comes next, what is being built, and what reached real people',
    },
  ],
  stories: [
    {
      id: 'S1',
      featureId: 'F1',
      role: 'maker',
      intention: 'look at a project that is open to everyone without saying who I am',
      reason: 'I can see what the method produces before committing to anything',
      priority: 'essential',
      state: 'in_progress',
    },
    {
      id: 'S2',
      featureId: 'F1',
      role: 'maker',
      intention: 'come back to the project I was last in',
      reason: 'I do not choose from a list every time I arrive',
      priority: 'expected',
      state: 'to_do',
    },
    {
      id: 'S3',
      featureId: 'F2',
      role: 'maker',
      intention: 'keep a recording of a conversation next to what I wrote from it',
      reason: 'the customer can check what I understood against what they said',
      priority: 'essential',
      state: 'done',
    },
    {
      id: 'S4',
      featureId: 'F2',
      role: 'customer',
      intention: 'agree a rule, and see my agreement fall when the sentence changes',
      reason: 'I am never held to something I did not read',
      priority: 'essential',
      state: 'done',
    },
    {
      id: 'S5',
      featureId: 'F2',
      role: 'maker',
      intention: 'cut the business into parts that each own their words',
      reason: 'a disputed word has one place to be settled',
      priority: 'expected',
      state: 'done',
    },
    {
      id: 'S6',
      featureId: 'F3',
      role: 'maker',
      intention: 'see the one story that comes next',
      reason: 'a project doing one thing at a time finishes things',
      priority: 'essential',
      state: 'done',
    },
    {
      id: 'S7',
      featureId: 'F3',
      role: 'customer',
      intention: 'see which version real people are using',
      reason: 'I know what I am talking about when something goes wrong',
      priority: 'expected',
      state: 'done',
    },
    {
      id: 'S8',
      featureId: 'F3',
      role: 'customer',
      intention: 'say what I think next to the thing I am looking at',
      reason: 'my remark is not lost in a conversation nobody kept',
      priority: 'essential',
      state: 'to_do',
    },
  ],
  versions: [
    { name: '0.1', storyIds: ['S3', 'S4', 'S6'], deployment: 'live' },
    { name: '0.2', storyIds: ['S5', 'S7'], deployment: 'planned' },
  ],
}
