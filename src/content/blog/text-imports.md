---
pubDate: 'Jun 03 2026'
title: Text imports
heroImage: "/text-modules.png"
description: Importing strings  
---

You can now import a file as a JavaScript string using the new `text` import attribute.

```js
import text from "/file.txt" with { type: "text" };
```

As with other import types like JSON and CSS, text modules can be dynamic:

```js
const button = document.querySelector('button');
const div = document.querySelector('div');

button.addEventListener('click', async function() {
    const text = await import('/file.txt', { with: { type: 'text' } });
    div.textContent = text.default;
});
```

The imported file could be pretty much anything — it need not be a `.txt` file. You could import a CSV file or a YAML file, for example. 

Here's an example that imports a HTML file and inserts it into the page:

```js
import partial from '/partial.html' with {type: "text"};
const div = document.querySelector('div');
div.setHTML(partial, {sanitizer: {}});
```

<div class="html-example"></div>

For a documentation website you could import a CSS, JavaScript or SVG file and display it as plain text:

```js
import text from "/plus-icon.svg" with { type: "text" };
const div = document.getElementById('target');
div.textContent = text;
```

<div style="font-family: ui-mono, monospace; font-size: 13px;" id="target"></div>

## Fetch comparison

`fetch()` can be used for the same purpose, but is always async.

```js
let response = await fetch("file.txt");
let text = await response.text();
```

## Browser support 

This feature is currently supported in [Bun](https://bun.com/docs/guides/runtime/import-html), [Deno](https://docs.deno.com/examples/importing_text/) and [Firefox Nightly](https://www.firefox.com/en-GB/firefox/153.0a1/releasenotes/#:~:text=Developers%20can%20now%20use%20the%20text%20import%20attribute%20to%20import%20text%20files%20using%20the%20module%20system.).

<script src="/text-imports.js" type="module"></script>