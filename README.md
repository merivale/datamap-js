# Fixed JS

Fixed JS is a JavaScript library for creating immutable collections (arrays, sets, and maps) in JavaScript, somewhat like Immutable JS.
But more than that, it aims to fix the fundamental problem with JavaScript's arrays and other objects.

**Don't use it yet though.**
I'm still just playing around, and haven't tested it properly.

## The Problem

The fundamental problem with JavaScript's arrays and other objects is not so much that they are mutable.
Some people like mutability, and good luck to them.

The fundamental problem, I suggest, is more that you can't just trivially check them for equality.

```js
const arr1 = [1, 2, 3]
const arr2 = [1, 2, 3]

arr2 === arr2 // false :(
```

Now of course you can write a function to check whether two objects are equal.
Or you can just import the one from Lodash or wherever.
But wouldn't it be nice if you didn't have to?
Wouldn't it be nice if regular equality checks _just worked_?

The problem gets worse when you start working with sets and maps.

Sets are supposed to contain unique items, but the built-in `Set` object lets you add the same value repeatedly, if that value is an array or other object.
And no matter how many times you add it, JavaScript will keep telling you that isn't there:

```js
const set = new Set()

set.add([1, 2])
set.add([1, 2])
set.add([1, 2])

set.size // 3 - EH?
set.has([1, 2]) // false - WOT?
```

Maps, meanwhile, are supposed to fix the limitation that regular objects can't themselves have arrays or other objects as property keys.
But what's the point of the built-in `Map` object if you have to keep references to these keys around in order to retrieve the value you associated with them?

```js
const map = new Map()

map.set([1, 2], 'buckle my shoe')
map.set([1, 2], 'go to the loo')

map.size // 2 - ¿QUE?
map.has([1, 2]) // false - 'SCUSE ME??
map.get([1, 2]) // undefined - SERIOUSLY??!
```

## The Solution

The solution, in a nutshell, is not only to create immutable collections, but also - crucially - to keep them around in a cache and not create copies of them every time we ask for something with the same value.
Instead, just return another reference to the object we cached earlier.

```js
const arr1 = fix([1, 2, 3])
const arr2 = fix([1, 2, 3])

arr2 === arr2 // true - TADA!
```

Calling the `fix` function on an array returns an immutable array, which is guaranteed to be the _same_ object in memory if you've `fix`ed that value already.
If you want an immutable _map_, meanwhile, you can call the `fix` function on any object that _isn't_ an array:

```js
const map1 = fix({ one: 1, two: 2 })
const map2 = fix({ one: 1, two: 2 })

map1.get('one') // 1
map2.get('two') // 2
map1 === map2 // true - YES!
```

Most importantly, this will work with keys that are themselves arrays or other objects, in just the way you would expect:

```js
const map1 = fix({}).set([1, 2], 'buckle my shoe')
const map2 = fix({}).set([1, 2], 'buckle my shoe')

map1 === map2 // true - WOOHOO!

map1.has([1, 2]) // true - OF COURSE!
map2.get([1, 2]) // 'buckle my shoe' - FINALLY!!
```

Notice that you don't need to `fix` the array literal `[1, 2]` when passing it to the `set`, `has`, or `get` methods.
You can if you like, but Fixed JS will just do it for you anyway if you don't.

## The Details

Fixed JS defines three classes, `FixedArray`, `FixedSet`, and `FixedMap`.
(There's no separate immutable object/record type, because `FixedMap` already serves this purpose.)

These classes have all the same methods that the built-in `Array`, `Set`, and `Map` classes have, except that any of those methods that would mutate the instance natively instead return a modified copy of the object. For example:

```js
// with regular arrays:
const arr1 = [1, 2, 3]
arr1.push(4, 5, 6)
arr1 // [1, 2, 3, 4, 5, 6]
arr1.pop() // 6
arr1 // [1, 2, 3, 4, 5]

// with Fixed JS arrays:
const arr2 = fix(arr1)
const arr3 = arr2.push(4, 5, 6)
arr2 // FixedArray { #values: [1, 2, 3] }
arr3 // FixedArray { #values: [1, 2, 3, 4, 5, 6] }
const arr4 = arr3.pop()
arr4 // FixedArray { #values: [1, 2, 3, 4, 5] }
```

The `FixedArray` class also has a few extra useful methods, to make up for the fact athat you can no longer do direct index lookups:

```js
// with regular arrays:
const arr1 = ['buckle', 'my', 'shoe']
arr1[0] // 'buckle'
arr1[1] // 'my'
arr1[arr1.length - 1] // 'shoe'

const arr2 = fix(arr1)
arr2.first() // 'buckle'
arr2.get(1) // 'my'
arr2.last() // 'shoe'
```

You can create instances of these objects by calling their class constructors if you want (`new FixedArray()`, `new FixedSet()`, `new FixedMap()`).
But the preferred way is to use the `fix` function when you can, and the more precise `fixSet`, and `fixMap` functions when you can't.

| function | description |
| -------- | ----------- |
| `fix`    | Takes an array or any other object. If you give it an array, it returns a `FixedArray`; if you give it any other object, it returns a `FixedMap` with keys and values corresponding to that object's keys and values. |
| `fixSet`  | Takes an array or a native `Set`, and returns a `FixedSet`. If you pass it an array with repeated values, it will filter them out. |
| `fixMap` | Takes an object, an array of key-value pairs, or a native `Map`, and returns a `FixedMap`. If you give it a regular object, it works just like `fix`. |

For convenience, you can pass values that don't need fixing to `fix` - i.e. primitives and instances of `FixedArray`, `FixedSet`, or `FixedMap` - and it will simply return those values unchanged.
You can also pass `FixedSet`s and `FixedMap`s to `fixSet` and `fixMap`, with the same (i.e. no) effect.

Finally, there's an `unfix` function that converts any of the fixed things back to their regular JavaScript equivalents.
Needless to say, you'll get _copies_ of all the relevant things out of this function, which can be mutated without changing the fixed collections you pass in to it.

For convenience, you can pass anything to the `unfix` function - if it isn't a `FixedArray`, `FixedSet`, or `FixedMap` it'll just be returned unchanged.

## Fixed All the Way Down

Note that anything you pass to Fixed's functions or methods will be `fix`ed all the way down.
So if your array elements or object properties are themselves arrays or objects, these will also be `fix`ed (unless you already `fix`ed them yourself).

This differs from Immutable JS, for example, which will allow you to create immutable collections containing regular mutable JavaScript objects if you like.
So if that's something you need, this isn't the library for you.

I can't see why you'd want that though.
And to have the magic of ordinary equality checks just working, you need to opt-in to `fix`ed collections fully.

## Performance

All of this inevitably comes with a performance cost.
At some point I'll try and measure how much it actually is.
Unless it turns out to be ridiculously high, though, I'm assuming it's worth paying for the readability of your code.

If you have to do a lot of intensive data processing, and you really care about efficiency, then you probably don't want to be using JavaScript in the first place.
