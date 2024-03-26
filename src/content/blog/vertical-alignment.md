---
pubDate: 'Dec 23 2023'
title: Easy vertical alignment without flexbox
tags:
  - CSS
heroImage: "/easy-centering.png"
description: Easy vertical alignment with display block
---

It is common to see `display: flex` applied to just about everything. The addition of flexbox to CSS made vertical alignment significantly easier. Until now, the `align-content` CSS property only worked with flexbox and CSS grid. Now that power has come to `display: block`. `display: block` is the default value of the ubiquitous `<div>` element. Its handy to be able to center things without the need to write any additional CSS to change this default value.

If all we need is vertical centering, instead of:

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

This isn't just about saving a line of code. It's been common to use flexbox purely to center things, but flexbox also has other effects. Flexbox expands items to fill the available free space. This is often not what you want. Flexbox will also force items to line up in a row, even if they have a display value of `block`.That's often useful, but not always. One limiting factor of this new approach to centering is that we can't use the `gap` property as it only works with `display` values of `grid` or `flex`, but margins still work well enough.

`align-content` now also works for elements with a `display` of `table-cell` or `list-item`:

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="gOqVwBP" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/gOqVwBP">
  Untitled</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Browser support
`align-content` in `block` layout is supported as of [Chrome 123](https://chromestatus.com/feature/5159040328138752), [Safari 17.4](https://developer.apple.com/documentation/safari-release-notes/safari-17_4-release-notes#CSS), and [Firefox 125](https://www.mozilla.org/en-US/firefox/125.0a1/releasenotes/#:~:text=align%2Dcontent%20works%20now%20in%20block%20layout%2C%20allowing%20block%20direction%20alignment%20without%20needing%20a%20flex%20or%20grid%20container.).
