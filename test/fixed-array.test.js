const { FixedArray } = require('../dist/fixed')

test('creates a fixed array', () => {
  // basics
  const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const fixed1 = new FixedArray(arr1)
  const fixed2 = new FixedArray(arr2)
  expect(fixed1).toBe(fixed2)
  // additional methods
  expect(fixed1.get(1)).toBe(arr1[1])
  expect(fixed1.first()).toBe(arr1[0])
  expect(fixed1.last()).toBe(arr1[arr1.length - 1])
  expect(fixed1.toArray()).toStrictEqual(arr1)
  // array properties and methods
  expect(fixed1.length).toBe(arr1.length)
  expect(fixed1.concat(...fixed2)).toBe(new FixedArray(arr1.concat(...arr2)))
  expect(fixed1.copyWithin(1, 2)).toBe(new FixedArray([...arr1].copyWithin(1, 2)))
  expect(fixed1.every(x => typeof x === 'number')).toBe(arr1.every(x => typeof x === 'number'))
  expect(fixed1.fill(42)).toBe(new FixedArray([...arr1].fill(42)))
  expect(fixed1.filter(x => x % 2 === 0)).toBe(new FixedArray(arr1.filter(x => x % 2 === 0)))
  expect(fixed1.find(x => x + 2 === 4)).toBe(2)
  expect(fixed1.find(x => x + 2 === 14)).toBe(undefined)
  expect(fixed1.findIndex(x => x + 2 === 4)).toBe(1)
  expect(fixed1.findIndex(x => x + 2 === 14)).toBe(-1)
  // TODO
  // flat
  // flatMap
  // forEach
  // includes
  // indexOf
  // join
  // keys
  // lastIndexOf
  // map
  // pop
  // push
  // reduce
  // reduceRight
  // reverse
  // shift
  // slice
  // some
  // sort
  // splice
  // toLocaleString
  // toString
  // unshift
  // values
  // for/of
})
