import FixedSet from './fixed-set'

function fixSet<V> (values: V[]): FixedSet<V> {
  return new FixedSet(values)
}

export default fixSet
