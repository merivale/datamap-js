const { FixedArray, FixedSet, FixedMap, stringify } = require('../dist/fixed')

test('stringify primitives', () => {
  expect(stringify(42)).toBe('42')
  expect(stringify('forty-two')).toBe('"forty-two"')
  expect(stringify(true)).toBe('true')
  expect(stringify(null)).toBe('null')
  expect(stringify(undefined)).toBe('undefined')
})

test('stringify objects', () => {
  expect(stringify({ c: 'sea', b: 'bee', a: 'hay' })).toBe('{"a":"hay","b":"bee","c":"sea"}')
  expect(stringify({ c: { b: 'bee', a: "hay" }, a: 'hay' })).toBe('{"a":"hay","c":{"a":"hay","b":"bee"}}')
})

test('stringify arrays', () => {
  expect(stringify([1, 2, 3, 4, 5])).toBe('[1,2,3,4,5]')
  expect(stringify([[1, 2], 3, [4, 5]])).toBe('[[1,2],3,[4,5]]')
})

test('stringify fixed arrays', () => {
  expect(stringify(new FixedArray([1, 2, 3, 4, 5]))).toBe(stringify([1, 2, 3, 4, 5]))
  expect(stringify(new FixedArray([[1, 2], 3, [4, 5]]))).toBe(stringify([[1, 2], 3, [4, 5]]))
})

test('stringify fixed sets', () => {
  expect(stringify(new FixedSet([1, 3, 2, 5, 4]))).toBe(stringify([1, 2, 3, 4, 5]))
  expect(stringify(new FixedSet([[3, 4, 5], [1, 2]]))).toBe(stringify([[1, 2], [3, 4, 5]]))
})

test('stringify fixed maps', () => {
  expect(stringify(new FixedMap({ c: 'sea', b: 'bee', a: 'hay' }))).toBe(stringify(Object.entries({ c: 'sea', b: 'bee', a: 'hay' })))
  expect(stringify(new FixedMap({ c: { b: 'bee', a: "hay" }, a: 'hay' }))).toBe(stringify(Object.entries({ c: Object.entries({ b: 'bee', a: "hay" }), a: 'hay' })))
})
