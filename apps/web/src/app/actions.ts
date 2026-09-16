'use server'

import { revalidatePath } from 'next/cache'
import {
  agree,
  answerQuestion,
  deploy,
  failed,
  finish,
  mayChange,
  planVersion,
  releasableStories,
  restate,
  start,
  succeeded,
} from '@supersoft/domain'
import type { Domain, Priority, Project, Source, Story, Version } from '@supersoft/domain'
import { cookieArrivals } from '@/prototype/cookie-arrivals'
import { findProject, inMemoryProjectStore as store } from '@/prototype/in-memory-project-store'

const text = (formData: FormData, field: string): string => {
  const value = formData.get(field)
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`Missing ${field}`)
  return value.trim()
}

const nextId = (prefix: string, taken: readonly { id: string }[]): string => {
  const numbers = taken.map((item) => Number(item.id.slice(prefix.length)) || 0)
  return `${prefix}${Math.max(0, ...numbers) + 1}`
}

/**
 * Every action is the same shape: say who you are, be recognised by the
 * project, then read it, apply the domain, and write it back.
 */
const change = async (
  formData: FormData,
  apply: (project: Project) => Project,
): Promise<void> => {
  const projectId = text(formData, 'projectId')
  const account = await cookieArrivals.whoIsHere()
  const found = await findProject(projectId, account)
  if (!found || !mayChange(found, account))
    throw new Error('Changing anything means saying who you are, and being recognised.')

  const project = await store.load(projectId)
  if (!project) throw new Error(`No such project: ${projectId}`)

  await store.save(apply(project))
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
  await change(formData, (project) =>
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
  await change(formData, (project) =>
    withDomain(project, {
      questions: [...project.domain.questions, { id: nextId('Q', project.domain.questions), asked }],
    }),
  )
}

export async function answer(formData: FormData) {
  const id = text(formData, 'id')
  const said = text(formData, 'answer')
  await change(formData, (project) =>
    withDomain(project, {
      questions: mapById(project.domain.questions, id, (question) =>
        answerQuestion(question, said),
      ),
    }),
  )
}

/* The formal side: the subdomains, their lexicon and their description. */

export async function addSubdomain(formData: FormData) {
  const name = text(formData, 'name')
  const description = text(formData, 'description')
  await change(formData, (project) =>
    withDomain(project, {
      subdomains: [
        ...project.domain.subdomains,
        { id: nextId('D', project.domain.subdomains), name, description },
      ],
    }),
  )
}

export async function defineTerm(formData: FormData) {
  const subdomainId = text(formData, 'subdomainId')
  const name = text(formData, 'name')
  const definition = text(formData, 'definition')
  await change(formData, (project) =>
    withDomain(project, { terms: [...project.domain.terms, { name, definition, subdomainId }] }),
  )
}

export async function writeRule(formData: FormData) {
  const subdomainId = text(formData, 'subdomainId')
  const statement = text(formData, 'statement')
  await change(formData, (project) =>
    withDomain(project, {
      rules: [
        ...project.domain.rules,
        { id: nextId('R', project.domain.rules), statement, state: 'proposed', subdomainId },
      ],
    }),
  )
}

export async function agreeRule(formData: FormData) {
  const id = text(formData, 'id')
  await change(formData, (project) =>
    withDomain(project, { rules: mapById(project.domain.rules, id, agree) }),
  )
}

export async function restateRule(formData: FormData) {
  const id = text(formData, 'id')
  const statement = text(formData, 'statement')
  await change(formData, (project) =>
    withDomain(project, {
      rules: mapById(project.domain.rules, id, (rule) => restate(rule, statement)),
    }),
  )
}

/* The solution. */

export async function addFeature(formData: FormData) {
  const name = text(formData, 'name')
  const purpose = text(formData, 'purpose')
  await change(formData, (project) => ({
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
  await change(formData, (project) => ({
    ...project,
    stories: [...project.stories, { id: nextId('S', project.stories), ...story }],
  }))
}

export async function startStory(formData: FormData) {
  const id = text(formData, 'id')
  await change(formData, (project) => ({ ...project, stories: mapById(project.stories, id, start) }))
}

export async function finishStory(formData: FormData) {
  const id = text(formData, 'id')
  await change(formData, (project) => ({
    ...project,
    stories: mapById(project.stories, id, finish),
  }))
}

export async function cutVersion(formData: FormData) {
  const name = text(formData, 'name')
  await change(formData, (project) => ({
    ...project,
    versions: [
      ...project.versions,
      planVersion(name, releasableStories(project.stories, project.versions)),
    ],
  }))
}

export async function startDeployment(formData: FormData) {
  const name = text(formData, 'name')
  await change(formData, (project) => ({
    ...project,
    versions: mapByName(project.versions, name, deploy),
  }))
}

export async function deploymentSucceeded(formData: FormData) {
  const name = text(formData, 'name')
  await change(formData, (project) => ({
    ...project,
    versions: mapByName(project.versions, name, succeeded),
  }))
}

export async function deploymentFailed(formData: FormData) {
  const name = text(formData, 'name')
  await change(formData, (project) => ({
    ...project,
    versions: mapByName(project.versions, name, failed),
  }))
}
