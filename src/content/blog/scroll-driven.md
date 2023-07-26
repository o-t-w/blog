---
author: Ollie Williams
pubDatetime: 2023-07-26T15:22:00Z
title: Scroll-driven animation with CSS
postSlug: scroll-driven-animation
featured: false
draft: true
tags:
  - CSS
  - Animation
ogImage: "/assets/scrolldriven.png"
description: Animating on scroll without JavaScript
---

Scroll-based animation has been a staple of Awwwards-style marketing and agency portfolio sites for over a decade. There are dozens of JavaScript libraries for scroll-driven and scroll-triggered animation. There’s [Lenis](https://lenis.studiofreight.com/), [Sal](https://github.com/mciastek/sal), [AOS](https://github.com/michalsnik/aos) (Animate on Scroll), [ScrollReveal](https://github.com/jlmakes/scrollreveal), [ScrollMagic](https://github.com/janpaepke/ScrollMagic), [Locomotive Scroll](https://locomotivemtl.github.io/locomotive-scroll/),  and [ScrollTrigger](https://greensock.com/scrolltrigger/) from GreenSock. There are React-specific libraries like [Scrollytelling](https://github.com/basementstudio/scrollytelling). [Framer Motion](https://www.framer.com/motion/scroll-animations/), perhaps the most popular React animation library, also provides utilities for scroll-based animation. Now, a lot of that power can be achieved with CSS. 

## Browser support

Scroll driven animations are supported in Chrome 115. Firefox has a [positive position](https://github.com/mozilla/standards-positions/issues/347) on the standard and are working on an implementation. Safari has also expressed a [positive position](https://github.com/WebKit/standards-positions/issues/152). 

## The basics 

Instead of giving a `@keyframes` animation a duration we give it a timeline. There are two different kinds of timeline: 

- A **scroll timeline** where the progress of the animation is linked to the scroll position of either the page itself or any element that has a scrollbar. 
- A **view timeline** where the animation is linked to a specified element moving across the viewport (or its scroll container).  


## View timeline

“A View Progress Timeline begins from the moment a subject starts intersecting with the scroller and ends when the subject stops intersecting the scroller. In the following visualization, you can see that the progress starts counting up from 0% when the subject enters the scroll container and reaches 100% at the very moment the subject has left the scroll container.”
Sometimes that’s what you want, but you can change this default to show the animation when the element is entering the viewport or leaving the viewport, for example. 
The following code will fade out any image once 30% of the image has been scrolled off the page. 

```css
@keyframes fadeout {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

img {
    object-fit: cover;
    animation-name: fadeout;
    animation-duration: auto;
    animation-timeline: view();
    animation-fill-mode: both;
    }
```

`animation-delay` is time based, so unsurprisingly doesn’t work with scroll driven animations. Something vaguely equivalent is `view-timeline-inset`.

## Animate an element based on the view timeline of another element

Sometimes it’s useful to animate an element based not on its own view timeline, but that of another element. In the following example a creature falls from the sky and lands on the ground. I wanted the animated to depend on the view of the background.

```css
.chinpokomon-background {
        background-image: url("videogamebg.png");
        view-timeline: --scene;
    }

.chinpokomon-creature {
        animation-timeline: --scene;
        animation-range: entry 0% entry 100%;
        animation: fall linear both;
        }
```

In the previous example the element being animated is a child of the element thats acting as the timeline. Sometimes that won’t be the case. In the following example I wanted to animate the `<h1>` when the image was exiting the viewport. You can achieve this with the `timeline-scope`
property. Set the `timeline-scope` property on an ancestor that contains both the element you want to animate and the element that provides the timeline. The value needs to match the value used for both the `view-timeline-name` and the `animation-timeline`.

```css
.parent {
        timeline-scope: --imageTimeline;
    }
    
    img {
     view-timeline: --imageTimeline block;
    }
    
    h1 {
      animation: fadeOut linear both;
      animation-timeline: --imageTimeline;
    }
```

https://codesandbox.io/s/view-timeline-demo-gk5w97


If you’re going to animate a parent based on the view of a child you need to use `timeline-scope` on the parent. In the following example the `background-color` of the HTML element is animated once some emoji are scrolled into view.  


https://codesandbox.io/s/dreamy-mountain-hhky6q?file=/index.html

## `animation-range` for a `view()` timeline

The following animation will start as soon as a single pixel of the element has entered the viewport, and the entire animation will be finished once the element is fully visible. 

```css
animation-range: entry 0% entry 100%;
```

start the animation once the element has started to be scrolled off of the screen. 

```css
animation-range: exit 0% exit 100%;
```

The following animation will only start once the element is fully visible and will complete just before the element is about to be scrolled out of the viewport. 

```css
animation-range: entry 100% exit 0%;
```

There’s also `entry-crossing` and `exit-crossing`. If the height of the element is smaller than the height of the viewport, they act the same as `entry` and `exit`. But what if the element is taller than the viewport? With `entry 0% entry 100%` the whole animation will be finished once the element fills the height of the screen, even though there is still more of the element that hasn’t been scrolled over yet. If you want the animation to continue while you’re still scrolling over that element, `entry-crossing 0% entry-crossing 100%` is what you need.  

## Different `animation-range` values for different animations

If we have multiple keyframe animation that we want to run at different times, we can set multiple comma-seperated values for `animation-range`. In this example the rotate animation plays as the element enters the viewport and the fade animation runs as the element exits the viewport. 

```css
animation-timeline: view();
animation-name: rotate, fade;
animation-range: entry, exit;
```

[Codepen](https://codepen.io/cssgrid/pen/KKrmvQE)

## insets for a `view()` timeline

Closely related to the `animation-range` property is the ability to offset the point at which an animation will start.
Given the following code, the animation will start once 100px of the element have entered the viewport:  

```css
animation-range: entry;
animation-timeline: view(block 100px);
```

Which is equivalent to:

```css
animation-range: entry 100px;
animation-timeline: view(block);
```

The inset is defined for the timeline itself, whereas the `animation-range` is set for a specific animation. If multiple animations use the same timeline, the inset will effect all of them.

An single element can define multiple timelines with different insets for each, but I doubt that’s something you’d need to do very often. 

```css
.parent {
      view-timeline: --timeline1, --timeline2;
      view-timeline-inset: 200px, 100px;
      justify-content: center;
    }
    
.inner1 {
    animation-timeline: --timeline1;
    animation-name: changeColor;
}

.inner1 {
    animation-timeline: --timeline2;
    animation-name: spin;
}
```

## Set different animations to use different timelines of the same element

```css
animation-name: fadeIn, rotate;
animation-timeline: --icon1, --menu;
```

## Different inset values

`view-timeline-inset`
What if you want to use a particular `view-timeline-inset` value for one animation, and a different inset value for another? The same element can have multiple view timelines, and each timeline can have a different inset. 


```css
view-timeline: --entry block, --exit block;
view-timeline-inset: 100px, -100px;
animation-name: rotate, fade;
animation-timeline: --entry, --exit;
```

https://codepen.io/cssgrid/embed/JjeNrGJ


It’s a pretty complicated approach. You can usually more easily achieve what you need with `animation-range`. The equivalent of the above code could have been achieved with:


    animation-range: entry 100px, exit 100px;
## `animation-range` for a `scroll()` timeline

Sometimes I want to animate a fixed position element. A `view()` timeline won’t be very useful for animating a fixed element because the element is effectively *always* in view. Here’s an example of reusing the same `@keyframes` animation on multiple fixed elements, but having them animate in an out at different times by setting a different `animation-range`. 


```css
[class^="fixed-thing"] {
    position: fixed;
    animation-name: appear;
    animation-fill-mode: both;
    animation-timeline: scroll();
}

.fixed-thing-1 {
    animation-range: 0% 100vh;
}
.fixed-thing-2 {
    animation-range: 90vh 200vh;
}
```

https://codesandbox.io/s/blue-butterfly-sfr7kj?file=/styles.css:212-428

## Combining scroll-driven animation with CSS scroll snap

You can combine scroll animations with CSS scroll snapping but the time it takes to scroll from section to section is so brief that the animation looks almost instant. Scroll triggered animations are a better option.
[CodePen](https://codepen.io/cssgrid/pen/WNYjLYL?editors=1100)

## Scroll triggered animations with `animationend`

The spec that introduces all this new CSS, and the title of this article, is Scroll-*driven* Animation — the animation progresses as you scroll. That’s different from scroll *triggered* animations which are time based with a set duration but don’t start playing until a user scrolls to a certain point. When combined with a tiny bit of JavaScript it’s possible to use a CSS view timeline to trigger time-based animations. You could previously do this using the Intersection Observer API in JavaScript but I always found that hard to work with. 

Both `animationend` and `animationstart` work for view timelines (but not for scroll timelines).

You can set a scroll driven animation that doesn’t actually do anything, just so that you have an `animationstart` event to listen for. Example: animate from `opacity: 1` to `opacity: 1`


```css
@keyframes fakeAnimation {
    to {
    opacity: 1;
    }
}
```

https://codepen.io/cssgrid/embed/NWEjQWw


You can play the same animation multiple times at different animation ranges:

```css
animation-name: fake, fake;
animation-timeline: view();
animation-range: entry, exit;
```

We can then use either `animationstart` or `animationend` events to toggle a class on the element.

```js
document.querySelectorAll('.content').forEach(element => {
    element.addEventListener('animationend', function(event) {
    event.target.classList.toggle('fadeOn');
    });
});
```

Better ways to achieve this might be added as [web standards](https://twitter.com/bramus/status/1679200272923389960?s=20) in the future. 

## `animation-iteration-count` has no effect

`animation-iteration-count` has no effect on a scroll-driven animation. If you want an initial animation that runs only once, for an element using a `view()` timeline something like the following works:

```js
document.querySelector('.rand').addEventListener('animationend', (event) => {
    event.target.classList.remove('animate');
}, { once: true });
```
## Some more examples

The code for animating a 3D object is taken from this [article by Bramus](https://www.bram.us/2023/06/21/synchronize-videos-3d-models-to-scroll-driven-animations/).


## Further reading

There’s also a JavaScript API but this article is long enough already. Bramus covers both the CSS and JavaScript API over on the [Chrome Developer website](https://developer.chrome.com/articles/scroll-driven-animations/).