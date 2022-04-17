import fix from './fix'
import stringify from './stringify'

const fixedArrayCache: Map<string, FixedArray<unknown>> = new Map()

export default class FixedArray<V> {
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

  // TODO: fix this type signature
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
