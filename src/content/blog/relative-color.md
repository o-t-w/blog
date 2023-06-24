---
author: Ollie Williams
pubDatetime: 2023-06-24T15:22:00Z
title: color-mix and relative color
postSlug: color-mix-and-relative-color
featured: false
draft: false
tags:
  - CSS
  - Design
ogImage: "/assets/relativecolor.png"
description: How to modify the hue, saturation, lightness and opacity of colors with CSS
---

## Relative color

With the relative color syntax we can take an existing color and change its hue, saturation or opacity or make it lighter or darker. 

**Browser support:** Safari has supported relative color since version 16.4. Chrome and Firefox have not yet implemented this feature. [See caniuse.com](https://caniuse.com/css-relative-colors) for up-to-date support information.

### Relative color and opacity

The [question](https://stackoverflow.com/questions/40010597/how-do-i-apply-opacity-to-a-css-color-variable) “How do I apply opacity to a CSS color variable?” has 493 up-votes on Stack Overflow. Before relative color there was no good solution to this question. Let’s look at this advice from the [Tailwind docs](https://tailwindcss.com/docs/customizing-colors#using-css-variables) as an example of how people currently approach the issue. If you’d like to define your colors as CSS variables and also want to be able to make use of Tailwind’s utility classes for reducing the opacity of colors, “you’ll need to define those variables as just the color *channels”*, the docs say. And so people end up with CSS variables that look like this:

```css
:root {
    --color-primary: 255 115 179;
}
```
The upside of this approach is that you can use the same variable but specify a reduced opacity. 
```css
button:hover {  
    background-color: rgb(var(--color-primary) / 50%);
}
```
The drawback is when you don’t need to define an opacity you’re still stuck with this horrible syntax:

```css
button {
    background-color: rgb(var(--color-primary));
}
```
With the new relative color syntax we can define and use our color variables in the normal way but still have the option to change the opacity:

```css
:root {
    --blue: #0ea5e9;
}

.bg-blue-half-opacity {
    background-color: rgb(from var(--blue) r g b / 50%);
}
```
<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="bGQeyoY" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/bGQeyoY">
  Modify opacity of a CSS Custom Property</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

We use `from` to specify the origin color (the color we want to base the new color on). The above example takes a hex color and uses it to create an rgb color. The origin color can be *any kind of color* — `rgb()`, `hsl()`, a named color like `blue`, etc. 

### Lighten, darken and more

Sass has color manipulation functions such as `darken()` and `lighten()`. With the relative color syntax it’s easy to achieve the same result and in a far more versatile way. It’s important to pick a color format that's easy to manipulate. An `rgb()` function might be useful if you specifically want to change the amount of red or green or blue, but it’s pretty hard to work with otherwise. We could modify the hue, saturation, or lightness of HSL but [oklch is a better option](https://css-tricks.com/the-expanding-gamut-of-color-on-the-web/#aa-a-better-lightness-lab-and-lch). 

Each color channel can either be directly specified or taken from the origin color and modified using math functions like `calc()`.

Example of setting the lightness to 20% but keeping the chroma (chroma means saturation) and hue the same as the origin color:
```css
background-color: lch(from var(--color) 20% c h)
```

You can create a whole range of different shades this way, all based on the same color:

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="JjeRENb" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/JjeRENb">
  Tints and shades with relative color syntax</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Alternatively you can take the lightness of the origin color and make it lighter or darker. By taking this approach, if the lightness of the origin color changed, the modified color would also change.

```css
background-color: oklch(from var(--color) calc(l + .04) c h);
 ```

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="vYQKQMz" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/vYQKQMz">
  Relative color: adjusting lightness</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Here’s an example that halves the chroma of the origin color but leaves the lightness and hue unchanged:
```css
background-color: lch(from var(--color) l calc(c / 2) h); 
```
Directly specifying values for chroma can also work well to create variations. 

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="oNQYxOX" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/oNQYxOX">
  Chroma variations</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### User-defined color themes with relative color

What no preprocessor could offer is the ability to create user-generated dynamic color schemes. Perhaps you want to give individual users more control over the color scheme of your website, like Twitter:


![A screenshot of a dialog on Twitter.com where a user can select a color from multiple choices](/assets/twittercolors.avif)


A more pragmatic use case is catering to businesses that want a website to reflect their brand. If a company was sending out a Google Form, for example, they might want to use their brand color. 


![A screenshot from Google Form's where the user can pick a color to theme their form](/assets/googleform.avif)


Setting a custom property to reflect the value of a color picker was always trivial with JavaScript. However, building an entire color palette out of that single color was incredibly hard to achieve. Relative color syntax makes it easier.

You could easily set the styles for your UI elements using this approach. 

<iframe src="https://codesandbox.io/embed/relative-color-for-theming-lxzjrx?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Relative color for theming"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

The above example gives a rough example of what’s possible. 

How do you prevent color contrast issues? Offering the user a limited set of colors to choose from (like Twitter does) rather than giving them free reign with a color input could solve this issue. If your users are businesses that want to use their brand color that isn’t a viable solution. A [talk at CSSConf](https://youtu.be/zi6L0ZqrKfA?t=551) in 2018 about dealing with color contrast for user-defined colors involved installing an [NPM dependency](https://www.npmjs.com/package/color) and setting the value of custom properties with JavaScript after doing various calculations. There are now easier approaches. The CSS Color Module Level 6 spec introduces the `color-contrast()` function but it’s only implemented in Safari Technology Preview. By itself, the `color-constrast()` function doesn’t completely solve contrast issues. Over certain background colors neither black nor white text is readable. 

### Relative color and math functions

You can use any CSS math functions — not just `calc()`. `clamp()`, for example, comes in useful to prevent colors from ever becoming too light or too dark. 

```css
.btn-light {
    background-color: oklch(from var(--theme-color) clamp(0.45, calc(l + 0.25), 0.99) c h);
}
```
For the `background-color` of the light button I’m bumping the lightness of the origin color up by .25 but preventing it from ever being fully white (if the user chooses a super light color) but also ensuring its never darker than .45 (so that it remains somewhat light even if the user chooses a dark color). 

The `min()` and `max()` functions are useful if you only need to constrain the number in one direction:
```css
oklch(from var(--theme-color) l min(.2, c) h) // prevent super-high chroma
oklch(from var(--theme-color) max(.4, l) c h) // prevent very dark colors
```

For the secondary and tertiary buttons I altered the hue. To change the hue you [change the angle](https://developer.mozilla.org/en-US/docs/Web/CSS/angle). There are a few ways to do this in CSS, but here’s an example using degrees:

```css
.btn-secondary {
    background-color: oklch(from var(--theme-color) l c calc(h + 45deg));
}
```

There’s incredible flexibility in what you can do with relative color syntax. You could use the `l` value from the origin color to set the amount of chroma, or vice versa, for example. 

## color-mix

`color-mix` is now supported in [all browsers](https://caniuse.com/?search=color-mix). By default you’ll get a 50/50 mix of the two colors.


The following code would result in a color that was 70% blue and 30% black: 

```css
background-color: color-mix(in oklab, blue, black 30%);
```

Specifying a percentage for both colors that amounts to less than 100% is a handy way to create semi-transparent colors with `color-mix`. The computed value of `color-mix(in oklch, red 20%, blue 30%)` would be `oklch(0.522375 0.291007 314.124 / 0.5)` (a shade of purple at half opacity). 

When using `color-mix()` you have to specify a color space. Any of the following would be valid: `lch`, `lab`, `oklch`, `oklab`, `hsl`, `hwb`, `srgb`, `xyz`. The chosen color space can have a huge effect on the resulting color, as demonstrated below: 

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="eYQdgOw" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/eYQdgOw">
  color-mix color spaces</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

See this [Twitter thread](https://twitter.com/hypeddev/status/1672254995599708167) for some suggested use cases for `color-mix`. 