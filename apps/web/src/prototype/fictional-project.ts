import type { Project } from '@supersoft/domain'

/**
 * The project Supersoft shows when it has nothing real to show: a small
 * association sharing a piece of land. Invented people, invented plots —
 * plausible enough to provoke real remarks, and no outside service anywhere.
 */
export const fictionalProject: Project = {
  name: 'Garden Share',
  participants: [
    { name: 'Nadia Okonkwo', role: 'customer' },
    { name: 'Sam Reyes', role: 'maker' },
    { name: 'Pilar Ferreira', role: 'domainExpert' },
  ],
  specification: {
    questions: [
      { id: 'Q1', asked: 'Can one household hold more than one plot?' },
      {
        id: 'Q2',
        asked: 'Who decides that a plot is reassigned?',
        answer: 'The committee, at its monthly meeting.',
      },
      { id: 'Q3', asked: 'What happens to a plot when a member stops paying halfway through a season?' },
    ],
    terms: [
      { name: 'Member', definition: 'Someone who has paid their subscription for the current season.' },
      { name: 'Plot', definition: 'One piece of land, held by one member for a season.' },
      { name: 'Season', definition: 'March to October. Plots are held for a whole season.' },
      { name: 'Rota', definition: 'The list of watering turns, one member per day.' },
      { name: 'Committee', definition: 'The five members elected to decide what the association does.' },
    ],
    rules: [
      { id: 'R1', statement: 'A member holds at most one plot.', state: 'agreed' },
      { id: 'R2', statement: 'A plot is held for a whole season, never part of one.', state: 'agreed' },
      {
        id: 'R3',
        statement: 'A member who has not renewed by the first of March loses their plot.',
        state: 'proposed',
      },
      {
        id: 'R4',
        statement: 'Every member takes at least two turns on the rota each season.',
        state: 'proposed',
      },
    ],
  },
  stories: [
    {
      id: 'S1',
      role: 'member',
      intention: 'see which plot I hold and until when',
      reason: 'I know whether I still have to renew',
      priority: 'essential',
      state: 'done',
    },
    {
      id: 'S2',
      role: 'member',
      intention: 'renew my plot for the next season',
      reason: 'I do not have to catch a committee member at the gate',
      priority: 'essential',
      state: 'done',
    },
    {
      id: 'S3',
      role: 'member',
      intention: 'put my name on a watering turn',
      reason: 'the rota fills itself instead of being chased',
      priority: 'expected',
      state: 'in_progress',
    },
    {
      id: 'S4',
      role: 'committee member',
      intention: 'see the plots nobody has renewed',
      reason: 'I can offer them to the people waiting',
      priority: 'essential',
      state: 'to_do',
    },
    {
      id: 'S5',
      role: 'neighbour',
      intention: 'put myself on the waiting list',
      reason: 'I am told when a plot frees up instead of asking every spring',
      priority: 'expected',
      state: 'to_do',
    },
    {
      id: 'S6',
      role: 'member',
      intention: 'swap a watering turn with someone',
      reason: 'being away for a week does not leave the garden dry',
      priority: 'later',
      state: 'to_do',
    },
  ],
  versions: [{ name: '1.0', storyIds: ['S1'], deployment: 'live' }],
}
