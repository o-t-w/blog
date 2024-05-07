---
pubDate: 'May 06 2024'
title: Parsing declarative shadow DOM
heroImage: "/parseHTML.png"
description: Document.parseHTMLUnsafe is the new improved .parseFromString
---

`parseFromString` does not play nicely with declarative shadow DOM. Let’s say you fetch a HTML document, grab some of its contents and inject it into the current page:

```html
<div id="container"></div>
<script>
    const container = document.getElementById('container');
    fetch('stuff.html')
    .then(response => response.text())
    .then((html) => {
        const parser = new DOMParser();
        const fetcheddoc = parser.parseFromString(html, "text/html");
        const main = fetcheddoc.getElementsByTagName('main')[0];
        container.appendChild(main);
    })
</script>
```

If the fetched HTML contains a `<template>` element with a `shadowrootmode` attribute, it will remain just a `<template>`, rather than becoming shadow DOM. 

`parseHTMLUnsafe` is a new alternative to `parseFromString` that will correctly instantiate shadow DOM from a template element. 

```js
const container = document.getElementById('container');
fetch('stuff.html')
.then(response => response.text())
.then((html) => {
    const fetcheddoc = Document.parseHTMLUnsafe(html);            
    const main = fetcheddoc.getElementsByTagName('main')[0];
    container.appendChild(main);
    })
```

`parseHTMLUnsafe` has been [supported](https://caniuse.com/mdn-api_document_parsehtmlunsafe_static) since Chrome and Edge 124, Safari 17.4 and Firefox 123.

If you are not using shadow DOM in your project, its still one less line of code. The [HTML spec](https://html.spec.whatwg.org/#the-domparser-interface) states: 

> “The design of `DOMParser`, as a class that needs to be constructed and then have its `parseFromString` method called, is an unfortunate historical artifact. If we were designing this functionality today it would be a standalone function. For parsing HTML, the modern alternative is [`Document.parseHTMLUnsafe()`](https://html.spec.whatwg.org/#dom-parsehtmlunsafe).”

The naming might put you off, but `parseHTMLUnsafe` is no more "unsafe" than `.parseFromString`. In the HTML specification, both methods display the same warning note: 

> "This method performs no sanitization to remove potentially-dangerous elements and attributes like script or event handler content attributes."

Shadow DOM is the main reason this new function exists, but it can be adopted as a general replacement for `.parseFromString`. 