const { FixedArray, FixedSet, FixedMap, fix } = require('../dist/fixed')

test('fixing fixed things does nothing', () => {
  const fixedArray = new FixedArray([1, 2, 3])
  const fixedSet = new FixedSet([1, 2, 3])
  const fixedMap = new FixedMap({ a: 'one', b: 'two' })
  expect(fix(fixedArray)).toBe(fixedArray)
  expect(fix(fixedSet)).toBe(fixedSet)
  expect(fix(fixedMap)).toBe(fixedMap)
})

test('fixing arrays gives fixed arrays', () => {
  const array = [1, 2, 3]
  expect(fix(array)).toBe(new FixedArray(array))
})

test('fixing sets gives fixed sets', () => {
  const array = [1, 2, 2, 5, 5]
  expect(fix(new Set(array))).toBe(new FixedSet(array))
})

test('fixing maps gives fixed maps', () => {
  const entries = [[{ a: 'one' }, true], [{ b: 'two' }, false], [{ c: 'three' }, false]]
  expect(fix(new Map(entries))).toBe(new FixedMap(entries))
})

test('fixing objects gives fixed maps', () => {
  const object = { a: 'one', b: 'two', c: 'three' }
  expect(fix(new Map(Object.entries(object)))).toBe(new FixedMap(object))
})

test('fixing primitives does nothing', () => {
  expect(fix(42)).toBe(42)
  expect(fix('forty-two')).toBe('forty-two')
  expect(fix(true)).toBe(true)
  expect(fix(null)).toBe(null)
  expect(fix(undefined)).toBe(undefined)
})

