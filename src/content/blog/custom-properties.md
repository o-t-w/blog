---
pubDate: 'May 24 2023'
title: Register custom properties in CSS, get and update them with JavaScript
tags:
  - CSS
  - Houdini
  - Typed OM
  - JavaScript
  - CSS Custom Properties
heroImage: "/custom-properties.png"
description: Use @property to register custom properties in CSS. Get and update them in JavaScript with the Typed OM. 
---

In this article we’ll look at two different ways to get the value of a CSS custom property and set or override the value of a custom property using JavaScript. The first is supported in all browsers. The second approach uses the Typed OM, which isn't supported in Firefox just yet.  

We’ll then learn how to register a custom property as being of a particular type.

Let’s say we have a `--size` variable defined on the `:root`/`html` element:

```css
:root {
    --size: 24px;
  }
```
 Here’s how you can obtain the value of that custom property in JavaScript:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--size');
```
Here’s how you set a CSS custom property inline on the `:root`/`html` element with JavaScript: 

```javascript
document.documentElement.style.setProperty('--accent-color', 'rgb(100,110,10)');
```
Now let's take a look at doing the same thing with the Typed OM API. 

## Setting a custom property using the Typed OM API

We can use `attributeStyleMap.set()` to set a custom property as an inline style: 
```javascript
document.documentElement.attributeStyleMap.set('--size', '20px');
```

Somewhat surprisingly, the following does **not** work and will cause an error, regardless of whether you have registered the property or not: 
```js
document.documentElement.attributeStyleMap.set('--size', CSS.px(20));
```

## Getting custom properties using the Typed OM API

To get the value of a custom property we use `computedStyleMap().get()`:
```javascript
const size = document.documentElement.computedStyleMap().get("--size");
```
If you `console.log` size now, it’ll show `CSSUnparsedValue {0: '24px', length: 1}`. You’ll notice that `'24px'` is a string. By using `CSSNumericValue.parse()` we can get the value as a number and the unit as a string.
```javascript
const parsedSize = CSSNumericValue.parse(document.documentElement.computedStyleMap().get("--size"))
```
Now a `console.log` will show `CSSUnitValue {value: 24, unit: 'px'}`

Needing to use `CSSNumericValue.parse()` doesn’t feel great. We can define the type of a custom property by registering it in CSS or JavaScript. Let’s do that instead.

## Register a custom property in CSS with `@property`

When we define a custom property, the browser has no way of knowing what kind of value it contains. The CSS [Properties and Values API](https://drafts.css-houdini.org/css-properties-values-api/) provides a way to register a custom property as being of a particular type. 

You define `@property` outside of any selector - meaning rather than `html { @property ...}` or `:root {@property ...}` you just write:

```css
@property --size {
    syntax: "<length>";
    inherits: true;
    initial-value: 24px;
  }
```
`syntax` is where we specify a type. It can be one of `"<length>"`, `"<number>"`, `"<percentage>"`, `"<length-percentage>"` (any valid length or percentage value, any valid `calc()` expression combining length and percentage components), `"<color>"`, `"<image>"`, `"<url>"`, `"<integer>"`, `"<angle>"`, `"<time>"`, `"<resolution>"`, `"<transform-function>"`, `"<transform-list>"` or `"<custom-ident>"`.

Registering a custom property has the benefit of making the custom property [animatable in CSS](https://web.dev/at-property/). It also means that JavaScript will know what type of value the custom property contains. To go back to our previous code, we can easily get the value and the unit of the CSS variable separately with JavaScript without needing `CSSNumericValue.parse()`: 

```javascript
const sizeAsNumber = document.documentElement.computedStyleMap().get("--size").value 
const sizeUnit = document.documentElement.computedStyleMap().get("--size").unit
```

## Register a custom property in JavaScript 

While the CSS approach is better, we could alternatively register a custom property with JavaScript. The equivalent to the above `@property` code would be:

```javascript
CSS.registerProperty({
    name: "--size",
    syntax: "<length>",
    inherits: true,
    initialValue: "24px"
  });
```

## Browser support

Firefox does not yet support `@property` but has expressed a [positive position](https://mozilla.github.io/standards-positions/#at-property) on the proposal. `@property` is part of [Interop 2023](https://webkit.org/blog/13706/interop-2023/#F) so will probably be implemented in Firefox at some point this year. Firefox does not support the Typed OM API but has a [positive position](https://mozilla.github.io/standards-positions/#css-typed-om) on the proposal (Typed OM is not part of Interop 2023 and there is no ETA). There are no up-to-date production-ready polyfills for Typed OM. Both `@property` and Typed OM are part of the Houdini set of API’s. [ishoudinireadyyet.com](https://ishoudinireadyyet.com/) tracks the progress of Houdini.

