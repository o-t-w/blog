---
pubDate: 'Jan 26 2025'
title: "Focus styles and programmatic focus"
heroImage: "/focusVisible.png"
description: ":focus, :focus-visible and the JavaScript .focus() method"
---

## `:focus` and `:focus-visible` CSS selectors

For users navigating via a keyboard, its important to keep focus styles prominent and clearly noticable so that the user can follow where they are on the page. Styles defined with the `:focus` pseudo-class are applied whenever an element has focus. Clicking a button or an input with a mouse focuses that element, so mouse users will also see custom `:focus` styles. For mouse users, these styles are unecessary, may be confusing and visually distracting, and might be deemed ugly. For keyboard users, they are a necessity.

Styles set using the `:focus-visible` pseudo-class will appear when a user is navigating using a keyboard, but will not be applied by mouse interactions*.

```css
:is(select, button, input):focus {
    outline: none;
}

:is(select, button, input):focus-visible {
    outline: solid 2px blue;
}
```

*Which styles get applied depends on the element. A button, link, checkbox, radio, range, color or file input, or an element with a tabindex of 0, will only show `focus-visible` styles when the user has focused the element using a keyboard. A text input, number input, or textarea will show both `focus` and `focus-visible` styles regardless of how the user focused the element. A select will show both `focus` and `focus-visible` styles for mouse-clicks in Chrome, but only `focus` styles in Firefox 🤷‍♂️.

## Programmatic focus styles

What happens when you focus an element using JavaScript?

`:focus` styles are always applied when an element is focused using JavaScript. Whether `:focus-visible` styles are applied depends on the context.

In the following example, clicking button2 with a mouse will focus button1 but won't show button1's `:focus-visible` styles. If you use a keyboard to press button2, button1’s `:focus-visible` styles will be shown.

```js
 button2.addEventListener('click', function() {
    button1.focus();
});
```

<style>
:is(#button1, #button2):focus {
    outline: dashed 3px pink;
    background-color: yellow;
}

:is(#button1, #button2):focus-visible {
    outline: solid 2px blue;
    border-radius: 3px;
}
</style>

<button class="simple-button" id="button1">button1</button>
<button class="simple-button" id="button2">Press to focus button1</button>

The above example uses the following (somewhat lurid) styles:

```css
button:focus {
    outline: dashed 3px pink;
    background-color: yellow;
}

button:focus-visible {
    outline: solid 2px blue;
    border-radius: 3px;
}
```

<script>
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
button2.addEventListener('click', function() {
button1.focus();
});
</script>

The HTML spec is somewhat vague about what's meant to happen. If, "in an implementation-defined way the user agent determines it would be best to do so, then indicate focus". It's left up to individual browsers to decide what to do, which leaves scope for inconsistencies. Current default behaviours shouldn't be relied upon as any browser could opt to change its behaviour in the future.

Whether `:focus-visible` styles are applied can be controlled via a `focusVisible` boolean option:

```js
button1.focus({focusVisible: false});
```

Set `focusVisible` to false and `:focus-visible` styles won't be applied, set it to true and they will be.

## Browser support

The `focusVisible` option for the `.focus()` method is supported in Firefox and Safari Technology Preview.
