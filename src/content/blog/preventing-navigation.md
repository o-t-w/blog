---
pubDate: 'Dec 12 2025'
title: "Preventing same-document and cross-document navigation"
heroImage: "/prevent-navigation.png"
description: "Using .preventDefault() on the navigate and beforeunload events"
---

<style>
    dialog {
        overscroll-behavior: contain;
        padding: 24px;
        width: 300px !important;
        max-width: 90vw !important;
    }

    dialog h2 {
        margin-top: 0 !important;
        margin-bottom: 12px;
    }

    dialog p {
        margin-bottom: 12px !important;
        margin-top: 0 !important;
    }

    ::backdrop {
        overscroll-behavior: contain;
        overflow: hidden;
    }

    dialog button {
        font-size: 16px;
        font-family: system-ui;
        padding: 4px 12px;
    }
</style>

If a user is in the middle of a task like filling out a form, you can prevent unintended data loss by showing a confirmation modal if the user attempts to navigate away from the current page:

```js
window.addEventListener('beforeunload', function(event) {
    if (shouldWarnYou()) {
        event.preventDefault();
    }
});
```

The dialog shown when calling `.preventDefault()` on the `beforeunload` event is fully controlled by the browser. The wording used differs between browsers and can't be customised. In Safari its a brief "Are you sure you want to leave this page?" while on Firefox its a wordy "This page is asking you to confirm that you want to leave — information you’ve entered may not be saved." There is no way to style the dialog.

<img src="/prevent-navigation.png" alt="screenshot of a dialog featuring the text Leave site? Changes that you made may not be saved. There is a Cancel button and a Leave button">

The `beforeunload` event fires when a user is navigating from one HTML document to another (or closing the browser window or tab) — it doesn't work for soft navigations. By contrast, the `navigate` event can be used to implement similar functionality for both cross-document and same-document navigations. Calling `preventDefault()` on the `navigate` event will not prevent a user from closing the window or tab or from navigating by typing a URL directly into the address bar, but will prevent all other forms of navigation, both user-initiated (clicking links) and programmatic (History API, Navigation API, `location`, etc).

```js
navigation.addEventListener('navigate', function(event) {
    if (!event.cancelable) return; // don't attempt to prevent the navigation if it cannot be prevented.
    if (shouldWarnYou()) {
    event.preventDefault();
    }
});
```

Unlike the `beforeunload` event, a confirmation dialog is not shown by the browser, so the above code has trapped the user with no obvious option to proceed with their navigation (although clicking the back key multiple times will override `.preventDefault()`). You'll need to implement a dialog yourself — which means you have full control over the styling and text content of the dialog.
<!-- 
```html
<dialog>
<form method="dialog">
    <h2>You have unsaved changes.</h2>
    <button id="leave">Leave</button>
    <button>Stay</button>
</form>
</dialog>
```

```js
const dialog = document.querySelector('dialog');
const leaveButton = document.getElementById('leave');

navigation.addEventListener('navigate', function(event) {
    if (event.downloadRequest || event.hashChange || event.formData) return; // boilerplate
    if (!event.cancelable) return; // don't attempt to show the dialog if event.preventDefault() won't work

    if (shouldWarnYou() && (event.info !== "letgo")) {
        event.preventDefault();
        leaveButton.value = event.destination.url; // if this button gets clicked, its value becomes the returnValue of the dialog
        dialog.showModal();
    }
});

dialog.addEventListener('close', function(event) {
    if (event.target.returnValue === "") return; // user clicked the Stay button
    navigation.navigate(event.target.returnValue, {info: "letgo"}); // this navigation will itself trigger the navigate event listener, pass some info so we don't get stuck in an infinite loop...
});
```

By default, a `<dialog>` can be closed by clicking the escape key. Should that keep the user on the current page? Or let them get on with their navigation? Given the above JavaScript, it will keep them on the page. The UX is debatable, but this _might_ be one of the rare use cases for the `closedby` attribute:

```html
<dialog closedby="none">
```

This disables the escape key, forcing the user to make a decision via the modal.  -->

Click the button to see this in action (this blog does not use client-side routing, so this demo does not have full parity with how this would work in a SPA: the back and forward buttons won't bring up the modal, because cross-document traversals can't be prevented).

<div class="not-content">
<button onclick="shouldWarnYou = true">Require confirmation to leave this webpage</button>
<div style="display: flex; margin-top: 12px; flex-wrap: wrap; gap: 12px; align-items: center;">
<a href="/blog">Blog home</a>
<a href="https://example.com/">example.com</a></div>
</div>

The Navigation API is primarily focused on same-origin navigations. You can't intercept a navigation to a different website, for example. That same-origin limit doesn't apply to cancelling a navigation, so the dialog will show for both of the above links.

Calling `.preventDefault()` on the `navigate` event prevents the `beforeunload` event from firing, so you can use both approaches without worrying about both dialogs appearing at the same time.
 
<button id="preventunload">Require confirmation to close the browser tab</button>

The fact that the dialogs don't look the same isn't ideal, but is unavoidable.

<dialog class="not-content" closedby="none">
<form method="dialog">
    <h2>Are you sure?</h2>
    <p>You have unsaved changes</p>
    <button>Stay</button>
    <button id="leave">Leave</button>
</form>
</dialog>

<script>
    var shouldWarnYou = false;
    const dialog = document.querySelector('dialog');
const leaveButton = document.getElementById('leave');
const preventunloadbutton = document.getElementById('preventunload');

preventunloadbutton.addEventListener('click', function(event) {
    window.addEventListener('beforeunload', function(beforeunloadevent) {
        beforeunloadevent.preventDefault();
    })
})

navigation.addEventListener('navigate', function(event) {
    if (event.downloadRequest || event.hashChange || event.formData || !event.cancelable) return;
    if (shouldWarnYou && (event.info !== "letgo")) {
        event.preventDefault();
        leaveButton.value = event.destination.url;
        dialog.showModal();
    }
});

dialog.addEventListener('close', function(event) {
    if (event.target.returnValue === "") { // user clicked the Stay button
        return
    } else {
        navigation.navigate(event.target.returnValue, {info: "letgo"}); // this navigation will itself trigger the navigate event listener. To avoid an infinite loop, check for the info value in the if statement
    }
});
</script>