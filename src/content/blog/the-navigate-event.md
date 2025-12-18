---
pubDate: 'Dec 18 2025'
title: The navigate event
heroImage: "/navigateevent.png"
description: Using the Navigation API for same-document navigations
---

This article is about using the `navigate` event to intercept navigations. Intercepting a navigation prevents what would have been a request to the server for another HTML document, allowing you to instead update the page via JavaScript. This is called a same-document navigation, because the HTML document never changes. Rather than listening for click events on every link, we listen for a `navigate` event: 

```js
navigation.addEventListener('navigate', (event) => {});
```

## What fires the `navigate` event?
- A link is clicked (either by a user or programmatically via `.click()`).
- A user clicks the back or forward button of the browser UI (or navigates backwards or forwards via a keyboard)
- A click on the `<area>` element of an image map
- Navigation API methods `navigation.navigate()`, `navigation.back()`, `navigation.forward()`, `navigation.reload()` and `.navigation.traverseTo()`
- History API methods `history.back()`, `history.forward()`, `history.go()` `history.pushState()` and `history.replaceState()`.
- Updating any part of the URL via `location`. e.g. `location.hash = "foo"`, `location.pathname = "/about.html"`
- `location.assign()`, `location.replace()`, `location.reload()`
- Form submission (including programmatic form submission via `.submit()` or `.requestSubmit()`)
- The Refresh HTTP header
- `<meta http-equiv="Refresh" content="5" />`

Links that make use of the `download` attribute will trigger a `navigate` event just like any other link:

```html
<a download="report.pdf" href="0242a2.pdf">Download</a>
```

You can determine if the navigation was caused by a download link via `event.downloadRequest`. This will return the filename of the requested download, or `null`.

Anchor links to sections of the current page will also trigger a `navigate` event:

```html
<a href="#section1">Scroll to element</a>
<a href="#:~:text=What%20fires%20the%20navigate%20event%3F">Scroll to text</a>
```

`event.hashChange` will return `true` if only the hash of the URL changed. 

Most of the time you will not want to intercept these kinds of navigation and should let the browser get on with its default behaviour.

```js
navigation.addEventListener('navigate', event => {
  if (event.downloadRequest) return; // let the file download
  if (event.hashChange) return; // let the browser scroll
});
```

## What _doesn't_ fire the `navigate` event?

- Typing a URL into the address bar and pressing enter (unless only the hash portion of the URL is changed)
- User-initiated normal or hard reload of the page
- Opening a link in a new window or tab
- `window.open()`

## Navigations that can't be intercepted

There are times when the `navigate` event does fire, but we're limited in what we can do in the event handler.

You cannot intercept:
- Cross-origin navigations (a navigation to a URL with a different scheme, username, password, host, or port). Only same-origin navigations (i.e. those where only the pathname, query string or fragment is different) can be intercepted.
- Cross-document back/forward navigations.

If a navigation cannot be intercepted, `event.canIntercept` will be false.

```js
navigation.addEventListener("navigate", (event) => {
    if (!event.canIntercept) return;
});
```

## Intercepting navigations

When intercepting a navigation, you can either: use a `handler()` or use both a `handler()` and `precommitHandler()`. When using a `handler()` alone, the address bar will be updated with the new URL immediately. The `handler()` callback is where you update the DOM to reflect the new URL. At its most basic, that could look like: 

```js
const root = document.getElementById("root");
navigation.addEventListener("navigate", (event) => {
if (!event.canIntercept) return;
const url = new URL(event.destination.url);

event.intercept({
    async handler() {
    if (url.pathname === "/about") {
        document.title = "About";
        root.setHTMLUnsafe(
        "<h2>About</h2><p>Acme Co. is a team dedicated to...</p>"
        );
    } else if (url.pathname === "/") {
        document.title = "Home";
        root.setHTMLUnsafe("<h2>Welcome to the home page</h2>");
    } else {
        document.title = "Not found";
        root.setHTMLUnsafe("<h2>Page not found</h2>");
    }
    },
});
});
```

There are a myriad of ways to update the DOM. To take just a few examples, you could:

- Fetch some JSON and feed it into a frontend templating library like [htm](https://github.com/developit/htm), [uhtml](https://github.com/WebReflection/uhtml) or [lit-html](https://lit.dev/docs/libraries/standalone-templates/).
- Fetch a HTML partial (a HTML file without a `<head>` or `<body>`) from the server and update the page via `setHTMLUnsafe()` (or, in the future, `setHTML()`).
- Fetch an entire HTML document, parse the response with `parseHTMLUnsafe()` (or, in the future, `parseHTML()`), `querySelector` a part of it and inject that into the page (an approach reminiscent of [Turbolinks](https://github.com/turbolinks/turbolinks)).

**Earlier in this article I listed all the times when the `navigate` event won't fire. To take care of those cases, in addition to rendering HTML in the event handler, it is also necessary to run the same render code when the HTML document initially loads.**

## `precommitHandler`
In the terminology of the Navigation API, _commit_ means the point at which the URL changes and the destination becomes the `currentEntry` in the history. To run some code before the URL updates, you need a `precommitHandler`. In the `precommitHandler` `location.href` will be the page that is being navigated from, whereas in the `handler` `location.href` will be the page that is being navigated to. 

```js
event.intercept({
  async precommitHandler() {
      console.log(location.href === event.destination.url); // false
  },
  async handler() {
      console.log(location.href === event.destination.url); // true
  },
});
```

You can use the `precommitHandler` to:
- perform a redirect to a specified URL
- update the state of the forthcoming history entry
- switch between `"replace"` and `"push"` navigations (`"reload"` and `"traverse"` navigations cannot be redirected).

Call the `redirect(url, options)` method with the target URL as the first argument to change the navigation destination: 

```js
const protectedRoutes = [
  new URLPattern({ pathname: '/dashboard/*' }),
  new URLPattern({ pathname: '/admin/*' })
];

navigation.addEventListener("navigate", (event) => {
if (protectedRoutes.some(pattern => pattern.test(event.destination.url)) && !userSignedIn) {
      event.intercept({
      async precommitHandler(controller) {
        controller.redirect("/signin/"); // the pathname of destination.url in the handler() will now be "/signin/"
      },
    });
}
});
```

An optional second argument can be provided: an object with a `state` and `history` property (both are optional). In the following example the destination is left unchanged but the history behavior is set to `"replace"`.

```js
async precommitHandler(controller) {
  controller.redirect(event.destination.url, {
      history: "replace"
  });
},
```

Let's look at something you shouldn't do with a `precommitHandler()`: 

```js
navigation.addEventListener("navigate", (event) => {

  event.intercept({
    async precommitHandler() {
      const transitionOut = document.startViewTransition(() => root.setHTMLUnsafe(`<div class="spinner"></div>`));
      await transitionOut.finished;
    },
    async handler() {
      await fetchAndRender(event.destination.url);
    },
  });
});
```
In the above example, a view transition animates out the old view and animates in a loading spinner. That might seem like a good moment to change the URL. The fetch inside the `handler()` can't start until after the animation has finished, which is far from ideal. **Including a `precommitHandler` defers the commit until all promises returned by the `precommitHandler` have resolved.**

`precommitHandler` is a more recent addition to the spec and is currently only supported in Chrome/Edge and Firefox Nightly. **Safari 26.2 [supports](https://developer.apple.com/documentation/safari-release-notes/safari-26_2-release-notes#New-Features) the Navigation API but does not yet support `precommitHandler`.**

### Optional step: adding a view transition

When we update the DOM, we can optionally add a [view transition](https://developer.chrome.com/docs/web-platform/view-transitions#how_to_trigger):

```js
document.startViewTransition(() => updateTheDOMSomehow());
```

Some browsers, like iOS Safari, have in-built visual transitions for certain kinds of navigation (such as swiping back and forward through history). In that instance, you should avoid applying a view transition. `event.hasUAVisualTransition` will return `true` when the user agent applies its own transition: 

```js
const root = document.getElementById('root');
if (event.hasUAVisualTransition) {
    // let the browser use its default back/forward transition
    root.setHTMLUnsafe(`<h2>Lorem ipsum</h2>`);
    return;
  }

// Apply a view transition
document.startViewTransition(() => root.setHTMLUnsafe(`<h2>Lorem ipsum</h2>`));
```

Some code examples also check whether the View Transition API is supported before adding the view transition:

```js
if (event.hasUAVisualTransition || !document.startViewTransition)
```

All browsers that support the Navigation API also support the View Transition API, so this code isn't necessary.
<!-- The View Transitions API can get complicated. Animations obviously take place _over time_, so view transitions can make a site feel slow. Only add them if its really necessary.  -->

## Other properties on the navigate `event`

In this article we've already seen `event.destination.url`, `event.canIntercept`, `event.downloadRequest` and `event.hashChange` but the navigate event includes more useful properties. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/NavigateEvent) for the full list.

### `sourceElement`

The `event.sourceElement` is the HTML element that initiated the navigation. This will usually be an `<a>` element but could potentially be an `<area>` (these are rather niche). For form submissions, it will be whichever `<button>` was used to submit the form. If the form was submitted via `.submit()` or `.requestSubmit()` then the `sourceElement` will be the `<form>` element itself. For all other navigations, `sourceElement` will be `null` — including navigations caused by buttons that make use of the `navigate()`/`reload()`/etc methods. For example, for a navigation caused by the following button, `sourceElement` will be `null`:

```html
<button onclick="navigation.navigate('/about')">Navigate</button>
```

You could use `sourceElement` to read a data attribute from the relevant link, for example, or to add a CSS `view-transition-name` to the `sourceElement` when working with the View Transitions API.

### `destination.sameDocument`

Indicates whether the navigation is to the same Document as the current one. `event.destination.sameDocument` will return true if only the hash changes. It will also return true if `history.pushState()` is used. Here's what the [spec says](https://html.spec.whatwg.org/multipage/nav-history-apis.html#nav-traversal-apis:~:text=Note%20that%20this%20property%20indicates%20the%20original%20nature%20of%20the%20navigation.%20If%20a%20cross%2Ddocument%20navigation%20is%20converted%20into%20a%20same%2Ddocument%20navigation%20using%20navigateEvent.intercept()%2C%20that%20will%20not%20change%20the%20value%20of%20this%20property.):

> This property indicates the original nature of the navigation. If a cross-document navigation is converted into a same-document navigation using `event.intercept()`, that will not change the value of this property.

That remains the case even if you've configured your backend to serve the same HTML document for all routes.

<!-- ### `event.navigationType`

Reloading by pressing command + r on the keyboard or clicking the reload button in the browser UI does not fire the `navigate` event, so the `navigationType` will only be `"reload"` if your code called `navigation.reload()` or an older legacy method like `location.reload()`, or `history.go(0)`. -->

## Conclusion

The Navigation API has a large surface area, but the `navigate` event is the core piece. The Navigation API provides a new improved foundation for building client-side routers. Hopefully rewrites of popular open source projects like [React Router](https://github.com/remix-run/react-router/discussions/11046) are around the corner. For simpler use cases, a third party dependency may not be necessary. 