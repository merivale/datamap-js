export default class FixedSet<V> {
    #private;
    constructor(values?: V[] | Set<V>);
    get size(): number;
    toArray(): V[];
    add(value: V): FixedSet<V>;
    clear(): FixedSet<V>;
    delete(value: V): FixedSet<V>;
    has(value: V): boolean;
    values(): IterableIterator<V>;
    keys(): IterableIterator<V>;
    entries(): IterableIterator<[V, V]>;
    forEach(callback: (value: V, map: FixedSet<V>) => void, thisArg: unknown): void;
    [Symbol.iterator](): Generator<V, void, unknown>;
}
