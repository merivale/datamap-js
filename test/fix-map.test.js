const { fix, fixMap } = require('../dist/fixed')

test('fixMap is fix(new Map())', () => {
  const entries1 = [['foo', true], ['bar', false]]
  const entries2 = [[[1, 2], 'buckle my shoe'], [[3, 4], 'knock at the door']]
  const entries3 = [[{ one: 1, two: 2 }, 'buckle my shoe'], [{ three: 3, four: 4 }, 'knock at the door']]
  expect(fixMap(entries1)).toBe(fix(new Map(entries1)))
  expect(fixMap(entries2)).toBe(fix(new Map(entries2)))
  expect(fixMap(entries3)).toBe(fix(new Map(entries3)))
})
