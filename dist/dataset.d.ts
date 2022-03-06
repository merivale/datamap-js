export declare class DataSet<ValueType> {
    #private;
    get size(): number;
    add(value: ValueType): this;
    clear(): void;
    delete(value: ValueType): boolean;
    has(value: ValueType): boolean;
    values(): ValueType[];
    keys: () => ValueType[];
    entries(): [ValueType, ValueType][];
    forEach(callback: (value: ValueType, map: DataSet<ValueType>) => void, thisArg: unknown): void;
    [Symbol.iterator](): Generator<ValueType, void, unknown>;
}
