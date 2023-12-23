---
pubDate: 'Jul 07 2023'
title: The new @font-face syntax
tags:
  - CSS
  - fonts
heroImage: "/fontface.png"
description: Using variable fonts and color fonts with @font-face.  
---

## Browser support

The new `@font-face` syntax has also been supported since [Safari 17](https://developer.apple.com/documentation/safari-release-notes/safari-17-release-notes#CSS:~:text=and%20%40font%2Dface%20src%20tech().), [Firefox 106](https://bugzilla.mozilla.org/show_bug.cgi?id=1786493#:~:text=Having%20just%20updated%20%40font%2Dface%20src%3A%20format()%20in%20bug%201784058%20and%20bug%20650372%20to%20follow%20the%20current%20spec%2C%20and%20added%20the%20tech()%20function) and [Chrome 108](https://chromestatus.com/feature/5088679224147968).

## Using variable fonts with `@font-face`
If you've used variable fonts on the web before you're probably familiar with this syntax, using the string `"woff2-variations"` in the `format()` function: 

```css
@font-face {
    font-family: "source sans";
    src: url("SourceSansVariable.woff2") format("woff2-variations");
}
```
That syntax has now been deprecated (but does still work). The new syntax looks like this: 

```css
@font-face {
    font-family: "source sans";
    src: url("SourceSansVariable.woff2") format(woff2) tech(variations);
}
```
What’s changed? Instead of using strings, we use keywords. `format()` is used exclusively to specify the file type: is it `woff`, `woff2`, `opentype`, `truetype`, etc. There are certain technical capabilities of fonts that the file type alone doesn’t tell us. Is it a variable font? Is it a color font? To test which of these technologies a browser supports, there’s the `tech()` function. Specifying `tech(variations)` means the file will only be loaded if the browser supports variable fonts (variable fonts have been supported in all browsers [since 2018](https://caniuse.com/variable-fonts)). 

Seeing as the older syntax has better browser support, you probably shouldn’t update to the new syntax just yet. 

## Using color fonts with `tech()`
Currently, no color font technology works in all browsers (except the older [COLRv0](https://caniuse.com/colr) format which [doesn’t support gradients](https://css-tricks.com/colrv1-and-css-font-palette-web-typography/#aa-colrv0-and-colrv1)). The two primary competing standards are OpenType-SVG (not the same thing as SVG fonts, which is [deprecated](https://glyphsapp.com/learn/creating-an-svg-color-font#:~:text=luckily%2C%20it%20has%20become%20extinct)), which is supported in Firefox and Safari support, and COLRv1, which is [supported](https://caniuse.com/colr-v1) in Firefox and Chrome/Edge.  It’s an annoying situation, but it’s easy enough to use an OpenType-SVG font for Safari and a COLRv1 font for Firefox and Chrome by using `tech()` in `@font-face`. 

```css
@font-face {
    font-family: "ComicColor";
    src: url("ComicColor-COLRv1.woff2") format(woff2) tech(variations, color-COLRv1),
         url("ComicColor-SVG.woff2") format(woff2) tech(color-SVG);
    }
```
All browsers have supported woff2 for many years so that’s the only format we need to provide. Firefox supports both COLRv1 and OpenType-SVG. I’d rather it use COLRv1, so I’ve specified that URL first. For the COLRv1 font I am checking both support for variable fonts and COLRv1 — you can test for multiple technologies by using a comma-separated list. OpenType-SVG and variable fonts are incompatible — there are no variable OpenType-SVG fonts so the `tech()` function for the second URL does not test for `variations`.

<iframe src="https://codesandbox.io/embed/funny-lewin-6gdqnf?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="COLRv1 + OpenType-SVG Color fonts"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Browser support for other color font technology (`color-COLRv0`, `color-sbix`, `color-CBDT`) can also be tested with `tech()`, but OpenType-SVG and COLRv1 are the best options for color fonts on the web.

The color palette of COLR and COLRv1 fonts can be [changed using CSS](https://css-tricks.com/colrv1-and-css-font-palette-web-typography/#aa-colr-and-css). If you want to conditionally load a font file only if the browser supports this functionality, you can do so with `tech(palettes)`.

### Other `tech()`

Other than variable fonts and color fonts, other values for `tech()` are `features-opentype`, `features-aat`, `features-graphite`, and `incremental`. 

`incremental` [refers to](https://www.w3.org/TR/css-fonts-4/#font-tech-definitions:~:text=The%20incremental%20tech%20refers%20to%20client%20support%20for%20incremental%20font%20loading%2C%20using%20either%20the%20range%2Drequest%20or%20the%20patch%2Dsubset%20method) “support for incremental font loading, using either the range-request or the patch-subset method”.

You can read about `features-opentype`, `features-aat` and `features-graphite` in the [spec](https://www.w3.org/TR/css-fonts-4/#font-tech-definitions) but they seem pretty niche.

## `@supports` 

Just as `@font-face` has a `tech()` and `format()` function for conditionally loading a font file, `@supports` has equivalent `font-tech()`  and `font-format()` functions for conditional CSS.

### Browser support
`@supports` has supported `font-tech()` and `font-format()` since [Firefox 106](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/106#css), [Chrome 108](https://developer.chrome.com/blog/new-in-chrome-108/#colrv1-support:~:text=font%2Dtech()%20and%20font%2Dformat()) and [Safari 17](https://developer.apple.com/documentation/safari-release-notes/safari-17-release-notes#CSS).

### `font-tech()`

`@supports` can conditionally apply CSS based on which font technology a browser supports. The same values you can test for with the `tech()` function in `@font-face` work for `font-tech()`.

Any CSS rules a browser doesn’t understand are ignored. That’s one of the great things about CSS. I can use new features like `font-palette` without worrying that it’ll break things in older browsers, without the need to wrap newer properties in `@supports`. So when is `@supports` useful? Perhaps the default palette of a font looks nice on a white background, but my custom palette looks nicer on black background. 

```css
@supports font-tech(palettes) and font-tech(color-COLRv1) {
    body {
        background-color: black;
    }
}
```

### `font-format()`

[`font-format()`](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports#font-tech:~:text=in%20the%20font-,font%2Dformat(),-This%20function%20checks) is less useful. It allows the same values as the `format()` function in `@font-face`. You can check if the browser supports `woff` (all of them have since 2012), `woff2` (this is the best format for fonts on the web and has been supported by all browsers since 2016), `truetype`, `opentype`, `embedded-opentype` (which is only supported in Internet Explorer), an OpenType `collection`, or an `svg` font (which is deprecated and you should not use).
