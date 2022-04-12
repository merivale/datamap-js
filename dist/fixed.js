export function fix(value) {
    if (value instanceof FixedArray || value instanceof FixedSet || value instanceof FixedMap) {
        return value;
    }
    if (Array.isArray(value)) {
        return new FixedArray(value);
    }
    if (typeof value === 'object' && value !== null) {
        return new FixedMap(value);
    }
    return value;
}
export function fixSet(values) {
    return new FixedSet(values);
}
export function fixMap(values) {
    return new FixedMap(values);
}
export function unfix(value) {
    if (value instanceof FixedArray) {
        return value.toArray().map(unfix);
    }
    if (value instanceof FixedSet) {
        return new Set(value.toArray().map(unfix));
    }
    if (value instanceof FixedMap) {
        return new Map(value.toArray().map(([k, v]) => [unfix(k), unfix(v)]));
    }
    if (Array.isArray(value)) {
        return value.map(unfix);
    }
    if (typeof value === 'object' && value !== null) {
        return Object.entries(value).reduce((acc, [key, value]) => ({ ...acc, [key]: unfix(value) }), {});
    }
    return value;
}
export function stringify(value) {
    if (value instanceof FixedArray || value instanceof FixedSet || value instanceof FixedMap) {
        return stringify(value.toArray());
    }
    if (Array.isArray(value)) {
        return `[${value.map(stringify).join()}]`;
    }
    if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
        return `{${Object.entries(value).sort().map(([key, value]) => `"${key}":${stringify(value)}`).join()}}`;
    }
    return JSON.stringify(value);
}
export class FixedArray {
    #values = [];
    constructor(values = []) {
        this.#values = values.map(fix);
        const hash = stringify(this);
        const existing = fixedArrayCache.get(hash);
        if (existing) {
            return existing;
        }
        else {
            fixedArrayCache.set(hash, this);
            return this;
        }
    }
    get length() {
        return this.#values.length;
    }
    toArray() {
        return [...this.#values];
    }
    get(index) {
        return this.#values[index];
    }
    first() {
        return this.#values[0];
    }
    last() {
        return this.#values[this.#values.length - 1];
    }
    concat(...items) {
        return new FixedArray(this.#values.concat(...items.map(fix)));
    }
    copyWithin(target, start, end) {
        const copy = this.toArray();
        copy.copyWithin(target, start, end);
        return new FixedArray(copy);
    }
    entries() {
        return this.toArray().entries();
    }
    every(cb) {
        return this.toArray().every(cb);
    }
    fill(value, start, end) {
        return new FixedArray(this.toArray().fill(fix(value), start, end));
    }
    filter(cb) {
        return new FixedArray(this.toArray().filter(cb));
    }
    find(cb) {
        return this.toArray().find(cb);
    }
    findIndex(cb) {
        return this.toArray().findIndex(cb);
    }
    flat(depth) {
        return new FixedArray(this.#values.flat(depth));
    }
    flatMap(cb) {
        return new FixedArray(this.toArray().flatMap(cb));
    }
    forEach(callback, thisArg) {
        callback.bind(thisArg !== undefined ? thisArg : this);
        for (const [index, value] of this.entries()) {
            callback(value, index, this);
        }
    }
    includes(value) {
        return this.#values.includes(value);
    }
    indexOf(value) {
        return this.#values.indexOf(value);
    }
    join(separator) {
        return this.#values.join(separator);
    }
    keys() {
        return this.#values.keys();
    }
    lastIndexOf(value) {
        return this.#values.lastIndexOf(value);
    }
    map(cb) {
        return new FixedArray(this.toArray().map(cb));
    }
    pop() {
        return new FixedArray(this.toArray().slice(0, -1));
    }
    push(...values) {
        return new FixedArray([...this.#values, ...values.map(fix)]);
    }
    reduce(cb, initialValue) {
        return this.toArray().reduce(cb, initialValue);
    }
    reduceRight(cb, initialValue) {
        return this.toArray().reduceRight(cb, initialValue);
    }
    reverse() {
        return new FixedArray(this.toArray().reverse());
    }
    shift() {
        return new FixedArray(this.toArray().slice(1));
    }
    slice(start, end) {
        return new FixedArray(this.toArray().slice(start, end));
    }
    some(cb) {
        return this.toArray().some(cb);
    }
    sort(cb) {
        if (this.#values.every(x => typeof x === 'number') && cb === undefined) {
            cb = (a, b) => a - b;
        }
        return new FixedArray(this.toArray().sort(cb));
    }
    splice(start, deleteCount, ...items) {
        const copy = this.toArray();
        copy.splice(start, deleteCount, ...items);
        return new FixedArray(copy);
    }
    toLocaleString() {
        return this.#values.toLocaleString();
    }
    toString() {
        return this.#values.toString();
    }
    unshift(...values) {
        return new FixedArray([...values.map(fix), ...this.#values]);
    }
    values() {
        return this.#values.values();
    }
    *[Symbol.iterator]() {
        for (const value of this.values()) {
            yield value;
        }
    }
}
export class FixedSet {
    #values = new Set();
    constructor(values = []) {
        values = Array.isArray(values) ? values : Array.from(values.values());
        this.#values = values.map(fix);
        const hash = stringify(this);
        const existing = fixedSetCache.get(hash);
        if (existing) {
            return existing;
        }
        else {
            fixedSetCache.set(hash, this);
            return this;
        }
    }
    get size() {
        return this.#values.size;
    }
    toArray() {
        return [...this.#values];
    }
    add(value) {
        const copy = new Set(this.#values);
        copy.add(fix(value));
        return new FixedSet(copy);
    }
    clear() {
        return new FixedSet();
    }
    delete(value) {
        const copy = new Set(this.#values);
        copy.delete(fix(value));
        return new FixedSet(copy);
    }
    has(value) {
        return this.#values.has(fix(value));
    }
    values() {
        return this.#values.values();
    }
    keys() {
        return this.#values.keys();
    }
    entries() {
        return this.#values.entries();
    }
    forEach(callback, thisArg) {
        callback.bind(thisArg !== undefined ? thisArg : this);
        for (const value of this.values()) {
            callback(value, this);
        }
    }
    *[Symbol.iterator]() {
        for (const value of this.values()) {
            yield value;
        }
    }
}
export class FixedMap {
    #values = new Map();
    constructor(values = []) {
        const entries = values instanceof Map ? values.entries() : Object.entries(values);
        const keysValuesArray = Array.isArray(values) ? values : Array.from(entries);
        const keysArray = keysValuesArray.map(([k]) => k);
        const valuesArray = keysValuesArray.map(([, v]) => v);
        this.#values = new Map();
        keysArray.forEach((k, index) => this.#values.set(fix(k), fix(valuesArray[index])));
        const hash = stringify(this);
        const existing = fixedMapCache.get(hash);
        if (existing) {
            return existing;
        }
        else {
            fixedMapCache.set(hash, this);
            return this;
        }
    }
    get size() {
        return this.#values.size;
    }
    toArray() {
        return Array.from(this.entries());
    }
    clear() {
        return new FixedMap();
    }
    delete(key) {
        const copy = new Map(this.#values);
        copy.delete(fix(key));
        return new FixedMap(copy);
    }
    get(key) {
        return this.#values.get(fix(key));
    }
    has(key) {
        return this.#values.has(fix(key));
    }
    set(key, value) {
        const copy = new Map(this.#values);
        copy.set(fix(key), fix(value));
        return new FixedMap(copy);
    }
    keys() {
        return this.#values.keys();
    }
    values() {
        return this.#values.values();
    }
    entries() {
        return this.#values.entries();
    }
    forEach(callback, thisArg) {
        callback.bind(thisArg !== undefined ? thisArg : this);
        for (const [key, value] of this.entries()) {
            callback(key, value, this);
        }
    }
    *[Symbol.iterator]() {
        for (const entry of this.entries()) {
            yield entry;
        }
    }
}
const fixedArrayCache = new Map();
const fixedSetCache = new Map();
const fixedMapCache = new Map();
