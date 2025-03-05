---
pubDate: 'Mar 05 2025'
title: Styling the HTML details and summary elements
heroImage: "/styling-summary.png"
description: Getting past the limitations of ::marker  
---

<style>
    .accordion-summary {
    padding-block: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    cursor: pointer;
    text-box: trim-both cap alphabetic;
}

.accordion-summary:after {
    transition: rotate .3s;
    transition-timing-function: ease-out;
    content: url('/chevron-down-mini.svg');
    margin-left: 30px;
}

.accordion-details[open] summary:after {
    rotate: 180deg;
}

.accordion-details {
    interpolate-size: allow-keywords;
    border-bottom: solid 1px #e4e4e7;
}

.accordion-details::details-content {
    height: 0;
    overflow-y: clip;
    transition: content-visibility .3s allow-discrete, block-size .3s;
    transition-timing-function: ease-out;
}

.accordion-details[open]::details-content {
    height: auto;
}

.accordion-details div {
    padding-bottom: 16px;
}

summary {
    user-select: none;
    -webkit-user-select: none;
}

</style>

<details class="accordion-details" name="faq">
<summary class="accordion-summary">Is this accordion built with the details and summary elements?</summary>
<div>
    Yes.
</div>
</details>

<details class="accordion-details" name="faq">
<summary class="accordion-summary">Will find-in-page open the relevant details element?</summary>
<div>
Yes, at least in Chrome/Microsoft Edge. Try searching for this text when this section is closed. The browser's find-in-page search will automatically open the relevant section of the accordion. You do not need to manually add <code>hidden="until-found"</code> as that behaviour is the default. 
</div>
</details>

<details class="accordion-details" name="faq">
<summary class="accordion-summary">Do URL text fragments work?</summary>
<div>
In Chrome and Edge, URL text fragments will automatically open the relevant details element. Try pressing the link below when this section is closed.
</div>
</details>

<a href="/styling-details-summary#:~:text=automatically%20open%20the%20relevant%20details%20element">URL text fragment link</a>

By default, without any custom styles applied, the `<details>` and `<summary>` elements looks like this:

<details>
  <summary>Summary</summary>Lorem ipsum dolor sit amet consectetur adipisicing elit.
</details>

Firefox, Chrome/Edge and the forthcoming [Safari 18.4](https://developer.apple.com/documentation/safari-release-notes/safari-18_4-release-notes#CSS) give the `summary` element a default `display` value of `list-item`. That means the `::marker` selector can be used to style the default triangle icon, or to replace it via the `content` property.

```css
summary::marker {
    content: url('/chevron-down.svg');
}
```

## The limitations of `::marker`

The `::marker` pseudo-element only supports a limited set of CSS properties:

- All font properties
- `white-space`
- `color`
- `text-combine-upright`
- `unicode-bidi`
- `direction`
- `content`
- Animation and transition properties

This makes accurately positioning a custom icon practically impossible.

Safari supports `::marker`, but unlike other browsers, does not support the `content` property when using this selector. Customization of the default icon is severely limited. A better approach is to hide the default icon and make use of `::before` or `::after`, which offer far more stylistic flexibility.

## Hiding the default icon

The `display` property is not supported for `::marker`, so `::marker { display: none; }` will not work. Safari does not support the `content` property for `::marker` so `content: ""` will not work in that browser. By default, `<summary>` is set to `display: list-item`. Setting `display` to any other value removes the marker:

```css
summary {
    display: flex;
}
```

The following also works:

```css
summary {
    list-style-type: none;
}
```

Some older browsers require the following code: 

```css
summary::-webkit-details-marker {
  display: none;
  margin-inline-end: 0;
}
```

## A custom icon with `::before` or `::after`

Once the default icon is removed, `::before` or `::after` can be used to set a custom icon. 

```css
summary::after {
    content: url('/chevron-down.svg');
}
```

Unlike `::marker`, `::before` and `::after` offer full stylistic versatility.
