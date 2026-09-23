import type { Project } from '@supersoft/domain'

/**
 * An invented association of meditators, publishing recorded practices and
 * gathering for events. Invented people, invented videos — plausible enough to
 * provoke real remarks, and no outside service anywhere. Its customer speaks
 * French, so the project is written in French.
 */
export const medito: Project = {
  id: 'medito',
  name: 'Medito',
  language: 'fr',
  scope:
    'L’application de l’association : ses adhérents y retrouvent les pratiques enregistrées par les enseignants et s’inscrivent aux rassemblements. Elle ne remplace ni la salle, ni la comptabilité de l’association.',
  participants: [
    { name: 'Amara Diallo', role: 'customer' },
    { name: 'Jules Perrin', role: 'maker' },
  ],
  business: {
    workshops: [
      {
        id: 'W1',
        date: '2026-08-27',
        kind: 'audio',
        title: 'Première conversation sur la vidéothèque — 42 minutes',
        from: 'Amara Diallo',
      },
      {
        id: 'W2',
        date: '2026-09-03',
        kind: 'video',
        title: 'Visite de la salle de méditation, filmée au téléphone',
        from: 'Amara Diallo',
      },
      {
        id: 'W3',
        date: '2026-09-10',
        kind: 'note',
        title: 'Conseil d’administration : les adhérents veulent pratiquer sans connexion',
        from: 'Jules Perrin',
      },
      {
        id: 'W4',
        date: '2026-09-18',
        kind: 'audio',
        title: 'Une enseignante sur la façon dont un enregistrement est fait et relu — 18 minutes',
        from: 'Noor Haddad, enseignante',
      },
    ],
    domains: [
      {
        id: 'D1',
        name: 'La vidéothèque',
        description:
          'Les enseignants enregistrent des pratiques et des enseignements. Un enregistrement est écouté par l’enseignant qui l’a fait avant que quiconque l’entende, et l’association le garde tant qu’il vaut la peine d’être entendu. Ce qui compte ici, c’est la voix : on revient vers un enseignant, pas vers un catalogue.',
      },
      {
        id: 'D2',
        name: 'Les événements',
        description:
          'L’association se rassemble : assises du soir dans la salle, journées de pratique, retraites. Un rassemblement a lieu à une date, en un lieu, avec un enseignant, et il accueille un certain nombre de personnes. Les places sont données dans l’ordre où elles sont demandées, et qui ne peut pas venir le dit — un coussin vide est une place que quelqu’un d’autre voulait.',
      },
      {
        id: 'D3',
        name: 'L’adhésion',
        description:
          'Appartenir à l’association se paie une fois par saison, et une saison est l’année au rythme de laquelle vit l’association, de septembre à août. C’est l’appartenance qui ouvre les enregistrements et les rassemblements. Quand une adhésion prend fin, l’appartenance prend fin avec elle, et ce à quoi la personne a participé reste vrai.',
      },
    ],
    terms: [
      {
        name: 'Adhérent',
        definition: 'Quelqu’un qui a payé l’adhésion de la saison en cours.',
        domainId: 'D3',
      },
      {
        name: 'Adhésion',
        definition: 'Ce qu’un adhérent paie une fois par saison pour appartenir à l’association.',
        domainId: 'D3',
      },
      {
        name: 'Saison',
        definition: 'L’année au rythme de laquelle vit l’association : de septembre à août.',
        domainId: 'D3',
      },
      {
        name: 'Enseignant',
        definition: 'Un adhérent qui enregistre des pratiques et anime des rassemblements.',
        domainId: 'D1',
      },
      {
        name: 'Vidéo',
        definition: 'Une pratique ou un enseignement enregistré, entendu par son enseignant avant quiconque.',
        domainId: 'D1',
      },
      {
        name: 'Événement',
        definition: 'Un rassemblement à une date, dans la salle ou à distance, qui accueille un certain nombre de personnes.',
        domainId: 'D2',
      },
      {
        name: 'Inscription',
        definition: 'Un adhérent qui prend l’une des places qu’offre un rassemblement.',
        domainId: 'D2',
      },
    ],
    rules: [
      {
        id: 'R1',
        statement: 'Seul un adhérent peut regarder une vidéo.',
        state: 'agreed',
        domainId: 'D1',
      },
      {
        id: 'R3',
        statement: 'Une vidéo n’est partagée qu’après que l’enseignant qui l’a enregistrée l’a réécoutée.',
        state: 'proposed',
        domainId: 'D1',
      },
      {
        id: 'R4',
        statement: 'Un événement accueille un certain nombre de personnes, et on cesse de donner des places quand elles sont prises.',
        state: 'agreed',
        domainId: 'D2',
      },
      {
        id: 'R5',
        statement: 'Un adhérent peut rendre sa place jusqu’à vingt-quatre heures avant l’événement.',
        state: 'proposed',
        domainId: 'D2',
      },
      {
        id: 'R2',
        statement: 'Une saison va du premier septembre à la fin du mois d’août.',
        state: 'agreed',
        domainId: 'D3',
      },
      {
        id: 'R6',
        statement:
          'Un adhérent dont l’adhésion a expiré garde ce à quoi il a participé, mais ne peut plus prendre de place.',
        state: 'proposed',
        domainId: 'D3',
      },
    ],
    questions: [
      {
        id: 'Q1',
        asked: 'Quelqu’un qui n’est pas adhérent peut-il regarder une vidéo ?',
        domainId: 'D1',
      },
      {
        id: 'Q2',
        asked: 'Qui décide qu’un enregistrement est prêt à être publié ?',
        answer: 'L’enseignant qui l’a enregistré, puis le secrétaire.',
        domainId: 'D1',
      },
      {
        id: 'Q3',
        asked: 'Que devient une inscription quand un événement est annulé ?',
        domainId: 'D2',
      },
    ],
  },
  features: [
    {
      id: 'F1',
      name: 'La vidéothèque',
      purpose: 'les adhérents trouvent et regardent ce que les enseignants ont enregistré',
    },
    {
      id: 'F2',
      name: 'Événements et places',
      purpose: 'les adhérents voient ce qui arrive et prennent une place',
    },
    {
      id: 'F3',
      name: 'Adhésion',
      purpose: 'chacun sait qui appartient à l’association, et jusqu’à quand',
    },
  ],
  stories: [
    {
      id: 'S1',
      featureId: 'F1',
      role: 'adhérent',
      intention: 'regarder une pratique depuis mon téléphone',
      reason: 'pouvoir m’asseoir où que je sois',
      priority: 'essential',
      state: 'done',
    },
    {
      id: 'S2',
      featureId: 'F1',
      role: 'adhérent',
      intention: 'trouver toutes les vidéos d’un enseignant',
      reason: 'pouvoir suivre une voix qui me convient',
      priority: 'expected',
      state: 'done',
    },
    {
      id: 'S3',
      featureId: 'F1',
      role: 'enseignant',
      intention: 'mettre un nouvel enregistrement dans la vidéothèque',
      reason: 'ne pas avoir à demander à quelqu’un de le publier pour moi',
      priority: 'essential',
      state: 'in_progress',
    },
    {
      id: 'S4',
      featureId: 'F2',
      role: 'adhérent',
      intention: 'voir les événements des semaines à venir',
      reason: 'pouvoir organiser mon mois autour',
      priority: 'essential',
      state: 'to_do',
    },
    {
      id: 'S5',
      featureId: 'F2',
      role: 'adhérent',
      intention: 'prendre une place à un événement',
      reason: 'savoir que je suis attendu, et que l’enseignant le sache aussi',
      priority: 'essential',
      state: 'to_do',
    },
    {
      id: 'S6',
      featureId: 'F2',
      role: 'adhérent',
      intention: 'rendre ma place',
      reason: 'que quelqu’un sur la liste d’attente puisse l’avoir',
      priority: 'expected',
      state: 'to_do',
    },
    {
      id: 'S7',
      featureId: 'F3',
      role: 'adhérent',
      intention: 'voir si mon adhésion court toujours',
      reason: 'ne pas être refoulé à la porte',
      priority: 'expected',
      state: 'done',
    },
    {
      id: 'S8',
      featureId: 'F3',
      role: 'secrétaire',
      intention: 'voir qui n’a pas renouvelé',
      reason: 'leur écrire une fois au lieu de relancer tout le monde',
      priority: 'expected',
      state: 'to_do',
    },
  ],
  prototypes: [
    { id: 'P1', featureId: 'F1', name: 'Regarder une pratique depuis son téléphone', state: 'validated' },
    { id: 'P2', featureId: 'F2', name: 'Prendre et rendre une place à un événement', state: 'being_tried' },
  ],
  versions: [{ name: '1.0', storyIds: ['S1', 'S2'] }],
}
