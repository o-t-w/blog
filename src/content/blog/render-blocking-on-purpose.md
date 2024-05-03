---
pubDate: 'May 02 2024'
title: Render-blocking on purpose
heroImage: "/render-block.jpg"
description: The new blocking="render" attribute.
---

Render blocking is something you usually want to avoid. Enter the term into Google and you'll be met with a great many articles about _eliminating_ render blocking. Perhaps somewhat surprisingly then, there's a new HTML `blocking` attribute to explicitly and purposefully block rendering until a particular resource is downloaded.

A regular `<script>` tag, when lacking an `async` or `defer` attribute, will pause the parsing of HTML and block rendering until the script is downloaded, parsed, and executed. 

The following script is both __parser-blocking__ and __render-blocking__:
```html
<head>
<script src="/script.js"></script>
</head>
```

Why do we need a new attribute?
- It makes the blocking behaviour explicit.
- It makes it possible to block rendering without blocking the HTML parser by using the `defer` or `async` attribute.
- Unlike classic scripts, module scripts defer by default. `<script type="module">` can now block rendering by using the `blocking` attribute.

## How does it work?
The `blocking` attribute can be added to `<script>`, `<link>` and `<style>` elements in the `<head>`. As of today, the only thing that can be blocked is rendering (we might be able to block [more operations](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#blocking-attributes) using this attribute in the future).

`blocking="render"` is a way to mark a resource as being required before anything is visually shown to the user. Not a single pixel will be painted in the viewport until the resource has loaded.

```html
<script blocking="render" 
        src="important.js" 
        defer></script>
```

The browser should assign a high priority to any render-blocking resource by default but seeing as not all browsers support the `blocking` attribute, its worth adding `fetchpriority="high"`:

```html
<script blocking="render" 
        fetchpriority="high" 
        src="important.js" 
        defer></script>
```

The attribute also works on inline scripts. An inline script is blocking by default — and the `defer` and `async` attributes don't work on classic inline scripts. However, a script with a `type="module"` attribute will be deferred, _even when its inline_.

```html
    <script type="module" async blocking="render">
    // vital JavaScript code...  
    </script>
```

The `async` attribute on an inline module script will cause it to [execute as soon as possible](https://v8.dev/features/modules#module-vs-script).

Let's look at a basic visual demonstration. [ChromaCheck](https://pixelambacht.nl/chromacheck/) is a simple website that display's which font formats your browser supports. To do this it uses client-side JavaScript, without render-blocking:

![](/chromacheck-without.webp)

Before the JavaScript has a chance to update the DOM, it briefly shows all formats as unsupported. Its a confusing flash of incorrect content. The sites entire raison d'etre relies on JavaScript. The JavaScript-dependent elements are displayed at the top of the page, above the fold. The script is small. Render-blocking would be an improvement in this case. The user would wait slightly longer for the first paint, but that's a worthwhile tradeoff. The content can be rendered fully-formed with no awkard or disorientating stylistic changes. Here's same site with render-blocking (with slow 3G throttling):

![](/chromacheck-with.webp)

Of course not everything is solved with render-blocking — I also needed to give the image a height.

<!-- If the blocking resource takes too long, the browser will eventually unblock rendering. If the resource takes an interminable amount of time to load, the user won't be left waiting forever. -->

## `blocking="render"` on `<link>`

You can also use the `blocking` attribute on `<link>` elements. However, if you are using the `<link>` to preload resources with `rel="preload"` or to preload JavaScript modules with `rel="modulepreload"` then the `blocking` attribute [will have no effect](https://github.com/whatwg/html/issues/7896). 

Stylesheets are blocking by default — and for good reason. This avoids a Flash of Unstyled Content (FOUC). Without render-blocking, the user would see the HTML displayed without any custom CSS, using the browsers basic default visual styles: black Times New Roman on a white background, etc. Then, once the stylesheet loads, the view of the page would change drastically, which is not a good user experience. Here's what the theverge.com looks like without any CSS, to take one random example:

![](/theverge.avif)

Because stylesheets block by default, adding the `blocking` attribute to a `<link>` or `<style>` tag is almost always unnecessary. The exception is a stylesheet loaded via JavaScript. 

The following stylesheet would __not__ block rendering:

```js
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './styles.css';
document.head.appendChild(link);
```

By making use of the `blocking` attribute, the stylesheet will be render-blocking:

```js
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './styles.css';
link.setAttribute('blocking', 'render');
document.head.appendChild(link);
```

## Render-blocking DOM elements


## The Performance API

To validate that the attribute worked, you can run the following code in the browser devtools console to see a list of render-blocking resources:

```js
window.performance.getEntriesByType("resource")
.filter(resource => resource.renderBlockingStatus === "blocking")
.forEach(resource => console.log(resource.name));
```

<!-- ## Single Page Applications
Render-blocking only applies to cross-document navigations (i.e the user clicks a link and is taken to a different HTML document). In a SPA, the use of client-side navigation means the document doesn't change, so `blocking="render"` will only have an effect when the user first navigates to the application. -->

## What does the user actually see?



## When is render blocking a good idea?
_It should go without saying that this attribute should be used with some amount of care as it could  potentially tank the First Contentful Paint (FCP), which is an important performance metric._ However, the fact that browsers purposefully block rendering until stylesheets have loaded speaks to the fact that render blocking is the right tradeoff for certain resources. 

### View Transitions

One primary use case for `blocking="render"` is cross-document view transitions. With this in mind, Chrome/Edge recently implemented a new `pagereveal` event: 

```js
window.addEventListener('pagereveal', function(event) {
    console.log(event.viewTransition);
});
```

This event listener needs to be registered in a render-blocking script. Otherwise, by the time JavaScript has added the event listener, the event will have already taken place so won't trigger your callback function. `pagereveal` takes place immediately before the first rendering opportunity. That means after any render-blocking CSS or JavaScript has loaded, but it could fire _before all the HTML has been parsed_. 

As part of the cross-document view transitions API, there's also a way to block rendering based on whether a particular HTML element has been parsed yet, using a `<link>` with a `href` attribute referencing the `id` of the element in question:   

```html
<head>
    <link rel="expect" href="#thingy" blocking="render">
</head>
```

HTML renders progressively/incrementally:

![](/incremental.avif)

This API gives developers more control over what's included in the First Contentful Paint. It's `rel="expect"` because the element is _expected_ to be in the DOM. Because it blocks rendering, it also effects at what point the `pagereveal` event is fired.

Read [_View Transitions Break Incremental Rendering_](https://ericportis.com/posts/2023/view-transitions-break-incremental-rendering/) by Eric Portis for an interesting perspective on this topic and [the response](https://dev.to/noamr/incremental-html-rendering-the-footgun-dillema-21ch) from browser engineer Noam Rosenthal.

### Layout shift
Maybe you have vital dynamic content at the top of a page? Maybe it pushes down other content once its loaded in? If the script is small, it could arguably be a better experience to ensure its ready to go before rendering the page. If a script effects the rendering of critical content the user sees within the viewport when they first land on the page, you could consider render blocking. At its very worst, the discordant and jarring herky-jerk of content moving, changing and shifting as it loads can be discombobulating and almost nausea-inducing for some users. But the alternative on slow connections may be an entirely blank screen. Render blocking can reduce layout shift, but at the cost of a delayed [First Paint](https://developer.mozilla.org/en-US/docs/Glossary/First_paint). There is an unavoidable tradeoff between seeing _something_ quickly and seeing things the way they are supposed to look. 

## Browser support
The `blocking` attribute has been available in Chrome and Edge since [version 105](https://chromestatus.com/feature/5452774595624960). It is also available in Samsung Internet. See MDN for the most up-to-date [browser compatibility data](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#browser_compatibility). 

Blocking via the `id` of a HTML element is supported in [Chrome 124](https://chromestatus.com/feature/5113053598711808). 