type Primitive = string | number | bigint | boolean | symbol | undefined | null

export function fix<K, V, T extends FixedArray<V> | FixedSet<V> | FixedMap<K, V>> (value: T): T
export function fix<V> (value: V[]): FixedArray<V>
export function fix<K extends string | number | symbol, V> (value: Record<K, V>): FixedMap<K, V>
export function fix (value: object): FixedMap<string, unknown>
export function fix<T extends Primitive> (value: T): T
export function fix (value: unknown): unknown {
  // pass Data things straight through
  if (value instanceof FixedArray || value instanceof FixedSet || value instanceof FixedMap) {
    return value
  }

  // convert Arrays to DataArrays
  if (Array.isArray(value)) {
    return new FixedArray(value)
  }

  // convert Objects to DataMaps
  if (typeof value === 'object' && value !== null) {
    return new FixedMap(value)
  }

  // pass primitives straight through
  return value
}

export function fixSet<V> (values: V[]): FixedSet<V> {
  return new FixedSet(values)
}

export function fixMap<K, V> (values: object): FixedMap<K, V> {
  return new FixedMap(values)
}

export function unfix<V> (value: FixedArray<V>): Array<V>
export function unfix<V> (value: FixedSet<V>): Set<V>
export function unfix<K, V> (value: FixedMap<K, V>): Map<K, V>
export function unfix<T extends Primitive> (value: T): T
export function unfix (value: unknown): unknown {
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

export function stringify (value: unknown): string {
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

export class FixedArray<V> {
  #values: V[] = []

  constructor (values: V[] = []) {
    // turn `this` into a FixedArray with the given values
    this.#values = values.map(fix) as any // FIXME

    // stringify `this`
    const hash = stringify(this)

    // cache and return `this`, or return the cached version
    const existing = fixedArrayCache.get(hash)
    if (existing) {
      return existing as FixedArray<V>
    } else {
      fixedArrayCache.set(hash, this)
      return this
    }
  }

  get length (): number {
    return this.#values.length
  }

  toArray (): V[] {
    return [...this.#values]
  }

  get (index: number): V | undefined {
    return this.#values[index]
  }

  first (): V | undefined {
    return this.#values[0]
  }

  last (): V | undefined {
    return this.#values[this.#values.length - 1]
  }

  concat (...items: V[]): FixedArray<V> {
    return new FixedArray(this.#values.concat(...items.map(fix) as any)) // FIXME
  }

  copyWithin (target: number, start: number, end?: number): FixedArray<V> {
    const copy = this.toArray()
    // TODO: check what happens when copying objects inside an array
    copy.copyWithin(target, start, end)
    return new FixedArray(copy)
  }

  entries (): IterableIterator<[number, V]> {
    return this.toArray().entries()
  }

  every (cb: (value: V, index: number, array: V[]) => boolean) {
    return this.toArray().every(cb)
  }

  fill (value: V, start?: number, end?: number): FixedArray<V> {
    return new FixedArray(this.toArray().fill(fix(value as any) as any, start, end)) // FIXME
  }

  filter (cb: (value: V, index: number, array: V[]) => boolean): FixedArray<V> {
    return new FixedArray(this.toArray().filter(cb))
  }

  find (cb: (value: V, index: number, array: V[]) => boolean): V | undefined {
    return this.toArray().find(cb)
  }

  findIndex (cb: (value: V, index: number, array: V[]) => boolean): number {
    return this.toArray().findIndex(cb)
  }

  flat<D extends number = 1> (depth?: D): FixedArray<FlatArray<V[], D>> {
    // TODO: this won't work for FixedArrays of FixedArrays
    return new FixedArray(this.#values.flat(depth))
  }

  flatMap (cb: (value: V, index: number, array: V[]) => unknown): FixedArray<unknown> {
    // TODO: presumably this won't work for FixedArrays of FixedArrays either
    return new FixedArray(this.toArray().flatMap(cb))
  }

  forEach (callback: (value: V, index: number, fixedArray: FixedArray<V>) => void, thisArg: unknown) {
    callback.bind(thisArg !== undefined ? thisArg : this)
    for (const [index, value] of this.entries()) {
      callback(value, index, this)
    }
  }

  includes (value: V): boolean {
    return this.#values.includes(value)
  }

  indexOf (value: V): number {
    return this.#values.indexOf(value)
  }

  join (separator?: string): string {
    return this.#values.join(separator)
  }

  keys (): IterableIterator<number> {
    return this.#values.keys()
  }

  lastIndexOf (value: V): number {
    return this.#values.lastIndexOf(value)
  }

  map (cb: (value: V, index: number, array: V[]) => unknown): FixedArray<unknown> {
    return new FixedArray(this.toArray().map(cb))
  }

  pop (): FixedArray<V> {
    return new FixedArray(this.toArray().slice(0, -1))
  }

  push (...values: V[]): FixedArray<V> {
    return new FixedArray([...this.#values, ...values.map(fix) as any]) // FIXME
  }

  reduce (cb: (previousValue: V, currentValue: V, currentIndex: number, array: V[]) => V, initialValue?: V): V
  reduce<U> (cb: (previousValue: U, currentValue: V, currentIndex: number, array: V[]) => U, initialValue: U): U {
    return this.toArray().reduce(cb, initialValue)
  }

  reduceRight (cb: (previousValue: V, currentValue: V, currentIndex: number, array: V[]) => V, initialValue: V): V
  reduceRight<U> (cb: (previousValue: U, currentValue: V, currentIndex: number, array: V[]) => U, initialValue: U): U {
    return this.toArray().reduceRight(cb, initialValue)
  }

  reverse (): FixedArray<V> {
    return new FixedArray(this.toArray().reverse())
  }

  shift (): FixedArray<V> {
    return new FixedArray(this.toArray().slice(1))
  }

  slice (start?: number, end?: number): FixedArray<V> {
    return new FixedArray(this.toArray().slice(start, end))
  }

  some (cb: (value: V, index: number, array: V[]) => boolean): boolean {
    return this.toArray().some(cb)
  }

  sort (cb?: (a: V, b: V) => number): FixedArray<V> {
    if (this.#values.every(x => typeof x === 'number') && cb === undefined) {
      cb = (a: V, b: V) => (a as unknown as number) - (b as unknown as number)
    }
    return new FixedArray(this.toArray().sort(cb))
  }

  splice (start: number, deleteCount?: number): FixedArray<V>
  splice (start: number, deleteCount: number, ...items: V[]): FixedArray<V> {
    const copy = this.toArray()
    copy.splice(start, deleteCount, ...items)
    return new FixedArray(copy)
  }

  toLocaleString (): string {
    return this.#values.toLocaleString()
  }

  toString (): string {
    return this.#values.toString()
  }

  unshift (...values: V[]): FixedArray<V> {
    return new FixedArray([...values.map(fix) as any, ...this.#values]) // FIXME
  }

  values (): IterableIterator<V> {
    return this.#values.values()
  }

  *[Symbol.iterator] () {
    for (const value of this.values()) {
      yield value
    }
  }
}

export class FixedSet<V> {
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

export class FixedMap<K, V> {
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

const fixedArrayCache: Map<string, FixedArray<unknown>> = new Map()
const fixedSetCache: Map<string, FixedSet<unknown>> = new Map()
const fixedMapCache: Map<string, FixedMap<unknown, unknown>> = new Map()
