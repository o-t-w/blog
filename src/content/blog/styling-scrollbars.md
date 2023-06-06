---
author: Ollie Williams
pubDatetime: 2023-06-06T18:22:00Z
title: Styling scrollbars
postSlug: styling-scrollbars
featured: false
draft: false
tags:
  - CSS
  - UX
  - Visual design
ogImage: "/assets/scrollbars.png"
description: How to style scrollbars... and the question of whether you should.  
---

It’s been possible to style scrollbars for many years but only in a [non-standard way](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar) that’s supported in Chrome, Edge and Safari, but not Firefox. This makes use of a large amount of CSS pseudo-elements:

- `::-webkit-scrollbar`
- `::-webkit-scrollbar-button`
- `::-webkit-scrollbar-thumb`
- `::-webkit-scrollbar-track`
- `::-webkit-scrollbar-track-piece`
- `::-webkit-scrollbar-corner`
- `::-webkit-resizer`

These pseudo-elements are not on a standards track, so won’t ever get implemented in Firefox.

In 2018 the W3C published a scrollbars styling specification which introduced the `scrollbar-width` and `scrollbar-color` CSS properties. Firefox 64, released that same year, implemented both of these properties. As of yet no other browser has followed suit and it’s unclear if they will do so (Safari have not declared a position on either [scrollbar-color](https://github.com/WebKit/standards-positions/issues/134) or [scrollbar-width](https://github.com/WebKit/standards-positions/issues/133#issuecomment-1551300724)).

The older non-standard approach allowed a great deal of control. You could even recreate Windows 95 style scrollbars for a retro look if you wanted to. The standardized CSS properties are much more limited in scope. 

About the non-standardized approach the [W3C spec](https://drafts.csswg.org/css-scrollbars/) states:

> “Exposing the scrollbar-related `::-webkit-` prefixed pseudo-elements to the Web is considered a mistake by both the CSS Working Group and Webkit”

And:
> “The internal structure, layout, and configuration of scrollbars, as well as precise control over their coloring, is out of scope. This is because different platforms have different scrollbar structures and styling conventions, and operating systems continuously evolve their scrollbar designs to provide better user experience. Pseudo-elements for selecting specific parts of a scrollbar, for example, were considered and rejected. While this level of fine control would be tempting for authors, the arrangement of the various parts—or whether they’re even all present—cannot be depended on. Providing too much control would allow authors to get perfect results on some platforms, but at the expense of broken results on others.”

For that reason I’m only going to cover standardized solutions in this article, even though browser support remains limited.

## UX considerations

Eric Bailey recently published an article titled [*Don’t use custom CSS scrollbars*](https://ericwbailey.website/published/dont-use-custom-css-scrollbars/) that makes some points that are worth considering:

> “Browser UI is used to help create consistency across the entire experience of using a device. When you deviate from these standards, you introduce ambiguity. Ambiguity means less certainty about what the piece of UI is, how you interact with it, and what effects taking action on it will cause. The more you deviate, the more confusing things get… It now no longer looks like any other scrollbar on a person's device, as well as any other website or web app on the internet.”

This is echoed in the W3C spec itself:
> “Scrollbars are a UI mechanism essential to interact with the page. Operating systems tend to want consistency in such controls to improve usability through familiarity, and users with specific preferences or needs can adjust the appearance of various UI components, including scrollbars, through OS or UA settings. While using this property in support of specific UX goals is appropriate, authors should otherwise refrain from overriding such user preferences.”

## `scrollbar-width`
```css    
.scrollable-section {
    scrollbar-width: thin;
}
```
There are only three possible values for the `scrollbar-width` property: 

- `auto` (the default width)
- `thin`
- `none`

You can set this value to `none` to have a scrollable area with no visible scrollbar but I struggle to think of a situation where that would be a good idea. 

The W3C spec describes the purpose of the `scrollbar-width` property and addresses some of the previously mentioned UX concerns:

> “The primary purpose of this property is not to allow authors to chose a particular scrollbar aesthetic for their pages, but to let them indicate for certain small or cramped elements of their pages that a smaller scrollbar would be desirable.”

So its not advised to use this property on the html element, but it could come in useful for UI elements such as a custom select menu, for example. 

![A screenshot of a custom dropdown menu with a thin scrollbar](/assets/amenu.png)

## `scrollbar-color`

This property accepts two color values:
```css
html {
    scrollbar-color: #6969dd #e0e0e0;
}
```
The first color applies to the thumb of the scrollbar (meaning the part of the scrollbar that you move ), the second to the scrollbar track.

If you decide to customize the color of the scrollbar its important to take accessibility into account when it comes to color contrast. To meet [WCAG 2.1 AA requirements](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) a minimum contrast ratio of 3:1 is required.

## Respecting user settings

Part of Eric’s argument against custom scrollbars focuses on failing to respect certain [user preferences](https://polypane.app/blog/forced-colors-explained-a-practical-guide/), such as high contrast mode on Windows (also known as forced colors mode). From my own testing, scrollbars customized with the non-standardized `::-webkit-` pseudo-element approach were completely invisible and unusable in high contrast mode on Windows. However, for scrollbars customized with the `scrollbar-color` CSS property, high contrast mode worked without issue. [MDN states](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color#:~:text=Note%3A%20%40media%20(forced%2Dcolors%3A%20active)%20sets%20scrollbar%2Dcolor%20to%20auto.) “`@media (forced-colors: active)` sets `scrollbar-color` to `auto`", meaning it will automatically override your custom styling. 

While I somewhat agree with Eric that styling scrollbars isn’t always a great idea, there is one situation where its important to consider: dark mode. Standard light-mode scrollbars don’t look great on websites that make heavy use of dark backgrounds. 

## Dark scrollbars

If you’re site supports dark mode, or if you have a website that makes heavy use of dark background colors regardless of user preferences, the standard light-mode scrollbar looks jarring. Twitter.com is one prominent example of a website that implements dark-mode without applying a dark color scheme to scrollbars.

![A screenshot of Twitter.com in dark mode but with light gray scrollbars](/assets/twitterlight.png)


You could use the `scrollbar-color` CSS property to specify any dark colors you choose. However, a better approach would be to use a `meta` tag. This approach has full cross-browser support.

If you’re site supports both light and dark color themes, add this meta tag to the head of your HTML document 
```html
<meta name="color-scheme" content="light dark">
```
If you have a website that only offers a dark color scheme, use the following meta tag:
```html
<meta name="color-scheme" content="dark">
```
Here’s Twitter.com after I applied the appropriate meta tag using devtools:

![A screenshot of Twitter.com with very dark grey scrollbars in dark mode](/assets/twitterdark.png)


By using the meta tag rather than specifying our own custom dark colors we assure that the user has familiarity with the interface, as the scrollbar will look exactly the same on most sites that implement dark mode. 

There’s also a CSS property for achieving the same effect.
```css
:root {
    color-scheme: dark;
}
```
The meta tag should be preferenced as it will be applied immediately, whereas the `color-scheme` CSS property requires the CSS to first be downloaded and parsed. 

The `color-scheme` CSS property can be used on both the `:root`/`html` element as well as on an individual element, whereas the meta tag will apply to all scrollbars. 

