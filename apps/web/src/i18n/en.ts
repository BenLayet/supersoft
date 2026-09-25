import type { DocumentKind, PrototypeState, Role, RuleState, Size, StoryState } from '@supersoft/domain'
import { onDay } from './day'

/** In English, only exactly one stays singular. */
const s = (count: number): string => (count === 1 ? '' : 's')

/** What Supersoft says, in English. Never what a project says: that is never translated. */
export const en = {
  languageName: 'English',
  description: 'Specifying and planning an application, with the customer in the conversation.',
  header: { leave: 'Leave', notSignedIn: 'not signed in' },
  footer: {
    note: 'Prototype — fictional projects, held in memory, no outside service.',
    language: 'Language',
    useProjectLanguage: "Use the project's language",
    yes: 'Yes',
    no: 'No',
  },

  roles: { customer: 'customer', maker: 'maker' } satisfies Record<Role, string>,
  documentKinds: {
    slides: 'slides',
    video: 'video',
    audio: 'recording',
    notes: 'notes',
    report: 'report',
    transcript: 'transcript',
  } satisfies Record<DocumentKind, string>,
  storyStates: { to_do: 'to do', in_progress: 'in progress', done: 'done' } satisfies Record<
    StoryState,
    string
  >,
  ruleStates: { proposed: 'proposed', agreed: 'agreed' } satisfies Record<RuleState, string>,
  prototypeStates: { being_tried: 'being tried', validated: 'validated' } satisfies Record<
    PrototypeState,
    string
  >,

  publicProject: 'Public project',
  privateProject: 'Private project',

  writtenIn: (language: string) => `written in ${language}`,
  /** The words a story is told with, in the language of the project that tells it. */
  storyWords: {
    asA: (role: string): string => (/^[aeiou]/i.test(role) ? 'As an ' : 'As a '),
    iWant: 'I want to',
    soThat: 'so that',
  },

  arrival: {
    yourProjects: (count: number) => `Your projects — ${count}`,
    signIn: 'Sign in',
    nothingAdded: 'Nothing added yet.',
    addProject: 'Add a project',
    remove: 'Remove',
    projectAddress: 'Project address',
    openIt: 'Open',
    unknown: (address: string) => `No project at “${address}”.`,
  },

  nav: {
    overview: 'Overview',
    business: 'Business',
    features: 'Features',
    versions: 'Versions',
    workshops: 'Workshops',
    domains: 'Domains',
    menu: 'Menu',
    closeMenu: 'Close the menu',
  },

  overview: {
    readingOnly: 'reading only',
    whoTakesPart: 'Who takes part',
    address: 'Address',
  },

  scope: {
    title: 'Scope',
    noScope: 'No scope yet: nobody has said what the application is for.',
    rewrite: 'Rewrite the scope',
    placeholder: 'What the application is for, and what it is not',
  },

  informal: {
    title: 'Workshops',
    workshops: (count: number) => `Workshops — ${count}`,
    nothingKept: 'No workshop has been held yet.',
    heldOn: (date: string) => onDay(date, 'en-GB'),
    workshopName: 'Name of the workshop',
    whenHeld: 'The day it was held',
    addWorkshop: 'Add',
    documentCount: (count: number) => `${count} document${s(count)}`,
    documents: (count: number) => `Documents — ${count}`,
    noDocument: 'Nothing has been kept from this workshop yet.',
    documentTitle: 'What it is — the slides shown, the report, the transcript',
    documentLocation: 'Where it is kept (optional)',
    addDocument: 'Add it',
    open: 'Open',
    correct: 'Correct',
    writeIt: 'Write it',
    write: 'Write',
    preview: 'Preview',
    writtenIn: 'Written in Markdown: # a heading, - a list, **bold**',
    nothingWritten: 'Nothing written yet.',
    save: 'Save',
    cancel: 'Cancel',
  },

  formal: {
    title: 'Domains',
    domains: (count: number) => `Domains — ${count}`,
    notCut: 'The business has not been cut up yet.',
    agreedOf: (agreed: number, rules: number) => `${agreed} of ${rules} agreed`,
    counts: (terms: number, rules: number, open: number) =>
      `${terms} term${s(terms)}, ${rules} rule${s(rules)}, ${open} open question${s(open)}.`,
    domainName: 'One part of the business, named as its people name it',
    domainDescription: 'What it is, in business terms only',
    addDomain: 'Add a domain',
    whatThisPartIs: 'What this part of the business is',
    lexicon: (count: number) => `Lexicon — ${count}`,
    noTerm: 'No concept has been named here yet.',
    termName: 'One concept, one name',
    termDefinition: "In the customer's own words",
    define: 'Define',
    description: (agreed: number, rules: number) => `Description — ${agreed} of ${rules} agreed`,
    noRule: 'Nothing is written here yet, so nothing is true here yet.',
    agree: 'Agree',
    rewriteIt: 'Rewrite it',
    rewrite: 'Rewrite',
    ruleStatement: 'One sentence the customer can confirm or deny',
    writeItDown: 'Write it down',
    openQuestions: (count: number) => `Open questions — ${count}`,
    nothingOpen: 'Nothing open here. Either this part is simple, or nobody is asking.',
    whatWasDecided: 'What was decided, and by whom',
    answer: 'Answer',
    whatNobodyKnows: 'What does nobody know yet about this part of the business?',
    ask: 'Ask',
    answered: 'Answered',
    noneAnswered: 'No question has been answered here yet.',
  },

  features: {
    title: 'Features',
    list: (count: number) => `Features — ${count}`,
    noStory: 'No story yet — it describes nothing.',
    storyCounts: (stories: number, done: number, inProgress: number, toDo: number) =>
      `${stories} stories — ${done} done, ${inProgress} in progress, ${toDo} to do.`,
    featureName: 'One thing the application offers',
    featurePurpose: 'What it is for, in one line',
    addFeature: 'Add a feature',
    whatItIsFor: 'What it is for',
    stories: (count: number) => `Stories — ${count}`,
    describesNothing: 'No story yet — this feature describes nothing until someone wants something.',
    addStory: 'Add a story',
    role: "As a… (a role of the domain, never 'the user')",
    intention: 'I want to…',
    reason: 'So that…',
    add: 'Add',
  },

  story: {
    theStory: 'The story',
    person: 'Person',
    intention: 'Intention',
    reason: 'Reason',
    whereItStands: 'Where it stands',
    value: (size: Size) => `value ${size}`,
    effort: (size: Size) => `effort ${size}`,
    next: 'next',
    startIt: 'Start it',
    itIsDone: 'It is done',
    carriedBy: 'Carried by',
    version: (name: string) => `version ${name}`,
    noVersion: 'No version carries it yet.',
  },

  prototypes: {
    list: (count: number) => `Prototypes — ${count}`,
    counts: (beingTried: number, validated: number) =>
      `${beingTried} being tried, ${validated} validated.`,
    nothingToTry: 'Nothing to try yet for this feature.',
    tryIt: 'Try it →',
    validate: 'Validate',
    name: 'What it lets people try',
    location: 'Where it can be tried (optional)',
    add: 'Add a prototype',
  },

  versions: {
    title: 'Versions',
    readyToGoOut: (count: number) => `Ready to go out — ${count}`,
    noneReady: 'No finished story is waiting. Nothing to cut a version from.',
    versionName: 'Name this version, e.g. 1.1',
    cut: 'Cut the version',
    all: 'All versions',
  },
}
