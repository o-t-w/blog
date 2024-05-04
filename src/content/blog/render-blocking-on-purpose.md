---
pubDate: 'May 02 2024'
title: Render-blocking on purpose
heroImage: "/render-block.jpg"
description: The new blocking="render" attribute.
---

Render blocking is something you usually want to avoid. Enter the term into Google and you'll be met with a great many articles about _eliminating_ render-blocking. Perhaps somewhat surprisingly then, there's a new HTML `blocking` attribute to purposefully block rendering until a particular resource is downloaded.

A regular `<script>` tag, when lacking an `async` or `defer` attribute, will pause the parsing of HTML and block rendering until the script is downloaded, parsed, and executed. 

The following script is both __parser-blocking__ and __render-blocking__:
```html
<head>
<script src="/script.js"></script>
</head>
```

Why do we need a new attribute?
- It makes the blocking behaviour explicit and conveys intent (your colleague will not accidentally refactor the code to be non-blocking).
- It makes it possible to block rendering without blocking the HTML parser when used in conjunction with the `defer` or `async` attribute.
- Unlike classic scripts, module scripts defer by default. `<script type="module">` can now block rendering by using the `blocking` attribute.
- `<script>`, `<link>` and `<style>` elements added to the `<head>` dynamically with JavaScript are not render blocking. You now have the flexibility to make them blocking. 

## How does it work?
The `blocking` attribute can be added to `<script>`, `<link>` and `<style>` elements in the `<head>`. As of today, the only thing that can be blocked is rendering (we might be able to block [more operations](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#blocking-attributes) using this attribute in the future).

`blocking="render"` is a way to mark a resource as required before anything is visually shown to the user. Not a single pixel will be painted in the viewport until the resource has loaded.

```html
<script blocking="render" 
        src="important.js" 
        defer></script>
```

The browser should assign a high priority to any render-blocking resource by default. As not all browsers support the `blocking` attribute, its worth adding `fetchpriority="high"`:

```html
<script blocking="render" 
        fetchpriority="high" 
        src="important.js" 
        defer></script>
```

The attribute also works on inline scripts. A classic inline script is blocking by default (and the `defer` and `async` attributes aren't used on classic inline scripts). However, a script with a `type="module"` attribute will be deferred, _even when its inline_.

```html
    <script type="module" async blocking="render">
    // vital JavaScript code...  
    </script>
```

The `async` attribute on an inline module script will cause it to [execute as soon as possible](https://v8.dev/features/modules#module-vs-script).

Let's look at a basic visual demonstration. [ChromaCheck](https://pixelambacht.nl/chromacheck/) is a simple website that display's which font formats a browser supports. To do this it uses client-side JavaScript, without render-blocking:

![](/chromacheck-without.webp)

Before the JavaScript has a chance to update the DOM, it briefly shows all formats as unsupported. It would be better to start with a neutral color in case JavaScript fails, _but you'd still get a flash of changing styles as the page loads_. The sites entire raison d'etre relies on JavaScript. The JavaScript-dependent elements are displayed at the top of the page. The script is small. Render-blocking would be an improvement in this case. The user would wait slightly longer for the first paint, but that's a worthwhile tradeoff. The critical content can be rendered fully-formed with no awkard or disorientating stylistic changes. Here's the same site with render-blocking (with slow 3G throttling):

![](/chromacheck-with.webp)

<!-- Of course not everything is solved with render-blocking — I also needed to give the image a height. -->
These sort of last-minute JavaScript DOM updates that effect above the fold content can sometimes justify render-blocking to prevent the discordant and jarring herky-jerky of content updating and rearranging (although layout shifts caused by dynamic content can often be solved simply by [reserving space with `min-height`](https://web.dev/articles/optimize-cls#late-loaded-content)). 

## `blocking="render"` on `<link>`

You can also use the `blocking` attribute on `<link>` elements. However, if you are using the `<link>` to preload resources with `rel="preload"` or to preload JavaScript modules with `rel="modulepreload"` then the `blocking` attribute [will have no effect](https://github.com/whatwg/html/issues/7896). 

Stylesheets are blocking by default — and for good reason. This avoids a Flash of Unstyled Content (FOUC). Without render-blocking, the user would see the HTML displayed using only the browsers basic default visual styles: black Times New Roman on a white background, etc. Then, once the stylesheet loads, the view of the page would change drastically, which is not a good user experience. Here's what the theverge.com looks like without any CSS, to take one random example:

![](/theverge.avif)

Because stylesheets block by default, adding the `blocking` attribute to a `<link>` or `<style>` tag is almost always unnecessary. The exception is a stylesheet loaded via JavaScript. 

The following stylesheet would __not__ block rendering:

```js
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './styles.css';
document.head.appendChild(link);
```
Developers tend to take advantage of this behaviour to purposefully defer _non-critical_ CSS. If, however, you need to load critical CSS (styles that change the layout of the entire page or effect something above the fold) in this way, you can make use of the `blocking` attribute:

```js
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './styles.css';
link.setAttribute('blocking', 'render');
document.head.appendChild(link);
```

## The Performance API

To validate that the attribute worked, you can run the following code in the browser devtools console to see a list of render-blocking resources:

```js
window.performance.getEntriesByType("resource")
.filter(resource => resource.renderBlockingStatus === "blocking")
.forEach(resource => console.log(resource.name));
```

## Render-blocking DOM nodes

HTML renders progressively/incrementally:

<figure>
<img src="/incremental.avif" alt="">
<figcaption class="font-small">Image borrowed from Philip Walton at <a href="https://web.dev/articles/fcp">web.dev</a></figcaption>
</figure>

Rendering can start before the entire HTML document is fetched and parsed. 

There's a way to block rendering based on whether a particular HTML element has been parsed.

Place a `<link>` in the `<head>` with a `href` attribute referencing the `id` of the element in question:   

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="expect" href="#visually-critical-content" blocking="render">
  </head>
  <body>
    <header>...</header>
    <div id="visually-critical-content">...</div>
  </body>
</html>
```
This gives developers more control over what's included in the First Contentful Paint. It should only be used for elements that are above the fold — otherwise you'll be needlessly delaying the first paint. Once the element has been parsed, the page will be made visible to the user. If the expected element is not found, rendering will be unblocked when the entire HTML document has finished parsing.

This feature was added to the web primarily with cross-document view transitions in mind. 

<!-- ## Single Page Applications
Render-blocking only applies to cross-document navigations (i.e the user clicks a link and is taken to a different HTML document). In a SPA, the use of client-side navigation means the document doesn't change, so `blocking="render"` will only have an effect when the user first navigates to the application. -->

## The `pagereveal` event and View Transitions
The initial implementation of view transitions only worked with client-side navigation. One primary use case for `blocking="render"` is [_cross-document_ view transitions](https://drafts.csswg.org/css-view-transitions-2/#waiting-for-stable-state). With this in mind, Chrome/Edge recently implemented a new `pagereveal` event: 

```js
window.addEventListener('pagereveal', function(event) {
    console.log(event.viewTransition);
});
```

This event listener needs to be registered in a render-blocking script. Otherwise, by the time JavaScript has added the event listener, the event will likely have already taken place so won't trigger your callback function. `pagereveal` takes place immediately before the first rendering opportunity. That means after any render-blocking CSS or JavaScript has loaded, but it could fire _before all the HTML has been parsed_. However, if you have `<link rel="expect" href="#thing" blocking="render">` in the `<head>`, for example, you can query that element with `document.getElementById('thing')` without the risk of it being `null`.

Read [_View Transitions Break Incremental Rendering_](https://ericportis.com/posts/2023/view-transitions-break-incremental-rendering/) by Eric Portis for an interesting perspective on this topic and [the response](https://dev.to/noamr/incremental-html-rendering-the-footgun-dillema-21ch) from browser engineer Noam Rosenthal.

## What does the user actually see?
Render-blocking delays drawing pixels to the screen, so you might assume this involves staring at a blank page. On fast connections, that is rarely the case. When navigating the web, it used to be common to see a flash of white between pages. To solve this, browsers started utilising [_paint holding_](https://developer.chrome.com/blog/paint-holding). Paint holding keeps the user on the previous page and shows a loading indicator until the First Contentful Paint (FCP) of the new page is ready. If you delay FCP, the user will be kept looking at the previous page for slightly longer. Paint holding only lasts for a short amount of time. If you delay FCP for too long, an empty white page will be displayed. For a slow site on slow 3G, this "flash" of white nothingness could potentially last for a significant amount of time. 

## Browser support
The `blocking` attribute has been available in Chrome and Edge since [version 105](https://chromestatus.com/feature/5452774595624960). It is also available in Samsung Internet. See MDN for the most up-to-date [browser compatibility data](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#browser_compatibility). 

Blocking via the `id` of a HTML element is supported in [Chrome 124](https://chromestatus.com/feature/5113053598711808). 

---
_It should go without saying that this attribute should be used with some amount of care as it will negatively impact First Contentful Paint (FCP), which is an important performance metric._ The fact that browsers purposefully block rendering until stylesheets have loaded speaks to the fact that render-blocking is the right tradeoff for certain critical resources.