import FixedArray from './fixed-array'
import FixedMap from './fixed-map'
import FixedSet from './fixed-set'

const stringify = (value: unknown): string => {
  // fixed arrays and maps
  if (value instanceof FixedArray || value instanceof FixedMap) {
    return stringify(value.toArray())
  }

  // fixed sets
  if (value instanceof FixedSet) {
    // stringify elements first, then sort - because order doesn't matter for a sets identity
    return `[${value.toArray().map(stringify).sort().join()}]`
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
  return value === undefined ? 'undefined' : JSON.stringify(value)
}

export default stringify
