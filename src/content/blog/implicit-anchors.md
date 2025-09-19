---
pubDate: 'Jan 16 2025'
title: Popovers and anchor positioning
heroImage: "/placeholder.png"
description: CSS anchor positioning and the popover API
---

<style>
#pop1 {
  position: absolute;
  inset: auto;
  left: anchor(left);
  top: calc(anchor(bottom) + 4px);
}
</style>

## Default anchor

The `button` used to open the popover will be its anchor by default. `anchor-name` and `position-anchor` aren't needed to anchor a popover.

Given the following markup:

```html
<button command="toggle-popover" commandfor="pop1">Toggle popover</button>
<div popover id="pop1">Example popover content.</div>
```

The popover can be positioned relative to the button that opened it:

```css
#pop1 {
  position: absolute;
  inset: auto;
  left: anchor(left);
  top: calc(anchor(bottom) + 4px);
}
```

<button command="toggle-popover" commandfor="pop1">Toggle popover</button>
<div popover id="pop1">Example popover content.</div>

<!-- <p class="codepen" data-height="300" data-slug-hash="yyBqyzQ" data-pen-title="anchored popover" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/yyBqyzQ">
  anchored popover</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script> -->

## Setting an anchor with CSS

The default anchor is what you want for most use-cases. You're free to use CSS to override the default if you want to anchor the popover to some other element.

You can set an _explicit_ anchor with CSS by setting an `anchor-name` property on the anchor, and a `position-anchor` property on the popover:

```css
.anchor {
  anchor-name: --eg;
}

.popover {
  position-anchor: --eg;
  position: absolute;
}
```

## Setting an invoker with JavaScript

One of the selling points of popovers is that they work without JavaScript. However, there may be situations where you need to use the `.showPopover()` method to open a popover. This method takes an optional argument of an object with a `source` property.

```js
const someElem = document.querySelector('.example');
popover.showPopover({source: someElem});
```

The `source` property is used to specify a DOM node to act as the "invoker" of the popover, as if it were the button that opened the popover. In the example code, the element with a class of `.example` becomes the anchor of the popover, without needing to set the `position-anchor` or `anchor-name` property.

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="VYZdPxw" data-pen-title="popover source" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/VYZdPxw">
  popover source</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>
