---
pubDate: 'Dec 05 2026'
title: Streaming HTML
heroImage: "/stream-html.png"
description: TODO
---

<style>
    table {
    overflow-x: scroll;
    max-width: 100%;
    display: block;

    code {
        font-size: 13px !important;
    }
    }

    td, th {
        padding-right: 16px;
    }

    @media (min-width: 900px) {
        table {
            max-width: revert;
            overflow-x: revert;
                
            code {
            font-size: 15px !important;
        }
        }
    }
</style>

"Streaming is the process of transmitting data incrementally as it’s generated. On the web, HTML streaming means sending HTML to the browser chunk-by-chunk, as soon as it's ready" - Marko website

## Getting a stream of HTML via `fetch()`

How do we get a stream of text from a `fetch` call? `response.text()` decodes the response as text but returns it all at once, not as a stream. For that reason, it is not appropriate for our use case. `response.body` is a stream, but a stream of `Uint8Array`, not of text. We therefor need to pass the `response.body` byte stream through a `TextDecoderStream()`.

```js
let response = await fetch('/');
let decoder = new TextDecoderStream();
response.body.pipeThrough(decoder)
```

The above code can be slightly improved by making use of the new `textStream()` method. `textStream()` returns a stream of decoded text chunks. `textStream()` is equivalent to piping the byte stream through a utf-8 `TextDecoderStream()`, so the previous code can be rewritten as:

```js
let response = await fetch('/');
response.body.textStream()
```

Now that we have a stream of decoded text, we can stream it into the page.

## Streaming HTML into the page

Chrome Canary recently added new methods for streaming HTML into the DOM. The `streamHTML` method, for example, will stream the HTML into the targeted element, replacing any previously existing content.

```js
const div = document.querySelector('div');
  
const response = await fetch('partial.html');
response.body.textStream()
.pipeTo(div.streamHTML());
```

- `streamHTML` sets the content of the element
- `streamReplaceWithHTML` replaces the element with the given HTML
- `streamAppendHTML` adds the HTML as the last child of the element
- `streamPrependHTML` adds the HTML as the first child of the element
- `streamBeforeHTML` adds the HTML before the element
- `streamAfterHTML` adds the HTML after the element

Here's a full list of the new streaming methods. They come in safe and unsafe versions. 

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

Along with all the new streaming methods, there are also new non-streaming equivalents.  

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
- the new methods support declarative shadow DOM (a somewhat niche requirement)
- the new methods have a `runScripts` option

## Declarative partial updates

These new streaming methods are part of a larger interrelated feature called [declarative partial updates](https://developer.chrome.com/blog/declarative-partial-updates#a_new_set_of_static_and_streaming_apis).

```html
<div>
     <?marker name="side-panel">
</div>
```

```html
<template for="side-panel">
<h1>I am inside a template</h1>
</template>
```

Rather than needing to `querySelector` an element in the DOM to stream into, the template can be appended to the body. The corresponding `name` and `for` attributes determine which part of the page gets updated. The contents of the template are streamed into the position of the marker.

By default, all safe methods remove `<template>` elements, so you need to specify a sanitizer to allow them:

```js
const response = await fetch('template-partial.html');
response.body
response.body.textStream();
.pipeTo(document.body.streamAppendHTML({sanitizer: {}}));
```

Safe methods strip out any `<script>` tags and inline event handlers. If the HTML you are inserting contains scripts you want to run, you need to use the unsafe version with `{runScripts: true}`. 

```html
<template for="side-panel">
<h1>I am inside a template</h1>
<button onclick="console.log('testing')">Click</button>
<script type="module">console.log("hello world")</script>
</template>
```

```js
const response = await fetch('template-partial.html');
response.body.textStream();
.pipeTo(document.body.streamAppendHTMLUnsafe({runScripts: true}));
```

## Browser support

`textStream` is supported in Chrome Canary. The streaming DOM methods are supported in Chrome Canary. `setHTMLUnsafe` is supported in all browsers. `setHTML` is supported in Firefox and Chrome/Edge.

https://github.com/whatwg/fetch/issues/1861
[developer.chrome.com](https://developer.chrome.com/blog/declarative-partial-updates#renewed_html_insertion_and_streaming_methods):
https://chromestatus.com/feature/5146752165478400