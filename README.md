# DataMap.js

Here's a rough first idea for a JavaScript `DataMap` class, to replace the built-in `Map` class.
Haven't tested it very thoroughly (still less written any tests), but having played around a bit it seems to work so far...

## The Problem

The the built-in `Map` class is supposed to let you use objects as keys, something you can't do with regular objects.
But the problem is objects aren't data, they're mutable state.
And when you try to compare objects, JavaScript compares the _pointers_ to those objects.

So with the built-in `Map`, you get this entirely unhelpful behaviour:

```js
const map = new Map()

map.set([1, 2], 'buckle my shoe')
map.set([1, 2], 'go to the loo')

map.size // 2
map.has([1, 2]) // false
map.get([1, 2]) // undefined
```

## The Solution

The `DataMap` class is supposed to work exactly like the built-in `Map` class, except it converts the keys to strings (in what should be a one-to-one mapping) - parsing them back again whenever you want them.

```js
const map = new DataMap()

map.set([1, 2], 'buckle my shoe')
map.set([1, 2], 'go to the loo')

map.size // 1
map.has([1, 2]) // true
map.get([1, 2]) // 'go to the loo'
```
