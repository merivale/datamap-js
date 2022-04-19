const { fix, unfix } = require('../dist/fixed')

test('unfixing fixed arrays gives regular arrays', () => {
  const array = [[1, 2], [3, 4], [4, 5]]
  const fixedArray = fix(array)
  expect(unfix(fixedArray)).toEqual(array)
})

test('unfixing fixed sets gives regular sets', () => {
  const set = new Set([[1, 2], [3, 4], [4, 5]])
  const fixedSet = fix(set)
  expect(unfix(fixedSet)).toEqual(set)
})

test('unfixing fixed maps gives regular maps', () => {
  const map = new Map([[new Map([['a', 'one']]), [1, 2]], [new Map([['b', 'two']]), [3, 4]], [new Map([['c', 'three']]), [4, 5]]])
  const fixedMap = fix(map)
  expect(unfix(fixedMap)).toEqual(map)
})

test('unfixing primitives does nothing', () => {
  expect(unfix(42)).toBe(42)
  expect(unfix('forty-two')).toBe('forty-two')
  expect(unfix(true)).toBe(true)
  expect(unfix(null)).toBe(null)
  expect(unfix(undefined)).toBe(undefined)
})
