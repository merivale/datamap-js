export default class FixedMap<K, V> {
    #private;
    constructor(values?: object);
    get size(): number;
    toArray(): [K, V][];
    clear(): FixedMap<K, V>;
    delete(key: K): FixedMap<K, V>;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): FixedMap<K, V>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[K, V]>;
    forEach(callback: (key: K, value: V, map: FixedMap<K, V>) => void, thisArg: unknown): void;
    [Symbol.iterator](): Generator<[K, V], void, unknown>;
}
