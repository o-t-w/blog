---
pubDate: 'Mar 16 2025'
title: A better non-modal dialog with the Popover API
heroImage: "/non-modal-dialog.png"
description: Combining the popover attribute with the dialog element
---

<style>
::backdrop {
    background-color: rgba(0,0,0,.1) !important;
  }

  dialog {
    padding: 8px 12px;
    left: 16px;
    bottom: 16px;
    top: auto;
    right: auto;
  }
</style>

<small>*Browser support note: the following examples make use of the `command` and `commandfor` attributes, which currently requires Chrome/Edge version 135 or Safari Technology Preview.*</small>

## What's wrong with `show()`?

A non-modal dialog opened via the `show()` method has the following limitations:

- The dialog will not use the top layer.
- No `::backdrop` pseudo-element. Using `::backdrop` for a non-modal dialog is somewhat uncommon, but so long as its kept mostly transparent, its a viable UX choice.

Without the popover API, there is no HTML-based way to open or close a non-modal dialog, whereas a popover can be opened and closed via either the `popovertarget` and `popovertargetaction` attributes or the `command` and `commandfor` attributes.

## `<dialog popover>`: combining the popover API and the dialog element

The only one way to create a non-modal dialog that is placed in the top layer and has a `::backdrop` pseudo-element is by using the `popover` attribute and showing the dialog via a popover API method or command.

A dialog that can be closed via light dismiss or by pressing the escape key:

```html
<dialog popover id="dialog1">Example popover dialog</dialog>
<button command="show-popover" commandfor="dialog1">Show dialog</button>
```

<dialog popover id="dialog1">Example popover dialog</dialog>
<button command="show-popover" commandfor="dialog1">Show dialog</button>

A dialog without light dismiss and that is not closed via the escape key:

```html
<dialog popover="manual" id="dialog2">
Example popover dialog
<button command="hide-popover" commandfor="dialog2">Close</button>
</dialog>

<button command="show-popover" commandfor="dialog2">Show dialog</button>
```

<style>
    #dialog2:popover-open {
        display: flex;
        gap: 12px;
        align-items: center;
    }
</style>

<dialog style="
    gap: 12px;
    align-items: center;" popover="manual" id="dialog2">
Example popover dialog
<button command="hide-popover" commandfor="dialog2">Close</button>
</dialog>
<button command="show-popover" commandfor="dialog2">Show dialog</button>

## Does it behave more like a dialog, or more like a popover?

How a dialog/popover combo behaves depends on the method or command used to open it. If a dialog element includes the `popover` attribute but is opened via `show()` or via the `open` attribute, the `popover` attribute will have no effect. If opened via a popover API command or method, it will act like a popover in almost all respects:

- In CSS the dialog will match `:popover-open` but not `[open]` or `:open`
- The element can only be closed via a popover method or command

There aren't many behavioural differences between `<div popover>` and `<dialog popover>`, but it is important to use the most semantically correct element: the dialog element has the advantage of an implicit ARIA role of *dialog*. The one notable functional difference is focus behaviour: when shown, `<dialog popover>` will focus the first focusable element within the dialog, whereas `<div popover>`, for example, will not.

## Shortcomings of `<dialog popover>`

### The `closedby` attribute

One useful piece of functionality you lose by using the popover API is the `closedby` attribute. This attribute currently only works if a dialog is opened via `show()`, `showModal()` or the `open` attribute. `<dialog popover="auto">` has equivalent close behaviour to `closedby=any`. `<dialog popover="manual">` has the same close behaviour as as `closedby=none`. There is no popover equivalent to `closedby=closerequest`. If you think `closedby` should work for dialogs that use the popover API, please leave a 👍 or a thoughtful comment on this [GitHub issue](https://github.com/whatwg/html/issues/11105). 

### The `open` attribute

There's no equivalent to the `open` attribute for the Popover API. `<dialog popover open>` will open the dialog, but the `popover` attribute will have no effect, meaning the dialog will not be in the top layer, will not have a `::backdrop` pseudo-element, and can only be closed by the `close` method or command. In CSS it will match `[open]` and `:open` but not `:popover-open`. There is a [GitHub issue](https://github.com/openui/open-ui/issues/771).
