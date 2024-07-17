---
pubDate: 'May 08 2024'
title: New alternatives to innerHTML
heroImage: "/sethtml.png"
description: getHTML, setHTML, setHTMLUnsafe, declarative shadow DOM and sanitization
---

__Browser support note__: `setHTMLUnsafe` is supported in [all browsers](https://caniuse.com/mdn-api_element_sethtmlunsafe). `setHTML` is still being standardised and is only available in Firefox behind a flag. [`getHTML`](https://caniuse.com/mdn-api_element_gethtml) is supported in Firefox (since [version 128](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/128)), in Chrome and Edge (since version 125) and in Safari (since [version 18](https://developer.apple.com/documentation/safari-release-notes/safari-18-release-notes)).

Browsers recently implemented a new `setHTMLUnsafe` method. *Unsafe* in this context means that, just like `innerHTML`, it does not perform input sanitization. This naming is not consistent with previous browser APIs: we have `innerHTML`, not `innerHTMLUnsafe`; `eval()` not `evalUnsafe()`, etc. `setHTMLUnsafe` is certainly no more dangerous than these older methods. Unlike the older methods though, there is both a safe version (`setHTML`) and an unsafe version (`setHTMLUnsafe`) — hence the naming.

Here's what the [Sanitizer API spec](https://wicg.github.io/sanitizer-api/) has to say:
> The "safe" methods will not generate any markup that executes script. That is, they should be safe from XSS.

Let’s imagine we have a HTML form with a text `<input>` and some JavaScript code that changes the DOM based on the user-supplied value:

```js
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const markup = `<h2>${input.value}</h2>`
    div.innerHTML = markup;
    });
```

If a user entered `<img src=doesnotexist onerror="alert('Potential XSS Attack')">` into the input, that JavaScript code would run in the browser. `.setHTMLUnsafe()` has the same problem.

In this simplistic example the code is only running in the users own browser, but if this sort of user input is stored in a database and used to display dynamic content to others, arbitrary and potentially malicious JavaScript could run in the browsers of other users.

Using `setHTML`, the only thing inserted into the DOM is `<img src="doesnotexist">`. The image is still injected into the page, but the JavaScript is stripped out.

The Sanitizer API is still a work in progress, but it helps put the naming of `setHTMLUnsafe` in context. 

## setHTMLUnsafe

If we’re (hopefully) getting `setHTML`, and we already have `innerHTML`, why do we even need `setHTMLUnsafe`? The answer is declarative shadow DOM.

The HTML `<template>` element can be used in two different ways:

- To hold a HTML fragment which is not rendered but that can be used later via JavaScript. 
- To immediately generate a shadow DOM. If the `<template>` contains the `shadowrootmode` attribute, the element is replaced in the DOM by its content, inside a shadow root.

`innerHTML` plays nicely with the first use case, but can’t handle the second.

```js
const main = document.querySelector('main');
main.innerHTML = `
    <h2>I am in the Light DOM</h2>
    <div>
    <template shadowrootmode="open">
        <style>
        h2 { color: blue; }
        </style>
        <h2>Shadow DOM</h2>
    </template>
    </div>`
```

`innerHTML` does inject the `<template>` into the page, but it remains a `<template>` element — it does not get turned into shadow DOM and its contents do not get rendered, regardless of the `shadowrootmode` attribute.

`setHTML` will purposefully remove the `template` and its contents:

```js
const main = document.querySelector('main');
main.setHTML(`
     <h2>I am in the Light DOM</h2>
    <div>
    <template shadowrootmode="open">
        <style>
        h2 { color: blue; }
        </style>
        <h2>Shadow DOM</h2>
    </template>
    </div>`);
```
In the above example, the contents of the `main` is now a `h2` and an empty `div`. The template is treated as an "unsafe node".

This is why browsers added `setHTMLUnsafe`, as a way to dynamically add declarative shadow DOM to the page.

```js
main.setHTMLUnsafe(`
    <h2>I am in the Light DOM</h2>
    <div>
    <template shadowrootmode="open">
        <style>
        h2 { color: blue; }
        </style>
        <h2>Shadow DOM</h2>
    </template>
    </div>
`);
```

When using `setHTMLUnsafe`, the contents of the `<template>` will be rendered inside of shadow DOM.

## getHTML

`setHTML` and `setHTMLUnsafe` aren’t, by themselves, a full replacement for `innerHTML`. `innerHTML` can both *set* and *get* HTML. The complementary function to `setHTML` and `setHTMLUnsafe` is [`getHTML`](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#html-serialization-methods) (there is no unsafe version). 

```js
const main = document.querySelector('main');
const html = main.getHTML();
```

By default `getHTML` won’t return any markup from within a shadow DOM, but it is configurable.

```js
const main = document.querySelector('main');
const html = main.getHTML({serializableShadowRoots: true} );
```

Setting `serializableShadowRoots` to true will serialize all shadow DOM trees that have opted-in to serialization.

A `template` element can opt-in using the `shadowrootserializable` attribute:

```html
<template shadowrootmode="open" shadowrootserializable>
```

Similarly, in JavaScript, the `attachShadow` method has a boolean `serializable` option. 

```js
this.attachShadow({ mode: "open", serializable: true });
```

It's also possible to serialize only certain specified shadow DOM trees by passing an array of shadow roots:

```js
const markup= main.getHTML({
    shadowRoots: [document.querySelector('.example').shadowRoot]
});
```

All shadow roots in the array will be serialized, _even if they are not marked as serializable_.