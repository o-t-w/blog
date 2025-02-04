---
pubDate: 'Jan 29 2025'
title: "How to gif (2025 edition)"
heroImage: "/howtogif.png"
description: Animated AVIF, AV1 video, JPEG-XL...
---

Back in 2022 I published the article [*GIFs Without the .gif: The Most Performant Image and Video Options Right Now*](https://css-tricks.com/gifs-without-the-gif-the-most-performant-image-and-video-options-right-now/) on CSS Tricks. Certain information in that post is now out of date:

- The AV1 video codec is supported in all browsers.
- Animated AVIF is supported in all browsers (albeit with issues in Safari).
- WebM video is supported in all browsers.
- The `image-set` CSS property is supported in all browsers.
- The `media` attribute works on HTML `<source>` elements within a `<video>` in all browsers.

## Image formats

<style>
    .anim-img-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        column-gap: 16px;
        row-gap: 8px;
        text-align: center;
        justify-content: center;
        margin-inline: auto;

        .format {
            grid-row: 2;
            font-size: 15px;
        }

        div:not(.format) {
            grid-row: 3;
            font-size: 15px;
            background-color: rgb(50,50,50);
            color: white;
        }

        img {
            border-radius: 0;
        }
    }
</style>

<div class="anim-img-grid" style="margin-top: 24px;">
<img src="/animated/friends.gif" alt="">
<div class="format">GIF</div>
<div>1.5 MB</div>
<img src="/animated/friends.png" alt="">
<div class="format">PNG</div>
<div>3.2 MB</div>
<img src="/animated/friends.webp" alt="">
<div class="format">WebP</div>
<div>382 KB</div>
<img src="/animated/friends.avifs" alt="">
<div class="format">AVIF</div>
<div>119 KB</div>
<!-- <picture>
<source srcset="/animated/friends.jxl" type="image/jxl">
<img src="/animated/jpegxl-not.png" alt="">
</picture>
<div class="format">JPEG-XL</div>
<div>158 KB</div> -->
</div>

GIF, PNG, WebP, AVIF and JPEG-XL support both still and animated images. Were I an FFmpeg expert, its likely I could have reduced the size of the GIF and PNG files somewhat, but you get the idea. GIF and PNG are legacy formats and WebP has been superseded by AVIF.

### AVIF

AVIF (AV1 Image File Format) was created by the Alliance for Open Media (AOM), a group that includes Google, Apple, Microsoft, Netflix, Meta, Zoom, Amazon, Adobe and Intel. AVIF is based on the AV1 video codec.

The AOM [website](https://aomedia.org/specifications/avif/) describes the features of the image format:

> “AVIF supports both lossless and lossy compression, as well as high dynamic range (HDR), wide color gamut (WCG), transparency, and animation, offering flexibility and versatility.”

While animated AVIF has been supported in all browsers for several years, the format can suffer from frame rate performance issues in Safari.

### JPEG-XL

Safari supports JPEG-XL but does not support animated JPEG-XL, so will display the first frame as a still image. Chrome, Edge, and Firefox do not support JPEG-XL, but Firefox is likely to add support later this year.

WebP and AVIF are based on video codecs, so it would be surprising if JPEG-XL, which was built from the ground up as a still-image format, could outperform them.

Under the heading *"Advantages of AVIF"*, Jon Sneyers, co-creator of JPEG-XL, [compared](https://cloudinary.com/blog/how_jpeg_xl_compares_to_other_image_codecs#animation_and_cinemagraphs) animated JPEG-XL unfavourably to AVIF and video codecs:

> “Even though you can create animation in JPEG XL, it offers no advanced video-codec features, such as [motion estimation](https://cloudinary.com/glossary/motion-estimation). JPEG XL compresses better than GIF, APNG, and animated WebP but cannot compete with actual video codecs for production of “natural” video. Even for a three-second looping video or cinemagraph, where most of the image is static, actual video codecs like AV1 and HEVC can compress much better than still-image codecs.”

## Video

An alternative to animated image formats is the `<video>` element:

```html
<video autoplay loop muted playsinline src="friends.mp4"></video>
```

Most browsers allow autoplay if the video has no audio track or includes the `muted` attribute, but this does depend on user settings.

A HTML `<video>` can be any size and aspect ratio, and can be displayed without any play/pause/mute buttons, so is more flexible than you might think.

### AV1

The AV1 video codec was created by the Alliance for Open Media (AOM).

Below is an ancient video I converted to AV1. If it's broken, your browser or device does not support AV1.

<video controls playsinline src="/animated/thisisDVD.mp4"></video>

AV1 is supported in all browsers, but with some major caveats:

- Safari supports WebM for some video codecs, but not for AV1, so MP4 must be used.
- Safari only plays AV1 video on devices that support hardware-accelerated decoding.

Most current Apple devices support hardware-accelerated decoding for AV1 video (see [this article](/apple-devices-av1-decoding) for a full list). By the end of 2025, it’s likely all of them will. There are millions of older Apple devices in circulation that will be in use for quite some time. A fallback video using a more-widely supported codec like H.264 can be provided by making use of multiple `<source>` elements and the `type` attribute.

```html
<video controls playsinline>
  <source src="myvideo-av1.mp4" type="video/mp4; codecs=av01.0.08M.08" />
  <source src="myvideo-h264.mp4" type="video/mp4" />
</video>
```

See [this article](https://jakearchibald.com/2022/html-codecs-parameter-for-av1/) for information on specifying the codec.

Adobe Media Encoder does not support export of AV1 video. DaVinci Resolve 19 on Windows supports exporting AV1 video. The command line tool FFmpeg or a GUI like Shutter Encoder can be used to convert video to AV1.

## Video vs Image formats

### Responsive video

When weighing up the two options in my CSS Tricks article, I described what was, at that time, a unique benefit of using images: media queries via the `<picture>` tag. Media queries for HTML video are now supported in all browsers.

Using multiple `<source>` elements, a different video file can be specified based on screen size, orientation, light mode/dark mode, or any other media query.

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

Media query support for video was implemented in all browsers, then removed from Chrome and Firefox, and then reintroduced in 2023.

## Transparency/Alpha

If a video includes transparency, the best solution is far more tenuous.

- AV1 does not support transparency.
- Animated AVIF files that include transparency suffer from performance issues in every browser, and are practically unusable in Safari.
- Safari supports the HEVC video codec with transparency, but Chrome does not.
- Chrome supports the VP9 video codec with transparency, but Safari does not.

Jake Archibald has written an [in-depth article](https://jakearchibald.com/2024/video-with-transparency/#the-performance-is-prohibitively-bad) about this topic.

Animated WebP seems to avoid the Safari issues of animated AVIF, so is worth considering.

## Looping video beyond "gifs"

Giphy, a gif search engine once valued at hundreds of millions of dollars, has blamed its [declining business](https://www.theguardian.com/technology/2022/sep/16/gifs-are-cringe-and-for-boomers-giphy-claims-in-meta-takeover-filing) on young people who view gifs as uncool:

> “They have fallen out of fashion as a content form, with younger users in particular describing gifs as ‘for boomers’ and ‘cringe’.”

While the term "gif" is often associated with pixelated graphics, 90's pop-culture references and horrifically dated art-styles, the use-cases for looping silent video are broader than chat reactions. I worked on a web app that imported an entire JavaScript library to animate a loading spinner. While a lot can be achieved with SVG, CSS and JavaScript animations, with modern codecs offering increasingly tiny file sizes, its possible were under-utilising modern "gifs" in UI design.

## Conclusion

While AVIF should be an obvious choice, frame rate performance issues and browser bugs currently make it difficult to fully recommend. AV1 sadly requires the extra effort of exporting the video in two different formats so that a fallback can be provided for older Apple devices.
