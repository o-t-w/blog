---
pubDate: 'Jul 30 2023'
title: Declarative Shadow DOM
postSlug: declarative-shadow-dom
tags:
  - JavaScript
  - Shadow DOM
  - CSS
heroImage: "/declarativeshadowdom.png"
description: Shadow DOM without JavaScript
---

Using shadow DOM previously required JavaScript:

```js
this.attachShadow({mode: "open"});
```

You can now utilise shadow DOM entirely in HTML by using the `shadowrootmode` attribute on a `<template>` element.  

```html
<div>
    <template shadowrootmode="open">
        <p>This is in the shadow DOM</p>
        <button>Shadow button</button>
    </template> 
</div>   
```

While Shadow DOM is typically used together with custom elements, you can attach Shadow DOM to most HTML elements. 

Any elements within the `<template>` will be in the shadow DOM. You can optionally use the `<slot>` element to render content within the light DOM.

```html
<div>
    <template shadowrootmode="open">
        <p>This is in the shadow DOM</p>
        <slot>
            <p>This is in the light DOM</p>
            <button>Light button</button>
        </slot>
        <button>Shadow button</button>
    </template> 
</div>   
```

Any elements that are outside of the template, but within the parent of the template (a `div` in this example) will end up in the `<slot>`.

```html
<div>
    <template shadowrootmode="open">
        <p>This is in the shadow DOM</p>
        <slot></slot>
        <button>Shadow button</button>
    </template>
     <p>This ends up in the slot</p>
    <button>This also ends up in the slot</button>
</div>   
```

You can use a `<style>` tag to style the contents of the shadow DOM:

```html
<div>
    <template shadowrootmode="open">
        <style>
        p {
            color: red;
        }
        button {
            background-color: blue;
        }
        </style>
        <p>This is in the shadow DOM</p>
        <button>Shadow button</button>
    </template>
</div>   
```

## React problems

If you try to use declarative shadow DOM in a React component, you'll run into problems:
```jsx
export default function Thing() {
  return (
    <div>
      <template shadowrootmode="open">
        <h2>This is in the shadow DOM</h2>
      </template>
    </div>
  );
}
```

In Next.js, you'll get the error "Error: Hydration failed because the initial UI does not match what was rendered on the server. Warning: Expected server HTML to contain a matching `<template>` in `<div>`." In Remix the shadow DOM will momentarily render before disappearing, but doesn't log any kind of error. 

Somebody [raised an issue](https://github.com/facebook/react/issues/26071) in the React GitHub repo but I would very much doubt it will be fixed anytime soon, if ever.  