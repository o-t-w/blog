---
author: Ollie Williams
pubDatetime: 2023-05-19T15:22:00Z
title: Using linear() for better animation
postSlug: linear
featured: true
draft: false
tags:
  - animation
  - Web Animation API
  - CSS
ogImage: "/assets/linear.png"
description: Using the linear() easing function with CSS transitions, animations and the JavaScript Web Animations API
---

When working with a `@keyframes` CSS animation, a CSS transition, or the Web Animations API in Javascript, we’ve long been able to specify an easing as either a cubic bezier, a keyword like `ease-in`, or a step function. 

An easing function has typically looked something like this:

![](/assets/chrome-editor.png)

By contrast a `linear()` easing function interpolates linearly between *multiple points*, so can look like this:

![](/assets/firefox-editor.png)

The `linear()` function allows us to achieve bounce, spring, and elastic effects that were previously only possible with complex JavaScript. You can use `linear()` to specify a value for the CSS `transition-timing-function` property, `animation-timing function` property, or as an `easing` value when using the Web Animations API in JavaScript.

MDN [explains the syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function#linear_easing_function): 
 `linear(0, 0.25 75%, 1)` produces a linear easing function that spends 75% of the time transitioning from `0` to `.25` and the last 25% transitioning from `.25` to `1`.”

A more real-world example looks like this: 
 
```css
animation-timing-function: linear(0, 0.218 2.1%, 0.862 6.5%, 1.114, 1.296 10.7%, 1.346, 1.37 12.9%, 1.373, 1.364 14.5%, 1.315 16.2%, 1.032 21.8%, 0.941 24%, 0.891 25.9%, 0.877, 0.869 27.8%, 0.87, 0.882 30.7%, 0.907 32.4%, 0.981 36.4%, 1.012 38.3%, 1.036,1.046 42.7% 44.1%, 1.042 45.7%, 0.996 53.3%, 0.988, 0.984 57.5%, 0.985 60.7%,1.001 68.1%, 1.006 72.2%, 0.998 86.7%, 1);
```

**I don’t see myself ever writing one of these by hand.**

Luckily Jake Archibald created the [Linear Easing Generator](https://linear-easing-generator.netlify.app/). The generator can convert a JavaScript or SVG easing definition into `linear()` syntax. I’ve never written a JavaScript of SVG easing definition — thankfully the generator has presets for the most typical effects: bounce, elastic and spring, as well as a [“Material design”](https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration) easing. 
 
You can copy and paste them into your codebase, store them as CSS variables, and use them throughout your project. 

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="BaqVRwr" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/BaqVRwr">
  linear() easing function</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

If you do want to finesse an easing by hand, Firefox devtools is helpful. Double-click anywhere on the curve to add a point. Double-click a point to remove it. Be aware that if you’re using a CSS variable to specify the value, the Firefox easing editor won’t be available. 

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">We added an editor that let you easily craft your easing function<br><br>Double-click on a point to remove it, double-click anywhere else to add a new one<br>Holding shift will snap points to the grid<br><br>All your changes are reflected back to the rule view 🪄<a href="https://twitter.com/hashtag/animation?src=hash&amp;ref_src=twsrc%5Etfw">#animation</a> <a href="https://twitter.com/hashtag/webdevelopment?src=hash&amp;ref_src=twsrc%5Etfw">#webdevelopment</a> <a href="https://t.co/0VpdoVUP0i">pic.twitter.com/0VpdoVUP0i</a></p>&mdash; Firefox DevTools (@FirefoxDevTools) <a href="https://twitter.com/FirefoxDevTools/status/1636315988378435584?ref_src=twsrc%5Etfw">March 16, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


## Web Animations API

You can define an easing once as a JavaScript variable then use it on any number of animations. 

```js
const elastic = 'linear(0, 0.218 2.1%, 0.862 6.5%, 1.114, 1.296 10.7%, 1.346, 1.37 12.9%, 1.373, 1.364 14.5%, 1.315 16.2%, 1.032 21.8%, 0.941 24%, 0.891 25.9%, 0.877, 0.869 27.8%, 0.87, 0.882 30.7%, 0.907 32.4%, 0.981 36.4%, 1.012 38.3%, 1.036,1.046 42.7% 44.1%, 1.042 45.7%, 0.996 53.3%, 0.988, 0.984 57.5%, 0.985 60.7%,1.001 68.1%, 1.006 72.2%, 0.998 86.7%, 1)';
```

Or if you already defined the easing as a CSS variable, you could grab it with JavaScript:
```js
const elastic = getComputedStyle(document.documentElement).getPropertyValue('--elastic-easing'); 
```
You can then use it as the value for `easing`:
```js
    const div = document.querySelector("div");
    div.animate(
      [
        { transform: "translateY(100px)" }, 
        { transform: "translateY(0px)" }
      ],
      {
        duration: 2000,
        iterations: Infinity,
        easing: elastic,
        fill: "forwards",
        delay: 1000,
      }
    );
```

<p class="codepen" data-height="300" data-default-tab="js,result" data-slug-hash="PoyxWmj" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/PoyxWmj">
  linear() Web Animation API example</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

If you want to hear more, check out this YouTube video from Google developer advocate Bramus Van Damme.

<iframe style="max-width: 100%;" width="560" height="315" src="https://www.youtube.com/embed/oDcb3fvtETs?start=721" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


## Browser support
The `linear()` easing function is currently implemented in Chromium-based browsers and Firefox. The Safari [position on the proposal](https://github.com/WebKit/standards-positions/issues/130) is positive.
