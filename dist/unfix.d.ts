import type { Primitive } from './types';
import FixedArray from './fixed-array';
import FixedMap from './fixed-map';
import FixedSet from './fixed-set';
declare function unfix<V>(value: FixedArray<V>): Array<V>;
declare function unfix<V>(value: FixedSet<V>): Set<V>;
declare function unfix<K, V>(value: FixedMap<K, V>): Map<K, V>;
declare function unfix<T extends Primitive>(value: T): T;
export default unfix;
