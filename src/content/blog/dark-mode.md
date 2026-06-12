---
pubDate: 'June 12 2026'
title: Dark mode with web standards
heroImage: "/dark-mode-cover.png"
description: Implementing dark mode with minimal JavaScript and standard CSS
---

<style>
    iframe {
        height: 100px;
    }

    img {
        width: 40px;
        height: 40px;
        margin-top: 12px;
    }

    .bg-gradient {
        border-radius: 8px; height: 80px; max-width: 100%; background-image: light-dark(linear-gradient(15deg, #b9b6ff, #308dc6), linear-gradient(15deg, #6b7495, #001339)); background-repeat: no-repeat; background-size: contain;
        margin-top: 12px;
    }

    .bg-grad-solid {
        border-radius: 8px; 
        height: 80px; 
        background-image: light-dark(linear-gradient(15deg, #b9b6ff, #308dc6), image(#001339)); 
        background-repeat: no-repeat; 
        background-size: contain;
        margin-top: 12px;
    }
</style>

Respecting the user's OS setting is straightforward: use the `prefers-color-scheme` media query in CSS. Arguably, that isn't enough: users should also be able to customise their choice on a per-site basis. A user might want dark mode for the UI of an application, but light mode for reading long-form text on content-heavy sites, for example.

We need to:

1. Support the user's system setting as the default for when the user lands on our website for the first time
2. Allow the user to override their system setting with a toggle in our application.

The color scheme of a web page can be set either via a HTML meta tag in the `<head>` of the document or via the CSS `color-scheme` property on the `html` element. It can take time for CSS to load on slow connections, so using the meta tag is the recommended approach. When a user lands on your website for the first time, respect their system preference by setting `<meta name="color-scheme" content="light dark">`. To override the OS setting via a control in your web app or site, use JavaScript to update the `content` attribute value to `light` to override the user's system preferences and force light mode, `dark` to force dark mode, or `light dark` to revert back to the OS setting.

```js
const metaTag = document.querySelector('[name="color-scheme"]');

const savedScheme = localStorage.getItem("colorScheme");
if (savedScheme) {metaTag.setAttribute('content', savedScheme);}

btnlight.addEventListener('click', function() {
    metaTag.setAttribute('content', 'light');
    localStorage.setItem("colorScheme", "light");
});
btndark.addEventListener('click', function() {
    metaTag.setAttribute('content', 'dark');
    localStorage.setItem("colorScheme", "dark");
});
btnsystem.addEventListener('click', function() {
    metaTag.setAttribute('content', 'light dark');
    localStorage.removeItem("colorScheme");
});
```

#### What does the `color-scheme` affect?

- Colors, gradients, or images set via the `light-dark()` CSS function
- System colors like `Canvas` and `CanvasText`
- Scrollbar colors
- The default colors of HTML elements like buttons
- iframes styles (so long as the iframe document has opted in via the meta tag)
- SVG's that make use of `light-dark()` or `prefers-color-scheme`

#### What doesn't `color-scheme` affect?

There's an unfortunate disconnect between `color-scheme` and the `prefers-color-scheme` media query. `prefers-color-scheme` reflects the OS settings — regardless of the `color-scheme` value. If you're providing an in-page toggle that implements dark mode, you can't adopt the `prefers-color-scheme` media query.

The following code is not be impacted by `color-scheme`:

```html
<picture>
  <source srcset="logo-dark.png" media="(prefers-color-scheme: dark)" />
  <source srcset="logo-light.png" media="(prefers-color-scheme: light)" />
  <img src="logo-light.png" alt="Product logo" />
</picture>
```

Other than making use of a `background-image`, there's sadly not an equivalent approach to the `<picture>` element that references the `color-scheme`. 

There are two exceptions where `color-scheme` will affect the `prefers-color-scheme` media query:

- iframes
- SVG

Below are two iframes that show the same document. The document inside the iframe is making use of the `prefers-color-scheme` media query.

```html
<iframe style="color-scheme: light;" src="/example.html"></iframe>
<iframe style="color-scheme: dark;" src="/example.html"></iframe>
```
<iframe style="color-scheme: light;" src="/example.html" ></iframe>
<iframe style="color-scheme: dark;" src="/example.html" ></iframe>

As you can see in the above example, the `@media (prefers-color-scheme: dark)` styles are being applied when `color-scheme: dark` is used in the parent document.

The same principle applies to SVG. Here's the content of an `.svg` file:

```html
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<style>
circle {
    fill: rgb(40,40,40);
}

@media (prefers-color-scheme: dark) {
    circle {
        fill: rgb(216, 216, 216);
    }
}
</style>
  <circle cx="50" cy="50" r="50" />
</svg>
```

```html
<img style="color-scheme: light;" src="/circle.svg" alt="">
<img style="color-scheme: dark;" src="/circle.svg" alt="">
```

<img style="color-scheme: light;" src="/circle-icon.svg" alt="">
<img style="color-scheme: dark;" src="/circle-icon.svg" alt="">

#### Some Safari caveats

- Support for the `prefers-color-scheme` media query within SVG was added in [Safari 27](<https://developer.apple.com/documentation/safari-release-notes/safari-27-release-notes?changes=la,la#:~:text=175598175)-,Fixed%20an%20issue%20where,the%20system%20color%20appearance,-.%20(176413340>), but `color-scheme` does not affect the media query ([see bug report](https://bugs.webkit.org/show_bug.cgi?id=316640))
- Support for the `prefers-color-scheme` media query within iframes was added in [Safari 27](<https://developer.apple.com/documentation/safari-release-notes/safari-27-release-notes?changes=la,la#:~:text=140674753)-,Fixed%20an%20issue%20where,was%20set%20to%20dark,-.%20(142072593>) and the `color-scheme` of the parent document does override it, as it should 🎉. However, other bugs remain ([see bug report](https://bugs.webkit.org/show_bug.cgi?id=316680))

## Using `light-dark()` with images and gradients

The `light-dark()` function was originally limited to colors. It can now be used for gradients and images (as of Chrome/Edge version 150, Firefox version 150, and a forthcoming version of Safari). 

```css
.bg-gradient {
  background-image: light-dark(linear-gradient(15deg, #b9b6ff, #308dc6), linear-gradient(15deg, #6b7495, #001339)); 
}
```

```html
<div class="bg-gradient" style="color-scheme: light;"></div>
<div class="bg-gradient" style="color-scheme: dark;"></div>
```

<div class="bg-gradient" style="color-scheme: light;"></div>
<div class="bg-gradient" style="color-scheme: dark;"></div>

It's also possible to switch between a single solid color and a gradient, depending on the `color-scheme`.

```css
.bg-grad-solid {
    background-image: light-dark(linear-gradient(15deg, #b9b6ff, #308dc6), image(#001339)); 
}
```

<div class="bg-grad-solid" style="color-scheme: light;"></div>
<div class="bg-grad-solid" style="color-scheme: dark;"></div>

### Images

```css
.bg {
    background-image: light-dark(url(/lightmode.avif), url(/darkmode.avif));
}
```

<div class="flex">
<button onclick="target.style.colorScheme = 'light'">Light</button>
<button onclick="target.style.colorScheme = 'dark'">Dark</button>
<button onclick="target.style.colorScheme = 'light dark'">System</button>
</div>

<div id="target" style="background-color: Canvas; color: CanvasText; padding: 16px;">

<div class="bg" style="margin-inline: auto; border-radius: 6px; height: 200px; max-width: 100%; aspect-ratio: 1; background-repeat: no-repeat; background-size: cover; background-image: light-dark(url(/lightmode.avif), url(/darkmode.avif)); background-position: center;">
</div>

</div>

<script>
    const target = document.getElementById('target');
</script>

## Changing more than colors, images and gradients

By and large, the thing you need to change between modes is color, but there are exceptions. A `box-shadow` might not be visible on a dark background in dark mode, so you may decide to apply a border instead, for example. Implementing that is currently rather challenging. The CSS standards body is planning to add a way to [detect the current color-scheme](https://github.com/w3c/csswg-drafts/issues/10577#issuecomment-3329616811) using either a CSS `if()` statement or a style query, but no browser has implemented this feature. It's possible to hack together an alternative, but I'm not sure I'd recommend this approach. 

Define a CSS variable to be true when the page is using dark mode: 

```css
html {
    --dark: false;
} 

html:has([content="light dark"]) {
 @media (prefers-color-scheme: dark) {
    --dark: true;
 }
}

html:has([content="dark"]) {
    --dark: true;
}
```

All browsers now support style queries, which allow you to apply styles depending on the value of a custom property:

```css
@container style(--dark: false) {
.card {
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
}
}

@container style(--dark: true) {
  .card {
    border: solid 1px rgb(94, 94, 94);
  }
}
```

## A (possible) future: overriding `prefers-color-scheme` via JS
 
We might get a way to override the `prefers-color-scheme` media query with JavaScript in the future. There's a [spec](https://drafts.csswg.org/mediaqueries-5/#script-control-user-prefs) but no browser has implemented it yet.

<!-- ## More than light/dark?

Some websites offer more than a binary choice between light/dark/system. Twitter offers both “dim” dark mode and a super-dark “lights out” mode. GitHub goes even further with a whole multitude of options (I’d hate to be a designer on GitHub.com with all of that to think about!) If you want to offer more choices than light/dark/system, `light-dark()` can’t help you. -->
