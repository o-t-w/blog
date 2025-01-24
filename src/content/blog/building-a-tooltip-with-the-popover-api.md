---
pubDate: 'Jan 23 2025'
title: Building a tooltip with the popover API
heroImage: "/placeholder.jpg"
description: Building a toggletip using the popover API
---

## A CSS-only tooltip (without the popover API)

You might be familiar with an old and well-known "CSS trick" for CSS-only tooltips:

```html
<button class="tooltip" data-tooltip="Italic">I</button>
```

```css
.tooltip:hover::after {
    content: attr(data-tooltip);
    position: absolute;
}
```

<div>
<template shadowrootmode="open">
<style>
.tooltip {
    anchor-name: --tooltip;
    height: 32px;
    width: 32px;
    font-style: italic;
    font-family: ui-serif, serif;
    font-size: 16px;
}
.tooltip:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    position-anchor: --tooltip;
    position-area: top;
    justify-self: anchor-center;
    position-try: flip-block;
    margin-bottom: 6px;
    border-radius: 6px;
    color: white;
    background-color: rgb(40,40,40);
    padding: 8px 12px;
    font-size: 14px;
    line-height: 1;
    font-style: normal;
    font-family: system-ui;
}
</style>
<button class="tooltip" data-tooltip="Italic">I</button>
</template>
</div>

A more accessible version would look something like:

```html
<button aria-labelledby="italics-label">I</button>
<div role="tooltip" id="italics-label">Italic</div>
```

```css
[role="tooltip"] {
  display: none;
}

button:hover + [role="tooltip"],  
button:focus + [role="tooltip"] {  
  display: block;
}
```

<div>
<template shadowrootmode="open">
<style>
button {
height: 32px;
width: 32px;
font-style: italic;
font-family: ui-serif, serif;
font-size: 16px;
anchor-name: --btn;
}
[role="tooltip"] {
position: absolute;
position-area: bottom center;
position-area: top;
    justify-self: anchor-center;
    position-try: flip-block;
    margin-bottom: 6px;
position-anchor: --btn;
border-radius: 6px;
color: white;
background-color: rgb(40,40,40);
padding: 8px 12px;
font-size: 14px;
line-height: 1;
display: none;
}
button:hover + [role="tooltip"],  
button:focus + [role="tooltip"] {  
    display: block;
}
</style>
<button aria-labelledby="italics-label">I</button>
<div role="tooltip" id="italics-label">Italic</div>
</template>
</div>

(Above code courtesy of [Inclusive Components](https://inclusive-components.design/tooltips-toggletips/).)

For either approach, anchor positioning can be used to position the tooltip in relation to the button.

Some interaction patterns can't yet be achieved using only HTML and CSS. The following example  looks at using JavaScript and the popover API.

## A toggletip using the Popover API

Definitions are hazy, but the term toggletip is sometimes used to describe a UI element that, while similar to a tooltip, isn't only visible while a user is hovering, and is dismissed with a user action.

The following example makes use of anchor positioning and `popover="hint"` so currently only works in Chrome Canary.

A popover can contain buttons, links, and other interactive content. This example recreates a UI pattern from GitHub.com: a link that shows a card with some additional information on hover. In my reinterpretation, the card is shown on hover or focus, and closed via the escape key or clicking outside the card.

<script type="module">
const link = document.querySelector(".gh-a");
const popover = document.querySelector(".gh-popover");

link.addEventListener("mouseover", function () {
popover.showPopover({ source: this });
});

link.addEventListener("focus", function () {
popover.showPopover({ source: this });
});
</script>

<style>
   .gh-popover {
        inset: auto;
        margin: 0;
        left: calc(anchor(left) - 17px);
        top: anchor(bottom);
        position-try: flip-block;
        margin-top: 12px;
        border: solid 1px #d1d9e0;
        border-radius: 6px;
        padding: 16px;
        font-size: 14px;
        width: 100%;
        max-width: 300px;
        line-height: 1;
      }

      .gh-button {
        color: #25292e;
        background-color: #f6f8fa;
        padding: 3px 12px;
        font-size: 12px;
        line-height: 20px;
        user-select: none;
        border: 1px solid #d1d9e0;
        border-radius: 6px;
      }
      
      .gh-button:hover {
        cursor: pointer;
      }

      .gh-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;;
      }

      .gh-a {
        color: rgb(90, 90, 90);
        display: block;
        width: fit-content;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        margin-right: 4px;
        color: rgb(31, 35, 40);
        text-decoration-thickness: 1px;
      }

      .gh-a:hover {
        text-decoration: underline;
      }

      button {
        font-family: system-ui;
      }

      .gh-flex {
        display: flex;
        justify-content: space-between;
      }

      .gh-buttons {
        display: flex;
        gap: 8px;
        align-items: start;
      }

      .gh-popover p {
        margin-bottom: 0 !important;
      }

      .gh-bold {
        font-weight: 500;
      }

      .mt4 {
        margin-top: 4px !important;
      }
      .mt8 {
        margin-top: 8px !important;
      }
</style>

<div style="background: #f6f8fa; border: solid 1px rgb(209, 217, 224); border-radius: 6px; padding-inline: 16px; padding-block: 8px;">
<a class="gh-a" href="https://github.com/o-t-w">hover-me</a>
</div>

<div popover="hint" class="gh-popover">
<div class="gh-flex">
<img src="/otw.jpeg" class="gh-circle"></img>
<div class="gh-buttons">
<button class="gh-button">Sponsor</button>
<button class="gh-button">Follow</button>
</div>
</div>
<div class="mt8 gh-bold">Oliver Williams</div>
<p class="mt8">CSS. Design. UX. UI. Web.</p>
</div>

The `popovertarget` attribute can only be used on a `button`, and only works on click. Calling the `.showPopover()` method in JavaScript offers more flexibility.

```js
const link = document.querySelector("a");
const popover = document.querySelector("[popover]");

link.addEventListener("mouseover", function() {
popover.showPopover();
});

link.addEventListener("focus", function() {
popover.showPopover();
});
```

Along with the `mouseover` event to open the popover on hover, it also listens for the `focus` event to cater to people using a keyboard to navigate.

When using a button with a `popovertarget` attribute (or a `command` and `commandfor` attribute), the button automatically becomes the anchor of the popover. That's a useful default behaviour you miss out on when using JavaScript — unless you specify a source element. An object with a `source` property can be passed as an argument to the `.showPopover()` method. This avoids the need to set an `anchor-name` and `position-anchor` property in CSS.

Let's improve the previous code:

```js
const link = document.querySelector("a");
const popover = document.querySelector("[popover]");

link.addEventListener("mouseover", function() {
popover.showPopover({ source: this });
});

link.addEventListener("focus", function() {
popover.showPopover({ source: this });
});
```

The `source` property is used to specify the DOM node that opened the popover. Using the above code, the link will become the anchor of the popover.

The previous code opens the popover, but what about closing it? Popovers have light-dismiss functionality built-in. The popover will close when the user clicks elsewhere or presses the escape key.

This UI pattern works well on a desktop or laptop but on a phone or tablet the user can only click the link, not bring up the card. The functionality is complementary and non-essential, so that's acceptable. Users can achieve the actions in the card (follow and sponsor) on the next page after clicking the link.

## `popover="hint"`

The HTML for the previous example basically looks like this:

```html
<a href="https://github.com/o-t-w">hover-me</a>

<div popover="hint">
<!-- contents of the popover -->
</div>
```

I could have used `popover="auto"` and things would have worked much the same. The key difference is that an `"auto"` popover will close other popovers, whether you open the popover with a mouse click, a keyboard button press, or with JavaScript. `popover="hint"` is primarily designed for hover interactions, and will not close other popovers (unless its opened with a mouse press, which isn't what its designed for).

<script type="module">
const link = document.querySelector(".gh-a2");
const popover = document.querySelector(".example-2");

link.addEventListener("mouseover", function () {
popover.showPopover({ source: this });
});

link.addEventListener("focus", function () {
popover.showPopover({ source: this });
});
</script>

<div style="background: #f6f8fa; border: solid 1px rgb(209, 217, 224); border-radius: 6px; padding-inline: 16px; padding-block: 8px; display: flex; align-items: center;">
<a class="gh-a gh-a2" href="https://github.com/o-t-w">hover-me</a>
<button class="gh-button" style="margin-left: auto" popovertarget="pop-auto">Toggle auto popover</button>
</div>

<div popover="hint" class="gh-popover example-2">
<div class="gh-flex">
<img src="/otw.jpeg" class="gh-circle"></img>
<div class="gh-buttons">
<button class="gh-button">Sponsor</button>
<button class="gh-button">Follow</button>
</div>
</div>
<div class="mt8 gh-bold">Oliver Williams</div>
<p class="mt8">CSS. Design. UX. UI. Web.</p>
</div>

<div popover class="gh-popover" style="right: calc(anchor(right) - 17px); left: auto; width: fit-content;" id="pop-auto">An "auto" popover</div>

## Conclusion

We live in a mobile-first age, but work-related apps are still primarily used on desktop and laptop, and for complex applications without the space to label every button, tooltips still come in handy.
