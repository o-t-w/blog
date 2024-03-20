---
pubDate: 'Mar 18 2024'
title: Creating and importing styles with constructable stylesheets and CSS module scripts
tags:
  - CSS
heroImage: "/placeholder.jpg"
description: Creating, importing and manipulating stylesheets using JavaScript.
---

## TL;DR

Create a new stylesheet from scratch and apply it to a HTML document:

```js
const myStylesheet = new CSSStyleSheet();
myStylesheet.replaceSync('h1 {color: blue;}');
document.adoptedStyleSheets.push(myStylesheet);
```

Import a stylesheet from a `.css` file and apply it to a HTML document:

```js
import styles from "./styles.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);
```

## Introduction
It's long been possible to create a `<link>` or `<style>` element using JavaScript.

Here's an example adding a `<link>` element to the `<head>`: 
```js
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './fancystyles.css';
document.head.appendChild(link);
```

You can also create a `<style>` element and add styles using `.textContent` and/or `.insertRule`:

```js
const styleElement = document.createElement('style');
styleElement.textContent = "h1 {color: green;}";
styleElement.sheet.insertRule("h2 {color: blue;}");
document.head.appendChild(styleElement);
```

Constructable stylesheets are a new approach. 

## Constructable stylesheets

You can create a stylesheet with the `CSSStyleSheet()` constructor:

```js
const myStylesheet = new CSSStyleSheet();
```

Optionally, an [object of options](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/CSSStyleSheet#parameters) can be passed to the constructor. In the following example the styles within the stylesheet will only apply if the users system is set to use dark mode:

```js
const sheet = new CSSStyleSheet({media: "(prefers-color-scheme: dark)"});
```

You can add styles to the stylesheet synchonously or asynchronously:

```js
// replace all styles synchronously:
myStylesheet.replaceSync('h1 {color: green;} body {background: pink;}');
```

The asynchronous version returns a promise that resolves with the `CSSStyleSheet` object:
```js
myStylesheet.replace('h1 {color: green;} body {background: pink;}')
  .then(sheet => console.log('Successfully replaced styles', sheet))
  .catch(err => console.error('Failed to replace styles:', err));
```

You apply the stylesheet to the documents `adoptedStyleSheets` property, which is an array:

```js
document.adoptedStyleSheets.push(myStylesheet);
```

When Constructable Stylesheets first shipped in Chrome `adoptedStyleSheets` was a frozen array. Some older blog posts therefor use the following syntax:

```js
document.adoptedStyleSheets = [...document.adoptedStyleSheets, myStylesheet];
```
`adoptedStyleSheets` is [no longer a frozen array](https://github.com/WICG/construct-stylesheets/issues/45), so you can use `.push()` and other array methods. You could, for example, remove a particular stylesheet from `adoptedStyleSheets` using `filter`:

```js
document.adoptedStyleSheets = document.adoptedStyleSheets.filter(sheet => sheet !== myStylesheet); // removes myStylesheet
```

You can remove the last stylesheet with `document.adoptedStyleSheets.pop()`, the first stylesheet with `document.adoptedStyleSheets.unshift()`, etc.

When using either `.replace` or `.replaceSync`, `@import` rules are ignored with a warning. You should **not** do the following:
```js
myStylesheet.replace('@import url("styles.css");'); // Console warning
```

How, then, can we import a CSS file?

## CSS module scripts
You can import a stylesheet with JavaScript using [import attributes](/import-attributes):

```js
import myStylesheet from "./fancystyles.css" with { type: "css" };
```
The default export of a CSS module is a [`CSSStyleSheet`](https://web.dev/constructable-stylesheets/) (the same sort of object that gets created by `new CSSStyleSheet()`). 

![console.log of a CSSStyleSheet](/cssstylesheet.avif)

Just like we saw with the `new CSSStyleSheet()` constructor example, applying the imported stylesheet to the HTML document is achieved via the `adoptedStyleSheets` API:

```js
document.adoptedStyleSheets.push(myStylesheet);
```

If the same CSS file is imported multiple times in your JavaScript code it will only be fetched, instantiated, and parsed a single time.

## Dynamically importing a CSS module
The import statement shown above can only be used at the top level. `import()`, by contrast, can be used inside a function or inside an `if` statement, for example. `import()` will dynamically load a module so that it is only evaluated when needed.

```js
document.querySelector('button').addEventListener('click', async function() {
    const stylesheet = await import('./extrastyles.css', { with: { type: 'css' } });
    document.adoptedStyleSheets.push(stylesheet.default);
});
```

`import()` returns a promise which fulfills with a [module namespace object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#module_namespace_object) — an object containing all the exports from the module. The `CSSStyleSheet` is the default export, so we access it with `.default`.

## Multiple stylesheets per file?
If you have dozens of `import` statements making seperate requests for CSS files, it isn't ideal for performance. That's where the [prospective addition](https://github.com/w3c/csswg-drafts/issues/5629) of named exports comes in: it looks likely that we'll eventually have a way to import different stylesheets from a single file. 

## Preloading CSS modules
When including a stylesheet in the traditional way using `<link rel="stylesheet">` in the `<head>` of a document, there's no reason to preload as the resource is discovered quickly. When importing CSS using JavaScript, by contrast, preloading might be useful. CSS imported via JavaScript only loads after the JavaScript is parsed.

As with many other kinds of resources, you can preload CSS by adding a `<link>` tag with `rel="preload"` to the `<head>` of your HTML:

```html
<link rel="preload" href="fancystyles.css" as="style" />
```

## Manipulating a `CSSStyleSheet` with JavaScript
The API for manipulating stylesheets isn't entirely new. Let's recap some older ways of obtaining a `CSSStyleSheet`.

Given the following HTML:
```html
<head>
    <meta charset="UTF-8">
    <link id="my-link" rel="stylesheet" href="extra.css">
    <style id="my-style">
        body {
            font-family: system-ui;
        }
    </style>
</head>
```

You can select a specific `<style>` or `<link>` element and get a [`CSSStyleSheet`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet) object by referencing the element's `sheet` property:

```js
const stylesheet1 = document.getElementById("my-link").sheet; // is a CSSStyleSheet
const stylesheet2 = document.getElementById("my-style").sheet; // is a CSSStyleSheet
```

To get all stylesheets you've embedded or linked to a HTML document using `<style>` or `<link>` elements, you can use `document.styleSheets` which returns an Array-like `StyleSheetList`. Each stylesheet in the list is represented by a `CSSStyleSheet` object. 

```js
const firstStylesheet = document.styleSheets[0]; // is a CSSStyleSheet
```

The `replace` and `replaceSync` methods only work on a `CSSStyleSheet` you've either created with `new CSSStyleSheet()` or imported via a JavaScript import assertion. Both of the following lines of code fail:
```js
document.getElementById("my-link").sheet.replace('h1 {color: green;}'); // DOMException: Failed to execute 'replace' on 'CSSStyleSheet': Can't call replace on non-constructed CSSStyleSheets.
document.styleSheets[0].replaceSync('h2 {color: blue;}'); // DOMException: Failed to execute 'replaceSync' on 'CSSStyleSheet': Can't call replaceSync on non-constructed CSSStyleSheets.
```

All other methods and properties work regardless of how you've obtained the `CSSStyleSheet`.

Add rules to the stylesheet using the `insertRule()` method:

```js
const ruleIndex = myStylesheet.insertRule("h1 {color: green;}");
```

The return value of the `.insertRule` method is the index of the rule. By default the rule is prepended at the start. 

Delete a rule at a specified index:

```js
myStylesheet.deleteRule(ruleIndex);
```

`CSSStyleSheet` inherits properties from [`StyleSheet`](https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet). One inherited property that might come in useful if you want to toggle a stylesheet is the `disabled` property. Rather than adding and removing a stylesheet from the `adoptedStyleSheets` array, you could toggle the disabled property:

```js
document.querySelector('button').addEventListener('click', function() {
    myStylesheet.disabled = !myStylesheet.disabled;
});
```

## Browser support
The `adoptedStyleSheets` property and the `CSSStyleSheet()` constructor have been [supported](https://caniuse.com/mdn-api_document_adoptedstylesheets) since Firefox 101, Safari 16.4 and Chrome 73.

Chrome has supported import attributes, including support for CSS modules, since version 123. [Safari 17.2](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/#:~:text=JavaScript-,Import%20attributes,-Safari%2017.2%20adds) added support for import attributes but currently only supports JSON modules, not CSS modules. Import attributes are [currently being implemented](https://bugzilla.mozilla.org/show_bug.cgi?id=1777526#:~:text=Import%20Attributes%20is%20in%20progress%20and%20quite%20close%20to%20completion) in Firefox. 

There is a [Rollup plugin](https://www.npmjs.com/package/rollup-plugin-css-modules) for using CSS module scripts in browsers that lack support but it does not offer full parity with the native browser feature.
