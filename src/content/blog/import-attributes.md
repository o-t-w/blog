---
author: Ollie Williams
pubDatetime: 2023-07-24T15:22:00Z
title: Import JSON, CSS and more with import attributes
postSlug: import-attributes
featured: false
draft: false
tags:
  - JavaScript
ogImage: "/assets/importattribute.png"
description: A standard way to import JSON modules, CSS modules and more
---

If you've worked with build tools like Webpack, you're probably used to a simple syntax for importing JSON and other resources: `import data from "/data.json"` or `const json = require('./data.json')`. Browsers have never understood this, but bundlers made it work. Now there's a web standard. 

```js
import json from "./data.json" with { type: "json" };
```

For security reasons (a file extension alone is not a [reliable enough](https://v8.dev/features/import-assertions#:~:text=But%2C%20there%E2%80%99s%20a%20security%20issue%20with%20relying%20on%20the%20MIME%20type%20alone.) indicator of the content type) you have to specify the type using `with {type: "json"}`. 

The JSON data is the default export. There are no named exports.  

The above example imports a JSON module, but the same syntax is used to import other resource types (CSS, possibly [HTML](https://bugs.chromium.org/p/chromium/issues/detail?id=990978) and [WebAssembly](https://github.com/tc39/proposal-import-attributes/blob/master/README.md#worker-instantiation:~:text=it%27s%20still%20uncertain%20whether%20importing%20WebAssembly%20modules%20would%20need%20to%20be%20marked%20specially) in the future). 

## Dynamic `import()`
`import()` will dynamically load a module so that it is only evaluated when needed. In contrast to an import statement, which must be used at the top level, [`import()`](https://exploringjs.com/impatient-js/ch_modules.html#dynamic-imports) can be used inside a function or inside an if statement.

```html
<button>Load some json</button>

<script type="module">
    const button = document.querySelector("button");
    button.addEventListener('click', function() {
        const jsonmodule = await import('stuff.json', { with: { type: 'json' } });
        console.log(json.default);
    });
</script>
```

`import()` returns a promise which fulfills with an object containing all exports from the module. The JSON data is the default export, so we access it with `.default`. There are no named exports. 

## Importing CSS

The default export of a CSS module is a [`CSSStyleSheet`](https://web.dev/constructable-stylesheets/) object. Rather than creating a new `<link>` or `<style>` element with e.g. `document.createElement()`, you apply the stylesheet to the document using `adoptedStyleSheets`.

```js
import styles from "./styles.css" with { type: "css" };
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles];
```

We start the array with `...document.adoptedStyleSheets`. This stops any other `CSSStyleSheet` we added via `adoptedStyleSheets` from being overridden.

There are no named exports from a CSS module but that [might change](https://github.com/w3c/csswg-drafts/issues/5629) in the future.

An article on the [web.dev](https://web.dev/css-module-scripts/) blog explains some of the benefits of native CSS modules: 
> - Deduplication: if the same CSS file is imported from multiple places in an application, it will still only be fetched, instantiated, and parsed a single time.
>  - Consistent order of evaluation: when the importing JavaScript is running, it can rely on the stylesheet it imports having already been fetched and parsed.
>  - Security: modules are fetched with CORS and use strict MIME-type checking.

If you need to, it's easy to add or delete CSS rules in the `CSSStyleSheet` before applying it to the document. 

```js
import styles from "./styles.css" with { type: "css" };
styles.insertRule(".btn { color: white; font-weight: bold; }");
import morestyles from "./morestyles.css" with { type: "css" };
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles, morestyles];
```

If you're using shadow DOM you can apply the stylesheet to a shadow root instead of the document: `shadowRoot.adoptedStyleSheets = [sheet];`:
```html
<my-element></my-element>
<script type="module">
import styles from "./styles.css" with { type: "css" };
class MyElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.adoptedStyleSheets = [styles];
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = "<p>Lorem ipsum</p><button>Hello world!</button>";
    }
}
customElements.define("my-element", MyElement);
</script>
```

As with JSON modules, you can dynamically import a stylesheet:

```html
<button>Add some style</button>

<script type="module">
const button = document.querySelector("button");
button.addEventListener('click', function() {
    const styles = await import('./style.css', { assert: { type: 'css' } });
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles.default];
})
</script>
```
The CSSStyleSheet is accessed with `.default` because its the default export of the module.

Confusingly, CSS Modules is also the name of a popular open source project for scoping CSS. That is not something that the web standard does, and there isn't any relation or similarity between the standard and the open-source project. They are sometimes referred to as “CSS Module Scripts”, which might help to avoid the confusion.

## Preload

You can preload non-JavaScript modules with `rel="preload"` (rather than `"modulepreload"`, which should be used for JavaScript modules):

```html 
<link rel="preload" as="json" href="...">
<link rel="preload" as="style" href="...">
```

## Browser support
Import attributes were previously known as import assertions. They have been [renamed](https://github.com/whatwg/html/issues/7233) and the syntax has changed. Chrome/Edge had already shipped JSON modules and CSS modules using the older syntax (`import json from "./data.json" assert { type: "json" }`). Chrome Canary has updated to use the new syntax (the old syntax still works, but is deprecated). The older syntax is also supported in [Deno](https://examples.deno.land/importing-json) and (experimentally) in [Node](https://nodejs.org/api/esm.html#import-assertions). Hopefully they will get an update soon. [Safari](https://github.com/WebKit/standards-positions/issues/77#issuecomment-1290347676) has a positive position on the CSS modules and had previously implemented JSON modules with the old syntax in Safari Technology Preview.

[Babel](https://babeljs.io/blog/2023/05/26/7.22.0#import-attributes-15536-15620), [Webpack and Rollup](https://github.com/nicolo-ribaudo/import-attributes-ecosystem-support#import-attributes-support-in-tools) have all implemented support for the syntax. 

Bun has already [adopted import attributes](https://bun.sh/blog/bun-macros) for macros.

