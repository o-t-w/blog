---
pubDate: 'Sep 08 2026'
title: accent-color and AccentColor
heroImage: "/accentcolor.png"
description: Referencing the accent-color value via the AccentColor keyword in CSS
---

<style>
    .box {
        padding: 16px;
        background-color: blue;
        background-color: #f3f3ff;
        margin-trim: block;
        border-radius: 8px;
        h2 {
            color: rgb(46, 46, 46);
            font-size: 18px;
        }
        p {
            font-size: 16px;
        }
    }
</style>


TLDR;
The `accent-color` CSS property sets the color of HTML form controls. The `AccentColor` keyword gets that color.

<div class="box">
<h2>Browser support</h2>
<p>This feature is not yet implemented in any browser but you can vote for its inclusion in <a href="https://github.com/web-platform-tests/interop/issues/1361">Interop 2027</a>.</p>
</div>

## Trying, and failing, to reflect user preferences via `AccentColor` 

A few years ago I penned an article titled _User-adaptive interfaces with AccentColor_. I was excited about a future where websites could reflect user preferences beyond dark mode, such as the color preference for form elements. Unfortunately, due to finger-printing concerns, the originally-planned functionality of `AccentColor` was curtailed. Chrome/Edge and Safari return `rgb(0, 122, 255)` (a shade of blue), regardless of your personal system setting.

<img style="width: 550px; max-width: 100%; margin-inline: auto;" src="/ignored.png" alt="">

Unable to reflect OS-level color preferences, `AccentColor`, had become a pointless keyword, totally unused by developers... but the story didn't end there. Instead, its taken on a new use case.

## Referencing `accent-color` via `AccentColor`

The CSS `accent-color` property sets the color of the following HTML elements: `<input type="checkbox">`, `<input type="checkbox" switch>`, `<input type="radio">`, `<input type="range">` and `<progress></progress>`.

```css
:root {
    accent-color: green;
}
```

<div style="accent-color: green;">
<div style="display: flex; max-width: 300px; gap: 8px; align-items: center;">
<input style="width: 20px; height: 20px;" checked type="checkbox">
<input switch checked type="checkbox">
<input style="width: 20px; height: 20px;" checked type="radio">
</div>
<input style="display: flex; max-width: 300px; gap: 8px; align-items: center; margin-top: 12px;" type="range">
<progress style="display: flex; max-width: 300px; gap: 8px; align-items: center; margin-top: 12px;" max="100" value="70"></progress>
</div>

`AccentColor` reflects the value of the `accent-color` property. Given the above code, `AccentColor` will be `green`. 

## Why is this better than a CSS variable?

You could just call a CSS variable `--AccentColor`, so why does this even matter? 

```css
:root {
    --AccentColor: green;
}
```

Currently, every component library takes a different approach: one might call a CSS custom property `--ui-accent`, another `--primary`, or `--accent-color`, or `--checked`. Some projects don't even use a CSS variable for this whatsoever. Once `AccentColor` is broadly adopted across component libraries, setting the `accent-color` property will be a consistent way for consumers of those projects to style both native HTML form controls and custom form controls. Rather than needing to consult documentation to discover the unique way a form control is styled, this will provide a standard approach. 

This might not seem like a mindblowing feature: its just a way to set a color, but it does provide an interoperable approach that can be used by all design systems, regardless of whether they're using Tailwind, CSS-in-JS, Sass, or whatever. Its often said that naming things is one of the hardest problems in computer science. This is one name you won't have to think about.


<!-- A majority of developers use custom form elements, so `accent-color` hasn't seen mass adoption. Looking to the future, browsers are working on `appearance: base` to make it easier to style HTML form controls.  It's early days for `appearance: base`, but as currently implemented in Chrome Canary, `accent-color` doesn't effect any form elements that have `appearance: base` applied:  uses black and white color only. -->
