---
pubDate: 'Jan 09 2024'
title: AVIF Everywhere
heroImage: "/avif.jpg"
description: A new image format for the web finally gets full browser support.
---

Microsoft Edge browser is based on Chromium under-the-hood. From the perspective of a frontend developer, Edge and Chrome are basically identical. The AVIF image format was an unusual divergence: Chrome supported it since version 85, all the way back in 2020. Edge finally added support in version 121, which means AVIF is now supported by all browsers.

AVIF is also supported in most [email clients](https://www.caniemail.com/features/image-avif/). 

AVIF is newer than WebP, and superior for most use-cases. Compared to JPEG or PNG at a similar visual quality, it offers a vastly smaller file size.

AVIF is great for still images, but it supports animation so its also an [ideal replacement for gifs](https://css-tricks.com/gifs-without-the-gif-the-most-performant-image-and-video-options-right-now/).

In the tooling space, there is still some catching-up to do. Figma does not support importing or exporting AVIF images, for example. 

On the topic of modern image formats, [Safari 17](https://developer.apple.com/documentation/safari-release-notes/safari-17-release-notes#Images) added support for JPEG XL. Firefox has a [neutral position](https://github.com/mozilla/standards-positions/issues/522#issuecomment-1409539985) on JPEG XL. It looks [unlikely](https://x.com/jonsneyers/status/1591101173846925312?s=20) that Chrome will ever support the format. 