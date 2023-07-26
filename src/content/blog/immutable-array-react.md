---
author: Ollie Williams
pubDatetime: 2023-07-22T15:22:00Z
title: Updating Arrays in State in React
postSlug: updating-arrays-state-react
featured: false
draft: true
tags:
  - JavaScript
  - React
ogImage: "/assets/reactstatearrays.png"
description: Rewriting a React docs page using new array methods
---

In the React docs, the page [*Updating Arrays in State*](https://react.dev/learn/updating-arrays-in-state) reads:

> "Arrays are mutable in JavaScript, but you should treat them as immutable when you store them in state. Just like with objects, when you want to update an array stored in state, you need to create a new one (or make a copy of an existing one), and then set state to use the new array."

The sounds like a perfect opportunity to use the new "change array by copy" methods `toSpliced()`, `with()`, `toSorted()` and `toReversed()`

The current docs make heavy use of the spread operator. Let's try rewriting them with immutable array methods. 

In the current docs:
```js
const insertAt = 1; // Could be any index
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
```
Could be replaced with:
```js
setArtists(artists.toSpliced(1, 0, { id: nextId++, name: name }));
```
 
