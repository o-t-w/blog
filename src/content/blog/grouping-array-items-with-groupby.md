---
pubDate: 'Jul 20 2023'
title: Grouping array items with groupBy()
tags:
  - JavaScript
  - arrays
heroImage: "/groupby.png"
description: Object.groupBy()
---

This API has changed *twice* in the [name of web compatibility](https://github.com/tc39/proposal-array-grouping#why-static-methods), so be aware that some older blog posts are now completely out of date. Chrome Canary has shipped an implementation that is up-to-date with the spec. Safari had shipped the older version. This has been updated in [Safari Technology Preview](https://webkit.org/blog/14390/release-notes-for-safari-technology-preview-174/#:~:text=Renamed%20.groupByToMap()%20on%20Array%20to%20.groupBy()%20on%20Object%20and%20Map). [Firefox](https://caniuse.com/mdn-javascript_builtins_array_group) supported the old method behind a flag and has not yet shipped an update. 

## `Object.groupBy()`

The first argument to `groupBy` is an array or any other iterable. The second is a callback function. 

This example seperates numbers into two groups depending on whether they are odd or even:
```js
const randomNumbers = [24, 32, 49, 10, 9, 7, 1082, 88, 101];
const groupedNumbers = Object.groupBy(randomNumbers, num => num % 2 === 0 ? 'even' : 'odd');
```
The return value is an object. `groupedNumbers.even` now contains all the even numbers and `groupedNumbers.odd` contains all the odd numbers.

The next example groups names by their first letter:
```js
const namesArray = ['Barry', 'Mary', 'Bruce', 'William', 'Wendy', 'Mark'];
const names = Object.groupBy(namesArray, name => name[0].toLowerCase());
```
`names.b` would then be `['Barry', 'Bruce']`

Here's an example that takes an array of film objects and groups the objects by genre:
```js
const films = [{
    name: 'Team America',
    genre: 'comedy'
}, {
    name: 'Rambo',
    genre: 'action'
}, {
    name: 'Airplane!',
    genre: 'comedy'
}, {
    name: 'Die Hard',
    genre: 'action'
}, {
    name: 'Borat',
    genre: 'comedy'
}];

const filmsByGenre = Object.groupBy(films, film => film.genre);
```

There is also an equivalent `Map.groupBy()`. Rather than returning an object, it returns a Map.
