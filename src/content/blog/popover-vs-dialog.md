---
pubDate: 'Mar 13 2025'
title: Popover vs Dialog
heroImage: "/popover-vs-dialog.png"
description: Modality, light-dismiss, the popover attribute and the dialog element
---

<style>
  li + li {
    margin-top: 12px;
  }

  small code {
    font-size: 15px !important;
  }
</style>

<small>*Browser support note: some of the following examples make use of the `command` and `commandfor` attributes and the `closedby` attribute, which currently only work in Chrome and Edge version 135 and 134 respectively.*</small>

Popovers and dialogs are similar in many ways. That's particularly the case since HTML introduced the `closedby` attribute for the dialog element, enabling light-dismiss functionality. So how are they different? A dialog can be modal or non-modal, whereas a popover is never modal*. Let's compare both kinds of dialog to the popover API.

<small>*Technically you _could_ toggle the `inert` attribute or the forthcoming CSS `interactivity` property when a popover opens e.g `body:has(:popover-open) main { interactivity: inert;}` but you almost certainly shouldn't, as that's better solved by the `showModal()` method of the dialog API.</small>

## Popover vs modal dialog

The key difference between a popover and a modal dialog is modality. By its very definition, a modal dialog will cause everything outside of the dialog to be inert.

Inert is similar to using the `disabled` HTML attribute together with setting `user-select: none` in CSS, but is more comprehensive: 

- inert elements and their children are hidden from assistive technologies.
- The browser's find-in-page search feature will not find any text within an inert element.

Focus is trapped in the dialog, and the only thing that remains interactive is the dialog. 

Modality is a pretty major distinction. The differences between a popover and a non-modal dialog are more subtle.

## Popover vs non-modal dialog

A popover and a non-modal dialog can be configured with similar functionality.

<style>
  dialog button:focus, [popover] button:focus, button:focus {
    outline: dashed 2px blue !important;
    outline-offset: 1px !important;
  }
</style>

```html
<dialog id="non-modal-dialog" closedby="any" style="position: fixed; margin: auto; inset: 0;">
    An example dialog
</dialog>
<button onclick="document.querySelector('#non-modal-dialog').show();">Open dialog</button>

<div id="popover" popover>An example popover</div>
<button commandfor="popover" command="show-popover">Open popover</button>
```

<dialog id="non-modal-dialog" closedby="any" style="position: fixed; margin: auto; inset: 0;">
An example dialog
</dialog>
<button onclick="document.querySelector('#non-modal-dialog').show();">Open dialog</button>

<div id="popover" popover>
An example popover
</div>
<button commandfor="popover" command="show-popover">Open popover</button>

<p style="margin-bottom: 12px;">Or to take another example:</p>

```html
<dialog id="dialog2" closedby="none" style="position: fixed; margin: auto; inset: 0;">
<h2>A non-modal dialog</h2>
<button onclick="document.querySelector('#dialog2').close();">Close</button>
</dialog>
<button onclick="document.querySelector('#dialog2').show();">Open dialog</button>

<div id="pop" popover="manual">
<h2 style="margin-top: 0;">A Manual popover</h2>
<button autofocus commandfor="pop" command="hide-popover">Close</button>
</div>
<button commandfor="pop" command="show-popover">Open popover</button>
```

<dialog id="dialog2" closedby="none" style="position: fixed; margin: auto; inset: 0;">
<h2 style="margin-top: 0;">A non-modal dialog</h2>
<button onclick="document.querySelector('#dialog2').close();">Close</button>
</dialog>
<button onclick="document.querySelector('#dialog2').show();">Open dialog</button>

<div id="pop" popover="manual">
<h2 style="margin-top: 0;">A Manual popover</h2>
<button autofocus commandfor="pop" command="hide-popover">Close</button>
</div>
<button commandfor="pop" command="show-popover">Open popover</button>

So what are the differences?

- Popovers are always displayed in the top layer. Non-modal dialogs do not use the top layer.
- `::backdrop` can be used for a popover, but not for a non-modal dialog.
- The functionality of a popover can be implemented entirely in markup via the `command` and `commandfor` attributes or the `popovertarget` attribute. There is no `command` to open a non-modal dialog.
- They have different default styles. Popovers are set to `position: fixed` by default, whereas non-modal dialogs are set to `position: absolute`. A popover is both vertically and horizontally centered via `inset: 0` whereas a non-modal dialog is horizontally centered but positioned at the top.
- A non-modal dialog can be open by default without using JavaScript via the `open` attribute. There is no equivalent attribute for a popover.

Additionally, there are some ways that both non-modal and modal dialogs differ from popovers:

- When not set to `hint` or `manual`, a popover will automatically close other popovers when opened. While it is unusual to display more than one dialog at a time, opening a dialog does not close other dialogs.
- The focus behaviour is different. Opening a dialog will focus the first focusable element within the dialog. By default, focusing an element within a popover requires tabbing to that element. However, the `autofocus` attribute can be used to automatically focus a particular element every time the popover is opened, as shown in the above example. Unlike a modal dialog, neither a popover nor a non-modal dialog trap focus.
- When using anchor positioning in CSS, the button that opens a popover will automatically be its anchor. Should you want to use anchor-positioning for a dialog, that relationship would need to be explicitly established via `anchor-name` and `position-anchor`.

## `<dialog popover>`: combining the popover API and the dialog element

As mentioned above, a dialog that uses the `open` attribute or the `show()` method will not be placed in the top layer. This is unfortunate as it can lead to issues with `z-index` and page content overlapping the dialog. There is only one way to create a non-modal dialog that is placed in the top layer: use the `popover` attribute on a `<dialog>` element and show the dialog via a popover API method or command. 

```html
<dialog popover id="dialog">Example popover dialog</dialog>
<button command="show-popover" commandfor="dialog">Show dialog</button>
```

<dialog popover id="dialog">Example popover dialog</dialog>
<button command="show-popover" commandfor="dialog">Show dialog</button>

The functionality for this dialog is coming from the Popover API, rather than being intrinsic to the dialog element. There aren't many behavioural differences between `<div popover>` and `<dialog popover>`, but it is important to use the most semantically correct element: the dialog element has the advantage of an implicit ARIA role of *dialog*. There is one behavioural difference: when shown, `<dialog popover>` will focus the first focusable element within the dialog, whereas `<div popover>`, for example, will not. 

How a dialog/popover combo behaves depends on the method or command used to open it. Both of the following buttons open the same `<dialog>` element. 

<style>
  #example::backdrop {
    background-color: rgba(0,0,0,.5);
  }
</style>

<dialog popover id="example" style="padding: 16px;">
<h2 style="margin-top: 0;">Dialog or popover?</h2>
<button commandfor="example" command="hide-popover">Close popover... but not dialog</button>
<button onclick="document.querySelector('#example').close();">Close dialog... but not popover</button>
</dialog>

<button commandfor="example" command="show-popover">Show popover</button>
<button onclick="document.querySelector('#example').show();">Open dialog</button>

```html
<dialog popover id="example">
<h2>Dialog or popover?</h2>
<button commandfor="example" command="hide-popover">Close popover... but not dialog</button>
<button onclick="document.querySelector('#example').close();">Close dialog... but not popover</button>
</dialog>

<button commandfor="example" command="show-popover">Show popover</button>
<button onclick="document.querySelector('#example').show();">Open dialog</button>
```

If opened via a `toggle-popover` or `show-popover` `command`, or by the `showPopover()` method, it will act like a popover. If opened via `show()` or via the `open` attribute, the dialog will get certain default styles due to the presence of the popover attribute, (e.g. it will be `position: fixed` by default rather than `position: absolute`), but other than that the `popover` attribute will have no effect. There's no universally applicable close method: if opened as a popover, the element must be closed via a popover method or command, if opened as a dialog, it must be closed via `close()`.

One useful piece of functionality you lose by using the popover API is the `closedby` attribute. This attribute currently only works if a dialog is opened via `show()`, `showModal()` or the `open` attribute. If you think it should work for `<dialog popover>`, please leave a 👍 or a thoughtful comment on this [GitHub issue](https://github.com/whatwg/html/issues/11105).
