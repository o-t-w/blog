---
pubDate: 'Dec 14 2024'
title: "CSS @import is cool, actually"
heroImage: "/cssimport.png"
description: Importing CSS into a cascade layer. Conditionally importing CSS with feature queries and media queries. @import vs <link>
---

Using `@import` is generally thought of as a bad practice. While there are some performance considerations to be aware of, `@import` provides some useful functionality that a `<link>` isn't capable of.

## Cascade layers

You can `@import` all the styles of a CSS file into a cascade layer.

```css
@import 'utility-classes.css' layer(utilities);
```

`@import` statements must be included at the top of a stylesheet but an `@layer` declaration can come before your imports:

```css
@layer base, components, utilities;
@import 'base.css' layer(base);
@import 'components.css' layer(components);
@import 'utility-classes.css' layer(utilities);
```

## Feature queries

An `@import` can include a `supports()` condition. If you want a stylesheet to be applied only if some newfangled CSS feature is supported, this is a clean way to achieve that.

```css
@import '/background-clip.css' supports(background-clip: border-area);
@import '/field-sizing.css' supports(field-sizing: content);
```

You can also import a stylesheet only if a CSS feature is not supported:

```css
@import '/fallback1.css' supports(not (animation-timeline: scroll()));
@import '/fallback2.css' supports(not (top: anchor(top)));
```

Unfortunately, in Safari and Firefox, all stylesheets get requested, but only those that meet the `supports` condition actually get applied. Chrome is more efficient: only stylesheets that meet the `supports` condition get requested.

The supports condition for `@import` was added in [Safari 17.5](https://webkit.org/blog/15383/webkit-features-in-safari-17-5/), Chrome 122, and Firefox 115.

## Media queries

If you seperate styles into seperate files for mobile and desktop or light and dark mode, for instance, you can conditionally apply the correct stylesheet:

```css
@import "/dark-styles.css" (prefers-color-scheme: dark);
@import "/light-styles.css" (prefers-color-scheme: light);
```

While only the appropriate stylesheets actually get applied to the document, all `.css` files are downloaded. Not only are requests made for unused CSS files, those requests are high priority. The `<link>` element is better is this regard as stylesheets that don't match the media query are downloaded at a [lower priority](https://x.com/tunetheweb/status/1593271809893453825).

## All of the above

You can use all of these features together:

```css
 @import "/foo.css" 
 layer(overrides) 
 supports(color: lch(29.2345% 44.2 27)) 
 (max-width: 700px);
 ```

## `@import` vs `<link>`

Both `<link>` and `@import` support media queries. `<link>`, however, has no way to specify a `supports` condition and lacks the ability to assign a stylesheet to a cascade layer. We might [eventually](https://github.com/w3c/csswg-drafts/issues/5853) get a [`layer` attribute](https://github.com/whatwg/html/issues/7540) and a `supports` attribute for the `<link>` element, but that is not supported in any browser yet.

## Performance

Some articles accuse `@import` of being bad for performance, but that partly depends on how its used. Let's look at an example:

```html
<link href="/a.css" rel="stylesheet" />
```

If stylesheet `a.css` contains an `@import` statement, a waterfall will be created:

```css
@import "/b.css" ;
```

Referencing one CSS file inside another causes the files to be downloaded sequentially — `a.css` needs to be downloaded before `b.css` can be requested. Using `@import` in this way should be avoided.

The following code in the `<head>` of the HTML document avoids that issue:

```html
<style>
    @import "/a.css";
    @import "/b.css";
</style>
```

Even compared to this improved approach, there are performance reasons to preference the `<link>` tag over `@import`, at least when using media queries:

- In Safari and Chrome, when using media queries as part of an `@import` statement, the preload scanner [won't pick up the stylesheets](https://x.com/tunetheweb/status/1597161125514076160).
- When using media queries, the `<link>` element downloads non-matching stylesheets with a low priority,  `@import` downloads them with a [high priority](https://issues.chromium.org/issues/40645959) and [blocks rendering](https://issues.chromium.org/issues/40869211).
