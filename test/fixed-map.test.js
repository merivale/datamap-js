const { FixedMap } = require('../dist/fixed')

test('creates a fixed map', () => {
  // equality checks
  expect(new FixedMap({})).toBe(new FixedMap({}))
  expect(new FixedMap({ a: 1, b: 2 })).toBe(new FixedMap({ a: 1, b: 2 }))
  expect(new FixedMap({ a: { nested: 'object' }, b: { foo: true } })).toBe(new FixedMap({ a: { nested: 'object' }, b: { foo: true } }))
  // other tests
  const map = new FixedMap({ a: { nested: 'object' }, b: { nested: 'object' } })
  expect(map.get('a')).toBe(map.get('b'))
  // TODO... lots more
})
