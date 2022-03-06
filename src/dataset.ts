import { parse, stringify } from './stringify'

export class DataSet<ValueType> {
  #values: string[] = []

  get size (): number {
    return this.#values.length
  }

  add (value: ValueType): this {
    if (this.#values.includes(stringify(value))) {
      return this
    }
    this.#values.push(stringify(value))
    return this
  }

  clear (): void {
    this.#values.length = 0
  }

  delete (value: ValueType): boolean {
    const index = this.#values.indexOf(stringify(value))
    if (index > -1) {
      this.#values.splice(index, 1)
      return true
    }
    return false
  }

  has (value: ValueType): boolean {
    const index = this.#values.indexOf(stringify(value))
    return index > -1
  }

  values (): ValueType[] {
    return this.#values.map(value => parse(value) as ValueType)
  }

  keys = this.values

  entries (): [ValueType, ValueType][] {
    return this.#values.map(value => [parse(value) as ValueType, parse(value) as ValueType])
  }

  forEach (callback: (value: ValueType, map: DataSet<ValueType>) => void, thisArg: unknown) {
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
