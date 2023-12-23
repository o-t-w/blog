---
pubDate: 'Jun 02 2023'
title: An introduction to @scope in CSS
tags:
  - CSS
heroImage: "/scope.png"
description: Style based on proximity and set a lower boundary for a selector.  
---

In January 2019 I raised an issue in the W3C CSS GitHub titled [*Please bring back scoped styles*](https://github.com/w3c/csswg-drafts/issues/3547). There had once been a `scoped` HTML attribute but it got deprecated. It’s been replaced by `@scope` in CSS. Browser support is still forthcoming. It’s due to land in [Chrome 117](https://chromestatus.com/feature/5100672734199808). Safari has a [positive position](https://github.com/WebKit/standards-positions/issues/13) on the specification. 

There are two selling points of `@scope`: styling based on proximity and setting a lower boundary for a selector.  

## Style based on proximity

Rather than just relying on source order and specificity, we now have the option to override styles based on proximity. Guess what color the button will be in the following examples:

```css
@scope (.blue) {
    button {
        background-color: blue;
    }
}
    
@scope (.green) {
    button {
      background-color: green;
    }
}
    
@scope (.red) {
    button {
      background-color: red;
    }
}
```

Example 1:
```html
<div class="red">
    <div class="green">
        <div class="blue">
            <button>Click</button>
        </div>
    </div>
</div>
```

Example 2:
```html
<div class="blue">
    <div class="green">
        <div class="red">
            <button>Click</button>
        </div>
    </div>
</div> 
```
Answer: just look to the nearest ancestor. In example 1 the button is blue. In example 2 the button is red. (If you are on Chrome Canary you can see the [CodePen example](https://codepen.io/cssgrid/pen/dygxNpv)).

Let’s look at a real world use case. `@scope` solves a problem I encountered back when working at the British phone network giffgaff. We had what we called [“themes”](https://www.giffgaff.design/design-fundamentals/themes/) — not light and dark themes that changed according to user preferences, but rather classes for styling different sections of a page with a particular color scheme. To ensure enough color contrast for easy readability, the link text color was dark blue when on a light background and light blue on a dark background. This saved us having to put a class on every single link, which would be tedious and prone to inconsistency. 

```css
.theme-white {
  background-color: white;
  color: black;
  }

.theme-white a {
  color: #00528a;
}

.theme-black {
  background-color: black;
  color: white;
}

.theme-black a {
  color: #35adce;
}
```
This worked well enough, but had one problem: nesting. CSS doesn’t look to the nearest HTML ancestor to know which style to apply — it just goes by the source order in your CSS file. Depending on the order in which you’ve defined your styles, if you nest a white section in a black section, or nest a black section in a white section, the link won’t be the correct color anymore. There was really no solution to this issue prior to `@scope`.

```html
<div class="theme-white">
  <a href="example.com">This link is the correct color</a>
</div>
    
<div class="theme-black">
  <a href="example.com">This link is the correct color</a>
    
  <div class="theme-white">
    <a href="example.com">This link is the wrong color</a>
  </div>
         
</div>
```

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="ZEqgeWB" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/ZEqgeWB">
  Nesting issue when relying on source order</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

With `@scope` we can solve this issue:

```css
.theme-white {
   background-color: white;
   color: black;
 }
    
.theme-gray {
   background-color: #f5f5f5;
   color: black;
 }
    
@scope (.theme-white, .theme-gray) {
  a {
    color: #00528a;
  }
}
    
.theme-black {
  background-color: black;
  color: white;
}
    
@scope (.theme-black) {
  a {
    color: #35adce;
  }
}
```
Now whenever a link is on a white or gray background it’ll be dark blue. Whenever it’s on black background it’ll be a brighter lighter blue. 

We could optionally rewrite the previous CSS to use the `:scope` pseudo-class which references the root of the current scope. In the following example `:scope` would select any element that has a `.theme-black` class. 

```css
@scope (.theme-black) {
   :scope {
     background-color: black;
     color: white;
   }         
   a {
     color: #35adce;
   }
}
```

[`:scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/:scope) isn’t a new pseudo-class. Its been in browsers for years but was previously pretty pointless when used in a stylesheet because outside of a `@scope` block it always means the same as `:root` (which selects the root element of the document — the `<html>` element). 

## Set a lower boundary for a selector

Sometimes you want to style a component without styling certain things that are nested inside of it. 

Miriam Suzanne, a co-author of the scope specification, appeared on the [Syntax podcast](https://syntax.fm/show/362/css-container-queries-layers-scoping-and-more-with-miriam-suzanne) a few years ago to talk about @scope:
“A tabs component has all these holes wherever your putting content in the tab. You don’t want the tab component to style the content, you just want it to style the tabs… We have descendent selectors where you can say anything inside of tabs but that’s not what we want. We want anything inside of tabs until you get to tab content. We want to be able to set a lower boundary on that selector.”

Let’s take a look at the syntax:

```css
@scope (.component) to (.content) {
  p {
    color: red;
  }
}
```
The second selector sets a lower boundary — i.e. *stop styling from this point*. 

```html
<div class="component">
    
  <p>In scope.</p>
  
  <div class="content">
    <p>Out of scope.</p>
  </div>
  
</div>
```
If you have a paragraph within `.content`, it won’t be selected (if you have a browser that supports `@scope` you can look at the [CodePen example](https://codepen.io/cssgrid/pen/abRepXJ)).

A `@scope` can have as many “holes” as you want:

```css
@scope (.component) to (.content, .slot, .child-component) {
  p {
    color: red;
  }
}
```

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="eYPqvVE" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/eYPqvVE">
  Multiple holes</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Further reading

You can read more about scope in the [Cascading and Inheritance Level 6 spec](https://drafts.csswg.org/css-cascade-6/#scoped-styles). 

