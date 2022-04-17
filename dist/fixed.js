// src/fixed-map.ts
var fixedMapCache = /* @__PURE__ */ new Map();
var FixedMap = class {
  #values = /* @__PURE__ */ new Map();
  constructor(values = []) {
    const entries = values instanceof Map ? values.entries() : Object.entries(values);
    const keysValuesArray = Array.isArray(values) ? values : Array.from(entries);
    const keysArray = keysValuesArray.map(([k]) => k);
    const valuesArray = keysValuesArray.map(([, v]) => v);
    this.#values = /* @__PURE__ */ new Map();
    keysArray.forEach((k, index) => this.#values.set(fix_default(k), fix_default(valuesArray[index])));
    const hash = stringify_default(this);
    const existing = fixedMapCache.get(hash);
    if (existing) {
      return existing;
    } else {
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
    copy.delete(fix_default(key));
    return new FixedMap(copy);
  }
  get(key) {
    return this.#values.get(fix_default(key));
  }
  has(key) {
    return this.#values.has(fix_default(key));
  }
  set(key, value) {
    const copy = new Map(this.#values);
    copy.set(fix_default(key), fix_default(value));
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
    callback.bind(thisArg !== void 0 ? thisArg : this);
    for (const [key, value] of this.entries()) {
      callback(key, value, this);
    }
  }
  *[Symbol.iterator]() {
    for (const entry of this.entries()) {
      yield entry;
    }
  }
};

// src/fixed-set.ts
var fixedSetCache = /* @__PURE__ */ new Map();
var FixedSet = class {
  #values = /* @__PURE__ */ new Set();
  constructor(values = []) {
    values = Array.isArray(values) ? values : Array.from(values.values());
    this.#values = values.map(fix_default);
    const hash = stringify_default(this);
    const existing = fixedSetCache.get(hash);
    if (existing) {
      return existing;
    } else {
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
    copy.add(fix_default(value));
    return new FixedSet(copy);
  }
  clear() {
    return new FixedSet();
  }
  delete(value) {
    const copy = new Set(this.#values);
    copy.delete(fix_default(value));
    return new FixedSet(copy);
  }
  has(value) {
    return this.#values.has(fix_default(value));
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
    callback.bind(thisArg !== void 0 ? thisArg : this);
    for (const value of this.values()) {
      callback(value, this);
    }
  }
  *[Symbol.iterator]() {
    for (const value of this.values()) {
      yield value;
    }
  }
};

// src/stringify.ts
var stringify = (value) => {
  if (value instanceof FixedArray || value instanceof FixedSet || value instanceof FixedMap) {
    return stringify(value.toArray());
  }
  if (Array.isArray(value)) {
    return `[${value.map(stringify).join()}]`;
  }
  if (typeof value === "function" || typeof value === "object" && value !== null) {
    return `{${Object.entries(value).sort().map(([key, value2]) => `"${key}":${stringify(value2)}`).join()}}`;
  }
  return JSON.stringify(value);
};
var stringify_default = stringify;

// src/fixed-array.ts
var fixedArrayCache = /* @__PURE__ */ new Map();
var FixedArray = class {
  #values = [];
  constructor(values = []) {
    this.#values = values.map(fix_default);
    const hash = stringify_default(this);
    const existing = fixedArrayCache.get(hash);
    if (existing) {
      return existing;
    } else {
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
    return new FixedArray(this.#values.concat(...items.map(fix_default)));
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
    return new FixedArray(this.toArray().fill(fix_default(value), start, end));
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
    callback.bind(thisArg !== void 0 ? thisArg : this);
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
    return new FixedArray([...this.#values, ...values.map(fix_default)]);
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
    if (this.#values.every((x) => typeof x === "number") && cb === void 0) {
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
    return new FixedArray([...values.map(fix_default), ...this.#values]);
  }
  values() {
    return this.#values.values();
  }
  *[Symbol.iterator]() {
    for (const value of this.values()) {
      yield value;
    }
  }
};

// src/fix.ts
function fix(value) {
  if (value instanceof FixedArray || value instanceof FixedSet || value instanceof FixedMap) {
    return value;
  }
  if (Array.isArray(value)) {
    return new FixedArray(value);
  }
  if (value instanceof Set) {
    return new FixedSet(value);
  }
  if (typeof value === "object" && value !== null) {
    return new FixedMap(value);
  }
  return value;
}
var fix_default = fix;

// src/fix-map.ts
function fixMap(values) {
  return new FixedMap(values);
}
var fix_map_default = fixMap;

// src/fix-set.ts
function fixSet(values) {
  return new FixedSet(values);
}
var fix_set_default = fixSet;

// src/unfix.ts
function unfix(value) {
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
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).reduce((acc, [key, value2]) => ({ ...acc, [key]: unfix(value2) }), {});
  }
  return value;
}
var unfix_default = unfix;
export {
  FixedArray,
  FixedMap,
  FixedSet,
  fix_default as fix,
  fix_map_default as fixMap,
  fix_set_default as fixSet,
  unfix_default as unfix
};
