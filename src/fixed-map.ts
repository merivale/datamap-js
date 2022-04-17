import fix from './fix'
import stringify from './stringify'

const fixedMapCache: Map<string, FixedMap<unknown, unknown>> = new Map()

export default class FixedMap<K, V> {
  #values: Map<K, V> = new Map()

  constructor (values: object = []) {
    // turn `this` into a FixedMap with the given values
    const entries = values instanceof Map ? values.entries() : Object.entries(values)
    const keysValuesArray = Array.isArray(values) ? values : Array.from(entries)
    const keysArray = keysValuesArray.map(([k]) => k)
    const valuesArray = keysValuesArray.map(([, v]) => v)
    this.#values = new Map()
    keysArray.forEach((k, index) => this.#values.set(fix(k), fix(valuesArray[index]!)))

    // stringify `this`
    const hash = stringify(this)

    // cache and return `this`, or return the cached version
    const existing = fixedMapCache.get(hash)
    if (existing) {
      return existing as FixedMap<K, V>
    } else {
      fixedMapCache.set(hash, this)
      return this
    }
  }

  get size (): number {
    return this.#values.size
  }

  toArray (): [K, V][] {
    return Array.from(this.entries())
  }

  clear (): FixedMap<K, V> {
    return new FixedMap()
  }

  delete (key: K): FixedMap<K, V> {
    const copy = new Map(this.#values)
    copy.delete(fix(key as any)) // FIXME
    return new FixedMap(copy)
  }

  get (key: K): V | undefined {
    return this.#values.get(fix(key as any)) // FIXME
  }

  has (key: K): boolean {
    return this.#values.has(fix(key as any)) // FIXME
  }

  set (key: K, value: V): FixedMap<K, V> {
    const copy = new Map(this.#values)
    copy.set(fix(key as any), fix(value as any)) // FIXME
    return new FixedMap(copy)
  }

  keys (): IterableIterator<K> {
    return this.#values.keys()
  }

  values (): IterableIterator<V> {
    return this.#values.values()
  }

  entries (): IterableIterator<[K, V]> {
    return this.#values.entries()
  }

  forEach (callback: (key: K, value: V, map: FixedMap<K, V>) => void, thisArg: unknown) {
    callback.bind(thisArg !== undefined ? thisArg : this)
    for (const [key, value] of this.entries()) {
      callback(key, value, this)
    }
  }

  *[Symbol.iterator] () {
    for (const entry of this.entries()) {
      yield entry
    }
  }
}
