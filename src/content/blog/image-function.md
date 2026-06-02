---
pubDate: 'Jun 02 2026'
title: Single color image
heroImage: "/image-function.png"
description: Working with the CSS image() function
---

In CSS, the gradient syntax can be used to create a single solid non-gradient color:

```css
div {
    background-image: linear-gradient(blue);
}
```

That works in all browsers, but its counter-intuitive to use gradient syntax to create something that is not a gradient. There's now a better approach: the CSS `image()` function can create a solid color image from any color.

```css
div {
    background-image: image(blue);
}
```

<div class="solid-bg"></div> 

When is this useful over using a `background-color`?

## Place a partially transparent color over a `background-image`

```css
.hero {
background-image: image(rgb(0 0 0 / 50%)), url('/mountains.avif');
}
```

In the future you could also opt to use the new `alpha()` CSS function.

```css
.hero {
background-image: image(alpha(from black / 50%)), url('/mountains.avif');
}
```

<div class="mountains">
<h2>Moving Mountains</h2>
</div>

## Maintain a solid background color when working with `background-clip: border-area`

```css
.border-gradient {
    background-image: image(white), linear-gradient(90deg, oklch(0.62 0.19 240.36) 0%, oklch(0.88 0.24 154.83) 100%);
    background-origin: border-box;
    background-size: cover;
    background-clip: padding-box, border-area;
    border: solid 10px transparent;
}
```

<div class="bg-black">
<div class="border-gradient">gradient<br>border</div>
</div>

## Maintain a solid background color when working with `background-clip: text`

```css
button {
    color: transparent;
    background-image: linear-gradient(to bottom right in hsl, green, purple), image(white);
    background-clip: text, padding-box;
}
```

<div class="bg-black">
<button class="button">Click!</button>
</div>

<style>

    @supports (background-image: image(blue)) {
    .solid-bg {
        background-image: image(blue);
        height: 80px;
    }
    }

            .mountains {
                text-align: center;
                align-content: center;
                height: 200px;
                background-size: cover;
                text-transform: uppercase;
                background-image: image(rgb(0 0 0 / 50%)), url('/mountains.avif');
                background-image: image(alpha(from black / 50%)), url('/mountains.avif');

                h2 {
                    color: white;
                    font-weight: 450;
                    font-stretch: 130%;
                    letter-spacing: .5px;
                    text-shadow: #000000a8 0 1px 2px;
                }
            }

            .border-gradient {
            height: 140px;
            aspect-ratio: 1;
            background-image: image(white), linear-gradient(90deg, oklch(0.62 0.19 240.36) 0%, oklch(0.88 0.24 154.83) 100%);
            background-origin: border-box;
            background-size: cover;
            background-clip: padding-box, border-area;
            border: solid 8px transparent;
            border-radius: 50px;
            corner-shape: squircle;
            margin-inline: auto;
            text-align: center;
            text-fit: grow per-line-all;
            padding: 12px;
            line-height: 1;
            align-content: center;
        }

        .bg-black {
            margin-top: 24px;
            margin-bottom: 32px;
            background-color: black;
            padding-block: 24px;
        }
        button {
            font-size: 40px;
            font-weight: 900;
            font-stretch: 130%;
            border: 0;
            font-family: system-ui;
            border-radius: 100vh;
            padding-inline: 12px;
            color: transparent;
            background-image: linear-gradient(to bottom right in hsl, green, purple), image(white);
            background-clip: text, padding-box;
            margin-inline: auto;
            display: block;
}

</style>