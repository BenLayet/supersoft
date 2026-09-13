import type { Project } from '@supersoft/domain'

/**
 * An invented association of meditators, publishing recorded practices and
 * gathering for events. Invented people, invented videos — plausible enough to
 * provoke real remarks, and no outside service anywhere.
 */
export const medito: Project = {
  id: 'medito',
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
    subdomains: [
      {
        id: 'D1',
        name: 'The video library',
        description:
          'Teachers record practices and teachings. A recording is listened to by the teacher who made it before anyone else hears it, and the association keeps it for as long as it is worth hearing. What matters here is the voice: people come back to a teacher, not to a catalogue.',
      },
      {
        id: 'D2',
        name: 'Events',
        description:
          'The association gathers: evening sittings in the hall, days of practice, retreats. A gathering happens on a date, in one place, with one teacher, and it holds a certain number of people. Places are taken in the order they are asked for, and someone who cannot come says so — an empty cushion is a place somebody else wanted.',
      },
      {
        id: 'D3',
        name: 'Membership',
        description:
          'Belonging to the association is paid once a season, and a season is the year the association lives by, from September to August. Belonging is what opens the recordings and the gatherings. When a membership ends, belonging ends with it, and what the person attended remains true.',
      },
    ],
    terms: [
      {
        name: 'Member',
        definition: 'Someone who has paid the membership for the current season.',
        subdomainId: 'D3',
      },
      {
        name: 'Membership',
        definition: 'What a member pays once a season to belong to the association.',
        subdomainId: 'D3',
      },
      {
        name: 'Season',
        definition: 'The year the association lives by: September to August.',
        subdomainId: 'D3',
      },
      {
        name: 'Teacher',
        definition: 'A member who records practices and leads gatherings.',
        subdomainId: 'D1',
      },
      {
        name: 'Video',
        definition: 'A recorded practice or teaching, heard by its teacher before anyone else.',
        subdomainId: 'D1',
      },
      {
        name: 'Event',
        definition: 'A gathering on a date, in the hall or remote, holding a certain number of people.',
        subdomainId: 'D2',
      },
      {
        name: 'Registration',
        definition: 'A member taking one of the places a gathering holds.',
        subdomainId: 'D2',
      },
    ],
    rules: [
      { id: 'R1', statement: 'Only a member can watch a video.', state: 'agreed', subdomainId: 'D1' },
      {
        id: 'R3',
        statement: 'A video is shared only after the teacher who recorded it has heard it again.',
        state: 'proposed',
        subdomainId: 'D1',
      },
      {
        id: 'R4',
        statement: 'An event holds a certain number of people, and places stop being given when they are taken.',
        state: 'agreed',
        subdomainId: 'D2',
      },
      {
        id: 'R5',
        statement: 'A member can give a place back up to twenty-four hours before the event.',
        state: 'proposed',
        subdomainId: 'D2',
      },
      {
        id: 'R2',
        statement: 'A season runs from the first of September to the end of August.',
        state: 'agreed',
        subdomainId: 'D3',
      },
      {
        id: 'R6',
        statement:
          'A member whose membership has lapsed keeps what they attended but can no longer take a place.',
        state: 'proposed',
        subdomainId: 'D3',
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
