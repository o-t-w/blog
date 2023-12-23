---
pubDate: 'May 24 2023'
title: Changing inline styles with JavaScript
tags:
  - CSS
  - JavaScript
heroImage: "/inline-styles.png"
description: Use the Typed OM and older APIs to get, delete and add inline styles using JavaScript.  
---

This is part of a series of articles about modern approaches to manipulating CSS with JavaScript:
- Part one: Inline styles (this article)
- Part two: Custom Properties
- Part three: Stylesheets (coming soon!)

There are multiple approaches to manipulating inline styles with JavaScript. One has been around for over a decade. Another is the Typed OM. The initial spec for Typed OM was released in 2016. Chrome shipped in [2018](https://developer.chrome.com/blog/new-in-chrome-66/#cssom). Safari shipped in version [16.4](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes#:~:text=Added%20support%20for%20CSS%20Typed%20OM.). Firefox has a [positive view of the proposal](https://mozilla.github.io/standards-positions/#css-typed-om) but has not implemented Typed OM yet. In this article I’m going to compare the different approaches.

The following examples assume we have the following element in our HTML:

```html
<p style="width: 200px;">Lorem ipsum</p>
```

And we’ve selected the element with JavaScript:

```javascript
const p = document.querySelector('p');
```

## Remove an inline style
```javascript
p.style.width = "";
```

With the Typed OM:
```javascript
p.attributeStyleMap.delete('width');
```

## Remove all inline styles
```javascript    
p.style = "";
```

With the Typed OM:
```javascript
p.attributeStyleMap.clear();
```

## Add or override an inline style
```javascript
p.style.width = "50%";
```
This is a simple syntax to remember. CSS values that contain a dash need to use camelCase. So if we were setting the CSS `min-width` property we would write `minWidth`:
```javascript
p.style.minWidth = "50%";
```
Alternatively we can use `style.setProperty()`. Because we specify the property as a string, we write `min-width` rather than `minWidth`
```javascript
p.style.setProperty('min-width', '50%');
```
With the Typed OM:
```javascript
p.attributeStyleMap.set('min-width', CSS.percent(50));
```
The Typed OM introduces a large amount of new syntax. In the above example I’m setting a percent value but there’s an equivalent syntax for [just about any CSS unit](https://www.w3.org/TR/css-typed-om-1/#numeric-factory): `CSS.px()`, `CSS.em()`, `CSS.rem()`, `CSS.vw()` etc. There’s also `CSS.number()` for setting things like `z-index`. If you need a keyword value like `auto` or `block`, there’s `new CSSKeywordValue`:
```javascript
p.attributeStyleMap.set('display', new CSSKeywordValue('none'));
```
While it’s probably not the recommended approach, setting the value with a string does also work:

```javascript
p.attributeStyleMap.set('width', '50%');
```

## Add an `!important` inline style

What if you need the inline style to override a style that’s using `!important`?

With `attributeStyleMap.set` there isn’t a way to make the style `!important`. Equally the following code would **not** work: `p.style.minWidth = "50% !important";`

The only option for an `!important` inline style is `setProperty()`. You specify the style as important with an optional third argument. Note that unlike in CSS, you don’t include the exclamation mark at the front: 
```javascript
p.style.setProperty('min-width', '50%', 'important');
```
## Get inline styles
```javascript
p.style.width;
```
This will return the width as a string (e.g. `'200px'`). If an inline style has not been set for the particular property, an empty string will be returned. 

With the Typed OM:
```javascript
p.attributeStyleMap.get('width');
```

If an inline style has not been set for the particular property, null will be returned. 

If you need to do maths using the value, Typed OM is a better option. Rather than returning a string it will return the value as a number and the unit separately `{value: 200, unit: 'px'}`.

`attributeStyleMap` will return the value using whatever unit was used to define it in CSS. So if your inline style was `style="width: 50vmin;"` the result would be `CSSUnitValue {value: 50, unit: 'vmin'}`. If you used the keyword value `auto`, you’d get back `CSSKeywordValue {value: 'auto'}`. 

## Conclusion

Articles and tweets from various Google employees claim the Typed OM API is faster than the older method. 

Eric Bidelman [writes](https://developer.chrome.com/authors/ericbidelman/):
“The browser has to do less work serializing and deserializing string values. Now, the engine uses a similar understanding of CSS values across JS and C++.“

Here’s Alex Russell of Microsoft Edge:

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">The cool thing about the Typed OM is that we avoid the JS object -&gt; string -&gt; parse loop. That actually often involves a UCS2 -&gt; UTF8/16 conversion when you do:<a href="https://t.co/BBmMlig2kG">https://t.co/BBmMlig2kG</a>.width = &quot;10px&quot;;<br><br>This is MUCH cheaper:<br><br>n.attributeStyleMap.set(&quot;width&quot;, CSS.px(10));</p>&mdash; Alex Russell (@slightlylate) <a href="https://twitter.com/slightlylate/status/1517191892445802500?ref_src=twsrc%5Etfw">April 21, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I can’t say I’ve ever noticed performance issues when applying a style with JavaScript the old fashioned way, but if you’re continuously updating a style with `requestAnimationFrame`, for instance, it might make a noticeable difference.

