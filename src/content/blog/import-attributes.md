---
pubDate: 'Jul 27 2023'
title: Import JSON, CSS and more with import attributes
tags:
  - JavaScript
heroImage: "/importattribute.png"
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
    button.addEventListener('click', async function() {
        const jsonmodule = await import('./stuff.json', { with: { type: 'json' } });
        console.log(jsonmodule.default);
    });
</script>
```

## Importing CSS

The default export of a CSS module is a [`CSSStyleSheet`](https://web.dev/constructable-stylesheets/) object. Rather than creating a new `<link>` or `<style>` element with e.g. `document.createElement()`, you apply the stylesheet to the document using `adoptedStyleSheets`.

```js
import styles from "./styles.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);
```

There are no named exports from a CSS module but that [might change](https://github.com/w3c/csswg-drafts/issues/5629) in the future.

An article on the [web.dev](https://web.dev/css-module-scripts/) blog explains some of the benefits of native CSS modules: 
> - Deduplication: if the same CSS file is imported from multiple places in an application, it will still only be fetched, instantiated, and parsed a single time.
>  - Consistent order of evaluation: when the importing JavaScript is running, it can rely on the stylesheet it imports having already been fetched and parsed.
>  - Security: modules are fetched with CORS and use strict MIME-type checking.

As with JSON modules, you can dynamically import a stylesheet:

```html
<button>Add some style</button>

<script type="module">
const button = document.querySelector("button");
button.addEventListener('click', async function() {
    const styles = await import('./style.css', { with: { type: 'css' } });
    document.adoptedStyleSheets.push(styles.default);
})
</script>
```
The CSSStyleSheet is accessed with `.default` because it is the default export of the module.

## Using CSS modules with Shadow DOM
If you're using shadow DOM you can apply the stylesheet to a shadow root instead of the document. 

```html
<my-element></my-element>

<script type="module">
import styles from "./styles.css" with { type: "css" };
class MyElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.adoptedStyleSheets.push(styles);
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = "<p>Lorem ipsum</p><button>Hello world!</button>";
    }
}
customElements.define("my-element", MyElement);
</script>
```

## Preload

You can preload non-JavaScript modules with `rel="preload"` (rather than `"modulepreload"`, which should be used for JavaScript modules):

```html 
<link rel="preload" as="json" href="...">
<link rel="preload" as="style" href="...">
```

## Browser support
Import attributes are at stage three. JSON modules and CSS modules are included the [HTML spec](https://html.spec.whatwg.org/#css-module-script:~:text=Module%20scripts%20can%20be%20classified%20into%20three%20types%3A). Import attributes were previously known as import assertions. They have been [renamed](https://github.com/whatwg/html/issues/7233) and the syntax has changed. Chrome/Edge had shipped JSON modules and CSS modules using the old syntax (`import json from "./data.json" assert { type: "json" }`). Chrome has updated to the new syntax as of version 123 (the old syntax is deprecated). JSON modules are supported in Safari since version 17.2. Safari has a [positive position](https://github.com/WebKit/standards-positions/issues/77#issuecomment-1290347676) on CSS modules.

On the backend, import attributes are supported in [Deno](https://examples.deno.land/importing-json) and [Node](https://nodejs.org/api/esm.html#import-attributes). Bun has [adopted import attributes](https://bun.sh/blog/bun-macros) for macros.

[Babel](https://babeljs.io/blog/2023/05/26/7.22.0#import-attributes-15536-15620), [Webpack and Rollup](https://github.com/nicolo-ribaudo/import-attributes-ecosystem-support#import-attributes-support-in-tools) have all implemented support for the syntax. 


