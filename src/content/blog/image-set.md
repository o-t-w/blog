---
pubDate: 'Jun 06 2023'
title: image-set() for CSS background images
tags:
  - CSS
  - images
heroImage: "/image-set.png"
description: Use the latest image formats in CSS.  
---

When [Safari 17](https://webkit.org/blog/14205/news-from-wwdc23-webkit-features-in-safari-17-beta/#:~:text=inside%20an%20app.-,Image%20set,-Safari%2017%20also) is released `image-set()` will be fully supported by all browsers. The [caniuse](https://caniuse.com/css-image-set) information is currently innaccurate. Chrome does fully support `image-set()` but shipped support for the `type` argument in version 115. 

AVIF is a relatively new image format. It’s supported in all browsers except for Microsoft Edge. Edge is built on Chromium so normally has the same features as Google Chrome. The current lack of support for AVIF is apparently due to [licensing issues](https://toot.cafe/@slightlyoff/109899372183448386).

JPEG XL is another modern image format. It is only supported by the forthcoming Safari 17 (it is not clear if it will ever be implemented by [Chrome](https://cloudinary.com/blog/the-case-for-jpeg-xl) or [Firefox](https://github.com/mozilla/standards-positions/issues/522)). 

`image-set()` gives us a way to use JPEG XL or AVIF images as a `background-image` in CSS while sending an older image format like WebP or PNG to browsers that don’t support the newer format. That way you gain performance improvements for some users while ensuring all users will see the image:

Example using AVIF:
```css
.hero-section {
    background-image: image-set(
        "coolbackground.avif" type("image/avif"),
        "coolbackground.png" type("image/png")
    );
}
```
Example using JPEG XL:
```css
.hero-section {
  background-image: image-set(
    url("coolbackground.jxl") type("image/jxl"),
    url("coolbackground.png") type("image/png")
  );
}
```
