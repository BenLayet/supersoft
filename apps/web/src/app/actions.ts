'use server'

import { revalidatePath } from 'next/cache'
import {
  addDocument,
  agree,
  answerQuestion,
  finish,
  mayChange,
  planVersion,
  releasableStories,
  restate,
  start,
  validate,
} from '@supersoft/domain'
import type { Business, DocumentKind, Priority, Project, Story } from '@supersoft/domain'
import { cookieArrivals } from '@/prototype/cookie-arrivals'
import { findProject, inMemoryProjectStore as store } from '@/prototype/in-memory-project-store'

const text = (formData: FormData, field: string): string => {
  const value = formData.get(field)
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`Missing ${field}`)
  return value.trim()
}

/** A field that may be left empty. */
const optional = (formData: FormData, field: string): string | undefined => {
  const value = formData.get(field)
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

const nextId = (prefix: string, taken: readonly { id: string }[]): string => {
  const numbers = taken.map((item) => Number(item.id.slice(prefix.length)) || 0)
  return `${prefix}${Math.max(0, ...numbers) + 1}`
}

/**
 * Every action is the same shape: say who you are, be recognised by the
 * project, then read it, apply the change, and write it back.
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

const withBusiness = (project: Project, business: Partial<Business>): Project => ({
  ...project,
  business: { ...project.business, ...business },
})

const mapById = <T extends { id: string }>(items: readonly T[], id: string, apply: (item: T) => T) =>
  items.map((item) => (item.id === id ? apply(item) : item))

/* The scope, then the workshops: what was said, on the day it was said. */

export async function rewriteScope(formData: FormData) {
  const scope = text(formData, 'scope')
  await change(formData, (project) => ({ ...project, scope }))
}

export async function keepWorkshop(formData: FormData) {
  const date = text(formData, 'date')
  const title = text(formData, 'title')
  await change(formData, (project) =>
    withBusiness(project, {
      workshops: [
        ...project.business.workshops,
        { id: nextId('W', project.business.workshops), date, title, documents: [] },
      ],
    }),
  )
}

export async function keepDocument(formData: FormData) {
  const workshopId = text(formData, 'workshopId')
  const kind = text(formData, 'kind') as DocumentKind
  const title = text(formData, 'title')
  const location = optional(formData, 'location')
  await change(formData, (project) =>
    withBusiness(project, {
      workshops: mapById(project.business.workshops, workshopId, (workshop) =>
        addDocument(workshop, { kind, title, location }),
      ),
    }),
  )
}

/* The domains of the business, their lexicon, their rules and their questions. */

export async function addDomain(formData: FormData) {
  const name = text(formData, 'name')
  const description = text(formData, 'description')
  await change(formData, (project) =>
    withBusiness(project, {
      domains: [
        ...project.business.domains,
        { id: nextId('D', project.business.domains), name, description },
      ],
    }),
  )
}

export async function defineTerm(formData: FormData) {
  const domainId = text(formData, 'domainId')
  const name = text(formData, 'name')
  const definition = text(formData, 'definition')
  await change(formData, (project) =>
    withBusiness(project, { terms: [...project.business.terms, { name, definition, domainId }] }),
  )
}

export async function writeRule(formData: FormData) {
  const domainId = text(formData, 'domainId')
  const statement = text(formData, 'statement')
  await change(formData, (project) =>
    withBusiness(project, {
      rules: [
        ...project.business.rules,
        { id: nextId('R', project.business.rules), statement, state: 'proposed', domainId },
      ],
    }),
  )
}

export async function askQuestion(formData: FormData) {
  const domainId = text(formData, 'domainId')
  const asked = text(formData, 'asked')
  await change(formData, (project) =>
    withBusiness(project, {
      questions: [
        ...project.business.questions,
        { id: nextId('Q', project.business.questions), asked, domainId },
      ],
    }),
  )
}

export async function answer(formData: FormData) {
  const id = text(formData, 'id')
  const said = text(formData, 'answer')
  await change(formData, (project) =>
    withBusiness(project, {
      questions: mapById(project.business.questions, id, (question) =>
        answerQuestion(question, said),
      ),
    }),
  )
}

export async function agreeRule(formData: FormData) {
  const id = text(formData, 'id')
  await change(formData, (project) =>
    withBusiness(project, { rules: mapById(project.business.rules, id, agree) }),
  )
}

export async function restateRule(formData: FormData) {
  const id = text(formData, 'id')
  const statement = text(formData, 'statement')
  await change(formData, (project) =>
    withBusiness(project, {
      rules: mapById(project.business.rules, id, (rule) => restate(rule, statement)),
    }),
  )
}

/* Features and their stories. */

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

/* Prototypes of a feature, tried before anything is real. */

export async function addPrototype(formData: FormData) {
  const featureId = text(formData, 'featureId')
  const name = text(formData, 'name')
  const location = String(formData.get('location') ?? '').trim() || undefined
  await change(formData, (project) => ({
    ...project,
    prototypes: [
      ...project.prototypes,
      { id: nextId('P', project.prototypes), featureId, name, location, state: 'being_tried' },
    ],
  }))
}

export async function validatePrototype(formData: FormData) {
  const id = text(formData, 'id')
  await change(formData, (project) => ({
    ...project,
    prototypes: mapById(project.prototypes, id, validate),
  }))
}

/* Versions, gathering what is done. */

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
