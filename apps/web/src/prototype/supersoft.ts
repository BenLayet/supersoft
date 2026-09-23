import type { Project } from '@supersoft/domain'

/**
 * Supersoft described in its own terms — the project it is built to serve
 * first. Everything here is taken from `docs/domain/`, which is the same
 * business said in prose, and said here in French: the language its makers
 * speak when they are the customer.
 */
export const supersoft: Project = {
  id: 'supersoft',
  name: 'Supersoft',
  language: 'fr',
  scope:
    'Un support pour la conversation entre un développeur et son client à propos d’une application web ou mobile : la spécifier, la planifier, et la suivre jusqu’à l’usage réel. Supersoft n’écrit pas l’application à la place de personne, et aucun projet ne dépend de lui pour continuer d’exister.',
  participants: [
    { name: 'Ben Layet', role: 'customer' },
    { name: 'Ben Layet', role: 'maker' },
  ],
  business: {
    sources: [
      {
        id: 'M1',
        kind: 'note',
        title: 'Les premiers mois ont spécifié un produit que personne n’avait jamais lancé',
        from: 'Ben Layet',
      },
      {
        id: 'M2',
        kind: 'note',
        title: 'Une application construite avec cette méthode avant que tout outil existe',
        from: 'Ben Layet',
      },
      {
        id: 'M3',
        kind: 'video',
        title: 'Pourquoi le logiciel d’une association est difficile à utiliser, et difficile à changer',
        from: 'Ben Layet',
        location: '/discovery/20260916%20general%20presentation/presentation.mp4',
      },
    ],
    questions: [
      {
        id: 'Q1',
        asked: 'Que garde un projet quand il cesse d’utiliser Supersoft ?',
        answer: 'Tout. Le métier et la solution sont les fichiers du client, lisibles sans Supersoft.',
      },
      { id: 'Q2', asked: 'Qui écrit le métier quand le client ne veut pas écrire de prose ?' },
      {
        id: 'Q3',
        asked: 'Comment une version sait-elle quels récits de vraies personnes ont réellement reçus ?',
      },
    ],
    domains: [
      {
        id: 'D1',
        name: 'Le projet',
        description:
          'Un projet est une application construite pour un client, et elle appartient à ce client dès le premier jour. Le client la commande et sait comment fonctionne le métier ; le développeur la construit et met le métier par écrit. Une même personne tient souvent les deux rôles. Un projet existe déjà là où son client le garde, et il continue d’exister quoi qu’il arrive aux personnes qui le servent.',
      },
      {
        id: 'D2',
        name: 'Le métier',
        description:
          'Le métier que sert l’application, dans les mots de ceux qui le connaissent. D’un côté, ce qu’ils ont dit, tel que c’est sorti — conversations, enregistrements, films, notes, et tout ce que personne ne sait encore. De l’autre, écrites à partir de cela, les parties du métier, chacune avec ses propres mots et ses propres règles. C’est ce côté écrit qui fait foi pour tout le reste.',
      },
      {
        id: 'D3',
        name: 'La solution',
        description:
          'Ce que l’application fait pour le métier. Elle se raconte en choses que des personnes veulent faire, et pourquoi, rassemblées dans les fonctionnalités qui les offrent, et livrées en versions qui atteignent de vraies personnes une à une. Rien ici ne décide de ce qu’est le métier ; la solution ne fait qu’y répondre.',
      },
    ],
    terms: [
      { name: 'Projet', definition: 'Une application, construite pour un client.', domainId: 'D1' },
      {
        name: 'Client',
        definition: 'La personne qui commande l’application et qui la possède.',
        domainId: 'D1',
      },
      {
        name: 'Développeur',
        definition: 'La personne qui la construit et la maintient, et qui met le métier par écrit.',
        domainId: 'D1',
      },
      {
        name: 'Source',
        definition: 'Matériau informel, gardé tel qu’il a été donné : une note, un enregistrement, un film.',
        domainId: 'D2',
      },
      {
        name: 'Domaine',
        definition: 'Une partie du métier qui a ses propres mots.',
        domainId: 'D2',
      },
      {
        name: 'Règle',
        definition: 'Une phrase qu’un client peut confirmer ou démentir.',
        domainId: 'D2',
      },
      {
        name: 'Fonctionnalité',
        definition: 'Une chose que l’application offre, nommée comme le client la dirait.',
        domainId: 'D3',
      },
      {
        name: 'Récit',
        definition: 'Une chose qu’une personne veut faire avec l’application, et pourquoi.',
        domainId: 'D3',
      },
      {
        name: 'Version',
        definition: 'Des récits terminés, rassemblés pour atteindre ensemble de vraies personnes.',
        domainId: 'D3',
      },
    ],
    rules: [
      {
        id: 'R1',
        statement: 'Un projet appartient à son client, quoi qu’il arrive au développeur.',
        state: 'agreed',
        domainId: 'D1',
      },
      {
        id: 'R2',
        statement: 'Rien n’est approuvé par le silence. L’accord est un acte, sur une chose nommée, à une date.',
        state: 'agreed',
        domainId: 'D1',
      },
      {
        id: 'R3',
        statement: 'Un projet public se lit sans dire qui l’on est.',
        state: 'proposed',
        domainId: 'D1',
      },
      {
        id: 'R4',
        statement: 'Le métier écrit fait foi ; l’application en est une conséquence.',
        state: 'agreed',
        domainId: 'D2',
      },
      {
        id: 'R5',
        statement: 'Une règle qui n’est pas écrite n’existe pas, et personne n’est en faute quand elle manque.',
        state: 'agreed',
        domainId: 'D2',
      },
      {
        id: 'R6',
        statement: 'Chaque récit appartient à exactement une fonctionnalité.',
        state: 'agreed',
        domainId: 'D3',
      },
      {
        id: 'R7',
        statement: 'Une version ne contient que des récits terminés. Le travail en cours attend la suivante.',
        state: 'agreed',
        domainId: 'D3',
      },
      {
        id: 'R8',
        statement: 'Un récit qui est sorti nomme la version qui l’a porté.',
        state: 'proposed',
        domainId: 'D3',
      },
    ],
  },
  features: [
    {
      id: 'F1',
      name: 'Arriver sur un projet',
      purpose: 'chacun trouve le projet sur lequel il travaille, ou en consulte un qui est public',
    },
    {
      id: 'F2',
      name: 'Lire et écrire le métier',
      purpose: 'le matériau informel et le métier écrit restent au même endroit, et restent vrais',
    },
    {
      id: 'F3',
      name: 'Suivre le travail',
      purpose: 'chacun voit ce qui vient ensuite, ce qui se construit, et ce qui a atteint de vraies personnes',
    },
  ],
  stories: [
    {
      id: 'S1',
      featureId: 'F1',
      role: 'développeur',
      intention: 'consulter un projet public sans dire qui je suis',
      reason: 'voir ce que produit la méthode avant de m’engager à quoi que ce soit',
      priority: 'essential',
      state: 'in_progress',
    },
    {
      id: 'S2',
      featureId: 'F1',
      role: 'développeur',
      intention: 'revenir au dernier projet sur lequel j’étais',
      reason: 'ne pas choisir dans une liste à chaque fois que j’arrive',
      priority: 'expected',
      state: 'to_do',
    },
    {
      id: 'S3',
      featureId: 'F2',
      role: 'développeur',
      intention: 'garder l’enregistrement d’une conversation à côté de ce que j’en ai écrit',
      reason: 'que le client puisse comparer ce que j’ai compris avec ce qu’il a dit',
      priority: 'essential',
      state: 'done',
    },
    {
      id: 'S4',
      featureId: 'F2',
      role: 'client',
      intention: 'approuver une règle, et voir mon accord tomber quand la phrase change',
      reason: 'n’être jamais tenu à une chose que je n’ai pas lue',
      priority: 'essential',
      state: 'done',
    },
    {
      id: 'S5',
      featureId: 'F2',
      role: 'développeur',
      intention: 'découper le métier en parties qui possèdent chacune leurs mots',
      reason: 'qu’un mot disputé ait un seul endroit où se régler',
      priority: 'expected',
      state: 'done',
    },
    {
      id: 'S6',
      featureId: 'F3',
      role: 'développeur',
      intention: 'voir le seul récit qui vient ensuite',
      reason: 'qu’un projet qui fait une chose à la fois finisse ce qu’il commence',
      priority: 'essential',
      state: 'done',
    },
    {
      id: 'S7',
      featureId: 'F3',
      role: 'client',
      intention: 'voir quelle version de vraies personnes utilisent',
      reason: 'savoir de quoi je parle quand quelque chose ne va pas',
      priority: 'expected',
      state: 'done',
    },
    {
      id: 'S8',
      featureId: 'F3',
      role: 'client',
      intention: 'dire ce que j’en pense à côté de la chose que je regarde',
      reason: 'que ma remarque ne se perde pas dans une conversation que personne n’a gardée',
      priority: 'essential',
      state: 'to_do',
    },
  ],
  prototypes: [
    { id: 'P1', featureId: 'F1', name: 'Arriver sur un projet et le parcourir', location: '/', state: 'being_tried' },
  ],
  versions: [
    { name: '0.1', storyIds: ['S3', 'S4', 'S6'] },
    { name: '0.2', storyIds: ['S5', 'S7'] },
  ],
}
