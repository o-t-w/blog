---
pubDate: 'Dec 04 2025'
title: Inheriting sibling-index() for staggered animation
heroImage: "/staggered.png"
description: "Register your custom property with @property "
---

<style>
    @property --i {
  syntax: "<integer>";
  inherits: true;
  initial-value: 1;
}

.index-example-grid {
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(3, 1fr); 
  margin-inline: auto;
  width: 100%;
}

body {
    min-height: 100vh;
    align-content: center;
}

.item {
    --i: calc(sibling-index() - 1);
    background-color: rgb(235, 235, 235);
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
}

.inner {
    max-width: 70%;
    max-height: 70%;
    position: absolute;
    inset: 0;
    margin: auto;
    filter: drop-shadow(4px -1px 6px rgba(0, 0, 0, .25));
    animation: enter 1s both;
    animation-delay: calc(var(--i) * 0.1s);
    animation-timing-function: var(--timing);
    transform: translateZ(0); /* Fix Safari bug */
}

@keyframes enter {
    0% {
        translate: 0 180px;
    },
    100% {
        translate: 0 0;
    }
}

:root {
    --timing: linear(
    0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017,
    1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%,
    1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%,
    0.997 69.8%, 1.003 76.9%, 1.004 83.8%, 1
  );
}
</style>

<div class="index-example-grid">
    <div class="item"><img src="/blobmagician.avif" alt="" class="inner"></div>
    <div class="item"><img src="/angelblobemoji.avif" alt="" class="inner"></div>
    <div class="item"><img src="/blobballoon.avif" alt="" class="inner"></div>
</div>

One primary use case for `sibling-index()` is staggered animations. In the above example, the images I'm animating aren't siblings, but their parents are. CSS variables are inherited by default, so I assumed the following code would just work: 

```css
.item {
    --i: calc(sibling-index() - 1); /* minus 1 because I don’t want any delay on the first animation. */ 
}

.item .inner {
    animation-delay: calc(var(--i) * 0.1s);
}
```

Turns out I needed to register the custom property to make this work as expected:

```css
@property --i {
  syntax: "<integer>";
  inherits: true;
  initial-value: 1;
}
```