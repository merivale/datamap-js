const { fix, fixSet } = require('../dist/fixed')

test('fixSet is fix(new Set())', () => {
  const arr1 = [1, 2, 2, 3, 3, 4]
  const arr2 = [[1, 2], [3, 4]]
  const arr3 = [{ a: 'one' }, { b: 'two' }]
  expect(fixSet(arr1)).toBe(fix(new Set(arr1)))
  expect(fixSet(arr2)).toBe(fix(new Set(arr2)))
  expect(fixSet(arr3)).toBe(fix(new Set(arr3)))
})
