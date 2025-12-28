---
pubDate: 'Dec 28 2025'
title: Rethinking SVG icons
heroImage: "/icons.jpg"
description: SVG icons are still a pain
---

Reading through the State of HTML survey, SVG came second in the [Graphics & Multimedia Pain Points](https://2025.stateofhtml.com/en-US/features/graphics-multimedia/) chart. While multiple issues were voiced in the comments, the problem that came up most frequently was styling:

- "No way to pass `currentColor` and other params to remote SVGs makes icons very hard to manage"
- "I'd like to refer to an SVG (e.g. to use as a repeated icon) that's less verbose than `<svg><use>...</use></svg>`"
- "Unable to style an SVG when its not inline. (I would like to have icons in external SVGs but still color or style them as if inline.)"
- “Want to be able to do `<img src='file.svg'>` and still retain ability to style. Currently if i want to pass through `currentColor` for example i have to inline the entire icon which is silly if i'm using it in dozens of places"
- "Inlining SVGs causes a lot of repetition and noise in the HTML"

In a [previous article](/blog/svg-icons/) about SVG icons I concluded:

> For most use cases, `<use>` is the best option. This approach balances performance, an OK developer experience and just the right amount of stylistic versatility. 

Even at the time of writing, I didn't feel entirely convinced. Compared to an `<img>`, `<use>` is a verbose and complex way to reuse icons. The best approach is not a settled issue.

<img src="/svgicons.webp" alt="">

The above tweet got over 1000 likes, only to ellicit the [response](https://x.com/__alula/status/2001421696515948643?s=46) "Don't do this - `mask-image` is actually a horrible solution", which itself garnered over 800 likes.  

## Is `<use>` a security issue?

I hadn't been aware there were any security issues until viewing this [GitHub issue](https://github.com/WebKit/standards-positions/issues/480#:~:text=I'm%20a%20bit%20surprised%20we'd%20further%20enhance%20the%20use%20element%20given%20what%20a%20security%20problem%20it%20has%20been%20to%20date) where an Apple employee working on web standards commented:

> I'm a bit surprised we'd further enhance the `use` element given what a security problem it has been to date.

The MDN page doesn't mention security issues. After a Google search, it seems it's mentioned almost nowhere on the web: [these](https://portswigger.net/research/bypassing-firefoxs-html-sanitizer-api) [articles](https://portswigger.net/research/new-xss-vectors) from 2022 are all I could find. An SVG can include `<script>` and `<foreignObject>` elements (a `<foreignObject>` is a way to include HTML within an SVG). Browsers take some measures to limit security issues: If `<use>` references an SVG file, `<script>` and inline event handlers do not execute and a `<foreignObject>` will not be rendered. **The new [Sanitizer API](/blog/sanitizer/) will strip out `<use>` elements entirely. If you need to pass markup through the Sanitizer, the `<use>` element is unusable.** That is not the case for an `<img>` element or an `<svg>` element, and is a relatively important mark against `<use>`. 

The only conclusion is that every approach to SVG icons is imperfect — at least until [CSS link parameters](https://drafts.csswg.org/css-link-params/) become a thing.