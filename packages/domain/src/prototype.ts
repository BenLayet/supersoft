import type { Feature } from './feature'

export type PrototypeState = 'being_tried' | 'validated'

/**
 * The application as the customer and the people who will use it can try it,
 * before it is real. It applies the rules of the domain and never holds one of
 * its own.
 */
export interface Prototype {
  readonly id: string
  /** Every prototype belongs to exactly one feature. */
  readonly featureId: string
  readonly name: string
  /** Where it can be tried. */
  readonly location?: string
  readonly state: PrototypeState
}

/** What people can try of a feature. */
export const prototypesOf = (feature: Feature, prototypes: readonly Prototype[]): readonly Prototype[] => prototypes.filter((prototype) => prototype.featureId === feature.id)

/** Validation is an act by the customer, and it is given once. */
export const validate = (prototype: Prototype): Prototype => {
  if (prototype.state === 'validated') throw new Error(`Already validated: ${prototype.id}`)
  return { ...prototype, state: 'validated' }
}
