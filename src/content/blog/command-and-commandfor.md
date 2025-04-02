---
pubDate: 'Feb 28 2025'
title: The HTML command and commandfor attributes
heroImage: "/command.png"
description: Opening and closing popovers and dialogs without JavaScript using invoker commands, and custom commands with the JavaScript command event
---

`command` and `commandfor` are new attributes for the HTML `<button>` element. They provide a declarative way to open and close dialogs and popovers, without the need for JavaScript.

The `command` attribute specifies an action to be performed when the button is pressed. The possible values are:

<style>
td:not(:last-child) {
    width: max-content;
    white-space: nowrap;
}
</style>

|Command  | Behaviour|
|-------- | ---------- |
|`"show-modal"` | Show a modal `<dialog>`.|
|`"close"` | Close a `<dialog>`. |
|`"show-popover"` | Show a popover. |
|`"hide-popover"`| Hide a popover. |
|`"toggle-popover"`| Toggle a popover between showing and hidden.|

Custom values can also be used, which I'll cover later in this article. In the future more built-in commands [may be available](https://open-ui.org/components/future-invokers.explainer/).

The naming of the commands reflects the equivalent JavaScript method. The `show-modal` command, for example, is a HTML equivalent of `document.querySelector('dialog').showModal()`.

`commandfor` is used to specify the ID of the popover or dialog to be opened or closed or toggled.

```html
<button command="show-modal" commandfor="dialog-1">Show modal dialog</button>

<dialog id="dialog-1">
<h2>This is a modal dialog</h2>
<button command="close" commandfor="dialog-1">Close</button>
</dialog>
```

<button command="show-modal" commandfor="dialog-1">Show modal dialog</button>
<dialog style="max-width: 100%; border-radius: 6px; border: 0;" id="dialog-1">
<h2 style="margin: 0; font-size: 18px;">This is a modal dialog</h2>
<button style="margin-top: 12px;" command="close" commandfor="dialog-1">Close</button>
</dialog>

Prior to `command` and `commandfor`, there was no way to open a modal dialog without JavaScript. That was not the case for the popover API, which already had the `popovertargetaction` and `popovertarget` attributes, the functionality of which is duplicated by `command` and `commandfor`.

The following lines of code are equivalent:

```html
<button popovertarget="popover1">Toggle popover 1</button>
<div id="popover1" popover>Popover 1</div>

<button command="toggle-popover" commandfor="popover2">Toggle popover 2</button>
<div id="popover2" popover>Popover 2</div>
```

<div style="display: flex; gap: 12px; align-items: center;">
<button popovertarget="popover1">Toggle popover 1</button><div style="inset: auto; left: 16px; bottom: 16px; text-align: center; padding-inline: 16px;" id="popover1" popover>Popover 1</div>
<button command="toggle-popover" commandfor="popover2">Toggle popover 2</button>
<div style="inset: auto; left: 16px; bottom: 16px; text-align: center; padding-inline: 16px;" id="popover2" popover>Popover 2</div>
</div>

Its nice to have a consistent approach shared between popovers and dialogs. For toggling a popover, however, using one attribute rather than two may be preferable. Toggling a popover is the default behaviour when only `popovertarget` is specified, whereas `command` and `commandfor` must both be specified.

## The `command` event

The `command` event fires on the popover, dialog, or any other element with an ID referenced by `commandfor`. It does not fire on the button.

```html
<button command="toggle-popover" commandfor="popover">Toggle popover</button>
<div 
oncommand="event.target.textContent = `The ${event.command} command was invoked`"
id="popover" 
popover>
Placeholder content...</div>
```

<button command="toggle-popover" commandfor="popover">Toggle popover</button>
<div oncommand="event.target.textContent = `The ${event.command} command was invoked`" style="inset: auto; left: 16px; bottom: 16px; text-align: center; padding-inline: 16px;" id="popover" popover>Popover content</div>

Popovers and dialogs also have `toggle` and `beforetoggle` events, which fire whenever the element gets opened or closed — including via the escape key or light dismiss. The `command` event fires only when the associated button is pressed. The `command` event is primarily useful when working with custom commands.

`command` events are always non-bubbling.

## Custom commands

Unlike the built-in predefined commands, custom commands rely on JavaScript. The name of a custom command must start with two hyphens e.g. `command="--my-command"`.

```html
<button commandfor="example" command="--multi-col-view" value=2>Multi-column: 2 columns</button>
<button commandfor="example" command="--multi-col-view" value=3>Multi-column: 3 columns</button>
<button commandfor="example" command="--grid-view" value=2>Grid: 2 columns</button>
<button commandfor="example" command="--grid-view" value=3>Grid: 3 columns</button>
```

The `command` event contains a `source` property that references the button that caused the event to fire. This can be used to access `data-` attributes or a `value` from the relevant button.

```js
document.getElementById("example").addEventListener("command", (event) => {
    if (event.command === "--grid-view") {
        event.target.style.columnCount = "";
        event.target.style.display = "grid";
        event.target.style.gridTemplateColumns = `repeat(${event.source.value}, 1fr)`
    } else if (event.command === "--multi-col-view") {
        event.target.style.display = "";
        event.target.style.columnCount = event.source.value;
    }
});
```

<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">
<button commandfor="example" command="--multi-col-view" value="2">Multi-column: 2 columns</button>
<button commandfor="example" command="--multi-col-view" value="3">Multi-column: 3 columns</button>
<button commandfor="example" command="--grid-view" value="2">Grid: 2 columns</button>
<button commandfor="example" command="--grid-view" value="3">Grid: 3 columns</button>
</div>

<div style="width: fit-content; column-gap: 16px;" id="example" class="multi-col-layout">
<div>Item 1</div>
<div>Item 2</div>
<div>Item 3</div>
<div>Item 4</div>
<div>Item 5</div>
<div>Item 6</div>
</div>

<script>
document.getElementById("example").addEventListener("command", (event) => {
    if (event.command === "--grid-view") {
        event.target.style.columnCount = "";
        event.target.style.display = "grid";
        event.target.style.gridTemplateColumns = `repeat(${event.source.value}, 1fr)`
    } else if (event.command === "--multi-col-view") {
       event.target.style.display = "";
       event.target.style.columnCount = event.source.value;
    }
});
</script>
