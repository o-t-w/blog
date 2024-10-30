---
pubDate: 'Oct 30 2024'
title: "The stretch keyword: a better alternative to width: 100% in CSS?" 
tags:
  - CSS
heroImage: "/stretch.png"
description: ...
---

Certain HTML elements, like a `div` or a `p`, will stretch to take up the full available width by default. If you give them a horizontal `margin`, it won’t cause a horizontal scrollbar. This is an incredibly useful default behaviour. Of course, many other elements aren’t full-width by default. Let’s look at a few instances where `width: 100%` comes in handy, before looking at a newer alternative.

The default dimensions of an image are defined by the embedded image's intrinsic size. It’s necessary to give large images a `width` of `100%` to prevent overflow.

Want a `button` or a `select` element to be full width? You’ll need to apply `width: 100%`.

**If you add a left or right `margin` to any element with a `width` set to `100%`,  it will cause overflow, leading to a horizontal scrollbar.**

This could already be solved by using `calc` to subtract the combined value of both margins. So if you had a left and right `margin` of `24px`, the following would work:

```css
button {
    width: calc(100% - 48px);
    margin-inline: 24px;
}
```

If you later decide to update the visual design by changing the size of the margins, you’d also need to change the value in the `calc` function. There’s now a simpler approach that lets you avoid math entirely: the `stretch` keyword.

```css
button {
    width: stretch;
    margin-inline: 24px;
    }
```

This property allows other elements to adopt the `auto` behaviour of divs and paragraph elements: stretch to fill the available width while also allowing for the unproblematic use of margins.

The `stretch` keyword also specced to work when specifying `height` and  `flex-basis`.

## Browser support

`stretch` is one of the few CSS properties that still requires a vendor prefix. The following code should work in [all browsers](https://caniuse.com/mdn-css_properties_width_stretch):

```css
width: -webkit-fill-available;
width: -moz-available;
width: stretch;
```

This property is finally being standardised and [should be available unprefixed soon](https://groups.google.com/a/mozilla.org/g/dev-platform/c/-pMSV-kgUjA/m/VRL09R1NAAAJ).

For now, only `width` is supported by all browsers. Using `-moz-available` or `-webkit-fill-available` for [`min-width`](https://caniuse.com/mdn-css_properties_min-width_stretch) or [`max-width`](https://caniuse.com/mdn-css_properties_max-width_stretch) is not supported by Firefox or Safari. `-moz-available` does not work for `height` in Firefox. Chrome doesn't support `-webkit-fill-available` as a value for `flex-basis`.
