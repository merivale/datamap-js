import { parse, stringify } from './stringify'

export class DataMap<KeyType, ValueType> {
  #keys: string[] = []
  #values: ValueType[] = []

  get size (): number {
    return this.#keys.length
  }

  clear (): void {
    this.#keys.length = 0
    this.#values.length = 0
  }

  delete (key: KeyType): boolean {
    const index = this.#keys.indexOf(stringify(key))
    if (index > -1) {
      this.#keys.splice(index, 1)
      this.#values.splice(index, 1)
      return true
    }
    return false
  }

  get (key: KeyType): ValueType | undefined {
    const index = this.#keys.indexOf(stringify(key))
    return index > -1 ? this.#values[index] : undefined
  }

  has (key: KeyType): boolean {
    const index = this.#keys.indexOf(stringify(key))
    return index > -1
  }

  set (key: KeyType, value: ValueType): this {
    const index = this.#keys.indexOf(stringify(key))
    if (index > -1) {
      this.#values[index] = value
    } else {
      this.#keys.push(stringify(key))
      this.#values.push(value)
    }
    return this
  }

  keys (): KeyType[] {
    return this.#keys.map(x => parse(x) as KeyType)
  }

  values (): ValueType[] {
    return this.#values
  }

  entries (): [KeyType, ValueType][] {
    return this.#keys.map((key, index) => [parse(key) as KeyType, this.#values[index]])
  }

  forEach (callback: (key: KeyType, value: ValueType, map: DataMap<KeyType, ValueType>) => void, thisArg: unknown) {
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
