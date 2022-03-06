import { parse, stringify } from './stringify';
export class DataSet {
    #values = [];
    get size() {
        return this.#values.length;
    }
    add(value) {
        if (this.#values.includes(stringify(value))) {
            return this;
        }
        this.#values.push(stringify(value));
        return this;
    }
    clear() {
        this.#values.length = 0;
    }
    delete(value) {
        const index = this.#values.indexOf(stringify(value));
        if (index > -1) {
            this.#values.splice(index, 1);
            return true;
        }
        return false;
    }
    has(value) {
        const index = this.#values.indexOf(stringify(value));
        return index > -1;
    }
    values() {
        return this.#values.map(value => parse(value));
    }
    keys = this.values;
    entries() {
        return this.#values.map(value => [parse(value), parse(value)]);
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
