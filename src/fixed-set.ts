import fix from './fix'
import stringify from './stringify'

const fixedSetCache: Map<string, FixedSet<unknown>> = new Map()

export default class FixedSet<V> {
  #values: Set<V> = new Set()

  constructor (values: V[] | Set<V> = []) {
    // turn `this` into a FixedSet with the given values
    values = Array.isArray(values) ? values : Array.from(values.values())
    this.#values = values.map(fix) as any // FIXME

    // stringify `this`
    const hash = stringify(this)

    // cache and return `this`, or return the cached version
    const existing = fixedSetCache.get(hash)
    if (existing) {
      return existing as FixedSet<V>
    } else {
      fixedSetCache.set(hash, this)
      return this
    }
  }

  get size (): number {
    return this.#values.size
  }

  toArray (): V[] {
    return [...this.#values]
  }

  add (value: V): FixedSet<V> {
    const copy = new Set(this.#values)
    copy.add(fix(value as any)) // FIXME
    return new FixedSet(copy)
  }

  clear (): FixedSet<V> {
    return new FixedSet()
  }

  delete (value: V): FixedSet<V> {
    const copy = new Set(this.#values)
    copy.delete(fix(value as any))
    return new FixedSet(copy)
  }

  has (value: V): boolean {
    return this.#values.has(fix(value as any))
  }

  values (): IterableIterator<V> {
    return this.#values.values()
  }

  keys (): IterableIterator<V> {
    return this.#values.keys()
  }

  entries (): IterableIterator<[V, V]> {
    return this.#values.entries()
  }

  forEach (callback: (value: V, map: FixedSet<V>) => void, thisArg: unknown) {
    callback.bind(thisArg !== undefined ? thisArg : this)
    for (const value of this.values()) {
      callback(value, this)
    }
  }

  *[Symbol.iterator] () {
    for (const value of this.values()) {
      yield value
    }
  }
}
