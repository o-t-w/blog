---
pubDate: 'Sep 25 2026'
title: "Interop 2027 and beyond"
heroImage: "/interop2027.webp"
description: My own frontend wishlist
---

## Interop 2027

Here is my own ranked list of the web features I've voted for:

1. [Sanitizer API](https://github.com/web-platform-tests/interop/issues/1336) and the new [HTML setter methods](https://github.com/web-platform-tests/interop/issues/1416) and [streaming methods](https://github.com/web-platform-tests/interop/issues/1471).
2. [`moveBefore()`](https://github.com/web-platform-tests/interop/issues/1355)
3. [Transparency support](https://github.com/web-platform-tests/interop/issues/1421) for VP9 video codec and animated AVIF as well as general [AVIF interoperability improvements](https://github.com/web-platform-tests/interop/issues/1461) and [progressive rendering support](https://github.com/web-platform-tests/interop/issues/1459) for both JPEG XL and AVIF
4. [CSS Link Parameters for styling SVG](https://github.com/web-platform-tests/interop/issues/1346)
5. [`focusgroup`](https://github.com/web-platform-tests/interop/issues/1348)
6. [Unprefix `box-decoration-break`](https://github.com/web-platform-tests/interop/issues/1391)
7. [Support `justify-self` in block layouts](https://github.com/web-platform-tests/interop/issues/1360) rather than only for grid items and absolutely-positioned elements
8. [`AccentColor` should reflect `accent-color`](https://github.com/web-platform-tests/interop/issues/1361)
9. [CSS gap decorations](https://github.com/web-platform-tests/interop/issues/1374)
10. [`flex-wrap: balance`](https://github.com/web-platform-tests/interop/issues/1350)
11. [Responsive iframes](https://github.com/web-platform-tests/interop/issues/1443)
12. [`align-content` for button/input centering](https://github.com/web-platform-tests/interop/issues/1410)
13. [CSS `grid-lanes`](https://github.com/web-platform-tests/interop/issues/1445) (aka Masonry layout)
14. [Speculation Rules API](https://github.com/web-platform-tests/interop/issues/1335)

## "Pre-op"

Web developers have some official avenues to express their sentiments on emerging web standards. There's Interop and there's the [developer-signals](https://github.com/web-platform-dx/developer-signals) GitHub repo, where you can vote for features via 👍 emoji reactions to issues. However, both Interop and the developer-signals repo are designed for features that are already fairly far-along in the standards process. For early-stage proposals, its harder for developers to make their sentiments known. So here is my personal "pre-op" wishlist of features that are too early to raise for Interop 2027: 

#### 1. `appearance: base` and the entire [CSS Forms spec](https://www.w3.org/TR/css-forms-1/) 
For decades developers have asked for a way to style native HTML inputs and form controls. This is the most significant  advancement on the horizon for UI development. Early-stage [implementation work](https://issues.chromium.org/issues/450139531) has started in Chromium.

#### 2. Better standards for implementing dark mode
Sadly, it looks like the Web Preferences API is [probably not going to happen](https://github.com/WebKit/standards-positions/issues/252). I've previously written about the frustrating disconnect between `<meta name="color-scheme">` and the `prefers-color-scheme` media query. A recent update to the CSS spec has changed the specified behaviour so that `<meta name="color-scheme">` _should_ impact the media query — but sadly no browser has implemented this yet. You can upvote the [relevant Chromium implementation issue](https://issues.chromium.org/issues/498561069).

#### 3. [CSS `image-animation`](https://www.w3.org/TR/css-image-animation-1/#image-animation)
The argument that you should just use a HTML `<video>` element is fairly compelling, but I'd still like to see more control over animated images ("gifs"). The CSS `image-animation` property is implemented behind a flag in Chrome Canary.

#### 4. [PUT, PATCH and DELETE methods for HTML forms](https://github.com/whatwg/html/issues/3577)

#### 5. [DOM Templating API](https://github.com/justinfagnani/dom-templating-api-proposal/blob/main/EXPLAINER.md)

This spec still needs a lot of work.

#### 6. [Better control over anchor positioning](https://github.com/w3c/csswg-drafts/issues/11666) 
When adding animations to elements making use of anchor positioning, it would be useful to be able to change the `transform-origin` and `translate` depending on the position of the anchor.

#### 7. [Persistent Widgets](https://groups.google.com/a/chromium.org/g/blink-dev/c/DGHoP1k2t2E/m/qQLbK1StDwAJ)

#### 8. [Everything Open UI is working on](https://open-ui.org)
There's a lot... but work on new menu elements is particularly compelling.

#### 9. Signals in JavaScript
There was initially a huge amount of engagement on this topic from authors of JavaScript frameworks. Its been slow going since then and [the proposal](https://github.com/tc39/proposal-signals) seems stuck at stage 1...

#### 10. [`<input type="date">` support for Temporal](https://github.com/whatwg/html/issues/10882)

--- 

After that, the internet is finished and browser engineers can spend the rest of time quashing bugs. 