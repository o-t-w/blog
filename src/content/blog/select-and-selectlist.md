---
author: Ollie Williams
pubDatetime: 2023-09-20T15:22:00Z
title: What's new with <select> (and <selectlist>)?
postSlug: select-and-selectlist
featured: false
draft: false
tags:
  - HTML
ogImage: "/assets/selectlist.png"
description: Customizing the select menu 
---

## Programmatically open an option picker with `.showPicker()`
Until now, there was no way to programatically open a `<select>` menu. `document.querySelector('select').click();` does not work. Instead we can use `.showPicker()`. `.showPicker` was originally added for certain HTML inputs: color, date, month, week, time, datetime-local and file, but it now works for the select element as well. 

```js
document.querySelector('select').showPicker();
```

`showPicker()` can only be called with a user interaction, otherwise it will throw a "NotAllowedError" DOMException. So the above code alone wouldn't actually work, but the following would:

```js
document.querySelector('button').addEventListener('click', function() { document.querySelector('select').showPicker();
});
```

<select name="" id="">
  <option value="one">Option one</option>
  <option value="two">Option two</option>
  <option value="three">Option three</option>
</select>
  
<button>Show Picker</button>

### Usage within iframes
Using `.showPicker()` on a select element will only work in same-origin iframes. If called in a cross-origin iframe it will throw a "SecurityError" DOMException.

### Feature detection

```js
if ("showPicker" in HTMLSelectElement.prototype) {
  // showPicker() is supported.
}
```

### Browser support
This feature is supported in Chrome 119. [Firefox](https://github.com/mozilla/standards-positions/issues/886) and [Safari](https://github.com/WebKit/standards-positions/issues/258) have expressed a positive position on the standard. 

## Using horizontal rules in a `<select>`

It's sometimes useful to group options with a select menu. We can now use a `<hr>` element to add a simple horizontal line to visually divide different groups.

```html
<select name="" id="">
  <option value="apple">Apple</option>
  <option value="mango">Mango</option>
  <hr/>
  <option value="carrot">Carrot</option>
  <option value="beetroot">Beetroot</option>
</select>
```

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="VwqrNQK" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/VwqrNQK">
  Horizontal rule in select </a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

This feature is currently supported in Safari 17 and Chrome 118.

You might want to further customize a `<select>`. For that we need a whole new element: `<selectlist>`.

## `<selectlist>`
**There are currently no up-to-date docs about this new API**

After a name change and some API changes, it looks like its finally on its way to being stable.

Here are some demos from the Microsoft Edge team https://microsoftedge.github.io/Demos/selectlist/

[Una CodePen examples](https://codepen.io/collection/QWeLGB/3b329b601dae2f8ebbbc2711f2564d55?grid_type=grid&cursor=eyJwYWdlIjoxfQ==)