---
pubDate: 'Nov 29 2024'
title: Are icon fonts a bad practice?
heroImage: "/icon-fonts.jpg"
description: Icon fonts in 2024. Icon fonts vs SVG. Performance, a11y, etc.
---

There‘s a lot of outdated information about icon fonts on the internet. When SVG vs icon fonts was last a conversation in the frontend blogosphere (circa 2016) SVG won the debate.

Since then, font technology and CSS have moved on:

- The CSS `content` property can now specify alt text.
- Variable fonts are now a thing.
- Universal browser support for COLR font technology means that icons can contain multiple colors.
- woff2 has been supported in all browsers for many years and is the only format you need for the web.
- We have full browser support for `font-display`. It’s advisable to use `font-display: block` for icon fonts (this is the default behaviour).

Despite numerous anti-icon font articles, they remain popular. Of all the fonts in the world, Font Awesome is the second [most used](https://almanac.httparchive.org/en/2024/fonts#families-and-foundries) font on the web. Collectively, icon fonts account for around 18% of web font usage, according to the [2024 Web Almanac](https://almanac.httparchive.org/en/2024/fonts#families-and-foundries:~:text=icon%20fonts%20make%20up%20about%2018%25%20of%20web%20fonts%20in%202024).

## Multicolor icons

In the past, multicolored icons were not possible in a font. COLRv0, a font technology supported in all browsers since 2019, changed that. Icons can contain an unlimited range of solid colors.

<h2 class="duotone-icons">account_circlefavoritevisibilitythumb_uplanguageassessmentrecord_voice_overtodayshopping_cart</h2>

You can change the colors using the CSS `font-palette` property.

<h2 class="duotone-icons icons-pink">account_circlefavoritevisibilitythumb_uplanguageassessmentrecord_voice_overtodayshopping_cart</h2>

COLRv1 and OpenType-SVG allow for gradients and more advanced design effects.

## Variable icon fonts?

With a variable icon font you can match the weight of the icon to the weight of the text. A CTA button with bold text could have a chunky version of the icon. When used elsewhere in a more subtle context, a thinner version of the same glyph could be used. You could achieve this result with SVG by changing the `stroke-width` with CSS, but changing the `font-weight` of a variable font feels slightly more natural.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Ground rule for icons in UI: Match icon weight with font weight<br>When crafting your user interface, begin with this fundamental principle. Whether you choose thin, regular, or bold, start by aligning the styles. This sets the foundation for a visually cohesive and engaging design.… <a href="https://t.co/Wu9TkNCXSf">pic.twitter.com/Wu9TkNCXSf</a></p>&mdash; Gleb Stroganov (@strongeron) <a href="https://twitter.com/strongeron/status/1758099435546948042?ref_src=twsrc%5Etfw">February 15, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Take [SF Symbols from Apple](https://developer.apple.com/design/human-interface-guidelines/sf-symbols#Weights-and-scales) as an example:

> SF Symbols provides symbols in a wide range of weights and scales to help you create adaptable designs. Each of the nine symbol weights — from ultralight to black — corresponds to a weight of the San Francisco system font, helping you achieve precise weight matching between symbols and adjacent text, while supporting flexibility for different sizes and contexts.

The precise inner workings of SF Symbols are a mystery (is it a variable font under the hood?), but its an interesting example of a symbol set with multiple weights (from ultralight to black) and both monochrome and multicolor variations.

<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">The SF system font now has icons! The icons change on each font weight too, going from ultralight to black (9 total.)<br><br>They also released SF Symbols—an app that lets you search the icons. From there, you can copy-paste into your tool of choice. 🥰<br><br>👉🏽<a href="https://t.co/xyHER8VcZF">https://t.co/xyHER8VcZF</a> <a href="https://t.co/lhN7beQWIk">pic.twitter.com/lhN7beQWIk</a></p>&mdash; Pablo Stanley (@pablostanley) <a href="https://twitter.com/pablostanley/status/1135705303868235776?ref_src=twsrc%5Etfw">June 4, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Material Symbols, available through Google Fonts, is an example of a variable icon font. It comes with an axis for weight, grade and optical sizing.

The axes of a variable font can be animated, which can be useful for things like hover effects.

While I like the concept of variable icon fonts, actually creating one takes a fair amount of know-how. There are simple tools to take a bunch of SVG files and convert them into a regular icon font. Creating a variable font, by contrast, requires complex and expensive software like Glyphs or FontLab.

## Performance

woff2 compression is impressive.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Today I converted a small collection of black and white SVG icons to a single woff2 font: the font is much smaller than the combined SVG files. Styling is super easy, too. Inline SVG was not a good option in my environment, and I was happy to get rid of the &lt;img&gt; references.</p>&mdash; Just van Rossum (@justvanrossum) <a href="https://twitter.com/justvanrossum/status/1536443582260948993?ref_src=twsrc%5Etfw">June 13, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

However, it's frustratingly common for websites to use a font containing hundreds of icons when only a few dozen are actually used. If you are using a third party icon font rather than creating your own, tools like [pyftsubset](https://markoskon.com/creating-font-subsets/), [glyphhanger](https://github.com/zachleat/glyphhanger) and [subfonts](https://www.npmjs.com/package/subfont) or an online GUI like Font Squirrel or Fontello can help remove unused glyphs (a process called subsetting). The paid version of Font Awesome includes its own subsetting functionality. Updating a font every time you use an additional icon does seem more laborious than maintaining a folder of SVG files.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Systems that require you to download lots of redundant data are always going to be a hack.<br><br>We used to do it because HTTP/1 was really slow when it came to multiple resources. In HTTP/2 that&#39;s much less of a problem.</p>&mdash; Jake Archibald (@jaffathecake) <a href="https://twitter.com/jaffathecake/status/1528750578775506944?ref_src=twsrc%5Etfw">May 23, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Even if the font file contains only icons you actually use, chances are you're not using all of the icons on every page. That's still wasteful — if a page uses a single icon, the entire font needs to be downloaded (an SVG sprite sheet suffers from the same issue).

You could partly get around this problem by splitting your icons into multiple files. Keep your most frequently used icons in one woff2 file, (which you could consider preloading). Icons that are only used in a particular section of the site could be kept in a seperate woff2 file. By specifying [`unicode-range`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range) as part of `@font-face`, the file is only requested if icons it contains are actually used on the current page. This approach takes effort and maintenance.

## What happens if the font fails to load?

Some browsers, such as Firefox, and some browser extensions, allow a user to override the fonts you've specified in your CSS with their own preferred typeface. This used to break icon fonts. Firefox found a way [around this issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1363454) and some extensions are also smart enough to not override icon fonts.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">If you use a icon font &amp; your user is using a content blocker, blocking custom fonts, they’ll block your icons. Use SVG. — <a href="https://twitter.com/SaraSoueidan?ref_src=twsrc%5Etfw">@SaraSoueidan</a></p>&mdash; Jen Simmons (@jensimmons) <a href="https://twitter.com/jensimmons/status/719378653100912640?ref_src=twsrc%5Etfw">April 11, 2016</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Users can also [block all web fonts](https://collinmbarrett.com/block-web-fonts) for improved performance and security or to save on bandwidth, but again, there are ways for users to do this without blocking icon fonts. I have no data on how many people actually do this and assume it’s fairly insignificant but it does speak to the brittleness of fonts compared to SVG.

A more pressing issue than users purposefully blocking or overriding your font is a flaky internet connection simply causing the download to fail. With an inline SVG, the icon is literally part of the document so will always be included. Fonts, by contrast, are a seperate request and inevitably less reliable.

Text and emoji are standardised by Unicode. Unicode defines Private Use Areas for custom glyphs that have no standard meaning. It's important to use the Private Use Areas for custom icons, otherwise users might see confusing results if the font request fails. Some operating systems, such as iOS, make their [own use](https://www.filamentgroup.com/lab/bulletproof_icon_fonts#:~:text=some%20operating%20system%20default%20fonts%20define%20their%20own%20characters%20in%20the%20PUA) of the Private Use Area for some icons. This can lead to unexpected results that are seemingly unavoidable.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">When are we going to stop using icon fonts? <a href="https://t.co/tRZfaqy83m">pic.twitter.com/tRZfaqy83m</a></p>&mdash; Harry Roberts (@csswizardry) <a href="https://twitter.com/csswizardry/status/1102186918190690304?ref_src=twsrc%5Etfw">March 3, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

In Chrome and Safari, missing icons will be rendered as rectangles:

<img style="max-width: 180px;" src="/missing-icons.png" alt="">

In Firefox they're displayed as a box with the relevant Unicode code inside:

<img style="max-width: 180px;" src="/icon-font-fail.png" alt="">

## Accessibility

There seems to be a general feeling that icon fonts are bad for accessibility. SVG are not accessible by default, and its always been possible to use icon fonts in an accessible way. The most popular way to utilise icon fonts makes use of the CSS `content` property. [Relatively recently](https://caniuse.com/mdn-css_properties_content_alt_text), browsers added support for alt text when using pseudo-elements. Icons in the private use area of Unicode get [ignored by screenreaders](https://benfrain.com/seriously-use-icon-fonts/#:~:text=well%20with%20IE.-,PUA%20and%20accessibility,-Much%20has%20been) by default.

For icons that aren't in the private use area, you can prevent superfluous content from being spoken by VoiceOver by using an empty string. In the following example, rather than announcing "black star favourite", a screenreader will pronounce "favourite".

```css
.star::before {
          content:  "★" / "";
      }
```

```html
<button><span class="star"></span>Favourite</button>
```

For icon-only buttons, you can use an `aria-label` attribute on the button, or give the icon itself some useful alt text:

```css
.star::before {
          content:  "★" / "Favourite";
      }
```

```html
<button class="star"></button>
```

If you're using an icon in different contexts to mean slightly different things, you can easily change the alt text by using a data attribute:

```css
.star::before {
    content:  "★" / attr(data-icon-alt);
}
```

```html
<span data-icon-alt="Love it" class="star"></span>
```

Making an icon font accessible is no more difficult than making an SVG accessible.

## Positioning icons

Chris Coyier has written of the [frustration](https://css-tricks.com/icon-fonts-vs-svg/) of positioning icon fonts:

> It depends on `line-height`, `vertical-align`, `letter-spacing`, `word-spacing`, how the font glyph is designed (does it naturally have space around it? does it have kerning information?). Then the pseudo elements `display` type affects if those properties have an effect or not.

Soon you'll also be able to throw `text-box-trim` & `text-box-edge` into the mix.

I'd add that controlling the size of an icon with `font-size` rather than `width` and `height` is non-ideal.

SVG isn't always simple either. Trying to understand how `viewBox` works has caused me no shortage of annoyance over the years.

## Conclusion: you should probably use SVG

There are so many different ways to make use of SVG that a direct comparison is difficult (I cover using SVG for icons in a separate article). The continuing popularity of Font Awesome is testament to the fact that the developer experience of icon fonts isn't that bad. So long as you subset your font to remove unused characters, icon fonts aren't a horrificly bad practice, but they're not the best approach. Creating a custom icon font with a tool like icomoon is simple, but to the majority of web designers and developers, the technical innards of a font file are an opaque mystery. SVG has its own complexities, but is less of a black box.

## A special case: Emoji

Emoji are a kind of icon but, unlike the arbitrary custom symbols you might use in your UI, emoji are standardised as part of Unicode. There's a case for using a COLR font for custom emoji. If the font fails to load, the user still sees the default emoji of the operating system. Below is an example using an open source [custom emoji font](https://github.com/mozilla/twemoji-colr) from Mozilla.

```html
<span class="my-emoji-font">💥😲🔥💎💩😵👽👼🫠</span>
```

<p style="font-family: twemoji; font-size: 24px; letter-spacing: 7px;">💥😲🔥💎💩😵👽👼🫠</p>

Emoji fonts can get excessively large because there are over three thousand emoji. If you only need a limited set, an emoji font is the best option. If a color font is too large, you could consider [splitting it into multiple files](https://x.com/mathias/status/1528760826965987328).
