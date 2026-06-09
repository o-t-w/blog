---
pubDate: 'June 05 2026'
title: Streaming HTML
heroImage: "/stream-html.png"
description: Stream HTML with response.textStream() and streamHTML()
---

<style>
    table {
    overflow-x: auto;
    max-width: 100%;
    display: block;

    code {
        font-size: 13px !important;
    }
    }

    td, th {
        padding-right: 16px;
    }

    @media (min-width: 1000px) {
        table {
            max-width: revert;
            overflow-x: revert;
                
            code {
            font-size: 15px !important;
        }
        }
    }
</style>

<!-- HTML streaming improves performance by sending HTML to the browser incrementally, chunk-by-chunk, as soon as it's ready. -->

## Getting a stream of HTML via `fetch()`

How do we get a stream of text from a `fetch` call? `response.text()` decodes the response as text but returns it all at once, not as a stream. For that reason, it is not appropriate for our use case. `response.body` is a stream, but a stream of `Uint8Array`, not of text. We therefore need to pass the `response.body` byte stream through a `TextDecoderStream()`.

```js
let response = await fetch('/partial.html');
let decoder = new TextDecoderStream();
response.body.pipeThrough(decoder)
```

The above code can be improved by making use of the new `textStream()` method. `textStream()` returns a stream of string chunks. `textStream()` is equivalent to piping the body through a utf-8 `TextDecoderStream()`, so the previous code can be rewritten as:

```js
let response = await fetch('/partial.html');
response.textStream()
```

Using the fetch API is not the only way to obtain a stream of text. Blobs also have a `.textStream()` method. Or see the [example](https://developer.chrome.com/blog/declarative-partial-updates#:~:text=The%20streaming%20versions%20work%20with%20the%20Streams%20API%20such%20as%20with%20a%20getWriter():) of using `getWriter()` on the Chrome for Developers blog.

Now that we have a stream of HTML, we can stream it into the page.

## Streaming HTML into the page

Chrome Canary recently added new methods for streaming HTML into the DOM. The `streamHTML` method, for example, will stream the HTML into the targeted element, replacing any previously existing contents.

```js
const div = document.querySelector('div');
  
const response = await fetch('partial.html');
response.textStream()
.pipeTo(div.streamHTML());
```

- `streamHTML` sets the content of the element
- `streamReplaceWithHTML` replaces the element with the new HTML
- `streamAppendHTML` adds the HTML as the last child of the element
- `streamPrependHTML` adds the HTML as the first child of the element
- `streamBeforeHTML` adds the HTML before the element
- `streamAfterHTML` adds the HTML after the element

There are also equivalent unsafe versions of these methods:

| safe streaming methods | unsafe streaming methods | 
| --- | --- |
| `streamHTML` | `streamHTMLUnsafe` | 
| `streamReplaceWithHTML` | `streamReplaceWithHTMLUnsafe` | 
| `streamAppendHTML` | `streamAppendHTMLUnsafe` |
| `streamPrependHTML` | `streamPrependHTMLUnsafe` |
| `streamBeforeHTML` | `streamBeforeHTMLUnsafe` |
| `streamAfterHTML` | `streamAfterHTMLUnsafe` |


The methods without `Unsafe` in their name will always sanitize the HTML. The unsafe methods do not perform any sanitization by default (although they can optionally make use of a sanitizer). Read my previous articles about [`setHTMLUnsafe`](/blog/innerhtml-alternatives/) and [`setHTML` and the Sanitizer API](/blog/sanitizer/) for more information about the difference between safe and unsafe DOM methods.

## Comparison with non-streaming methods

Along with all the new streaming methods, there are also new non-streaming equivalents. Here's the full list of all the new methods: 

| safe | unsafe | stream safe | stream unsafe | 
| --- | --- | --- | --- |
| `setHTML`       | `setHTMLUnsafe`    | `streamHTML` | `streamHTMLUnsafe` | 
| `replaceWithHTML` | `replaceWithHTMLUnsafe`| `streamReplaceWithHTML` | `streamReplaceWithHTMLUnsafe` | 
| `appendHTML`    | `appendHTMLUnsafe` | `streamAppendHTML` | `streamAppendHTMLUnsafe` |
| `prependHTML`   | `prependHTMLUnsafe`| `streamPrependHTML` | `streamPrependHTMLUnsafe` |
| `beforeHTML`    | `beforeHTMLUnsafe`| `streamBeforeHTML` | `streamBeforeHTMLUnsafe` |
| `afterHTML`     | `afterHTMLUnsafe`| `streamAfterHTML` | `streamAfterHTMLUnsafe` |

The non-streaming unsafe methods are equivalent to the following legacy methods:

| modern method | legacy equivalent |
| --- | --- | 
| `setHTMLUnsafe` | `innerHTML` | 
| `replaceWithHTMLUnsafe` | `outerHTML` | 
| `appendHTMLUnsafe` | `insertAdjacentHTML(beforeend)` | 
| `prependHTMLUnsafe` | `insertAdjacentHTML(afterbegin)` | 
| `beforeHTMLUnsafe` | `insertAdjacentHTML(beforebegin)` | 
| `afterHTMLUnsafe` | `insertAdjacentHTML(afterend)` |

Despite the naming not making it clear, the older methods are always unsafe. 

There are two key differences between all the new methods with `Unsafe` in their name and the older methods: 
- the new `Unsafe` methods support declarative shadow DOM (a somewhat niche requirement)
- the new `Unsafe` methods have a [`runScripts`](/blog/runscripts/) option

## Declarative partial updates

The new streaming methods are part of a larger interrelated feature called [declarative partial updates](https://developer.chrome.com/blog/declarative-partial-updates#a_new_set_of_static_and_streaming_apis).

Rather than needing to `querySelector` an element in the DOM to stream into, `<template>` elements can be stream-appended to the body. By default, all safe methods remove `<template>` elements, so you need to specify a sanitizer to allow them:

```js
const response = await fetch('templates.html');
response.textStream()
.pipeTo(document.body.streamAppendHTMLUnsafe());
```

If the fetched HTML contains the following markup:

```html
<template for="side-panel">
<h1>Sidebar content</h1>
</template>

<template for="main">
<h1>Main content</h1>
</template>
```

The initial HTML of the page can make use of processing instructions using the following syntax:

```html
<main>
     <?marker name="main">
</main>
<div>
     <?marker name="side-panel">
</div>
```

The contents of each template will stream into the position of the marker with a corresponding name. Matching `name` and `for` attributes determine which part of the page gets updated by which template.

If you want to use a safe method to stream `<template>` elements onto the page, be aware that by default, if you don't specify a sanitizer, safe methods remove `<template>` elements. Specify a sanitizer to allow `<template>` elements:

```js
const response = await fetch('templates.html');
response.textStream()
.pipeTo(document.body.streamAppendHTML({sanitizer: {}}));
```

<!-- ## Running scripts

What if the HTML you're streaming into the page contains scripts that need to be executed?

```html
<button onclick="console.log('testing')">Click</button>
<script type="module">console.log("Important script...")</script>
```

If the HTML you are inserting contains scripts you want to run, you need to use an unsafe method with `{runScripts: true}`. 

```js
const response = await fetch('templates.html');
response.textStream()
.pipeTo(document.body.streamAppendHTMLUnsafe({runScripts: true}));
``` -->

## Browser support

`textStream()` is supported in Chrome Canary. The streaming DOM methods are also supported in Chrome Canary.