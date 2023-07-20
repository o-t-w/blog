---
author: Ollie Williams
pubDatetime: 2023-07-20T15:22:00Z
title: Change array by copy
postSlug: change-array-by-copy
featured: false
draft: false
tags:
  - JavaScript
  - arrays
ogImage: "/assets/changearray.png"
description: toReversed(), toSorted() and toSpliced()
---

These methods are supported in Node [since version 20](https://openjsf.org/blog/2023/04/18/node-js-20-now-available/#:~:text=Methods%20that%20change%20Array%20and%20TypedArray%20by%20copy), Deno, [Bun](https://twitter.com/jarredsumner/status/1523279875754266624), Safari (since version 16), Chrome/Edge ([from version 110](https://chromestatus.com/feature/5068609911521280)) and Firefox (since [version 115](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/115#javascript)).

## Immutability

In JavaScript, arrays are mutable. Certain methods change the array:

```js
const names = ['Xavier', 'Anna', 'Zach', 'Brad'];
names.sort();
// names is now ['Anna', 'Brad', 'Xavier', 'Zach']
names.reverse();
// names is now ['Zach', 'Xavier', 'Brad', 'Anna']
```
 
 Here’s the full list of array methods that mutate the array:

- `push`
- `pop`
- `splice`
- `shift`
- `unshift`
- `reverse`
- `sort`
- `copyWithin`
- `fill`
## Tuples

There's a proposal for adding tuples to JavaScript. Tuples look identical to arrays except that they begin with a hash `#` symbol:

```js
const users = #['Xavier', 'Anna', 'Zach', 'Brad'];
```
The key difference between arrays and tuples: tuples are immutable. Tuples have all the methods that Arrays have, except for the destructive ones. Because tuples can't be mutated, they can't have any of the methods listed above.

There are now immutable equivalents to the `reverse`, `sort`, and `splice` methods that will return a new copy of the array with the changes applied, leaving the original array unchanged:

- `.toReversed()`
- `.toSorted()`
- `.toSpliced()` 

While these new methods were originally created with tuples in mind, they have also been added to arrays. Tuples are still a work in progress, but we’ll be able to use the same methods to non-destructively change both Arrays and Tuples in the future.

Here's the [official motivation](https://github.com/tc39/proposal-change-array-by-copy#motivation) for adding them, as explained by members of the TC39:
> The [Tuple.prototype](https://tc39.es/proposal-record-tuple/#sec-properties-of-the-tuple-prototype-object) introduces these functions as a way to deal with the immutable aspect of the Tuples in [Record & Tuple](https://github.com/tc39/proposal-record-tuple). While Arrays are not immutable by nature, this style of programming can be beneficial to users dealing with frozen arrays for instance. This proposal notably makes it easier to write code able to deal with Arrays and Tuples interchangeably.

There’s also `.with()`, which doesn’t have an older mutating equivalent.

## Immutable array methods

A non-mutating equivalent to `shift`, `pop`, `push` and `fill` can already be written in a relatively simple way. 

- `pop` can be replaced with `.slice(-1)`.
- `push` can be replaced with `.concat()`
- `shift` can be replaced with `.slice(1)`
- `fill` can be replaced by `.map()`

It was already possible to use `reverse` and `sort` without mutating the original array by using spread:

```js
    const names = ['Xavier', 'Anna', 'Zach', 'Brad'];
    const sortedNames = [...names].sort();
    const invertedNames = [...names].reverse();
```

The new functions offer a slightly better way to achieve this. 

## `.toReversed`

```js
    const names = ['Xavier', 'Anna', 'Zach', 'Brad'];
    const reversedNames = names.toReversed();
    // names will remain ['Xavier', 'Anna', 'Zach', 'Brad']
    // reversedNames is ['Brad', 'Zach', 'Anna', 'Xavier']
```
## `.toSorted()`
`toSorted` works just like sort() but it returns a new array. The original array is not changed when you call toSorted().

```js
const names = ['Xavier', 'Anna', 'Zach', 'Brad'];
const sortedNames = names.toSorted();
// names will remain ['Xavier', 'Anna', 'Zach', 'Brad']
// sortedNames is ['Anna', 'Brad', 'Xavier', 'Zach']
```
## `.toSpliced()`

The first argument is a start index. The second is the amount of array items you want to delete. You can then specify one or multiple elements to add at the start index.

```js
const names = ['Xavier', 'Anna', 'Zach', 'Brad'];
const differentNames = names.toSpliced(2, Infinity, 'Mark');
// Infinity means all array items starting from the second index get deleted. 'Mark' gets added to the array so the new array is ['Xavier', 'Anna', 'Mark']
```

Here’s an non-mutating equivalent of `unshift` using `toSpliced`:
```js
const names = ['Xavier', 'Anna', 'Zach', 'Brad'];
const moreNames = names.toSpliced(0, 0, 'Mark', 'Luke', 'John');
// 'Mark', 'Luke' and 'John' are added to the beginning of the array.
```
## `.with()`

`with()` accepts an index and a value. The value replaces the array item at the given index.

```js
const names = ['Xavier', 'Anna', 'Zach', 'Brad'];
const namesWithOneChanged = names.with(2, 'Mark');
``` 
In the new array, 'Mark' replaces 'Zach'.