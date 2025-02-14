---
pubDate: 'Feb 14 2025'
title: Gradient borders in CSS
heroImage: "/border-gradient.png"
description: "Using background-clip: border-area"
---

<style>
@supports(background-image: linear-gradient(green)) {
    .gradient-demo {
    width: 100px;
    height: 100px;
    background-image: linear-gradient(green);
}
}

.border-gradient-1 {
    background-image: linear-gradient(35deg, #1B88FF, oklch(0.82 0.13 223.75));
    border: solid 4px transparent;
    background-clip: border-area;
    background-origin: border-box;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 500;
    font-stretch: 110%;
    padding: 8px 16px;
    margin: auto;
    display: block;
    color:rgb(0, 51, 101);
}

.border-gradient-2 {
    background-image: linear-gradient(35deg, #1B88FF, oklch(0.82 0.13 223.75)), linear-gradient(35deg, oklch(1 0.13 223.75), #fdf7ff);
    border: solid 4px transparent;
    background-clip: border-area, padding-box;
    background-origin: border-box;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 500;
    font-stretch: 110%;
    padding: 8px 16px;
    margin: auto;
    display: block;
    color:rgb(0, 51, 101);
}

.border-gradient {
    background-image: linear-gradient(35deg, #1B88FF, oklch(0.82 0.13 223.75)), linear-gradient(white);
    border: solid 4px transparent;
    background-clip: border-area, padding-box;
    background-origin: border-box;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 500;
    font-stretch: 110%;
    padding: 8px 16px;
    margin: auto;
    display: block;
    color:rgb(0, 51, 101);
}

.transparency-bg {
    aspect-ratio: 2 / 1;
    height: 120px;
    background-image: url('/whitegraysquare.svg');
    background-repeat: round;
    margin-inline: auto;
    align-content: center;
}

@media (min-width: 440px) {
    .transparency-bg {
    aspect-ratio: 4 / 1
}
}

</style>

Safari 18.2 added a new value for the `background-clip` property: `border-area`.

It's long been possible to implement a gradient border using the `border-image` property, but that approach isn't compatible with setting a `border-radius`.

In the following example, both the `background-color` and `background-image` are clipped by `background-clip: border-area`.

<div class="transparency-bg">
<button class="border-gradient-1">border gradient</button>
</div>

```css
.border-gradient {
    background-image: linear-gradient(35deg, #1B88FF, oklch(0.82 0.13 223.75));
    background-clip: border-area;
    background-origin: border-box;
    border: solid 4px transparent;
}
```

Jen Simmons wrote a [post](https://webkit.org/blog/16214/background-clip-border-area/) that explains how this works.

Together with a border gradient, you may also want a gradient or image that isn't clipped to the border, fulfilling the role of a regular background.

<div class="transparency-bg">
<button class="border-gradient-2">border gradient</button>
</div>

`background-image` can specify multiple backgrounds, and each can be set to use a different `background-clip` value.

```css
.border-gradient-and-background-gradient {
    background-image: linear-gradient(navy, aqua), linear-gradient(blue, white);
    background-clip: border-area, padding-box;
    background-origin: border-box;
    border: solid 4px transparent;
}
```

In the above code, one gradient uses a `background-clip` value of `border-area` while the other uses a value of `padding-box`. `background-clip` values name the area that a background is _clipped into_, so `padding-box` means the image is visible everywhere except the border area.

## A single-color "gradient"

Something that landed in all (beta) browsers recently is the ability to use a single color as the value for a gradient (currently requires Safari Technology Preview, Firefox Nightly or Chrome Canary).

<div style="display: grid; grid-template-columns: max-content 1fr; gap: 16px; align-items: center;">
<div class="gradient-demo"></div>

```css
div {
    background-image: linear-gradient(green);
}
```

</div>

This works for `linear-gradient`, `radial-gradient` and `conic-gradient`.

This has very niche use-cases, but comes in handy to set a solid background color when working with `background-clip: border-area`.

```css
.border-gradient {
    background-image: linear-gradient(35deg, #1B88FF, oklch(0.82 0.13 223.75)), linear-gradient(white);
    background-clip: border-area, padding-box;
    background-origin: border-box;
    border: solid 4px transparent;
}
```

<div class="transparency-bg">
<button class="border-gradient">border gradient</button>
</div>
