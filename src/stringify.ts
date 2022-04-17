import FixedArray from './fixed-array'
import FixedMap from './fixed-map'
import FixedSet from './fixed-set'

const stringify = (value: unknown): string => {
  // fixed things
  if (value instanceof FixedArray || value instanceof FixedSet || value instanceof FixedMap) {
    // TODO: sort the values of sets (because order doesn't matter to their identity)
    return stringify(value.toArray())
  }

  // arrays
  if (Array.isArray(value)) {
    return `[${value.map(stringify).join()}]`
  }

  // objects
  if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
    return `{${Object.entries(value).sort().map(([key, value]) => `"${key}":${stringify(value)}`).join()}}`
  }

  // primitives
  return JSON.stringify(value)
}

export default stringify
