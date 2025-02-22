---
pubDate: 'Dec 16 2024'
title: Cookie Store API
heroImage: "/cookiestore.png"
description: A modern asynchronous alternative to document.cookie
---
The Cookie Store API is a modern asynchronous alternative to `document.cookie`.

## Browser support

The Cookie Store API has been [available](https://caniuse.com/cookie-store-api) in Chrome and Edge since version 87, released back in 2020. The API shipped in [Safari 18.4](https://developer.apple.com/documentation/safari-release-notes/safari-18_4-release-notes#Web-API) and [Firefox 136](https://www.mozilla.org/en-US/firefox/136.0beta/releasenotes/#:~:text=Added%20support%20for%20the%20CookieStore%20API). Firefox and Safari decided to implement only a [subset](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Experimental_features#cookie_store_api) of the API, which is what I will cover in this article. A [polyfill](https://github.com/markcellus/cookie-store) is available.

## Set a cookie

```js
await cookieStore.set("cookie_test", "123");
```

To specify more than a name and value, you can pass in an object of [options](https://developer.mozilla.org/en-US/docs/Web/API/CookieStore/set#parameters):

```js
await cookieStore.set({
    name: "cookie_test", 
    value: "123",
    domain: "example.com",
    expires: new Date('Wed, 1 Jan 2025 00:00:00 GMT')
});
```

## Get a cookie

```js
const cookie = await cookieStore.get("cookie_test");
console.log(cookie);
```

The `get()` method returns a promise that resolves with an object that contains a `name` and `value` property:

```js
{
name: "cookie_test",
value: "123"
}
```

In Chrome/Edge/Samsung Internet, some additional properties are included in the cookie object but these are [unlikely](https://github.com/WICG/cookie-store/issues/238) to be exposed by other browsers.

## Get multiple cookies

`getAll()` returns a promise that resolves with an array of cookie objects.

```js
const cookies = await cookieStore.getAll()
```

## Delete a cookie

```js
await cookieStore.delete("cookie_test");
```

## Cookie `change` event

The `change` event is fired every time a cookie is set or deleted.

```js
cookieStore.addEventListener("change", function (event) {
  for (const cookie of event.deleted) {
    console.log(`cookie ${cookie.name} was deleted`);
  }

  for (const cookie of event.changed) {
    console.log(`cookie ${cookie.name} was set`);
  }
});
```

This [event](https://developer.mozilla.org/en-US/docs/Web/API/CookieChangeEvent) has a `deleted`  property, which is an array containing all cookies that were removed, either because they were explicitly deleted or because they expired, and a `changed` property, which is an array containing any newly created cookies.

## Differences between Chrome/Edge/Samsung Internet and other browsers

MDN currently covers further aspects of the API not mentioned in this article, including features that are only implemented in Chrome/Edge/Samsung Internet and that have not achieved cross-browser consensus. It is likely that the scope of the spec will be [reduced](https://github.com/WICG/cookie-store/issues/241) inline with the opinions of Safari and Firefox. Safari and Firefox only expose the [name and value](https://github.com/WICG/cookie-store/issues/238) of cookies returned from `get()` or `getAll()`, whereas Chromium-based browsers include additional metadata. Firefox have stated that "At this time we're not ready to expose `ServiceWorkerRegistration.cookies` or implement the `CookieStoreManager` as proposed".

- [Safari position](https://github.com/WebKit/standards-positions/issues/36)
- [Firefox position](https://github.com/mozilla/standards-positions/issues/94#issuecomment-2192528669)
