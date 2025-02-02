---
pubDate: 'Feb 02 2025'
title: Combining currentcolor with relative color syntax
heroImage: "/currentcolor.png"
description: Using the CSS currentcolor keyword with relative color syntax
---

<style>
    .badge {
        border-radius: 20px;
        width: fit-content;
        font-size: 14px;
        font-weight: 550;
        line-height: 1;
         padding: 4px 8px;
        background-color: oklch(from currentcolor l c h / 12%);
        border: solid 1px currentcolor;
    }

    .btn-warn {
        background-color: transparent;
        color: red;
        border: 0;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 550;
        font-family: system-ui;
        border-radius: 5px;

        &:hover {
            background-color: oklch(from currentcolor l c h / 10%);
        }

         &:active {
            background-color: oklch(from currentcolor l c h / 15%);
        }
    }

    .with-shadow {
        box-shadow: oklch(from currentcolor 40% c h / 45%) 0 1px 2px 0;
    }
</style>

In 2024, browsers added support for using the `currentcolor` keyword together with relative color syntax.

It's common in UI design to set a `background-color` based on text color.

A "ghost" button, for example, might show a low-opacity background when hovered.

<button class="btn-warn">Delete</button>

That's now easy to implement using relative color syntax.

```css
.btn-warn {
    background-color: transparent;
    color: red;
    
    &:hover {
        background-color: oklch(from currentcolor l c h / 10%);
    }

    &:active {
    background-color: oklch(from currentcolor l c h / 15%);
    }
}
```

Here's a badge example where infinite variations can be achieved by changing only the `color` property.

```html
<div class="badge" style="color: navy;">NEW</div>
<div class="badge" style="color: deeppink;">NEW</div>
<div class="badge" style="color: #009b92;">NEW</div>
<div class="badge" style="color: royalblue;">NEW</div>
```

```css
.badge {
    background-color: oklch(from currentcolor l c h / 12%);
    border: solid 1px currentcolor;
    }
```

<div style="display: flex; gap: 8px; padding-block: 32px; justify-content: center;">
<div class="badge" style="color: navy;">NEW</div>
<div class="badge" style="color: deeppink;">NEW</div>
<div class="badge" style="color: #009b92;">NEW</div>
<div class="badge" style="color: royalblue;">NEW</div>
</div>

As well as backgrounds, the combination of `currentcolor` with relative color syntax could be useful for setting borders or shadows, or the `fill` and `stroke` color of an SVG, for instance. Relative color can be used to change more than opacity, as I've [written about](/color-mix-and-relative-color) previously.

Here's a slightly darker shade of the text color used for `box-shadow`:

```css
box-shadow: oklch(from currentcolor 25% c h / 45%) 0 1px 2px 0;
```

<div style="display: flex; gap: 8px; padding-block: 32px; justify-content: center;">
<div class="badge with-shadow" style="color: navy;">NEW</div>
<div class="badge with-shadow" style="color: deeppink;">NEW</div>
<div class="badge with-shadow" style="color: #009b92;">NEW</div>
<div class="badge with-shadow" style="color: royalblue;">NEW</div>
</div>
