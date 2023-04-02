---
author: Ollie Williams
pubDatetime: 2023-04-02T15:22:00Z
title: __dirname & __filename equivalent in Bun
postSlug: import-meta-bun
featured: false
draft: false
tags:
  - Bun
ogImage: "/assets/bun.png"
description: Get the directory and file name of the current module
---

The Bun documentation lists the [available globals](https://bun.sh/docs/api/globals). This includes the globals `__dirname` and `__filename`, popularized by Node. While these work in Bun, they are not the preferred approach because, according to Jarred Sumner (the creator of Bun) "the types will usually get mad about `__dirname`". 

Instead we can use `import.meta`. `import.meta` is a standard implemented in Node, Deno, Bun and browsers. `import.meta` is extended by Bun. Jarred Sumner has said "`import.meta` is host-defined (by the spec) so we are “allowed” to extend it". If you look on the MDN page for `import.meta` you won't find the following information as it is unique to Bun, and the following code won't work in Deno, Node or web browsers. 

### Get the directory of the current module:

```js
const dir = import.meta.dir;
```
The dir variable would be something like `/Users/olliew/code/mybunproject`

### Get the name of the current module:
```js
const file = import.meta.file;
```
file variable would be something like `index.js`

### Get the path of the current module:
```js
const path = import.meta.path;
```
The path variable would be something like `/Users/olliew/code/mybunproject/index.js`
