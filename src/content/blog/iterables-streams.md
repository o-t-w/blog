---
author: Ollie Williams
pubDatetime: 2023-07-22T15:22:00Z
title: Converting between iterables and web streams
postSlug: converting-between-iterables-and-web-streams
featured: false
draft: true
tags:
  - JavaScript
  - streams
ogImage: "/assets/iterablestreams.png"
description: ReadableStream.from() and Array.fromAsync()
---
It's now pretty easy to turn an iterator into a readable stream and a readable stream into an array. Let's take a look.

## `ReadableStream.from()`

`ReadableStream.from` is currently supported in [Firefox Nightly](https://www.mozilla.org/en-US/firefox/117.0a1/releasenotes/?utm_source=firefox-browser&utm_medium=firefox-desktop&utm_campaign=about-dialog#:~:text=ReadableStream.from%20is%20now%20supported) and [Deno](https://github.com/denoland/deno/releases#:~:text=feat%3A-,ReadableStream.from,-(%2319446)). There is a [Webkit PR](https://github.com/WebKit/WebKit/pull/12454) but not merged or in Technology Preview yet. Bun will probably have support soon after Webkit.
**A** [**PR was merged in Node**](https://github.com/nodejs/node/commit/b361ad72ce65894a250fd0543b0e09d1a9a7edc5) **very recently, don’t think it made it into a release yet…**

`ReadableStream.from()` takes any [sync or async iterable](https://github.com/whatwg/streams/commit/8d7a0bf26eb2cc23e884ddbaac7c1da4b91cf2bc#:~:text=This%20static%20method%20takes%20an%20async%20iterable%20and%20returns%20a%20ReadableStream%20pulling%20chunks%20from%20that%20async%20iterable.%20Sync%20iterables%20(including%20arrays%20and%20generators)%20are%20also%20supported%2C%20since%20GetIterator()%20already%20has%20all%20the%20necessary%20handling%20to%20adapt%20a%20sync%20iterator%20into%20an%20async%20iterator.) and returns a readable stream. The text of the [PR to the spec](https://github.com/whatwg/streams/commit/8d7a0bf26eb2cc23e884ddbaac7c1da4b91cf2bc#:~:text=This%20static%20method%20takes%20an%20async%20iterable%20and%20returns%20a%20ReadableStream%20pulling%20chunks%20from%20that%20async%20iterable.%20Sync%20iterables%20(including%20arrays%20and%20generators)%20are%20also%20supported%2C%20since%20GetIterator()%20already%20has%20all%20the%20necessary%20handling%20to%20adapt%20a%20sync%20iterator%20into%20an%20async%20iterator.) reads:


> “This static method takes an async iterable and returns a ReadableStream pulling chunks from that async iterable. Sync iterables (including arrays and generators) are also supported, since GetIterator() already has all the necessary handling to adapt a sync iterator into an async iterator.”

```js

const syncIterable = ['hello', 'world'];
const stream1 = ReadableStream.from(syncIterable);

async function* createAsyncIterable() {
  yield 'foo';
  yield 'bar';
  yield 'baz';
}
const stream2 = ReadableStream.from(createAsyncIterable());
```

## `Array.fromAsync()`

`Array.fromAsync` is currently supported in Safari 16.4, [Firefox 115](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/115#javascript) and [Bun](https://bun.sh/blog/bun-v0.3.0#array-from-async). [CHROME, Deno and Node HAVE NOT IMPLEMENTED IT YET!!](https://bugs.chromium.org/p/v8/issues/detail?id=13321)(they all use v8). **HUGE CAVEAT:** Chrome and Safari do not treat streams as async iterables yet, so `Array.fromAsync()` won't work on streams in those browsers. 

`fromAsync` converts asynchronous iterables into an array. Readable streams are asynchronously iterable, so we can use `fromAsync()` to turn a readable stream into an array.
`fromAsync()` returns a promise that resolves with an array. Each chunk is an array item. 

```js
const bodyArray = fetch('foo.txt')
.then(response => response.body)
.then(body => body.pipeThrough(new TextDecoderStream()))
.then(textStream => Array.fromAsync(textStream))
.then(array => console.log(array))
```

It's not a practical real-world example, but to keep things simple lets revisit the stream we created earlier:

```js
async function* createAsyncIterable() {
  yield 'foo';
  yield 'bar';
  yield 'baz';
}
const stream = ReadableStream.from(createAsyncIterable());
const array = await Array.fromAsync(stream);
console.log(array);
```