---
pubDate: 'Apr 28 2025'
title: "sheet"
heroImage: "/placeholder.png"
description: TODO
---
`@sheet` allows for the bundling of CSS. A single `.css` file can contain multiple named stylesheets.

SHOW EXAMPLE HERE

The styles within an `@sheet` block are not applied unless the named stylesheet is explicitly imported. A stylesheet can be imported via JavaScript using import attributes and CSS modules, or in CSS via `@import` . WHAT ABOUT LINK REL STYLESHEET

When working with web components, you'd probably import a stylesheet using import attributes and CSS modules: GIVE EXAMPLE

Historically, `@import` had performance drawbacks. `@sheet` solves the performance issues of `@import`. Here's the syntax:

SHOW CODE EXAMPLE

To understand the benefit of `@import` involves reminding ourselves of the power of `@import`.  Previously, I wouldn't have used multiple `<link rel="stylesheet">` elements or multiple CSS `@import` statements because making multiple requests is bad for performance. `@sheet` does change that somewhat, as multiple stylesheets can be bundled into a single file.
Sheet makes it possible to use CSS import statements without slowing down your site. 

While you can write the `@sheet` syntax by hand, the more common use case will be writing separate CSS files and having a build tool merge them into a single file that makes use of @sheet.

`@sheet` was originally suggested as a performance improvement for shadow DOM, but it has other use cases. It can aid in CSS organisation.  

Import has historically had negative performance drawbacks. For that reason, many tools allow developers to use import statements in CSS, but have them transpiled away during the build step. Tools that do this include Sass, PostCSS, Bun, and Lightning. You might be happy enough with that approach. However, these tools don’t all match everything that the browser import is capable of. 

It can be easier to manage your layers and media queries in one place. That's enabled by using CSS `@import`. 

`@sheet` is a new feature added to CSS to improve performance of custom elements using shadow DOM. Are there use-cases for `@sheet` outside of web components? If multiple CSS files are combined into a single file using a build tool, why would you even need an import statement?

How about instead of managing layers in the place where styles are defined, we manage them in the place where stylesheets are imported.

Given the following CSS:

```css
@sheet foo {
@scope {
    h2 {
        color: green;
    }
    
    p {
        color: pink;
    }
}
}

@sheet bar {
@scope {
    h2 {
        color: blue;
    }
    
    p {
        color: purple;
    }

    :scope {
        border: solid 2px;
        padding: 12px;
        background-color: fuchsia;
    }
}
}
```

Imported into the following markup:

```html
<div>
    <link rel="stylesheet" href="stylesheet.css#foo">
    <h2>Test</h2>
    <p>test</p>
</div>

<div>
    <style>
        @import "stylesheet.css#bar";
    </style>
    <h2>Test</h2>
    <p>test</p>
</div>

<div>
    <h2>Test</h2>
    <p>test</p>
</div>
```

Because of `@scope`, the styles defined in foo will only be applied to the elements within the first `div`. The styles defined in bar will only be applied to elements within the second `div`.

You could combine this with the layer attribute for `@import`:

```html
<div>
    <style>
        @import "things.css" layer(important);
    </style>
    <h2>Test</h2>
    <p>test</p>
</div>
```

Is this useful? Is this a good approach to use in the real world? These features are new and under-explored and I'm just trying out what's possible.
Are there use-cases for sheet outside of shadow DOM? This is a brand new feature that I haven’t used in a production site so this blog post is as much an open question as a prescriptive how-to tutorial.

--- 

Romain Menke:

> "I had hoped that having interop tests for bundlers would improve the ecosystem...Maybe the at-sheet proposal will improve things in the distant future?
Inlining multiple different CSS files into a single file changes how that CSS will behave. For example url's to images for backgrounds. Or duplicate and cyclical imports of CSS files. With at-sheet it could be possible to make a CSS bundler that behaves correctly in all cases.

In my opinion it is easier if there is no observable difference between using:
- multiple link tags in html
- multiple at-import statements in CSS
- using a bundling tool

Switching between either of these approaches shouldn't affect your page styles. But with many bundlers they do!

For a partial comparison of some tools see: github.com/romainmenke/...

LightningCSS for example claims to be a standards centric tool but fails almost 50% of tests."

NOT JUST USEFUL FOR LAYER AND MEDIA QUERY AND SUPPORTS, ALSO USEFUL FOR @SCOPE ONCE THAT IS A THING

EVEN THIS DOESNT WORK:

```html
<style>
    @scope {
        @import url(things.css);
    }
</style>
```

THERE IS A CSSWG PROPOSAL TO ALLOW @IMPORT TO SPECIFY A SCOPE!! https://github.com/w3c/csswg-drafts/issues/7348