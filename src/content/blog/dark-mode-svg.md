---
pubDate: 'Mar 24 2025'
title: Dark mode for SVG (and favicons)
heroImage: "/dark-mode-svg.png"
description: Using the light-dark() CSS function to implement light and dark mode for SVG icons and SVG favicons, including SVG used with the HTML img element or as a CSS background-image. 
---

SVG has a unique benefit over other image formats: CSS can be included within the markup of the image itself. For inline SVG, `currentcolor` and CSS variables are simple ways to implement dark mode. When SVG is used like a typical image format, neither of those approaches work. When an `.svg` file is used (rather than including SVG markup directly within HTML) the CSS `light-dark()` function offers a solution.

Below are three SVG circles. One is a `<div>` using the CSS `background-image` property. The second is a HTML `<img>` element. The third uses `<use>`. Their `fill` color will depend on the users system preferences:

<div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; color-scheme: light dark; background-color: Canvas; padding: 16px;">
<div style="width: 40px; height: 40px; background-image: url('/circle.svg')">
</div>
<img width="40px" src="/circle.svg" alt="">
<svg width="40" height="40">
    <use href="/circle.svg#circle"></use>
</svg>
</div>

```html
<div style="background-image: url('/circle.svg'); width: 40px; height: 40px;"></div>
<img width="40px" src="/circle.svg" alt="">
<svg width="40" height="40">
    <use href="/circle.svg#circle"></use>
</svg>
```

The contents of the `circle.svg` file:

```html
<svg style="color-scheme: light dark;" fill="light-dark(black, white)" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" id="circle"><circle cx="5" cy="5" r="5"/></svg>
```

The `color-scheme` property inside the SVG is effectively saying "these are the color schemes I can support", but the actual scheme used by the SVG can be controlled from outside, either by the `color-scheme` CSS property, or by a `color-scheme` meta tag in the `<head>` of the HTML document. The code inside the SVG file defines which color themes the SVG is capable of, and the code in the HTML document specifies which theme it wants to use.

```html
<img width="40px" src="/circle.svg" alt="">
<img style="color-scheme: light;" width="40px" src="/circle.svg" alt="">
<img style="color-scheme: dark;" width="40px" src="/circle.svg" alt="">
```

<div style="margin-bottom: 24px; line-height: 1.3; font-size: 16px;">
<div style="display: grid; grid-template-columns: max-content 1fr; color-scheme: light dark; background-color: Canvas; color: CanvasText; padding: 8px; align-items: center; gap: 12px;"><img width="32px" src="/circle.svg" alt=""> <span>Depends on system preference</span></div>
<div style="display: grid; grid-template-columns: max-content 1fr; color-scheme: light; background-color: Canvas; color: CanvasText; padding: 8px; align-items: center; gap: 12px;"><img style="color-scheme: light;" width="32px" src="/circle.svg" alt=""> <span>Uses light color scheme, regardless of system preference</span></div>
<div style="display: grid; grid-template-columns: max-content 1fr; color-scheme: dark; background-color: Canvas; color: CanvasText; padding: 8px; align-items: center; gap: 12px;"><img style="color-scheme: dark;" width="32px" src="/circle.svg" alt=""> <span>Uses dark color scheme, regardless of system preference</span></div>
</div>

The following code in the `<head>` of a HTML document indicates that the document only uses dark mode, so the dark value specified in `light-dark()` will be used by any SVG image that has indicated it can support dark mode via `color-scheme`:

```html
<meta name="color-scheme" content="dark" />
```

## Other approaches

### The `prefers-color-scheme` media query

For SVG that are not inline, the `prefers-color-scheme` media query works in Chrome/Edge and Firefox, but not in Safari. There is an [open bug](https://bugs.webkit.org/show_bug.cgi?id=199134).

The `prefers-color-scheme` media query can be used inside of a `<style>` block inside an SVG:

```html
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <style>
    :root { color: black }
    @media (prefers-color-scheme: dark) {
      :root { color: white }
    }
  </style>
  <rect fill="currentColor" width="32" height="32"/>
</svg>
```

In browsers that do support `prefers-color-scheme` for non-inline SVG, the results of the query are impacted by both the `color-scheme` CSS property and by the HTML `color-scheme` meta tag.

```html
<div style="color-scheme: light">
  <img src="/square.svg">
</div>
<div style="color-scheme: dark">
  <img src="/square.svg">
</div>
```

<div style="color-scheme: light; background-color: Canvas; padding: 8px;">
  <img style="border-radius: 0;" src="/square.svg">
</div>
<div style="color-scheme: dark; background-color: Canvas; margin-top: 8px; margin-bottom: 32px; padding: 8px;">
  <img style="border-radius: 0;" src="/square.svg">
</div>

### The `<picture>` element

The `<picture>` element can be used to display one image for dark mode and another for light mode. This requires exporting the same SVG image as two different files. The `<picture>` markup needs to be repeated every time the icon is used. The simple `<img>` tag is less code. Unlike the `<picture>` element, using `light-dark()` within the markup of the SVG also works for CSS background images.

## Dark mode for SVG favicons

Safari Technology Preview recently added support for SVG favicons. Implementing a favicon is now as simple as including the following in the `<head>` of the HTML:

```html
 <link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

[Previous articles](https://blog.tomayac.com/2019/09/21/prefers-color-scheme-in-svg-favicons-for-dark-mode-icons/) about dark mode for SVG favicons make use of the `prefers-color-scheme` media query, which Safari doesn't support. Historically, that hasn't mattered because Safari didn't support SVG favicons whatsoever. Now that Safari does support SVG favicons, `light-dark()` is a better approach as it will work in all browsers.
