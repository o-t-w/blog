---
pubDate: 'Nov 14 2024'
title: Styling lists with ::marker in CSS
heroImage: "/placeholder.png"
description: Styling lists with ::marker and list-style-image in CSS
---

`::marker` makes it easy to style the list markers of both ordered and unordered lists.

```css
li::marker {
    color: blue;
    font-weight: 800;
}
```

This is useful for controlling things like the `font-weight` or `color` of the default marker. For an entirely custom marker though

`list-style-image` is supported by all browsers.

```css
ul > li {
    list-style-image: url(heart.svg);
}
```

`list-style-type`:

```css
ul > li {
    list-style-type: "✨";
}
```

`list-style-image` is less versatile than `content` because it requires an image. By contrast, the value of `content` can be an image or text (including emoji), so the following are all valid:

```css
ul > li::marker {
    content: "*";
    content: "✨";
    content: url(heart.svg);
}
```

`::marker` is supported in all browsers. However, Safari [does not support](https://bugs.webkit.org/show_bug.cgi?id=204163) the `content` property when used on `::marker`

The CSS properties supported on `::marker` are very limited, so vertically centering the text of a `<li>` with its marker can be challenging.

Given the following HTML:

```html
<ul>
    <li><span>First item</span></li>
    <li><span>Second item</span></li>
</ul>
```

The `vertical-align` property can be used to align the text of the `<li>` with its marker.

```css
li > span {
            vertical-align: top;
        }
```
