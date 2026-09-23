import type { Dictionary } from './dictionary'

/** In French, only more than one takes an s: zero stays singular. */
const s = (count: number): string => (count > 1 ? 's' : '')

/** What Supersoft says, in French. Never what a project says: that is never translated. */
export const fr: Dictionary = {
  languageName: 'Français',
  description: 'Spécifier et planifier une application, avec le client dans la conversation.',
  header: { leave: 'Partir', notSignedIn: 'non connecté' },
  footer: {
    note: 'Prototype — projets fictifs, gardés en mémoire, aucun service extérieur.',
    language: 'Langue',
    useProjectLanguage: 'Utiliser la langue du projet',
    yes: 'Oui',
    no: 'Non',
  },

  roles: { customer: 'client', maker: 'développeur' },
  sourceKinds: { note: 'note', audio: 'audio', video: 'vidéo' },
  storyStates: { to_do: 'à faire', in_progress: 'en cours', done: 'terminé' },
  priorities: { essential: 'essentiel', expected: 'attendu', later: 'plus tard' },
  ruleStates: { proposed: 'proposée', agreed: 'approuvée' },
  prototypeStates: { being_tried: 'en essai', validated: 'validé' },

  publicProject: 'Projet public',
  privateProject: 'Projet privé',

  writtenIn: (language: string) => `rédigé en ${language}`,
  storyWords: {
    asA: (role: string) => (/^[aeiouyhàâéèêîïôû]/i.test(role) ? 'En tant qu’' : 'En tant que '),
    iWant: 'je veux',
    soThat: 'pour',
  },

  arrival: {
    yourProjects: (count: number) => `Vos projets — ${count}`,
    signIn: 'Se connecter',
    nothingAdded: 'Aucun projet ajouté.',
    addProject: 'Ajouter un projet',
    remove: 'Retirer',
    projectAddress: 'Adresse du projet',
    openIt: 'Ouvrir',
    unknown: (address: string) => `Aucun projet à l'adresse « ${address} ».`,
  },

  nav: {
    overview: 'Vue d’ensemble',
    business: 'Métier',
    features: 'Fonctionnalités',
    versions: 'Versions',
    sources: 'Sources',
    domains: 'Domaines',
  },

  overview: {
    readingOnly: 'lecture seule',
    whoTakesPart: 'Qui participe',
    address: 'Adresse',
  },

  scope: {
    title: 'Périmètre',
    noScope: 'Pas encore de périmètre : personne n’a dit à quoi sert l’application.',
    rewrite: 'Réécrire le périmètre',
    placeholder: 'À quoi sert l’application, et à quoi elle ne sert pas',
  },

  informal: {
    title: 'Sources',
    sources: (count: number) => `Sources — ${count}`,
    nothingKept: 'Rien n’a encore été gardé.',
    from: (who: string) => `donnée par ${who}`,
    whatItIs: 'Ce que c’est — un enregistrement, un film, une page de notes',
    whoFrom: 'De qui cela vient',
    keepIt: 'Le garder',
  },

  formal: {
    title: 'Domaines',
    domains: (count: number) => `Domaines — ${count}`,
    notCut: 'Le métier n’a pas encore été découpé.',
    agreedOf: (agreed: number, rules: number) => `${agreed} sur ${rules} approuvées`,
    counts: (terms: number, rules: number, open: number) =>
      `${terms} terme${s(terms)}, ${rules} règle${s(rules)}, ` +
      `${open} question${s(open)} ouverte${s(open)}.`,
    domainName: 'Une partie du métier, nommée comme ses gens la nomment',
    domainDescription: 'Ce qu’elle est, en termes métier uniquement',
    addDomain: 'Ajouter un domaine',
    whatThisPartIs: 'Ce qu’est cette partie du métier',
    lexicon: (count: number) => `Lexique — ${count}`,
    noTerm: 'Aucun concept n’a encore été nommé ici.',
    termName: 'Un concept, un nom',
    termDefinition: 'Dans les mots du client',
    define: 'Définir',
    description: (agreed: number, rules: number) => `Description — ${agreed} sur ${rules} approuvées`,
    noRule: 'Rien n’est encore écrit ici, donc rien n’est encore vrai ici.',
    agree: 'Approuver',
    rewriteIt: 'La réécrire',
    rewrite: 'Réécrire',
    ruleStatement: 'Une phrase que le client peut confirmer ou démentir',
    writeItDown: 'L’écrire',
    openQuestions: (count: number) => `Questions ouvertes — ${count}`,
    nothingOpen: 'Rien d’ouvert ici. Soit cette partie est simple, soit personne ne pose de question.',
    whatWasDecided: 'Ce qui a été décidé, et par qui',
    answer: 'Répondre',
    whatNobodyKnows: 'Qu’est-ce que personne ne sait encore sur cette partie du métier ?',
    ask: 'Demander',
    answered: 'Répondues',
    noneAnswered: 'Aucune question n’a encore reçu de réponse ici.',
  },

  features: {
    title: 'Fonctionnalités',
    list: (count: number) => `Fonctionnalités — ${count}`,
    noStory: 'Aucun récit — elle ne décrit rien.',
    storyCounts: (stories: number, done: number, inProgress: number, toDo: number) =>
      `${stories} récits — ${done} terminés, ${inProgress} en cours, ${toDo} à faire.`,
    featureName: 'Une chose que l’application offre',
    featurePurpose: 'À quoi elle sert, en une ligne',
    addFeature: 'Ajouter une fonctionnalité',
    whatItIsFor: 'À quoi elle sert',
    stories: (count: number) => `Récits — ${count}`,
    describesNothing:
      'Aucun récit — cette fonctionnalité ne décrit rien tant que personne ne veut quelque chose.',
    addStory: 'Ajouter un récit',
    role: 'En tant que… (un rôle du domaine, jamais « l’utilisateur »)',
    intention: 'Je veux…',
    reason: 'Pour…',
    add: 'Ajouter',
  },

  story: {
    theStory: 'Le récit',
    person: 'Personne',
    intention: 'Intention',
    reason: 'Raison',
    whereItStands: 'Où il en est',
    next: 'ensuite',
    startIt: 'Le commencer',
    itIsDone: 'C’est terminé',
    carriedBy: 'Porté par la',
    version: (name: string) => `version ${name}`,
    noVersion: 'Aucune version ne le porte encore.',
  },

  prototypes: {
    list: (count: number) => `Prototypes — ${count}`,
    counts: (beingTried: number, validated: number) =>
      `${beingTried} en essai, ${validated} validés.`,
    nothingToTry: 'Rien à essayer pour l’instant pour cette fonctionnalité.',
    tryIt: 'L’essayer →',
    validate: 'Valider',
    name: 'Ce qu’il permet d’essayer',
    location: 'Où l’essayer (facultatif)',
    add: 'Ajouter un prototype',
  },

  versions: {
    title: 'Versions',
    readyToGoOut: (count: number) => `Prêts à sortir — ${count}`,
    noneReady: 'Aucun récit terminé n’attend. Rien à partir de quoi faire une version.',
    versionName: 'Nommer cette version, par ex. 1.1',
    cut: 'Faire la version',
    all: 'Toutes les versions',
  },
}
