---
pubDate: 'Dec 1 2024'
title: A more powerful CSS attr() function
heroImage: "/attr.png"
description: Fallback values and non-string values, for any CSS property, not just content
---

The `attr()` function reads the value of a HTML attribute and allows you to use it in CSS. Values defined in markup can be used within a stylesheet. The `attr()` function is used most commonly with `data-` attributes but it can access any HTML attribute. Currently, use of the `attr()` function is limited to the `content` property, meaning it can be used with `::before`, `::after` and `::marker`, and is limited to string values.

```html
<ul>
  <li data-mark="💥">item 1</li>
  <li data-mark="✨">item 2</li>
  <li data-mark="🦖">item 3</li>
</ul>
```

```css
li::marker {
  content: attr(data-mark);
}
```

## Fallback value

`attr()` supports a fallback value:

```css
h1:before {
  content: attr(data-mark, "✨");
}
```

This will be used as the default value when the data attribute is not included on the element in your HTML. This has been supported since [Firefox 119](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/119#css), [Safari Technology Preview 208](https://developer.apple.com/documentation/safari-technology-preview-release-notes/stp-release-208#New-Features), and in Chrome Canary (behind a flag).

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="abeebyZ" data-pen-title="attr() fallback " data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/abeebyZ">
  attr() fallback </a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

<small>(Safari does not yet support the `content` property for `::marker` so the list part of the above demo does not work in Safari.)</small>

## `attr()` for more than string values

In the latest W3C [CSS Values and Units specification](https://drafts.csswg.org/css-values-5/#attr-notation), the `attr()` function can be used to specify any kind of value, not just strings, and can be used as the value for any CSS property, not just `content`.

```css
[data-bg] {
  background-color: attr(data-bg type(<color>));
}
```

```html
<div data-bg="blue"></div>
```

To test out the following functionality, open Chrome Canary from terminal with the `--enable-features=CSSAdvancedAttrFunction` flag (its due to ship in [Chrome 133](https://chromestatus.com/feature/4680129030651904)).

```console
/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --enable-features=CSSAdvancedAttrFunction
```

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="VwoNPjd" data-pen-title="attr function doesn't work... " data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/VwoNPjd">
  attr function doesn't work... </a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

You can combine this new power with fallback values:

```css
div {
  background-color: attr(data-bg type(<color>), pink);
}
```

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="MYgwbJK" data-pen-title="Untitled" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/MYgwbJK">
  Untitled</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Here's an example using the `maxlength` attribute of an `input` to set the width:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="LEPZvzJ" data-pen-title="maxlength attribute for width with attr()" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/LEPZvzJ">
  maxlength attribute for width with attr()</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

You can set the value of a CSS variable using the `attr()` function:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="jENrRmr" data-pen-title="setting CSS variable with data attribute attr" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/jENrRmr">
  setting CSS variable with data attribute attr</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

If you lose the `data-` prefix, the HTML will no longer pass validation (but it will still work in all browsers).

<img src="/invalidhtml.png" alt="">

Data attributes are easy to update from JavaScript:

```js
someElement.dataset.bg = "purple";
```

Sadly, it seems that `attr()` [can't be used](https://github.com/w3c/csswg-drafts/issues/5092#issuecomment-2367503260) in conjunction with the `url()` function, so code such as the following will not work:

```css
img {
    float: left;
    shape-outside: url(attr(src type(<url>)));
    }
```

While there's been a lot of developer interest in `attr()`, some may be asking: how is this better than inline styles? Or utility classes? How is `<div data-bg="blue">` superior to `<div class="bg-blue">` or `<div style="background-color: blue;">`?

A utility class needs to have an explicit value set in a stylesheet. The value of an `attr()` function can be set to any arbitrary color, any arbitrary size, etc. Much of what you can do with the `attr()` function can be achieved with an inline CSS variable. However, a Content Security Policy might [block inline styles](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#unsafe-inline). Inline styles are often avoided because they can only be overridden with `!important`.
