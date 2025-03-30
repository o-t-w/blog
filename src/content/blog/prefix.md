---
pubDate: 'Apr 22 2024'
title: The slow death of CSS vendor prefixes 
tags:
  - CSS
heroImage: "/webkit.jpg"
description: Do we still need Autoprefixer?
---

*This article was updated on 30th March 2025*

CSS prefixes are a relic from a bygone age.

Developers once manually typed out code like:

```css
.round {
   -moz-border-radius: 10px;
   -webkit-border-radius: 10px;
   -o-border-radius: 10px;
   border-radius: 10px;
}
```

This arduous experience was automated away by the popular build-tool Autoprefixer.  

> “This is a project that I hope will die.”
> -- <cite>[Andrey Sitnik, creator of Autoprefixer][1]</cite>

[1]: https://x.com/sitnikcode/status/1681409857281245186?s=46

As part of the standardisation process, browsers need to test unstable new features and gather developer feedback. Today, developers can try features before they're fully standardized by enabling experimental feature flags in the settings of their web browser, or by using a browser like Chrome Canary, Firefox Nightly or Safari Technology Preview. There's no incentive to use these features on a production website because they won't work for your users (other than the 0.0001% who have turned on the feature flag.) In the earlier days of the web, vendor prefixes were used as a way for browsers to try out experimental features. Developers started using these prefixes on user-facing production websites, and the browser folks belatedly realised that they were a bad idea.

Around 2016, browsers stopped using vendor prefixes for new CSS properties and started to remove the need for prefixes for many older CSS properties that previously required them. This has been a gradual and slow process as browsers have unprefixed CSS properties one property at a time. Here's a tweet from back in 2019:

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Browser teams have been *removing* support for prefixes. Much of the -moz stuff is long gone. Opera’s rendering engine is gone. Plus, there are no new prefixed properties &amp; haven’t been for years.</p>&mdash; Jen Simmons (@jensimmons) <a href="https://twitter.com/jensimmons/status/1084921105444491265?ref_src=twsrc%5Etfw">January 14, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I like to keep my build process as minimal as possible. Like many people, I ditched Sass. Could Autoprefixer be another dependency made unnecessary by the progress of the modern web? In 2013, the year Autoprefixer was released, [53 CSS features](https://css-tricks.com/is-vendor-prefixing-dead/) required prefixing. What's the situation now?

## Which CSS properties still require a prefix?

- `user-select`
- `initial-letter`
- `text-decoration` (sort of)
- `text-stroke`
- `text-fill-color`
- `line-clamp`
- `box-decoration-break`
- `stretch`/`available`/`fill-available`

[`user-select`](https://caniuse.com/user-select-none) and [`initial-letter`](https://caniuse.com/css-initial-letter) still require a `-webkit-` prefix in Safari.

Safari supports `text-decoration-color`, `text-decoration-line` and `text-decoration-style` without a prefix. The `text-decoration` property is meant to work as a shorthand for all three. In Safari, however, `text-decoration` can only set `text-decoration-line`. `text-decoration: underline;` works.  `text-decoration: underline orange wavy;` doesn't. `-webkit-text-decoration` works correctly when setting all three properties.

`text-stroke` and `text-fill-color` have never been standardised, but `-webkit-text-stroke` and  `-webkit-text-fill-color` work in every browser.

Similarly, `line-clamp` has still not been been standardised. There is currently no `line-clamp` property implemented in any browser, only `-webkit-line-clamp`, which only works in conjunction with two other prefixed non-standard properties:

```css
.clamp {  
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
```

You might as well type that out by hand as _there will never be_ a standardised non-prefixed version of `box-orient` or `display: box`. Chrome looks set on implementing an improved non-prefixed [line-clamp](https://groups.google.com/a/chromium.org/g/blink-dev/c/CWP5rb--Gyk), which won't rely on setting any other esoteric obsolete properties.

There are a great many prefixed properties for styling scrollbars. These are not a web standard and will never be a web standard, but they do still work in Chrome and Safari. The standard properties for styling scrollbars are `scrollbar-width` and `scrollbar-color`, which have never required a prefix.

The CSS `stretch` keyword as a value for `width` and `height` is implemented only in [Chrome/Edge](https://chromestatus.com/feature/6176445286842368). The equivalent prefixed value `-webkit-fill-available` works in Safari and older versions of Chrome/Edge. `-moz-available` is required for Firefox.

`box-decoration-break` requires a `-webkit` prefix in Safari. Chrome/Edge shipped full unprefixed support for this property in [version 130](https://developer.chrome.com/blog/box-decoration-break#inline_fragmentation).

## Updates since this article was first published

`background-clip: text` and `mask` had required a prefix for Samsung Internet browser. That is no longer the case as of Samsung Internet version 25.

`ruby-position` had required a `-webkit` prefix for Safari. This is no longer the case as of [Safari 18.2](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#CSS).

Chrome, Edge and other Chromium-based browsers had required a `-webkit-` prefix for `print-color-adjust`. This is no longer the case as of [version 136](https://chromestatus.com/feature/5159639697850368).

[`backdrop-filter`](https://caniuse.com/css-backdrop-filter) had required a `-webkit-` prefix in Safari. An unprefixed version of `backdrop-filter` has been supported since [Safari 18](https://developer.apple.com/documentation/safari-release-notes/safari-18-release-notes#:~:text=unprefixed%20backdrop%2Dfilter).
