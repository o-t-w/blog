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

If you've worked with build tools like Webpack, you're probably used to a simple syntax for importing JSON and other resources: `import data from "/data.json"` or `const json = require('./data.json')`. Browsers have never understood this, but bundlers made it work. Now there's a standardized syntax. 

```js
import json from "./data.json" with { type: "json" };
```

For security reasons (a file extension alone is not a [reliable enough](https://v8.dev/features/import-assertions#:~:text=But%2C%20there%E2%80%99s%20a%20security%20issue%20with%20relying%20on%20the%20MIME%20type%20alone.) indicator of the content type) you have to specify the type. 

The above example imports a JSON module, but the same syntax is used to import other resource types (CSS, possibly [HTML](https://bugs.chromium.org/p/chromium/issues/detail?id=990978) and [WebAssembly](https://github.com/tc39/proposal-import-attributes/blob/master/README.md#worker-instantiation:~:text=it%27s%20still%20uncertain%20whether%20importing%20WebAssembly%20modules%20would%20need%20to%20be%20marked%20specially) in the future). 

## Dynamic `import()`
```html
<button>Load some json</button>

<script type="module">
    const button = document.querySelector("button");
    button.addEventListener('click', function() {
        const json = await import('stuff.json', { with: { type: 'json' } });
        console.log(json);
    });
</script>
```
DO YOU NEED TO USE json.default RATHER THAN JUST JSON??? The [V8 blog](https://v8.dev/features/import-assertions) says: 
The JSON content is the default export of the module, so it’s referenced through the default property on the object returned from import(). AND HAS THIS EXAMPLE CODE: `console.log(jsonModule.default.answer); // 42``

## CSS modules

The default export of a CSS module is a [constructable stylesheet](https://web.dev/constructable-stylesheets/). Rather than creating a new `<style>` element with `document.createElement('style')`, you apply the stylesheet to the document using `adoptedStyleSheets`.

```js
import styles from "./styles.css" with { type: "css" };
import morestyles from "./morestyles.css" with { type: "css" };
document.adoptedStyleSheets = [styles, morestyles];
```

An article on the [web.dev](https://web.dev/css-module-scripts/) blog explains some of their benefits: 
> - Deduplication: if the same CSS file is imported from multiple places in an application, it will still only be fetched, instantiated, and parsed a single time.
>  - Consistent order of evaluation: when the importing JavaScript is running, it can rely on the stylesheet it imports having already been fetched and parsed.
>  - Security: modules are fetched with CORS and use strict MIME-type checking.

If you need to, it's easy to add or delete CSS rules in the constructable stylesheet before applying it to the document. 

```js
import styles from "./styles.css" with { type: "css" };
stylesheet.insertRule(".btn { color: white; font-weight: bold; }");
document.adoptedStyleSheets = [styles];
```

If you're using shadow DOM you can apply the stylesheet to a shadow root instead of the document: `shadowRoot.adoptedStyleSheets = [sheet];`

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
    document.adoptedStyleSheets = [styles.default];
})
</script>
```

Confusingly, CSS Modules is also the name of a popular open source project for scoping CSS. That is not something that the web standard does, and there isn't any relation or similarity between the standard and the open-source project.

## Browser support
Import attributes were previously known as import assertions. Due to issues with CSP (Content Security Policy) they have been renamed and the syntax has changed. Chrome/Edge had already shipped JSON modules and CSS modules using the older syntax (`import json from "./data.json" assert { type: "json" }`). That syntax still works, but is now deprecated. Chrome Canary has updated to use the new syntax. The older syntax is also supported in [Deno](https://examples.deno.land/importing-json) and (experimentally) in [Node](https://nodejs.org/api/esm.html#import-assertions). Hopefully they will get an update soon. [Safari](https://github.com/WebKit/standards-positions/issues/77#issuecomment-1290347676) has a positive position on the CSS modules and had previously implemented JSON modules with the old syntax in Safari Technology Preview.

[Babel](https://babeljs.io/blog/2023/05/26/7.22.0#import-attributes-15536-15620), [Webpack and Rollup](https://github.com/nicolo-ribaudo/import-attributes-ecosystem-support#import-attributes-support-in-tools) have all implemented support for the syntax. 

Bun has already [adopted import attributes](https://bun.sh/blog/bun-macros) for macros.

