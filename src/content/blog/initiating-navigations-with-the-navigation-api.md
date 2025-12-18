---
pubDate: 'Dec 18 2025'
title: Initiating navigations with the Navigation API
heroImage: "/initiating-navigation.png"
description: The back(), forward(), reload(), traverseTo() and navigate() Navigation API methods
---

This article looks at programmatically triggering navigations using the following methods: 

- `navigation.navigate()`
- `navigation.reload()`
- `navigation.forward()`
- `navigation.back()`
- `navigation.traverseTo()`

Navigations initiated by these methods can be intercepted to produce same-document navigations; if not intercepted, they result in cross-document navigations.

<button id="back" onclick="navigation.back()">Back</button>
<button id="forward" onclick="navigation.forward()">Forward</button>

## Navigating through history

### Going `back()` and `forward()`

```html
<button onclick="navigation.back()" id="back">Back</button>
<button onclick="navigation.forward()" id="forward">Forward</button>
```

Calling `back()` or `forward()` when there's no history entry in that direction will result in an `InvalidStateError` so its important to check the `navigation.canGoBack` or `navigation.canGoForward` properties before calling either method. 

```js
if (navigation.canGoBack) {
    navigation.back();
}
```

These properties are also useful for disabling in-page buttons.

```js
document.getElementById("back").disabled = !navigation.canGoBack;
document.getElementById("forward").disabled = !navigation.canGoForward;
```

**`back()` and `forward()` will not take the user to another origin and `canGoBack` and `canGoForward` will be `false` if the previous or next history entry is cross-origin.**

The [explainer](https://github.com/WICG/navigation-api?tab=readme-ov-file#sample-code) has the example of an in-page button that will take the user back to the previous history entry if it matches a particular URL, and `navigate()` to that URL if not. This would be useful for an image lightbox, for example. 

```js
backButtonEl.addEventListener("click", () => {
  if (navigation.entries()[navigation.currentEntry.index - 1]?.url === "/image-gallery") {
    navigation.back();
  } else {
    // If the user arrived here by typing the URL directly:
    navigation.navigate("/image-gallery", { history: "replace" });
  }
});
```

### Traversing to a particular history entry with `.traverseTo()`

`navigation.entries()` returns an array of `NavigationHistoryEntry` objects, each of which has a `key` property. Each entry looks something like this:

```js
{
id: "fd98618b-d66e-4271-a966-8aaa5a5b0b00",
index: 1,
key: "1e8f5c7a-0b69-4616-be4b-7e5ffb075894",
ondispose: null,
sameDocument: true,
url: "http://localhost:4321/blog/initiating-navigations/"
}
```

`traverseTo()` navigates to a specific history entry identified by its key. Let's look at an example of traversing two entries back. If there is any forward history, the current history entry will not be the last item in the array, so code like `navigation.entries().at(-2).key` won't suffice. Instead, traverse back or forwards from the current entry by making use of `currentEntry.index`. 

```js
const twoBack = navigation.entries()[navigation.currentEntry.index - 2];
navigation.traverseTo(twoBack.key);
```

## `navigation.navigate()` and `navigation.reload()`

The Navigation API isn't just a modern replacement for the History API, its also a replacement for the `location.assign()`, `location.replace()`, and `location.reload()` methods.

```js
// equivalent to location.assign(url)
navigation.navigate(url);

// equivalent to location.replace(url)
navigation.navigate(url, {history: "replace"});

// equivalent to location.reload()
navigation.reload()
```

Both the `location` methods and the `navigation` methods trigger the `navigate` event, but there are benefits to using the newer Navigation API methods:
- You can specify state for the history entry
- You can pass in `info` to be used in the `navigate` event handler
- They return promises allowing you to run code either when the URL has changed or when the navigation has finished

### `navigation.navigate()`
You don't have to specify the entire URL. All of the following are valid:

```js
navigation.navigate('/about');

const params = new URLSearchParams({order: "desc"});
navigation.navigate("?" + params.toString());

navigation.navigate('#example');
```

Specifying just the query params will remove the hash. Alternatively, create a URL object, update the relevant part, and then navigate: 

```js
const url = new URL(location.href);
url.searchParams.set('order', 'desc');
navigation.navigate(url.href);
```

### `replace` vs `push` navigations

By default, the `navigate()` method performs a push navigation ([except in rare circumstances](https://developer.mozilla.org/en-US/docs/Web/API/Navigation/navigate#:~:text=auto:%20The%20default%20value;%20will%20usually%20perform%20a%20push%20navigation%20but%20will%20perform%20a%20replace%20navigation%20under%20special%20circumstances%20(see%20the%20NotSupportedError%20description%20below).)). This can be configured:

```html
<button onclick="navigation.navigate('#tab2', {history: 'replace'})">Tab 2</button>
```

In the above example, using `history: "replace"` replaces the current `/about` history entry with `/about#tab2`. When it comes to back and forward navigation, its as if the user never visited `/about` and landed straight on `/about#tab2`.

In his article [_Your URL Is Your State_](https://alfy.blog/2025/10/31/your-url-is-your-state.html) Ahmad Alfy wrote the following:

> I clicked the URL, and it was the PrismJS download page with every checkbox, dropdown, and option pre-selected to match my exact configuration. Themes chosen. Languages selected. Plugins enabled. Everything, perfectly reconstructed from that single URL... Here was a URL doing far more than just pointing to a page. It was storing state, encoding intent, and making my entire setup shareable and recoverable. No cookies. No localStorage. Just a URL.

If the URL is being updated every time a user clicks a checkbox or radio input, the back button should not check or uncheck those inputs, it should take the user back to the previous page. For situations like this, `'replace'` is the right choice.

### State

If state needs to be shareable or bookmarkable, put it in the URL; if not, store it in the history entry state. 

#### Setting state

State can be set by the following methods:
- `navigation.navigate(url, {state: newState})`
- `navigation.reload({state: newState})`
- `navigation.updateCurrentEntry({state: newState})`

`state` can be set to any serializable value. 

```js
navigation.navigate('/admin', {state: {
  sidebarOpen: true
}})
```

State persists with each history entry: it’s restored whenever the user navigates back or forward to that entry.

Both `reload({state: newState})` and `updateCurrentEntry({state: newState})` update the state of the current history entry. The `updateCurrentEntry()` method does not perform a navigation, so is used to capture updates that have already happened. When the state needs to drive a UI update, use `navigation.reload()`, which will trigger a `navigate` event.

The `navigate()` and `reload()` methods can only set state for intercepted navigations. All websites, including those with no client-side routing, will have a `entries()` array and a `currentEntry`, but state will be ignored for cross-document navigations.

#### Reading state using `getState()`

Get the state of the current history entry:
```js
navigation.currentEntry.getState();
```

Log the state for the destination history entry:
```js
navigation.addEventListener("navigate", (event) => {
  console.log(event.destination.getState());
});
```

`getState()` can also read the state of any history entry in the array returned by `navigation.entries()`:

```js
navigation.entries()[0].getState();
```

#### Hash changes and state

In most respects, a fragment navigation is treated like any other navigation: it triggers the `navigate` event and creates a new history entry. However, you typically do not want to discard state just because a user clicked an anchor link. 

```html
<a href="#section1">Scroll to element</a>
```

Conveniently, for user-initiated hash navigations, the state is automatically carried over to the new history entry. However, if you programatically add a hash to the URL via `navigation.navigate()`, state is _not_ automatically carried over:

```js
navigation.updateCurrentEntry({state: "testing"});
navigation.navigate('#foobar');
navigation.currentEntry.getState(); // undefined
```

If needed, you can pass in the state manually: 

```js
navigation.navigate('#foobar', {state: navigation.currentEntry.getState()});
```

#### `navigation.getState()` vs `history.state`

The Navigation API and the legacy History API maintain state separately. Calling `getState()` only returns state set via Navigation API methods, while `history.state` does not include state set by the Navigation API.

## `info`

The `back()`, `forward()`, `reload()`, `traverseTo()` and `navigate()` all accept an options object, which can include an `info` property. `info` can be anything: a string, an object, a DOM node, etc. The `navigate` `event` automatically receives certain information about what initiated a navigation: `userInitiated`, `sourceElement` and `navigationType`, but there may be additional information about this particular navigation you wish to convey. The original [API explainer](https://github.com/WICG/navigation-api?tab=readme-ov-file#example-using-info) uses the following example:

```js
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && hasPreviousPhoto()) {
    navigation.navigate(getPreviousPhotoURL(), { info: { via: "go-left" } });
  }
  if (e.key === "ArrowRight" && hasNextPhoto()) {
    navigation.navigate(getNextPhotoURL(), { info: { via: "go-right" } });
  }
});

photoGallery.addEventListener("click", e => {
  if (e.target.closest(".photo-thumbnail")) {
    navigation.navigate(getPhotoURL(e.target), { info: { via: "gallery", thumbnail: e.target } });
  }
});
```

`info` is accessed in the corresponding `navigate` event handler.

```js
navigation.addEventListener('navigate', (event) => {
    console.log(event.info);
});
```

## `committed` and `finished`

The `back()`, `forward()`, `reload()`, `traverseTo()` and `navigate()` methods return an object containing two properties: `committed` and `finished`, each of which is a promise. Making use of these promises, we can run code at specific moments during and after the navigation. Both promises fulfill with the `NavigationHistoryEntry` the navigation created.

```js
const { committed, finished } = navigation.navigate("/about");
```

`committed` will fulfill once the URL changes (i.e. after the `precommitHandler()`, if there is one, immediately if not). This is also the point at which a new `NavigationHistoryEntry` for the destination has been created and become the `currentEntry`. `finished` will fulfill when all promises returned by the `intercept()` handler are fulfilled:

```js
const historyEntry = await committed;
console.log(historyEntry.url); // https://example.com/about

await finished;
console.log("navigation finished");
```

These promises only serve a purpose if you are intercepting the navigation. For cross-document navigations, the document is unloaded, so the promises will never settle.

<script>
    document.getElementById("back").disabled = !navigation.canGoBack;
    document.getElementById("forward").disabled = !navigation.canGoForward;
</script>