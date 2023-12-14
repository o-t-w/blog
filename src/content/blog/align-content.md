---
author: Ollie Williams
pubDatetime: 2023-12-14T10:22:00Z
title: Easy centering without display: flex
postSlug: easy-centering
featured: false
draft: false
tags:
  - CSS
ogImage: "/assets/easy-centering.png"
description: align-content: center for display: block
---

Its currently not uncommon to see `display: flex` applied to just about everything. The addition of flexbox to CSS made vertical centering significantly easier. Now that power has come to `display: block`. `display: block` is the default value of the ubiquitous <div> element. Its handy to be able to center things without the need to write any additional CSS to change this default display value.

If all we need it vertical centering, instead of 

```css
.some-div {
  display: flex;
  align-content: center;
}
```

we can use the slightly terser:

```css
.some-div {
  align-content: center;
}
```

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="mdvYZma" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/mdvYZma">
  align-content: center with display: block;</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

I'm a fan of keeping CSS as pruned and minimal as possible, so this is a nice addition to how layout works on the web.

As of December 2023, this works in Safari Technology Preview and Chrome Canary. 