---
pubDate: 'Sep 08 2026'
title: Link parameters for SVG
heroImage: "/link-parameters.png"
description: Setting colors for SVG via CSS
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

<div class="box">
<h2>Browser support</h2>
<p>The link-parameters CSS property is supported in Firefox Nightly. Other aspects of the spec are not implemented anywhere. All the examples in this article require Firefox Nightly to work. Implementation work is ongoing in Chrome/Edge. You can vote for the inclusion of link parameters in <a href="https://github.com/web-platform-tests/interop/issues/1346">Interop 2027</a>.</p>
</div>

The simplest approach is using SVG is the `<img>` element, but until now its come with a big restriction: there was no way to control the colors of the SVG from CSS. Link parameters are a way to set CSS custom environment variables on an SVG `<img>`.

A link parameter is used within SVG code via the `env()` function:

```html
<svg fill="env(--color)" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" />
</svg>
```

Link parameters can be specified in three different ways:

## Via the `link-parameters` CSS property

```css
img {
    link-parameters: param(--color, blue);
}
```

## In the URL of the image
<!-- DOESNT WORK IN FIREFOX YET EXAMPLE COPIED FROM SPEC

"via a special syntax in the fragment portion of the URL of an external resource" - spec -->

The strange syntax `:~:` is known as a fragment directive:


```html
<img src="circle.svg#:~:param(--color,blue)">
```

## In the `url()` function in CSS

```css
.circle-icon {
  background-image: url("circle.svg" param(--color, blue));
}
```

## Multiple parameters

Multiple link parameters can be specified in order to style different parts of the SVG, or to set a separate `fill` and `stroke` color:

```css
img {
    link-parameters: param(--color1, blue), param(--color2, green);
}
```

```html
<svg fill="env(--color1)" stroke="env(--color2)" stroke-width="4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" />
</svg>
```

<!-- 

```html
<svg fill="light-dark(env(--lightSchemeColor), env(--darkSchemeColor))" style="color-scheme: light dark;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" />
</svg>
```

WOULDNT THE FOLLOWING BE EASIER TO JUST SET IT TO CURRENTCOLOR, AND THAT WILL AUTOMATICALLY FOLLOW DARK MODE! -->

<!-- This DOES work in Firefox already!! -->

## Light and dark mode

For the CSS `light-dark()` function to work properly, make sure to set the `color-scheme` property inside the SVG code.

```html
<svg style="color-scheme: light dark;" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 248 204">
  <path fill="env(--color)" d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"/>
</svg>
```

```css
img {
  link-parameters: param(--color, light-dark(#515151, #f3f3f3));
}
```

<div style="display: flex; gap: 8px;">
<img style="padding: 12px; link-parameters: param(--color, light-dark(#515151, #f3f3f3)); width: 48px;" class="approved" src="/bird.svg" alt="">
<img style="padding: 12px; color-scheme: dark; background-color: Canvas; link-parameters: param(--color, light-dark(#515151, #f3f3f3)); width: 48px;" class="approved" src="/bird.svg" alt="">
</div>

<!-- ## `currentcolor`

SHOULD IT WORK WITH CURRENTCOLOR?? BUT DOESNT!

```css
img {
    link-parameters: param(--color, currentcolor);
}
``` -->

<!--
## Transitions THIS MIGHT CHANGE. RECHECK

 For hover effects, for instance, a CSS `transition` does not work when applied to the `link-parameters` property. Instead, specifying the transition within a `<style>` block within the SVG code does seem to work:

```html
<svg fill="env(--color1)" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<style>
circle {
    transition: fill .5s;
}
</style>
  <circle cx="50" cy="50" r="50" />
</svg>
``` -->

<!-- SHOULD THIS WORK???

The `link-parameters` property can't be animated. For hover effects and other CSS transitions, a registered CSS custom property can be used.

```css
@property --color {
  syntax: '<color>';
  inherits: true;
  initial-value: #3498db;
}

img {
    link-parameters: param(--color1, var(--color));
    transition: --color 0.5s;
}

img:hover {
    --color: #00568f;
}
``` -->

## Values other than color

While `fill` and `stroke` color is the predominant use case, there are no limitations:

```css
img {
    link-parameters: param(--stroke-width, 5);
}
```

```html
<svg stroke="pink" stroke-width="env(--stroke-width)" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" />
</svg>
```

<!-- THEORETICALLY YOU COULD PASS IN CURRENTCOLOR BUT THAT DOES NOT WORK IN FIREFOX YET!

```css
img {
    link-parameters: param(--color, currentcolor);
}
``` -->

<!-- ## Combining the approaches

Should you want to, you can pass different params to the same resource in different ways:

```html
<img src="image.svg#param(--color1,green)">
```

```css
img {
    link-parameters: param(--color2, blue);
}
``` -->

## The power of modern CSS within SVG code

`link-parameters` can be combined with other features of CSS within the SVG code. Seperate shades can be created from a single color using either relative color syntax or the `alpha()` CSS function.

For example, in the below icon, the background shape makes use of the same color as the tick icon, but at a reduced opacity.

<div style="display: flex; gap: 8px;">
<img style="link-parameters: param(--color, blue); width: 48px;" class="approved" src="/approved.svg" alt="">
<img style="link-parameters: param(--color, green); width: 48px;" class="approved" src="/approved.svg" alt="">
</div>

```html
fill="alpha(from env(--color) / 50%)"
```

```html
<img style="link-parameters: param(--color, blue);" src="/approved.svg" alt="">
<img style="link-parameters: param(--color, green);" src="/approved.svg" alt="">
```
