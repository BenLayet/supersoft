import type { Project } from '@supersoft/domain'

/**
 * The project Supersoft shows when it has nothing real to show: an invented
 * association of meditators, publishing recorded practices and gathering for
 * events. Invented people, invented videos — plausible enough to provoke real
 * remarks, and no outside service anywhere.
 */
export const fictionalProject: Project = {
  name: 'Medito',
  participants: [
    { name: 'Amara Diallo', role: 'customer' },
    { name: 'Jules Perrin', role: 'maker' },
  ],
  domain: {
    sources: [
      {
        id: 'M1',
        kind: 'audio',
        title: 'First conversation about the video library — 42 minutes',
        from: 'Amara Diallo',
      },
      {
        id: 'M2',
        kind: 'video',
        title: 'Visit of the meditation hall, filmed on a phone',
        from: 'Amara Diallo',
      },
      {
        id: 'M3',
        kind: 'note',
        title: 'Board meeting: members want to practise without a connection',
        from: 'Jules Perrin',
      },
      {
        id: 'M4',
        kind: 'audio',
        title: 'A teacher on how a recording is made and reviewed — 18 minutes',
        from: 'Noor Haddad, teacher',
      },
    ],
    questions: [
      { id: 'Q1', asked: 'Can someone who is not a member watch a video?' },
      {
        id: 'Q2',
        asked: 'Who decides that a recording is ready to be published?',
        answer: 'The teacher who recorded it, then the secretary.',
      },
      { id: 'Q3', asked: 'What happens to a registration when an event is cancelled?' },
    ],
    terms: [
      {
        name: 'Member',
        definition: 'Someone who has paid the membership for the current season.',
      },
      {
        name: 'Membership',
        definition: 'What a member pays once a season to belong to the association.',
      },
      {
        name: 'Teacher',
        definition: 'A member who records practices and leads events.',
      },
      {
        name: 'Video',
        definition: 'A recorded practice or teaching, published in the library once reviewed.',
      },
      {
        name: 'Event',
        definition: 'A gathering on a date, in the hall or remote, with a limited number of places.',
      },
      {
        name: 'Registration',
        definition: 'A member taking one of the places an event offers.',
      },
    ],
    rules: [
      { id: 'R1', statement: 'Only a member can watch a video.', state: 'agreed' },
      {
        id: 'R2',
        statement: 'A season runs from the first of September to the end of August.',
        state: 'agreed',
      },
      {
        id: 'R3',
        statement: 'A video is published only after the teacher who recorded it has reviewed it.',
        state: 'proposed',
      },
      {
        id: 'R4',
        statement: 'An event has a limited number of places, and registration stops when they are taken.',
        state: 'agreed',
      },
      {
        id: 'R5',
        statement: 'A member can give a place back up to twenty-four hours before the event.',
        state: 'proposed',
      },
      {
        id: 'R6',
        statement:
          'A member whose membership has lapsed keeps their past registrations but can no longer register.',
        state: 'proposed',
      },
    ],
  },
  features: [
    {
      id: 'F1',
      name: 'The video library',
      purpose: 'members find and watch what the teachers have recorded',
    },
    {
      id: 'F2',
      name: 'Events and places',
      purpose: 'members see what is coming and take a place',
    },
    {
      id: 'F3',
      name: 'Membership',
      purpose: 'everyone knows who belongs to the association, and until when',
    },
  ],
  stories: [
    {
      id: 'S1',
      featureId: 'F1',
      role: 'member',
      intention: 'watch a practice from my phone',
      reason: 'I can sit wherever I am',
      priority: 'essential',
      state: 'done',
    },
    {
      id: 'S2',
      featureId: 'F1',
      role: 'member',
      intention: 'find every video of one teacher',
      reason: 'I can follow a voice that suits me',
      priority: 'expected',
      state: 'done',
    },
    {
      id: 'S3',
      featureId: 'F1',
      role: 'teacher',
      intention: 'put a new recording in the library',
      reason: 'I do not have to ask anyone to publish it for me',
      priority: 'essential',
      state: 'in_progress',
    },
    {
      id: 'S4',
      featureId: 'F2',
      role: 'member',
      intention: 'see the events of the coming weeks',
      reason: 'I can plan my month around them',
      priority: 'essential',
      state: 'to_do',
    },
    {
      id: 'S5',
      featureId: 'F2',
      role: 'member',
      intention: 'take a place at an event',
      reason: 'I know I am expected, and so does the teacher',
      priority: 'essential',
      state: 'to_do',
    },
    {
      id: 'S6',
      featureId: 'F2',
      role: 'member',
      intention: 'give my place back',
      reason: 'someone on the waiting list can have it',
      priority: 'expected',
      state: 'to_do',
    },
    {
      id: 'S7',
      featureId: 'F3',
      role: 'member',
      intention: 'see whether my membership is still running',
      reason: 'I am not turned away at the door',
      priority: 'expected',
      state: 'done',
    },
    {
      id: 'S8',
      featureId: 'F3',
      role: 'secretary',
      intention: 'see who has not renewed',
      reason: 'I write to them once instead of chasing everyone',
      priority: 'expected',
      state: 'to_do',
    },
  ],
  versions: [{ name: '1.0', storyIds: ['S1', 'S2'], deployment: 'live' }],
}
