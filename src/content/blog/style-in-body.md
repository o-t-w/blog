---
pubDate: 'Nov 05 2025'
title: "Is <style> in <body> a good idea?"
heroImage: "/style-in-body.png"
description: HTML conformance, security and performance 
---

I don't have any data on how common it is to place a `<style>` block inside the `<body>`, but sites that do so include Ebay, Wikipedia and Amazon.com. Perhaps the introduction of `@scope` will make this practice more popular. 

## Scoped styles

Here's some sample code from the [CSS Cascading and Inheritance Level 6 spec](https://www.w3.org/TR/css-cascade-6/#example-52419898):

```html
<div>
  <style>
    @scope {
      p { color: red; }
    }
  </style>
  <p>this is red</p>
</div>
<p>not red</p>
```

What's the benefit of this approach? You don't need to come up with a CSS class name, and therefor you entirely avoid naming collisions. It avoids the unpleasantly verbose syntax of CSS approaches like BEM. 

Including a `<style>` block directly within the markup it styles is effectively the browsers own in-built version of single-file components. Single-file components were popularised by Vue.js, allowing template logic and styling to coexist in a single file. When it comes to code organisation, that can provide a better developer experience than changing some markup in one file and then searching through the codebase to find the associated CSS file. 

However, there are good reasons to keep styles in the `<head>`.

## HTML Conformance

I'm not sure how much this matters seeing as it works in all browsers regardless, but use of `<style>` inside the `<body>` is technically invalid according to the HTML specification. It's strange that a CSS spec would use invalid markup (as shown above), but that's the situation.

## Performance

There is an old GitHub issue arguing that the HTML spec should be changed to make `<style>` inside `<body>` valid. The issue was closed due to performance concerns. According to the [browser engineers](https://github.com/whatwg/html/issues/1605#issuecomment-282438836) in that thread, `<style>` in `<body>` can lead to a Flash of Unstyled Content (FOUC) and expensive re-styling, re-layout, and re-painting.

## Security

Regardless of whether its in the `<head>` or the `<body>`, `<link rel="stylesheet">` should be preferred over `<style>`.

The MDN page about the `style-src` Content Security Policy (CSP) directive [states](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src#unsafe_inline_styles):

> "Disallowing inline styles and inline scripts is one of the biggest security wins CSP provides.".

A CSP policy can enable inline styles, but that is notably named `'unsafe-inline'`. 

