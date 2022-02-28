import stringify from './stringify';
export class DataMap {
    #keys = [];
    #values = [];
    get size() {
        return this.#keys.length;
    }
    clear() {
        this.#keys.length = 0;
        this.#values.length = 0;
    }
    delete(key) {
        const index = this.#keys.indexOf(stringify(key));
        if (index > -1) {
            this.#keys.splice(index, 1);
            this.#values.splice(index, 1);
            return true;
        }
        return false;
    }
    get(key) {
        const index = this.#keys.indexOf(stringify(key));
        return index > -1 ? this.#values[index] : undefined;
    }
    has(key) {
        const index = this.#keys.indexOf(stringify(key));
        return index > -1;
    }
    set(key, value) {
        const index = this.#keys.indexOf(stringify(key));
        if (index > -1) {
            this.#values[index] = value;
        }
        else {
            this.#keys.push(stringify(key));
            this.#values.push(value);
        }
        return this;
    }
    keys() {
        return this.#keys.map(x => JSON.parse(x));
    }
    values() {
        return this.#values;
    }
    entries() {
        return this.#keys.map((key, index) => [JSON.parse(key), this.#values[index]]);
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
