---
pubDate: 'Jan 29 2025'
title: "How to gif (2025 edition)"
heroImage: "/howtogif.png"
description: Animated AVIF, AV1 video, or JPEG-XL...
---

Back in 2022 I published the article [*GIFs Without the .gif: The Most Performant Image and Video Options Right Now*](https://css-tricks.com/gifs-without-the-gif-the-most-performant-image-and-video-options-right-now/) on CSS Tricks. Certain information in that post is now out of date:

- The AV1 video codec is supported in all browsers
- WebM video is supported in all browsers
- The `image-set` CSS property is supported in all browsers
- Animated AVIF is supported in all browsers
- The `media` attribute works on HTML `<source>` elements within a `<video>` in all browsers.

I concluded that article: “I wish there was a TL;DR for this article. For now, at least, there’s no clear winner…” If you need transparency/alpha, that's still true. If you don’t need transparency, animated AVIF is probably the best approach.

## Image formats

<style>
    .anim-img-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 16px;
        text-align: center;
        justify-content: center;
        margin-inline: auto;

        div {
            grid-row: 2;
        }

        img {
            border-radius: 0;
        }
    }
</style>

<!-- <div class="anim-img-grid">
<img src="/animated/anim-icos.gif" alt="">
<div>gif</div>
<img src="/animated/anim-icos.apng.png" alt="">
<div>PNG</div>
<img src="/animated/anim-icos.webp" alt="">
<div>WebP</div>
<img src="/animated/anim-icos.jxl" alt="">
<div>JPEG-XL</div>
</div> -->

<div class="anim-img-grid" style="margin-top: 24px;">
<img src="/animated/friends.gif" alt="">
<div>gif</div>
<img src="/animated/friends.png" alt="">
<div>PNG</div>
<img src="/animated/giphy.webp" alt="">
<div>WebP</div>
<img src="/animated/friends.avifs" alt="">
<div>AVIF</div>
<picture>
<source srcset="/animated/friends.jxl" type="image/jxl">
<img src="/animated/jpegxl-not.png" alt="">
</picture>
<div>JPEG-XL</div>
</div>

gif and PNG are legacy formats.

### JPEG-XL

Safari supports JPEG-XL but does not support animated JPEG-XL, so will display the first frame as a still image. Chrome, Edge, and Firefox do not support JPEG-XL, but Firefox is likely to add support later this year.

WebP and AVIF are based on video codecs, so it would be surprising if JPEG-XL, which was built from the ground up as a still-image format, could outperform them.

Under the heading _"Advantages of AVIF"_, Jon Sneyers, co-creator of JPEG-XL, [compared](https://cloudinary.com/blog/how_jpeg_xl_compares_to_other_image_codecs#animation_and_cinemagraphs) animated JPEG-XL unfavourably to AVIF and video codecs:

> “Even though you can create animation in JPEG XL, it offers no advanced video-codec features, such as [motion estimation](https://cloudinary.com/glossary/motion-estimation). JPEG XL compresses better than GIF, APNG, and animated WebP but cannot compete with actual video codecs for production of “natural” video. Even for a three-second looping video or cinemagraph, where most of the image is static, actual video codecs like AV1 and HEVC can compress much better than still-image codecs.”

## Video

An alternative to animated image formats is to use the `<video>` element:

```html
<video autoplay loop muted playsinline src="friends.mp4"></video>
```

Most browsers allow autoplay if the video has no audio track or includes the `muted` attribute, but this does depend on the users settings.

### AV1

The only video format that can rival AVIF is AV1. 

Below is an AV1 video:

<video controls src="/animated/thisisDVD.mp4"></video>

<video controls src="/animated/thisisDVD.webm"></video>


AV1 is supported in all browsers, but has a few caveats:

- It does not support alpha/transparency.
- Safari only plays AV1 video on devices that support hardware-accelerated decoding.

Most current Apple devices support hardware-acceleration for AV1 video (see [this article](/apple-devices-av1-decoding) for a full list of Apple devices that support AV1 hardware decoding). By the end of 2025, it’s likely all of them will. There are millions of older Apple devices in circulation that will be in use for quite some time. A fallback video using a more-widely supported codec like H.264 can be provided, but needing to a export a video in two different formats is far from ideal.

Some video formats support transparency:

AVIF is supported in all browsers, with the only caveat being transparency bugs. AV1 is supported in all browsers, but with a huge caveat:

### Responsive video

Using the `<source>` element, a different video file can be specified based on screen size, orientation, light mode/dark mode, or any other media query.

```html
<video controls autoplay loop muted playsinline>
    <source media="(orientation: landscape)" src="/fish-desktop.mp4">
    <source media="(orientation: portrait)"  src="/fish-mobile.mp4">
</video>
```

Resize your browser window and reload the page to see the difference.

<video controls autoplay loop muted playsinline style="max-height: 80vh; margin-inline: auto; display: block; margin-top: 24px;">
    <source media="(orientation: landscape)" src="/animated/fish-desktop-h264.mp4">
    <source media="(orientation: portrait)"  src="/animated/fish-mobile-h264.mp4">
</video>

## Transparency
