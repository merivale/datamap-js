import type { Primitive } from './types'
import FixedArray from './fixed-array'
import FixedMap from './fixed-map'
import FixedSet from './fixed-set'

function fix<K, V, T extends FixedArray<V> | FixedSet<V> | FixedMap<K, V>> (value: T): T
function fix<V> (value: V[]): FixedArray<V>
function fix<V> (value: Set<V>): FixedSet<V>
function fix<K extends string | number | symbol, V> (value: Record<K, V>): FixedMap<K, V>
function fix (value: object): FixedMap<string, unknown>
function fix<T extends Primitive> (value: T): T
function fix (value: unknown): unknown {
  // pass Data things straight through
  if (value instanceof FixedArray || value instanceof FixedSet || value instanceof FixedMap) {
    return value
  }

  // convert Arrays to FixedArrays
  if (Array.isArray(value)) {
    return new FixedArray(value)
  }

  // convert Sets to FixedSets
  if (value instanceof Set) {
    return new FixedSet(value)
  }

  // convert Maps and other objects to FixedMaps
  if (typeof value === 'object' && value !== null) {
    return new FixedMap(value)
  }

  // pass primitives straight through
  return value
}

export default fix
