---
pubDate: 'Sep 10 2026'
title: Speculation Rules API
heroImage: "/speculationrules.png"
description: Speed up future navigations by prefetching and/or prerendering before a user has clicked a link
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

<div class="box">
<h2>Browser support</h2>
<p>This feature has been in Chrome and Edge since version 109, released in 2023. It is not yet clear whether other browsers are fully on-board with all aspects of this API, but it can be used as a progressive enhancement (its already adopted in production by companies such as WordPress, Shopify, Etsy and Google). <code>prerender_until_script</code> is a newer part of the spec that is currently an origin trial in Chrome. You can vote for the Speculation Rules API for inclusion in <a href="https://github.com/web-platform-tests/interop/issues/1335">Interop 2027</a>.</p>
</div>

Speculation rules offer a way to preemptively load pages for future navigations before the user has actually clicked a link. Its worth noting at the outset that speculation rules only work for cross-document navigations, not for the soft navigations of a Single Page Application (SPA). If your app only uses client-side routing, the Speculation Rules API has nothing to offer.  

Speculation rules consist of JSON delivered using a `<script>` element with its type attribute set to `"speculationrules"`. This needs to be defined inline in the `<head>`, although in the future it may be possible to use a `.json` file: 

```html
<script type="speculationrules">
{
    "prefetch": [{
        "where": { "selector_matches": ".prefetch"},
        "eagerness": "eager"
    }]
}
</script>
```

<!-- Alternatively a `.json` file can be used:

```html
<script type="speculationrules" src="rules.json"></script>
``` -->

There are three options: prefetch, prerender or the newer `prerender_until_script`. Prefetch fetches the HTML document and nothing more. Prerender will fetch the HTML document and all subresources the page needs (fonts, CSS, images, JavaScript, etc) and will fully render the page and run all scripts. With prerendering, future navigations can potentially be instantaneous because all the work is done ahead of time. `prerender_until_script` is an intermediate choice: it does more than prefetch, but less than prerender. `prerender_until_script` will start to prerender the page but will pause if it encounters a parser-blocking `<script>` element — scripts will not be executed. If the page being navigated to has no parser-blocking JavaScript, prerender and `prerender_until_script` behave identically.

<!-- <div class="box">
<h2>The two meanings of “prerendering”</h2>

<p>Some JavaScript frameworks use the term "prerendering" to mean something very different: the process of <a href="https://svelte.dev/docs/kit/glossary#Prerendering">generating static HTML files</a>. What the Speculation Rules API accomplishes is far more powerful, and is something a SPA is not capable of. Single page applications are incapable of prerendering: so your MPA can be faster than a SPA.</p>
</div> -->

Specific links can be targeted via a CSS selector to prefetch or prerender their destination.

```json
{
    "prerender": [{
        "where": { "selector_matches": ".prerender" },
        "eagerness": "eager"
    }],
    "prefetch": [{
        "where": { "selector_matches": ".prefetch"},
        "eagerness": "eager"
    }],
    "prerender_until_script": [{
        "where": {"selector_matches": ".untilscript"},
        "eagerness": "eager"
    }]
}
```

```html
<a class="prerender" href="/blog.html">Blog</a>
<a class="prefetch" href="/about.html">About</a>
<a class="untilscript" href="/stuff.html">Stuff</a>
```

Alternatively, specific URLs can be prefetched or prerendered: 

```json
{
    "prerender": [{
        "eagerness": "moderate",
        "urls": ["blog.html", "about.html"]
    }]
}
```

The following example prerenders all urls except for `/logout` (prefetching `/logout` would sign the user out, which you don't want to do prematurely).

```json
{
"prerender": [{
    "eagerness": "moderate",
    "where": { 
    "and": [
        {"href_matches": "/*"},
        {"not": { "href_matches": "/logout" } }
        ]
        }  
    }]
}
```

The eagerness can be set to either immediate, eager, moderate or conservative. These might vary slightly between browsers, but in Chrome and Edge, they work in the following way:

#### `conservative`
By default, when speculation rules are not used, links are fetched on `pointerup`. A `conservative` eagerness will fetch only slightly beforehand, on `pointerdown`. This gives the browser a tiny, but still meaningful, head start before the user releases their finger to complete the click.

#### `moderate` and `eager`
`moderate` and `eager` will both trigger the prefetch/preload when the user hovers over the link. When a `moderate` eagerness is used, the user needs to hover for slightly longer (200 milliseconds) to trigger the prefetch/preload, compared to 10 millisecond for `eager`. On mobile, prefetching/preloading will be triggered after the link enters the viewport.

#### `immediate`
`immediate` is fairly self explanatory: the user does not need to interact with the link at all, the prefetch/prerender will start as soon as the speculation rule is parsed. Immediately prefetching is largely equivalent to including a `<link rel="prefetch">` tag in the head.

---

If you navigate via keyboard rather than with a mouse: focusing a link does not trigger a prefetch or prerender.

By making use of different eagerness settings, it is possible to prefetch and then later prerender (or `prerender_until_script`):

```json
{
"prefetch": [{
    "eagerness": "eager",
    "where": { 
    "and": [
        {"href_matches": "/*"},
        {"not": { "href_matches": "/logout" } }
        ]
        }  
    }],
"prerender_until_script": [{
    "eagerness": "conservative",
    "where": { 
    "and": [
        {"href_matches": "/*"},
        {"not": { "href_matches": "/logout" } }
        ]
        }  
    }]
}
```

Using this approach you avoid being wasteful by over-eagerly prerendering, while still getting things going well ahead of time with prefetch. 

## Potential drawbacks

### Wastefullness

Using this API can be wasteful. Unless you use an eagerness of `conservative`, its very likely that some links will be prefetched or prerendered that the user never actually navigates to. Prerendering with an eagerness of immediate is the most likely to waste a users bandwidth, battery, memory and CPU. Server load and CDN costs will go up accordingly. Chrome does take steps to mitigate costs. Speculation Rules automatically respects battery saver and data saver modes: prefetching and prerendering will be skipped when these modes are active, or if the device is memory constrained, or if the page is opened in a background tab. Cross-origin iframes are not prerendered.

### Stale content

Chrome will cache prefetched pages for five minutes. If the user hovers a link but doesn’t click it until sometime later, the content of prefetched/prerendered page could be up to five minutes out of date. 

<!-- Stale content mitigations
Clear-Site-Data: prefetchCache, prerenderCache can cancel speculations from API calls. -->