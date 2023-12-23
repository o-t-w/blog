---
pubDate: 'Jul 16 2023'
title: Using emoji on the web
postSlug: using-emoji-on-the-web
tags:
  - emoji
  - fonts
heroImage: "/emoji.png"
description: Probably more than you ever wanted to know about emoji
---

By default, most browsers utilise whichever emoji font is provided by the underlying operating system. Browsers running on ChromeOS and most Android devices will render Google’s Noto Color Emoji. On iOS and macOS, browsers will use [Apple Color Emoji](https://emojipedia.org/apple/), and on Windows it’ll be [Microsoft Segoe Color Emoji](https://emojipedia.org/microsoft/). Firefox on Windows and Linux is an exception in that it bundles [Twitter’s Twemoji font](https://github.com/mozilla/twemoji-colr) and uses that instead of Segoe. 

When you use an emoji character within HTML markup it usually *just works*: an emoji gets rendered. There are, however, edge cases and issues to be aware of. Nolan Lawson posted an article in 2022 titled [*The struggle of using native emoji on the web*](https://nolanlawson.com/2022/04/08/the-struggle-of-using-native-emoji-on-the-web/). The issues he raised:

### 1. Single color icons
Some older emoji (see a [full list here](http://www.unicode.org/emoji/charts/emoji-variants.html)) can render either as a monochrome icon or as a multi-colored emoji.

<p style="font-variant-emoji: text; font-size: 24px; letter-spacing: 4px;">☺&#xFE0E;✈&#xFE0E;☢&#xFE0E;☣&#xFE0E;☘&#xFE0E;☠&#xFE0E;♻&#xFE0E;☄&#xFE0E;☂&#xFE0E;☃&#xFE0E;☹&#xFE0E;☮&#xFE0E;⚠&#xFE0E;⛱&#xFE0E;✌&#xFE0E;✂&#xFE0E;✍&#xFE0E;✏&#xFE0E;☯&#xFE0E;ℹ&#xFE0E;♠&#xFE0E;♣&#xFE0E;⚖&#xFE0E;⚰&#xFE0E;✔&#xFE0E;➡&#xFE0E;</p>

This can vary depending on the operating system, browser, and font stack. If you don't conduct much cross-device testing, you might not even be aware that your colorful emoji is shown as a plain single-color symbol for some users.

### 2. Country flags are not included in the Segoe Emoji font. 
Windows users (except those using Firefox browser) will see two letters to denote the country, rather than a flag emoji.

![Screenshots of the UK flag on different operating systems](/countryflag.png)


### 3. Missing emoji on old operating systems (and some new ones)

Every year, new emoji are added by Unicode. People stuck on older operating systems won’t get these updates. 

Here’s how some of the newer emoji appear on macOS Ventura:

![Screenshot of some of the newer emoji such as Coral and Lotus rendered correctly](/neweremoji.avif)


On Windows 10, they look like this:

![Screenshot of Windows 10 where emoji are rendered as squares with a black outline and no emoji appearing at all](/brokenemoji.avif)


This isn’t just a problem of legacy tech. Some *current* operating systems, notably Windows 11, lag behind in updating their system emoji.

## Solutions

### Solving problem 1 with `font-variant-emoji`

Explicitly setting the `font-family` to an emoji font is often enough to solve this issue. Ideally, we’d be able to use `font-family: emoji`. In the same way that we have `font-family: system-ui` to specify the system font, this is an equivalent way to specify the system emoji font. 

`font-family: emoji` is roughly equivalent to:
```css
p {
    font-family: Apple Color Emoji, "Segoe UI Emoji", "Noto Color Emoji";
    }
``` 
`font-family: emoji` would remain forever up-to-date. By contrast, by using named fonts, were Apple, Google or Microsoft to design a brand new emoji font with a different name, the above code would be obsolete. No browser has shipped `font-family: emoji` yet, so we’ll have to list out the different fonts of each operating system (and "Twemoji Mozilla", the font used by Firefox on Windows): 

```css
h1 {
    font-family: "Twemoji Mozilla", Apple Color Emoji, "Segoe UI Emoji", "Noto Color Emoji", "EmojiOne Color";
    }
```
Should you have text that includes both emoji and regular text, things get more complicated. 
Let’s say you have the [following code](https://codepen.io/cssgrid/pen/MWzVKZb):

```html
<h1 style="font-family: 'Comic Sans MS', Apple Color Emoji, 'Segoe UI Emoji', 'Noto Color Emoji';">I ♥ emoji</h1>
```
Paraphrasing [Monica Dinculescu](https://meowni.ca/posts/emoji-emoji-emoji/), who previously worked as an engineer on Google Chrome:

Chrome will first look up the glyph corresponding to ♥ in the Comic Sans font. It won’t find it, so it will look through the rest of the fonts we've listed and use whichever emoji font is on the user's system. We were lucky here because Comic Sans doesn’t contain this emoji. The problem is, some fonts designed for regular text do contain the black pseudo-emoji were trying to avoid. On a Mac, for example, the system font contains a black heart symbol.

```html
<h1 style="font-family: system-ui, Apple Color Emoji, 'Segoe UI Emoji', 'Noto Color Emoji';">I ♥ emoji</h1>
```

Chrome will first look up the glyph corresponding to ♥ in SF Pro (the system font on mac) and it *will* find it, so the code will not render a colorful emoji.

As well as setting the font, you should also append the variation selector `&#xFE0F;` to the emoji:

```html
<h1>I ♥&#xFE0F; emoji</h1>
```
If you want the single color version, append `&#xFE0E;`

```html
<h1>I ♥&#xFE0E; emoji</h1>
```
The variation selector alone is not always enough to render what you want. Unicode Technical Committee Chair Peter Constable told me, "Font fallback logic in text engines is not necessarily going to have special-case logic for variation sequences". In some browsers, notably Chrome, your font stack can still [effect the result](https://stackoverflow.com/questions/70993962/emoji-variation-selector-doesnt-work-for-user-specified-font).

If you're using a lot of emoji, constant use of the variation selector is rather verbose. There's a new CSS property on the horizon that will make this easier. 

```css
h1 {
    font-variant-emoji: emoji;
}
```

If you’re using a browser that supports the `font-variant-emoji` CSS property, this [CodePen](https://codepen.io/cssgrid/pen/zYMRaxW) should look like this (the second line is set to `font-variant-emoji: emoji`):

![A screenshot showing emoji rendered as text in the top line, and rendered properly as emoji on the second line](/emojivstext.avif)

You can alternatively use `font-variant-emoji: text` if you want the plain single-color version.

Browser support is forthcoming. It's behind a flag in Firefox. Chrome have announced an [intent to ship](https://groups.google.com/a/chromium.org/g/blink-dev/c/MaXgbE4vTbk/m/Q3QbI37IBQAJ) and it's currently being worked on in Safari.

### Solving problem 2 (and 3?) with color fonts

The Apple Color Emoji font is 189MB. Apple uses sbix, the bulkiest color font format, for their emoji, which partly explains the gargantuan file size. Google’s Noto Emoji color font contains 3,664 emoji, coming in at 23MB. Every year new emoji are added. Even if you use COLRv1, a modern color font format that offers significantly reduced file size, serving a font containing all emoji is far from sensible. With so many glyphs, the file size is bound to be huge.

Some emoji are ubiquitous, many others are rarely used (aerial tramway 🚡, non-potable water 🚱, banjo 🪕, whatever this thing is 〽️ ...).

Colin M. Ford has worked as a typeface designer for two of the world’s most respected foundries:  Hoefler & Co and Monotype. He specialises in emoji design. It’s worth reading his article [Emoji on the web](https://medium.com/making-faces-and-other-emoji/emoji-on-the-web-537c5769dffa#801d). He advocates for the approach that Twitter and Facebook take: image replacement. 

> The traditional way to slim down fonts is to subset the character set, or remove some of the glyphs you know you’ll never use. But if a user of your website can input text, you’ll never be sure he or she won’t reach for the obscure 💮 or 🔣 emoji, so subsetting is for the most part out of the question.

This position ignores an important fact: if your `@font-face` emoji font doesn't contain certain niche emoji, the browser will fallback to using the system emoji font, so the user will still see an emoji — albeit perhaps one drawn in a different visual style. 

Subsetting is a good answer to problem 2. If you strip all other characters from the font, the size of a flags-only color font isn’t that large.   

There are several open-source color emoji fonts you can freely use:
- [Noto Color](https://fonts.google.com/noto/specimen/Noto+Color+Emoji) from Google
- [Emoji One](https://github.com/adobe-fonts/emojione-color) from Adobe
- [Twemoji](https://github.com/13rac1/twemoji-color-font) by Twitter
- [FxEmoji](https://github.com/mozilla/fxemoji/blob/gh-pages/dist/FirefoxEmoji/FirefoxEmoji.ttf) from Mozilla
- [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) from Microsoft (they've released the SVG artwork, but you'd need to bundle the SVGs into a font yourself). 

Other than Fluent, they all contain country flags.

There is no great answer to missing emoji on older operating systems. You could subset a color font to include only the newer emoji (and keep it updated as more emoji come out…) but they might be stylistically inconsistent with other emoji on the user's system (which is probably better than nothing). Of the open-source emoji fonts, FxEmoji and Emoji One have not been updated with new emoji for years. Noto Color, by contrast, is always up-to-date. 

If you want to use a color font, you have two options:

1. Use a COLRv0 font. 

This will work in all browsers. Whether it is viable or not depends on the emoji you want to use. COLRv0 does not support gradients, only solid colors.

2. Use both a COLRv1 font and an OpenType-SVG font. 

The Chrome team have made it clear they will never support OpenType-SVG. Safari currently has no intention of implementing COLRv1. Thankfully it’s trivial to export both formats from FontLab. It’s also pretty simple to [serve both formats](/posts/new-font-face-syntax/) with CSS `@font-face`. There’s also an equivalent JavaScript API to conditionally load the appropriate version: 

```js
if (CSS.supports("font-tech(color-COLRv1)")) {
        const fontFile = new FontFace(
            "emojifont",
            "url(COLRv1emoji.woff2)"
        )
        document.fonts.add(fontFile);
        document.body.style.fontFamily = "emojifont";
    } else if (CSS.supports("font-tech(color-SVG)")) {
        const fontFile = new FontFace(
            "emojifont",
            "url(OpentypeSVGemoji.woff2)"
        )
        document.fonts.add(fontFile);
        document.body.style.fontFamily = "emojifont";
    } 
```

## Custom Emoji using color fonts

We’ve looked at using color fonts to fix the problem of missing emoji but they're also a fun way to express your design sensibility. For a limited set of custom emoji, a color font is a great idea. I recently put together a [color emoji set](https://github.com/o-t-w/mishmashmoji) using FontLab, primarily based on the open-source [Kablammo font](https://fonts.withgoogle.com/kablammo) by Vectro Type Foundry. The exported COLRv1 font is 55kb. The OpenType-SVG version is 107kb. I could export both file types from a single set of glyphs, and together they work in all browsers.

<p class="custom-emoji" style="font-variant-emoji: emoji; line-height: 1.2;">💥😲🔥👀👻☺️&#xFE0E;💎⚠️&#xFE0E;💩😵♥👽<span style="letter-spacing: 0;">👼🫠</span></p>

