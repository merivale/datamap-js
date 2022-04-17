import type { Primitive } from './types'
import FixedArray from './fixed-array'
import FixedMap from './fixed-map'
import FixedSet from './fixed-set'

function unfix<V> (value: FixedArray<V>): Array<V>
function unfix<V> (value: FixedSet<V>): Set<V>
function unfix<K, V> (value: FixedMap<K, V>): Map<K, V>
function unfix<T extends Primitive> (value: T): T
function unfix (value: unknown): unknown {
  // fixed things
  if (value instanceof FixedArray) {
    return value.toArray().map(unfix)
  }

  if (value instanceof FixedSet) {
    return new Set(value.toArray().map(unfix))
  }

  if (value instanceof FixedMap) {
    return new Map(value.toArray().map(([k, v]) => [unfix(k), unfix(v)]))
  }

  // arrays
  if (Array.isArray(value)) {
    return value.map(unfix)
  }

  // objects
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).reduce((acc, [key, value]) => ({ ...acc, [key]: unfix(value) }), {})
  }

  // primitives
  return value
}

export default unfix
