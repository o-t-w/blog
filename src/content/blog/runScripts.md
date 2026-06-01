---
pubDate: 'Jun 01 2026'
title: runScripts
heroImage: "/runScripts.png"
description: Run scripts when dynamically setting HTML.  
---

Safe DOM methods, such as `setHTML()`, will always remove `<script>` elements, whereas unsafe methods like `setHTMLUnsafe()` will not (unless explicitly told to by a provided sanitizer). By default, scripts dynamically injected into the page with these unsafe methods are not executed post-insertion. 

```js
const html = `<script type="module" src="testscript.js"><\/script>`;
const div = document.querySelector('div');
div.setHTMLUnsafe(html); // script is not executed
```

If you view source, you'll see that the `<script>` has been added, but it won't actually do anything: the script is on the page, but disabled/inactive. By setting `runScripts` to `true`, any scripts you dynamically insert will run:

```js
div.setHTMLUnsafe(html, {runScripts: true}); // script is executed
```

This is a new feature that is currently supported in Chrome Canary.