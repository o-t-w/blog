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
Until now, there was no way to programatically open a `<select>` menu. `document.querySelector('select').click();` does not work. Instead we can use `.showPicker()`. `.showPicker` originally worked for color, date, month, week, time, datetime-local and file inputs. It now also works for the select element: 

```js
document.querySelector('select').showPicker();
```

`showPicker()` can only be called with a user interaction, otherwise it will throw a "NotAllowedError" DOMException. So the above code alone wouldn't actually work, but the following would:

```js
document.querySelector('button').addEventListener('click', function() { document.querySelector('select').showPicker();
});
```

<iframe style="height: 48px;" src="/iframes/picker.html" frameborder="0"> 

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

It's sometimes useful to group options with a select menu. We can now use a `<hr>` element to add a simple horizontal line to visually divide different options.

```html
<select name="" id="">
  <option value="apple">Apple</option>
  <option value="mango">Mango</option>
  <hr/>
  <option value="carrot">Carrot</option>
  <option value="beetroot">Beetroot</option>
</select>
```

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="VwqrNQK" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/VwqrNQK">
  Horizontal rule in select </a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

This feature is currently supported in Safari 17 and Chrome 118.

We already had a way to group options with `<optgroup>`, which displays a label for each group:

```html
<select id="dino-select">
  <optgroup label="Theropods">
    <option>Tyrannosaurus</option>
    <option>Velociraptor</option>
    <option>Deinonychus</option>
  </optgroup>
  <optgroup label="Sauropods">
    <option>Diplodocus</option>
    <option>Saltasaurus</option>
    <option>Apatosaurus</option>
  </optgroup>
</select>
```

You can optionally use both `optgroup` and `hr` together:

```html
<select id="dino-select">
  <optgroup label="Theropods">
    <option>Tyrannosaurus</option>
    <option>Velociraptor</option>
    <option>Deinonychus</option>
  </optgroup>
  <hr>
  <optgroup label="Sauropods">
    <option>Diplodocus</option>
    <option>Saltasaurus</option>
    <option>Apatosaurus</option>
  </optgroup>
</select>
```

You might want to further customize a `<select>`. For that we need a whole new element: `<selectlist>`.

## `<selectlist>`

In the 2023 [State of CSS survey](https://2023.stateofcss.com/en-US/usage/#css_pain_points), styling form elements was voted as one of the worst pain points for developers. According to a [survey](https://www.gwhitworth.com/posts/2019/form-controls-components/) by Greg Whitworth, styling select elements is the form control that gives developers the most frustration.

![](/assets/form-controls-graph.avif)

"While it’s relatively easy to style the appearance of the button part of a <select> (the thing you see in the page when the popup is closed), it’s almost impossible to style the options (the thing you see when the popup is open), let alone add more content within the popup. As a result, design systems and component libraries have been rolling out their own selects, made from scratch using custom HTML markup, CSS, and often a lot of JavaScript, in order to have something that integrates nicely with the other components. Unfortunately, doing so correctly with the right accessibility semantics, keyboard support, and popup positioning is not easy." - [Patrick Brosset, CSS Tricks](https://css-tricks.com/the-selectmenu-element/)

The new `selectlist` HTML element is a more customisable alternative to the `select` element. 
After a name change and some API changes, it looks like its finally on its way to being stable. It's currently available in Chrome Canary. This is the most useful addition to HTML that we've seen in quite some time. Below are some examples to show what sort of thing will be possible in the future.

Here's an example I made that uses images within the options (something that was not possible with a `select` element):

   <iframe src="https://codesandbox.io/embed/custom-button-vs-default-button-q9r727?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="custom button vs default button"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

The default `selectlist` button doesn't offer much in terms of customisation. You can nest a `button` element within the select, over which you have full stylistic control. You can nest `<selectedoption></selectedoption>` within the button to reflect whatever DOM elements are in the currently selected `option`. If you stick to the default button, there's a handy `::marker` pseudo-class we can use to style the arrow:

> this isn't implemented yet in Chrome Canary... make an example when it is ready. Should be selectlist::marker


And here's an example using inline SVG:

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="ZEwxJOw" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/ZEwxJOw">
  Untitled</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

By nesting a `div` within the `listbox`, you can even display the options horizontally: 

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="xxMWLjZ" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/xxMWLjZ">
  Untitled</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

To style the currently selected option within the dropdown, use `option:checked`:

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="BaMrwme" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/BaMrwme">
  Styling the currently selected option in a selectlist</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


As with a `select` element, you can use <hr> and `<optgroup>` within a `selectlist`. You can also call `.showPicker()` on a `selectlist`.

Here are [some demos](https://microsoftedge.github.io/Demos/selectlist/) from the Microsoft Edge team for a taste of what will be possible in the future. 

[A fun demo](https://codepen.io/utilitybend/pen/PoXOzzw) from utilitybend.

[Una CodePen examples](https://codepen.io/collection/QWeLGB/3b329b601dae2f8ebbbc2711f2564d55?grid_type=grid&cursor=eyJwYWdlIjoxfQ==)

There are certain limitations with selectlist that might require you to build your: selecting multiple options isn't possible. 

Combobox (an element that combines an text input with a dropdown list) is [being developed](https://open-ui.org/components/combobox.explainer/) by the Open UI group seperately. 