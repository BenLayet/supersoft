import type { Deployment, Priority, Role, RuleState, Source, StoryState } from '@supersoft/domain'

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

  project: {
    project: 'Project',
    domain: 'Domain',
    solution: 'Solution',
    readingOnly: 'reading only',
    whoTakesPart: 'Who takes part',
    keptBy: (owner: string) => `Kept by ${owner}.`,
    openToEveryone: 'Open to everyone — read without saying who you are.',
    openToRecognised: 'Open to the people it recognises.',
    theDomain: 'The domain',
    informal: 'Informal',
    informalSummary: (sources: number, open: number) =>
      `${sources} sources kept, ${open} question${open === 1 ? '' : 's'} still open.`,
    formal: 'Formal',
    formalSummary: (subdomains: number, terms: number, agreed: number, rules: number) =>
      `${subdomains} subdomains, ${terms} terms, ${agreed} of ${rules} rules agreed.`,
    theSolution: 'The solution',
    features: 'Features',
    featuresSummary: (features: number, done: number, inProgress: number, toDo: number) =>
      `${features} features, ${done} stories done, ${inProgress} in progress, ${toDo} to do.`,
    versions: 'Versions',
    inUse: (name: string) => `Real people are using ${name}.`,
    nothingInUse: 'Nothing has reached real people yet.',
    whatComesNext: 'What comes next',
    nothingWaiting: 'Nothing is waiting. Every story is under way or done.',
  },

  informal: {
    title: 'The informal side',
    sources: (count: number) => `Sources — ${count}`,
    nothingKept: 'Nothing has been kept yet.',
    from: (who: string) => `from ${who}`,
    whatItIs: 'What it is — a recording, a film, a page of notes',
    whoFrom: 'Who it came from',
    keepIt: 'Keep it',
    keptAsGiven:
      'A source is kept as it was given. What the maker understood from it belongs to the formal side, where the customer can contradict it.',
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
    title: 'The formal side',
    subdomains: (count: number) => `Subdomains — ${count}`,
    notCut: 'The business has not been cut up yet.',
    agreedOf: (agreed: number, rules: number) => `${agreed} of ${rules} agreed`,
    counts: (terms: number, rules: number) => `${terms} terms, ${rules} rules.`,
    subdomainName: 'One part of the business, named as its people name it',
    subdomainDescription: 'What it is, in business terms only',
    addSubdomain: 'Add a subdomain',
    businessTermsOnly:
      'A subdomain is described in business terms only. What the application does about it is the solution, and it is written elsewhere.',
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

  versions: {
    title: 'Versions',
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
