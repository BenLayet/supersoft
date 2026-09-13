'use server'

import { revalidatePath } from 'next/cache'
import {
  agree,
  answerQuestion,
  deploy,
  failed,
  finish,
  planVersion,
  releasableStories,
  restate,
  start,
  succeeded,
} from '@supersoft/domain'
import type { Domain, Priority, Project, Source, Story, Version } from '@supersoft/domain'
import { inMemoryProjectStore as store } from '@/prototype/in-memory-project-store'

const text = (formData: FormData, field: string): string => {
  const value = formData.get(field)
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`Missing ${field}`)
  return value.trim()
}

const nextId = (prefix: string, taken: readonly { id: string }[]): string => {
  const numbers = taken.map((item) => Number(item.id.slice(prefix.length)) || 0)
  return `${prefix}${Math.max(0, ...numbers) + 1}`
}

/** Every action is the same shape: read the project, apply the domain, write it back. */
const change = async (apply: (project: Project) => Project): Promise<void> => {
  await store.save(apply(await store.load()))
  revalidatePath('/', 'layout')
}

const withDomain = (project: Project, domain: Partial<Domain>): Project => ({
  ...project,
  domain: { ...project.domain, ...domain },
})

const mapById = <T extends { id: string }>(items: readonly T[], id: string, apply: (item: T) => T) =>
  items.map((item) => (item.id === id ? apply(item) : item))

const mapByName = (versions: readonly Version[], name: string, apply: (v: Version) => Version) =>
  versions.map((version) => (version.name === name ? apply(version) : version))

/* The informal side of the domain. */

export async function keepSource(formData: FormData) {
  const kind = text(formData, 'kind') as Source['kind']
  const title = text(formData, 'title')
  const from = text(formData, 'from')
  await change((project) =>
    withDomain(project, {
      sources: [
        ...project.domain.sources,
        { id: nextId('M', project.domain.sources), kind, title, from },
      ],
    }),
  )
}

export async function askQuestion(formData: FormData) {
  const asked = text(formData, 'asked')
  await change((project) =>
    withDomain(project, {
      questions: [
        ...project.domain.questions,
        { id: nextId('Q', project.domain.questions), asked },
      ],
    }),
  )
}

export async function answer(formData: FormData) {
  const id = text(formData, 'id')
  const said = text(formData, 'answer')
  await change((project) =>
    withDomain(project, {
      questions: mapById(project.domain.questions, id, (question) =>
        answerQuestion(question, said),
      ),
    }),
  )
}

/* The formal side: the lexicon and the description. */

export async function defineTerm(formData: FormData) {
  const name = text(formData, 'name')
  const definition = text(formData, 'definition')
  await change((project) =>
    withDomain(project, { terms: [...project.domain.terms, { name, definition }] }),
  )
}

export async function writeRule(formData: FormData) {
  const statement = text(formData, 'statement')
  await change((project) =>
    withDomain(project, {
      rules: [
        ...project.domain.rules,
        { id: nextId('R', project.domain.rules), statement, state: 'proposed' },
      ],
    }),
  )
}

export async function agreeRule(formData: FormData) {
  const id = text(formData, 'id')
  await change((project) => withDomain(project, { rules: mapById(project.domain.rules, id, agree) }))
}

export async function restateRule(formData: FormData) {
  const id = text(formData, 'id')
  const statement = text(formData, 'statement')
  await change((project) =>
    withDomain(project, {
      rules: mapById(project.domain.rules, id, (rule) => restate(rule, statement)),
    }),
  )
}

/* The solution. */

export async function addFeature(formData: FormData) {
  const name = text(formData, 'name')
  const purpose = text(formData, 'purpose')
  await change((project) => ({
    ...project,
    features: [...project.features, { id: nextId('F', project.features), name, purpose }],
  }))
}

export async function addStory(formData: FormData) {
  const story: Omit<Story, 'id'> = {
    featureId: text(formData, 'featureId'),
    role: text(formData, 'role'),
    intention: text(formData, 'intention'),
    reason: text(formData, 'reason'),
    priority: text(formData, 'priority') as Priority,
    state: 'to_do',
  }
  await change((project) => ({
    ...project,
    stories: [...project.stories, { id: nextId('S', project.stories), ...story }],
  }))
}

export async function startStory(formData: FormData) {
  const id = text(formData, 'id')
  await change((project) => ({ ...project, stories: mapById(project.stories, id, start) }))
}

export async function finishStory(formData: FormData) {
  const id = text(formData, 'id')
  await change((project) => ({ ...project, stories: mapById(project.stories, id, finish) }))
}

export async function cutVersion(formData: FormData) {
  const name = text(formData, 'name')
  await change((project) => ({
    ...project,
    versions: [
      ...project.versions,
      planVersion(name, releasableStories(project.stories, project.versions)),
    ],
  }))
}

export async function startDeployment(formData: FormData) {
  const name = text(formData, 'name')
  await change((project) => ({ ...project, versions: mapByName(project.versions, name, deploy) }))
}

export async function deploymentSucceeded(formData: FormData) {
  const name = text(formData, 'name')
  await change((project) => ({ ...project, versions: mapByName(project.versions, name, succeeded) }))
}

export async function deploymentFailed(formData: FormData) {
  const name = text(formData, 'name')
  await change((project) => ({ ...project, versions: mapByName(project.versions, name, failed) }))
}
