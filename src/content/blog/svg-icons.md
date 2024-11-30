---
pubDate: 'Nov 30 2024'
title: The best approach to SVG icons
heroImage: "/svg.jpg"
description: Inline SVG, <use>, <symbol>, spritesheets, JSX...
---

There are several different ways to use SVG. The TL;DR conclusion is: use `<use>`.

## `<img>`

The HTML `img` element has the advantage of native lazy loading with the `loading` attribute and resource prioritization with the `fetchpriority` attribute. For a complex SVG with a large file size that appears below the fold, lazy loading is useful.

Using an `img` element is a simple approach, but offers the least amount of control. You can style the icon in certain ways with CSS (`opacity`,  `filter`) but you have no direct control over things like `stroke-width`, `fill` color or `stroke` color, which you might want to change for hover, focus and disabled states and dark mode, for example. An SVG file can contain a `<style>` element but the CSS `light-dark()` function and `prefers-color-scheme` media query do not work in [Safari](https://bugs.webkit.org/show_bug.cgi?id=199134) when using the `<img>` tag.  

## SVG markup in HTML

At the opposite end of the spectrum is inline SVG. Unlike other image formats, you can paste SVG code directly into HTML. This approach gives maximum flexibility. You can target different parts of the SVG to style with CSS. If you need fine-grained control, inline SVG is the best option but for most icon use-cases, its more control than you need.

This approach does have some major drawbacks. A single SVG icon can consist of a large amount of markup. Scanning and editing HTML becomes more difficult when its littered with giant blocks of SVG code. If you want to edit the design of an icon, *you’ll need to make the change in every place you’ve used it*.

## SVG as JavaScript-framework components

JavaScript frameworks like React seemingly offered the best of both worlds. By abstracting SVG into JSX components, we could keep the styling flexibility of inline SVG without needing to look at the mass of SVG code every time we scroll through the markup of a page. This approach has performance drawbacks.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Please don&#39;t import SVGs as JSX. It&#39;s the most expensive form of sprite sheet: costs a minimum of 3x more than other techniques, and hurts both runtime (rendering) performance and memory usage.<br><br>This bundle from a popular site is almost 50% SVG icons (250kb), and most are unused. <a href="https://t.co/G1IgOjTeIT">pic.twitter.com/G1IgOjTeIT</a></p>&mdash; Jason Miller 🦊⚛ (@_developit) <a href="https://twitter.com/_developit/status/1382838799420514317?ref_src=twsrc%5Etfw">April 15, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

See the article [*Breaking Up with SVG-in-JS*](https://kurtextrem.de/posts/svg-in-js) for more on why this is a bad idea.

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Yeah, we&#39;ve done lots of research on this in the Preact team. Strings are always the number 1 reason for bundle size bloat.<br><br>And yes it&#39;s truly bonkers how much strings end up in js files. From icon sets, to base64 fonts, to inlined images, etc. Often makes up 60% of bundle size</p>&mdash; Marvin Hagemeister ⚛️ (@marvinhagemeist) <a href="https://twitter.com/marvinhagemeist/status/1722942159878312429?ref_src=twsrc%5Etfw">November 10, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

There's another downside to using JSX for SVG: you can't just write or copy/paste regular SVG markup because JSX requires camelCase attributes. `stroke-width` become `strokeWidth`, etc.

## `<use>`

`<use>` is an SVG component system built into the browser. You can make use of `currentColor` and CSS variables to achieve far more styling versatility than a HTML `<img>`.

There are different approaches to using `<use>`:

- Keep each icon in a separate `.svg` file and add an `id` to each `<svg>`.
- Use a spritesheet file containing multiple icons using `<symbol>`.

You can mix and match both approaches. If multiple icons are visible in at the top of every page, it makes sense to reduce the amount of HTTP requests by combining them into a single file. By contrast, if an icon only appears once at the bottom of a barely-visited page, it shouldn't be in a spritesheet.

Having separate SVG files is easier to maintain. If you’re no longer using a particular icon, its easier to delete a file than navigating through the markup of a spritesheet.

I'll cover both approaches but regardless of how you store the icons, referencing them is the same:

```html
<svg>
    <use href="sprites.svg#icon-1"></use>
</svg>
```

When working with the `<use>` element, the file path alone is not enough. The hashtag `#` (technically called a *fragment identifier*) needs to reference an ID within the markup of the SVG.

If you don't find the syntax of `<use>` appealing, its easy to abstract into a component in a JavaScript framework and pass the `href` as a prop.

<div class="warning">
Code examples in older blog posts make use of the <code>xlink:href</code> syntax, which is deprecated. Use <code>href</code> instead.
</div>

### Creating a spritesheet with `<symbol>`

Multiple icons can be stored in a single `.svg` file commonly referred to as an SVG sprite or spritesheet. Inside that file, you make use of the `<symbol>` element to define each icon:

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
  
    <symbol id="icon-1">
        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
        <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z"/>
    </symbol>

    <symbol id="icon-2">
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </symbol>

  </defs>
</svg>
```

The `<symbol>` element is used to define reusable bits of SVG. Its contents is only ever drawn via `<use>` (if you try to reference a `<symbol>` as the `src` of an `<img>`, nothing will be displayed). If you open up the spritesheet in a tool like Adobe Illustrator or Figma, you won't see anything.

### `<use>` with individual SVG files

The `<symbol>` element is useful when used in conjunction with `<use>`, but isn’t a necessity. `<use>` can reference any part of an SVG element - a `<path>`, a `<g>`, a `<circle>`, even an entire `<svg>`. Storing each individual icon as its own `.svg` file is my preferred approach.

You need to manually edit each SVG file to include an `id` on the `<svg>` element:

```html
<svg id="icon" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="5"/>
</svg>
```

The SVG 2 spec allows omitting the fragment identifier, which would be a big improvement, but that is not supported in any browser yet.

By storing icons as regular individual SVG files rather than as a spritesheet, its remains easy to use the icons as a CSS `background-image` or as the `src` of a HTML `<img>` tag, and you can easily open them in design software. You *can* use a spritesheet for `<img>` and `background-image`, but the code of the spritesheet gets a bit more complicated.

### Sizing `<use>`

Without a `viewBox` an SVG will have a width of 300px and a height of 150px. Its an arbitrary size [defined in a W3C spec](https://svgwg.org/specs/integration/#svg-css-sizing). It will be this size regardless of the intrinsic proportions of the image. If you give the icon only a `width`, the height won’t automatically scale based on the proportions of the image: it’ll remain at 150px.

If your SVG symbol looks like this:

```html
<symbol id="tall-icon" viewBox="0 0 84 143">
    <!-- icon code... -->
</symbol>
```

Unfortunately, you need to specify the `viewBox` again whenever you use `<use>` inside a HTML file:

```html
<svg viewBox="0 0 84 143">
    <use href="sprite.svg#tall-icon"></use>
</svg>
```

Once the `viewBox` is set, the SVG will scale to be the correct aspect-ratio if given only a width or only a height.

Alternatively you can:

- Specify both `width` and `height` attributes or set both `width` and `height` using CSS.
- Set an `aspect-ratio` in CSS.

### Styling `<use>`

`<use>` predates web components, but makes use of the shadow DOM. Styling with CSS is more limited than an inline SVG, but you can use `currentColor` to change the fill and stroke color of the SVG, and CSS custom properties to style anything else.

Within the markup of the SVG, you can set the stroke or fill to be `currentColor`. The icon will then automatically match the color of text on the page and the color of the SVG can be easily controlled with the CSS `color` property.

`currentColor` works well if you want the entire icon to be a single color, and by combining it with opacity or relative color syntax, you can cater to multicolored icons.

Using `currentColor` and `opacity`:

```html
<svg id="plus" xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 24 24">
    <path opacity=".2" fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"></path>
    <path fill="currentColor" d="M12 7a1 1 0 0 0-.993.883L11 8v3H8a1 1 0 0 0-.117 1.993L8 13h3v3a1 1 0 0 0 1.993.117L13 16v-3h3a1 1 0 0 0 .117-1.993L16 11h-3V8a1 1 0 0 0-1-1Z"></path>
</svg>
```

```html
<svg style="color: #00D3EF;">
    <use href="/plus-icon-opacity.svg#plus"></use>
</svg>

<svg style="color: #FF289F;">
    <use href="/plus-icon-opacity.svg#plus"></use>
</svg>

<svg style="color: #29EB6A;">
    <use href="/plus-icon-opacity.svg#plus"></use>
</svg>
```

<svg style="color: #00D3EF; width: 60px; height: 60px;">
    <use href="/plus-icon-opacity.svg#plus"></use>
</svg>

<svg style="color: #FF289F; width: 60px; height: 60px;">
    <use href="/plus-icon-opacity.svg#plus"></use>
</svg>

<svg style="color: #29EB6A; width: 60px; height: 60px;">
    <use href="/plus-icon-opacity.svg#plus"></use>
</svg>

Using `currentColor` with relative color syntax:

```html
<svg id="plus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="oklch(from currentcolor calc(L * 4) calc(C / 2) H)" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"></path>
    <path fill="currentColor" d="M12 7a1 1 0 0 0-.993.883L11 8v3H8a1 1 0 0 0-.117 1.993L8 13h3v3a1 1 0 0 0 1.993.117L13 16v-3h3a1 1 0 0 0 .117-1.993L16 11h-3V8a1 1 0 0 0-1-1Z"></path>
</svg>
```

<svg style="color: #00D3EF; width: 60px; height: 60px;">
    <use href="/plus-icon-relative.svg#plus"></use>
</svg>

<svg style="color: #FF289F; width: 60px; height: 60px;">
    <use href="/plus-icon-relative.svg#plus"></use>
</svg>

<svg style="color: #29EB6A; width: 60px; height: 60px;">
    <use href="/plus-icon-relative.svg#plus"></use>
</svg>

What if you want to style different parts of the SVG independently with explicit colors? Or to style things other than color? For that use case, CSS custom properties are the only option. In the below example I'm changing the `stroke-width` by updating the value of a CSS variable on hover:

```html
 <svg stroke-width="var(--stroke-width)" id="arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="transition: stroke-width .4s;" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
```

<button class="svg-hover-button">Hover me <svg width="24" height="24">
    <use href="/arrow.svg#arrow"></use>
</svg></button>

## Using the same icon with multiple approaches

It’s handy to have the flexibility to use the same icon in multiple ways. In some contexts, you might want to use `<use>`, while in another scenario a `background-image` might be necessary.

When used as an `<img>` or `background-image`, SVG have no knowledge of `currentColor` or the value of any CSS variables you’ve set. The default fill color for SVG is black. There is no default stroke color. Thankfully the `var()` function accepts a fallback value, which will be used if the variable isn’t set, and when working with `<img>` or `background-image`:

```css
stroke="var(--color1, #e040fb)" 
```

In the above example, if `--color1` isn’t defined, the stroke will be `#e040fb`. That’s a good way to give SVG a default color, while still allowing the SVG to be customised with CSS when necessary. In this way, we retain stylistic control when using the icon with `<use>`, while still being able to give the icon a color other than black when used with `<img>` or `background-image`.

## Using a spritesheet with `<img>` and `background-image`

A HTML `<img>` and a CSS `background-image` can't directly reference a `<symbol>`. However, you can use `<use>` inside the spritesheet itself, give the `<use>` element an `id`, and then reference that `id` when specifying the `src` or `url`. For this to work, you need to add some boilerplate `display: none`/`display: block` in a `<style>` block.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<style>
    use {
        display: none;
    }
    use:target {
        display: block;
    }
</style>
    <symbol id="plus-icon" viewBox="0 0 512 512">
    <path stroke="var(--color1, #bbdefb)" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="var(--color2, #0d47a1)" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160M336 256H176"/>
    </symbol>
    
    <use id="plus-icon-blue" href="#plus-icon"  />
    <use style="--color1: #b39ddb; --color2: #6200ea;" id="plus-icon-purple" href="#plus-icon" />
</svg>
```

If you’re intent on using `<img>` or `background-image` but need the same icon in multiple colors, one obvious approach is to simply duplicate the icon inside the spritesheet and give it a different stroke or fill color. There is however, a better approach than copy-pasting. In the above example, the same icon is “exported” twice: once with strokes using shades of blue, and once with strokes using shades of purple.

In the HTML of your page, it’s then easy to use the same icon in different colors:

```html
<img src="circle.svg#plus-icon-blue" alt="">
<img src="circle.svg#plus-icon-purple" alt="">
```

<img style="width: 60px; height: 60px; display: inline-block;" src="/plus-icon.svg#plus-icon-blue" alt="">
<img style="width: 60px; height: 60px; display: inline-block;" src="/plus-icon.svg#plus-icon-purple" alt="">

## `mask-image`

When needing to use an SVG as a `background-image`, you can instead make use of `mask-image`, which allows you to easily change the color of the icon:

```css
.pink-heart {
    mask-image: url(heart.svg);
    background-color: pink;
    }

.red-heart {
    mask-image: url(heart.svg);
    background-color: red;
    }
```

## And the winner is...

For most use cases, `<use>` is the best option. This approach balances performance, an OK developer experience and just the right amount of stylistic versatility.
