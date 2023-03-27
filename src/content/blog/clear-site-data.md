---
author: Ollie Williams
pubDatetime: 2023-03-27T15:22:00Z
title: The clear-site-data header
postSlug: clear-site-data-header
featured: false
draft: false
tags:
  - headers
ogImage: "logosquare.png"
description: Wipe data from a web browser with this header
---

> This is an important privacy feature for logging out and truly wiping the client without having to enumerate everything that might need deletion.

<cite>— [Malte Ubl](https://twitter.com/cramforce/status/1583064493688426503), CTO Vercel</cite>

> This is a privacy and security enhancing feature. A sensitive website can trigger local data deletion after the user signs out.

<cite>— [Google](https://chromestatus.com/feature/4713262029471744)</cite>

> Developers may instruct a user agent to clear various types of relevant data by delivering a `Clear-Site-Data` HTTP response header in response to a request. The `Clear-Site-Data` HTTP response header field sends a signal to the user agent that it ought to remove all data of a certain set of types.

<cite>— [Clear Site Data spec](https://w3c.github.io/webappsec-clear-site-data/)</cite>

Support for the `clear-site-data` header landed in Safari 16.4. It's been supported by Chrome and Firefox for years.

When a user signs out of an application, or deletes their account, you might want to remove data being stored by their browser. Let’s look at the different kinds of data you can remove with this header (the code examples use the Express framework):

## storage

```js
res.header("Clear-Site-Data", '"storage"');
```

`"storage"` will clear the following:

- localStorage (executes `localStorage.clear`)
- sessionStorage (executes `sessionStorage.clear`)
- IndexedDB (for each database execute [`IDBFactory.deleteDatabase`](https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/deleteDatabase))
- Service workers are terminated and deregistered (for each service worker registration, execute [`ServiceWorkerRegistration.unregister`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/unregister))
- [FileSystem API data](https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API)

## cookies

```js
res.header("Clear-Site-Data", '"cookies"');
```

Pretty self-explanatory.

To clear storage and cookies:

```js
app.get("/", (req, res) => {
  res.header("Clear-Site-Data", '"cookies", "storage"');
  res.sendFile(path.join(__dirname, "index.html"));
});
```

## cache

Firefox had implemented the “cache” type but they purposefully [removed it](https://groups.google.com/a/mozilla.org/g/dev-platform/c/I939w1yrTp4?pli=1). It is supported by other browsers.

## Wildcard (`*`)

The wildcard character [isn’t currently supported in Google Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=898503).

```js
res.header("Clear-Site-Data", '"*"');
```

The wildcard character (_) is equivalent to specifying all possible types. So for now `'"_"'` and`'"cookies", "storage", "cache"'` are equivalent. It’s feasible that more types will be added in the future, which the wildcard would automatically include.

There’s also `executionContexts` but it is not implemented in any browser and possibly never will be so I won’t discuss it here.

## Check it worked

Firefox will helpfully log a message in the console.

![](/public/clear.png)

Check out the Application tab in any browser and you should see that all the data has been removed.

![](/public/applicationtab.png)
