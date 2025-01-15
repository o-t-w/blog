---
pubDate: 'Jan 15 2025'
title: What's new with <dialog>
heroImage: "/dialog.png"
description: Zero-JavaScript modals, light dismiss functionality, toggle events and more...
---

<style>
body:has(dialog[open]) {
    overflow: hidden;
}

html {
    scrollbar-gutter: stable;
}

.btn-destructive {
    color: white;
    background-color: #b80010;
    border: 0;
    border-radius: 4px;
}

[class*=btn] {
    font-family: system-ui;
    padding: 8px 12px;
}
</style>

## Open and close dialogs without JavaScript

The `command` and `commandfor` attributes are currently supported in Chrome Canary.

`command` and `commandfor` are two new attributes that can be used on a HTML `button` element.
Setting the `command` attribute to `"show-modal"` will open a `dialog` elements. Setting it to `"close"` will close a `dialog`. The `commandfor` attribute is used to specify which `dialog` you want to open or close, by referencing an `id` on the `dialog` element.

```html
<button commandfor="dialog-1" command="show-modal">Show modal</button>
<dialog id="dialog-1">
I am some dialog content...
 <button commandfor="dialog-1" command="close">Close dialog</button>
</dialog>
```

<button class="btn" commandfor="dialog-1" command="show-modal">Show modal</button>
<dialog id="dialog-1">
I am some dialog content...
 <button class="btn" style="display: block; margin-top: 12px;" commandfor="dialog-1" command="close">Close dialog</button>
</dialog>

## `closedby` attribute

The `closedby` attribute was recently added to the HTML specification and is currently supported in Chrome Canary.

Modals are used in different ways. Some may ask an important question like "confirm deletion" that the user needs to answer before closing the dialog. Others, such as promotional marketing dialogs, should be easy to close without the user needing to hunt for a small close button.

Its common to let the user close a dialog by clicking outside of it, anywhere else on the page. This behaviour is known as _light dismiss_ and can be enabled by setting the `closedby` attribute to `"any"`.

```html
<dialog closedby="any">
I am some dialog content...
</dialog>
```

<button class="btn" commandfor="dialog-2" command="show-modal">Show modal</button>
<dialog closedby="any" id="dialog-2">
I am some dialog content...
</dialog>

By default, a HTML `<dialog>` is closed by the escape key. `closedby="none"` disables this behaviour.

```html
<dialog closedby="none">
Important question
<button>Delete everything</button>
<button>Save changes</button>
</dialog>
```

<button class="btn" commandfor="dialog-3" command="show-modal">Show modal</button>
<dialog closedby="none" id="dialog-3">
<h2 style="margin: 0;">Important question</h2>
<div style="margin-top: 16px; display: flex; gap: 16px;">
<button class="btn-destructive" command="close" commandfor="dialog-3">Delete everything</button>
<button class="btn-action" command="close" commandfor="dialog-3">Save changes</button>
</div>
</dialog>

## Toggle events

The `dialog` element dispatches a `beforetoggle` event just before it is shown or hidden.

```js
dialog.addEventListener('beforetoggle', function(event) {
  console.log(`${event.oldState}, ${event.newState}`);
});
```

The `dialog` element dispatches a `toggle`  event immediately after it is shown or hidden.

```js
dialog.addEventListener('toggle', function(event) {
  console.log(`${event.oldState}, ${event.newState}`);
});
```

These events will fire regardless of how the `dialog` was opened or closed: whether that be by pressing the escape key, light dismiss, pressing a button with a `command` attribute set to `"show-modal"` or `"close"`, or via a JavaScript `showModal()`, `show()` or `close()` method.

Further information about [`toggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/toggle_event) and [`beforetoggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforetoggle_event) is available on MDN.

The `toggle` and `beforetoggle` events are currently supported in Firefox and Google Chrome/Microsoft Edge.

## `scrollbar-gutter`

Its a common practice to set `overflow: hidden` on the `body` element when a dialog is open, to prevent the page from scrolling. When the scrollbar gets hidden, the space it took up is vacated, leading to a layout shift*. This is a jarring experience for users. The `scrollbar-gutter` CSS property can prevent the layout from changing when a scrollbar is added or removed.

```css
html {
  scrollbar-gutter: stable;
}
```

`scrollbar-gutter: stable` will reserve space for the scrollbar.

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="ZYzOQJX" data-pen-title="dialog..." data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/ZYzOQJX">
  dialog...</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

*Whether a scrollbar causes the layout to shift will depend on the type of scrollbar the user has chosen in their OS settings. On iOS and macOS, users can opt to use an "overlay scrollbar" which is placed above the content of the page and only shown when the user scrolls. Overlay scrollbars do not cause layout shifts. `scrollbar-gutter` has no effect when a device is set to use overlay scrollbars.

Dialogs aren't the only use case for `scrollbar-gutter`. If content is dynamically added to a page, the page may go from having no scrollbar to having a scrollbar, so this property would again come in handy.

`scrollbar-gutter` is supported in all browsers.
