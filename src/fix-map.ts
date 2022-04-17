import FixedMap from './fixed-map'

function fixMap<K, V> (values: Array<[K, V]>): FixedMap<K, V> {
  return new FixedMap(values)
}

export default fixMap
