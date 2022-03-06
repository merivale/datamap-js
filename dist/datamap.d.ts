export declare class DataMap<KeyType, ValueType> {
    #private;
    get size(): number;
    clear(): void;
    delete(key: KeyType): boolean;
    get(key: KeyType): ValueType | undefined;
    has(key: KeyType): boolean;
    set(key: KeyType, value: ValueType): this;
    keys(): KeyType[];
    values(): ValueType[];
    entries(): [KeyType, ValueType][];
    forEach(callback: (key: KeyType, value: ValueType, map: DataMap<KeyType, ValueType>) => void, thisArg: unknown): void;
    [Symbol.iterator](): Generator<[KeyType, ValueType], void, unknown>;
}
