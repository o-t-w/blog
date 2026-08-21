---
pubDate: 'Aug 19 2026'
title: Highlighting a range of text inside an input or textarea
heroImage: "/opaquerange.jpg"
description: Using OpaqueRange and the Custom Highlight API
---

<style>
    .box {
        padding: 16px;
        background-color: blue;
        background-color: #f3f3ff;
        margin-trim: block;
        border-radius: 8px;
        h2 {
            color: rgb(46, 46, 46);
            font-size: 18px;
        }
        p {
            font-size: 16px;
        }
    }
</style>

This article will cover using the `OpaqueRange` API together with the Custom Highlight API to style a section of text inside a `textarea` or `input`.

<div class="box">
<h2>Browser support</h2>
<p>The CSS Custom Highlight API is supported in all browsers. The OpaqueRange API is supported in Microsoft Edge, Google Chrome and other Chromium-based browsers since version 152.
</p>
</div>

## What is the Custom Highlight API?

The Custom Highlight API is a way to style a range. A range is a way of pointing at a stretch of content by specifying a start and end point using JavaScript.

You can create a highlight from a [`Range`](https://developer.mozilla.org/en-US/docs/Web/API/Range), a [`StaticRange`](https://developer.mozilla.org/en-US/docs/Web/API/StaticRange), or, as is the topic of this article, an `OpaqueRange`:

```js
// TODO: create someExampleRange
const myHighlight = new Highlight(someExampleRange);
```

The highlight then needs to be registered into the highlight registry:

```css
CSS.highlights.set("yellow", myHighlight);
```

The highlight can then be styled using the CSS `::highlight` pseudo element:

```css
::highlight(yellow) {
    background-color: yellow;
}
```

A `Range` or a `StaticRange` are used to represent a range of content in the DOM. For example, they can be used to highlight some words in a paragraph without needing to wrap those words in a `<mark>` or `<span>` element:

<p id="p">This is some <i id="start">example</i> <b id="fin">text</b> inside a paragraph.</p>

`Range` and `StaticRange` cannot be used to highlight text inside an `input` or `textarea` (although they do work for elements that make use of the `contenteditable` attribute). Hence why we need `OpaqueRange`.

<script type="module">
const range = new Range();
range.setStart(p.firstChild, 8);
range.setEnd(fin.firstChild, fin.firstChild.length);

const basic = new Highlight(range);
CSS.highlights.set("yellow", basic);
</script>

## What is an OpaqueRange?

An `OpaqueRange` represents a portion of text within a form control's value. 
An `OpaqueRange` object is created by calling `.createValueRange()` on either of the following elements:
- `<textarea>`
- an `<input>` with a `type` of `text`, `password`, `search`, `tel` or `url`. 

The following example would create an `OpaqueRange` from the first 4 letters of the input's value:

```js
const input = document.querySelector('input[type="text"]');
const myOpaqueRange = input.createValueRange(0, 4);
```

There are important use cases for the OpaqueRange API that don't involve the Custom Highlight API, but that is outside the scope of this article.

## Putting the two APIs together

Pass an `OpaqueRange` into the `new Highlight()` constructor:

```js
const input = document.querySelector('input[type="text"]');
const startIndex = input.value.indexOf("example");
const myOpaqueRange = input.createValueRange(startIndex, startIndex + "example".length);
const greenHighlights = new Highlight(myOpaqueRange);
CSS.highlights.set("green", greenHighlights);
```

<input value="This is some example text" type="text">

The same highlight styles can be applied to multiple ranges by passing multiple `OpaqueRange` objects into the `new Highlight()` constructor:

```js
const greenHighlights = new Highlight(opaqueRange1, opaqueRange2);
const pinkHighlights = new Highlight(opaqueRange3);

CSS.highlights.set("green", greenHighlights);
CSS.highlights.set("pink", pinkHighlights);
```

<textarea name="" id="multiple">One and two and three</textarea>

Additional ranges can also be added to a preexisting `Highlight`:

```js
const blueHighlights = new Highlight(exampleRange1);
CSS.highlights.set("blue", blueHighlights);

blueHighlights.add(exampleRange2);
```

## Styling highlights

There are limitations to how you can style the highlight — only the following CSS properties are supported: 

- `color`
- `background-color`
- `text-decoration` (and the longhand properties)
- `text-shadow`
- `-webkit-text-stroke-color`, `-webkit-text-fill-color` and `-webkit-text-stroke-width`

```css
::highlight(green) {
    color: oklch(0.35 0.11 130.14);
    background-color: oklch(0.94 0.13 139.18);
    text-shadow: oklch(0.35 0.11 130.14 / 0.22) 1px 1px 1px;
}

::highlight(pink) {
    color: oklch(0.18 0.09 349.3);
    background-color: oklch(0.9 0.11 331.13);
    text-decoration: 2px underline solid oklch(0.44 0.2 355.29 / 0.33);
}
```

## A more realistic example

The following code will highlight every instance of the word "example", updating as the user types:

```js
const textarea = document.querySelector('textarea');
const blueHighlights = new Highlight;
CSS.highlights.set("blue", blueHighlights);

function highlightWord() {
blueHighlights.clear();

const matches = textarea.value.matchAll(/\bexample\b/gi);

for (const match of matches) {
    blueHighlights.add(textarea.createValueRange(match.index, match.index + "example".length));
}
}

highlightWord();
textarea.addEventListener('input', highlightWord);
```

<style>
    textarea, input[type="text"] {
        padding: 8px 12px;
        line-height: 1.5;
        font-family: system-ui;
        font-size: 16px;
        width: 100%;
        max-width: 300px;
    }

    ::highlight(highlight1), ::highlight(highlight2) {
       /* color: oklch(0.18 0.09 349.3);
        background-color: oklch(0.9 0.11 331.13); */
        color: oklch(0.35 0.11 130.14);
    background-color: oklch(0.94 0.14 135.33);
        }

    ::highlight(yellow) {
        background-color: yellow;
        /* color: oklch(0.35 0.18 260.07);
        background-color: oklch(0.93 0.06 218.57); */
    }

    ::highlight(pink) {
    color: oklch(0.18 0.09 349.3);
    background-color: oklch(0.9 0.11 331.13);
    text-decoration: 2px underline solid oklch(0.44 0.2 355.29 / 0.33);
}

::highlight(green) {
    color: oklch(0.35 0.11 130.14);
    background-color: oklch(0.94 0.13 139.18);
    text-shadow: oklch(0.35 0.11 130.14 / 0.22) 1px 1px 1px;
}

::highlight(blue) {
        color: oklch(0.34 0.12 249.78);
    background-color: oklch(0.9 0.06 241.7);
}
</style>

<textarea id="dynamicexample">This is some example text</textarea>


<script type="module">
const textarea = document.getElementById('dynamicexample');
const highlight1 = new Highlight;
CSS.highlights.set("blue", highlight1);

function highlightWord() {
highlight1.clear();

const matches = textarea.value.matchAll(/\bexample\b/gi);

for (const match of matches) {
    highlight1.add(textarea.createValueRange(match.index, match.index + "example".length));
}
}

highlightWord();
textarea.addEventListener('input', highlightWord);


// Input example
const input = document.querySelector('input');
const startIndex = input.value.indexOf("example");
const opaqueRange = input.createValueRange(startIndex, startIndex + "example".length);
const highlight2 = new Highlight(opaqueRange);
CSS.highlights.set("highlight2", highlight2);

// Multiple colors example

const multi = document.getElementById('multiple');
const opaqueRange1 = multi.createValueRange(0, 3);
const opaqueRange2 = multi.createValueRange(8, 11);
const opaqueRange3 = multi.createValueRange(16, 21);

const greenHighlights = new Highlight(opaqueRange1, opaqueRange2);
const pinkHighlights = new Highlight(opaqueRange3);

CSS.highlights.set("pink", pinkHighlights);
CSS.highlights.set("green", greenHighlights);
</script>