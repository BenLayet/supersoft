import type { Deployment, Priority, PrototypeState, Role, RuleState, Source, StoryState } from '@supersoft/domain'

/** What Supersoft says, in English. Never what a project says: that is never translated. */
export const en = {
  languageName: 'English',
  description: 'Specifying and planning an application, with the customer in the conversation.',
  header: { leave: 'Leave', notSignedIn: 'not signed in' },
  footer: 'Prototype — fictional projects, held in memory, no outside service.',

  roles: { customer: 'customer', maker: 'maker' } satisfies Record<Role, string>,
  sourceKinds: { note: 'note', audio: 'audio', video: 'video' } satisfies Record<Source['kind'], string>,
  storyStates: { to_do: 'to do', in_progress: 'in progress', done: 'done' } satisfies Record<
    StoryState,
    string
  >,
  priorities: { essential: 'essential', expected: 'expected', later: 'later' } satisfies Record<
    Priority,
    string
  >,
  ruleStates: { proposed: 'proposed', agreed: 'agreed' } satisfies Record<RuleState, string>,
  prototypeStates: { being_tried: 'being tried', validated: 'validated' } satisfies Record<
    PrototypeState,
    string
  >,
  deployments: {
    planned: 'planned',
    deploying: 'deploying',
    live: 'in real use',
    failed: 'failed',
  } satisfies Record<Deployment, string>,

  writtenIn: (language: string) => `written in ${language}`,
  /** The words a story is told with, in the language of the project that tells it. */
  storyWords: {
    asA: (role: string): string => (/^[aeiou]/i.test(role) ? 'As an ' : 'As a '),
    iWant: 'I want to',
    soThat: 'so that',
  },

  arrival: {
    yourProjects: 'Your projects',
    arrive: 'Arrive',
    sayWhoYouAre: 'Say who you are',
    neverCreates:
      'Supersoft never creates a project. It opens one that already exists where you keep it, and it can only act where you could already act without it.',
    signIn: 'Sign in where my projects live',
    whereYouLeftOff: 'Where you left off',
    remembered: 'Remembered as a convenience. Forget it and no project loses anything.',
    foundForYou: (count: number) => `Found for you — ${count}`,
    openToEveryone: 'Open to everyone',
    nothingFound: 'Nothing found.',
    nameOne: 'Or name one that is open to everyone',
    openIt: 'Open it',
    unknown: (name: string) => `Nothing open to everyone is called “${name}”.`,
    readWithoutSaying: 'Open to everyone — read without saying who you are.',
    onlyRecognised: 'Only the people it recognises.',
    notInTheForm: 'Not written in the form Supersoft reads.',
    readable: 'readable',
    unreadable: 'unreadable',
  },

  nav: {
    overview: 'Overview',
    business: 'Business',
    features: 'Features',
    versions: 'Versions',
    sources: 'Sources & questions',
    subdomains: 'Subdomains',
  },

  overview: {
    readingOnly: 'reading only',
    whoTakesPart: 'Who takes part',
    keptBy: (owner: string) => `Kept by ${owner}.`,
    openToEveryone: 'Open to everyone — read without saying who you are.',
    openToRecognised: 'Open to the people it recognises.',
    sourcesSummary: (sources: number, open: number) =>
      `${sources} sources kept, ${open} question${open === 1 ? '' : 's'} still open.`,
    featuresSummary: (features: number, done: number, inProgress: number, toDo: number) =>
      `${features} features, ${done} stories done, ${inProgress} in progress, ${toDo} to do.`,
    subdomainsSummary: (subdomains: number, terms: number, agreed: number, rules: number) =>
      `${subdomains} subdomains, ${terms} terms, ${agreed} of ${rules} rules agreed.`,
    prototypesSummary: (beingTried: number, validated: number) =>
      `Prototypes: ${beingTried} being tried, ${validated} validated.`,
    inUse: (name: string) => `Real people are using ${name}.`,
    nothingInUse: 'Nothing has reached real people yet.',
    whatComesNext: 'What comes next',
    nothingWaiting: 'Nothing is waiting. Every story is under way or done.',
  },

  scope: {
    title: 'Scope',
    noScope: 'No scope yet: nobody has said what the application is for.',
    rewrite: 'Rewrite the scope',
    placeholder: 'What the application is for, and what it is not',
    shortOnPurpose:
      'Short, broad and deliberately vague: it hardly changes. The precision lives in the subdomains. Every feature is drawn from the scope — one it cannot account for is a change of scope, said out loud.',
  },

  informal: {
    title: 'Sources & questions',
    sources: (count: number) => `Sources — ${count}`,
    nothingKept: 'Nothing has been kept yet.',
    from: (who: string) => `from ${who}`,
    whatItIs: 'What it is — a recording, a film, a page of notes',
    whoFrom: 'Who it came from',
    keepIt: 'Keep it',
    keptAsGiven:
      'A source is kept as it was given. What the maker understood from it is written in the subdomains, where the customer can contradict it.',
    openQuestions: (count: number) => `Open questions — ${count}`,
    nothingOpen: 'Nothing open. Either the project is small, or nobody is asking.',
    whatWasDecided: 'What was decided, and by whom',
    answer: 'Answer',
    whatNobodyKnows: 'What does nobody know yet?',
    ask: 'Ask',
    answered: 'Answered',
    noneAnswered: 'No question has been answered yet.',
  },

  formal: {
    title: 'Subdomains',
    subdomains: (count: number) => `Subdomains — ${count}`,
    notCut: 'The business has not been cut up yet.',
    agreedOf: (agreed: number, rules: number) => `${agreed} of ${rules} agreed`,
    counts: (terms: number, rules: number) => `${terms} terms, ${rules} rules.`,
    subdomainName: 'One part of the business, named as its people name it',
    subdomainDescription: 'What it is, in business terms only',
    addSubdomain: 'Add a subdomain',
    businessTermsOnly:
      'A subdomain is described in business terms only. What the application does about it is told in its features, elsewhere.',
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
    agreementIsToASentence:
      'Rewriting an agreed rule makes it proposed again: agreement is given to a sentence, not to a subject.',
  },

  features: {
    title: 'Features',
    inFeature: (name: string) => `in ${name} →`,
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
    priorityIsTheCustomers:
      "Priority is the customer's to set. The maker's contribution is the cost, stated before the priority is chosen.",
  },

  story: {
    theStory: 'The story',
    person: 'Person',
    intention: 'Intention',
    reason: 'Reason',
    whereItStands: 'Where it stands',
    next: 'next',
    startIt: 'Start it',
    itIsDone: 'It is done',
    doneMeans: 'Done means the customer could see it working, not that the code exists.',
    realPeople: 'Real people',
    carriedBy: 'Carried by',
    version: (name: string) => `version ${name}`,
    whichIsInUse: 'which real people are using.',
    whichIs: (deployment: string) => `which is ${deployment}.`,
    noVersion: 'No version carries it yet.',
  },

  prototypes: {
    list: (count: number) => `Prototypes — ${count}`,
    nothingToTry: 'Nothing to try yet for this feature.',
    tryIt: 'Try it →',
    validate: 'Validate',
    name: 'What it lets people try',
    location: 'Where it can be tried (optional)',
    add: 'Add a prototype',
    appliesTheRules:
      'A prototype applies the rules of the business and never holds one of its own: a rule found while trying it is written down first. Validation is the customer’s act. Once validated, it is refined into realistic mock-ups — a demonstration, connected to nothing.',
  },

  versions: {
    title: 'Versions',
    onlyValidated:
      'Only a validated demonstration is connected to the outside world and goes out as a version.',
    inRealUse: 'In real use',
    readyToGoOut: (count: number) => `Ready to go out — ${count}`,
    noneReady: 'No finished story is waiting. Nothing to cut a version from.',
    versionName: 'Name this version, e.g. 1.1',
    cut: 'Cut the version',
    all: 'All versions',
    deploy: 'Deploy it',
    itIsUp: 'It is up',
    itFailed: 'It failed',
  },
}
