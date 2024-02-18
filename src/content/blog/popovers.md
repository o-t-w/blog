---
pubDate: 'Feb 17 2024'
title: Menus, toasts and more with the Popover API, the dialog element, invokers, anchor positioning and @starting-style
tags:
  - HTML
heroImage: "/popover.png"
description: Dropdowns, menus, tooltips, comboboxes, toasts — the popover HTML attribute will make building a large variety of UI components easier.
---

Dropdowns, menus, tooltips, comboboxes, toasts — the `popover` attribute will make building a large variety of UI components easier. Unlike a dialog, a popover is always [non-modal](https://hidde.blog/dialog-modal-popover-differences/) — meaning they don't block interaction with anything else on the page. The `popover` attribute can be used on any HTML element, so you have the flexibility to choose whichever element is most appropriate semantically for each particular use case. To toggle a popover open and closed, a `button` element needs to include an `invoketarget` attribute with a value that matches the `id` of the popover.

```html
<button invoketarget="foobar">Toggle popover</button>

<div id="foobar" popover>
  Popover content goes here...
</div>
```

A `<button>` with an `invoketarget` attribute is called an _invoker_. Invokers might eventually bring all sorts of power to HTML markup, but in its first iteration its limited to opening and closing popovers and dialogs. You don’t need `onclick=` or `addEventListener`, it’ll just work. 

The fact that popovers work without JavaScript is nice, but toggling `display: none` on an element using JS was never challenging. Popovers do, however, bring far more to the table:

- Popovers make use of the top layer.  
- Light-dismiss functionality: clicking outside of the popover will close the popover.
- Hitting the escape key will close the popover.
- Focus management: when you open a popover, the next tab stop will be the first focusable element inside the popover. If you've focused an element within the popover and then close the popover, focus is returned to the correct place (this was tricky to get right with JavaScript).

## Browser support
The `popover` attribute is supported in Chrome, Safari, and behind a flag in Firefox. The `popovertarget` attribute currently has better browser support than `invoketarget`. `popovertarget` is popover-specific, offering a declarative way to toggle popovers open and closed. `popovertarget` will likely eventually be [deprecated and replaced](https://github.com/openui/open-ui/issues/869) by the more flexible `invoketarget`. After popovers shipped in Chrome, some smart people realised it would also be handy to have a declarative way for buttons to open dialogs and perform other tasks, which is why there are two ways to do the same thing. A [polyfill for invokers](https://www.npmjs.com/package/invokers-polyfill) is available.

## Light dismiss
The `popover` attribute can be set to either `auto` (the default) or `manual`. When set to `auto`, the popover has light dismiss functionality: if the user clicks outside of the popover, the popover is closed. Pressing the escape key will also close the popover. Only one `auto` popover is ever open at a time.

When set to `manual`, there is no light dismiss functionality and the escape key does not close the popover. The popover must be explicitly closed by pressing the button again (or by calling `hidePopover()` in JavaScript). Multiple `manual` popovers can be open at the same time. 

```html
<button invoketarget="foobar">Toggle popover</button>

<div id="foobar" popover="manual">
  Popover content goes here...
</div>
```

## Invoker actions

Along with the `invoketarget` attribute, a button can also optionally include an `invokeaction` attribute. The different actions are listed below.

<table>
    <thead>
    <tr>
    <th>Action</th>
    <th>Description</th>
    </tr>
    </thead>
   <tbody>
    <tr>
     <td><code data-x="">auto</code></td>
     <td>If the target set by <code>invoketarget</code> is a popover <code>auto</code> will call <code>.togglePopover()</code>. If the target is a dialog it will call <code>showModal()</code> if the dialog is closed and will close the dialog if the dialog is open.</td>
     </tr>
    <tr>
     <td><code data-x="">showpopover</code></td>
     <td>Show a popover.</td>
    </tr>
    <tr>
     <td><code data-x="">hidepopover</code></td>
     <td>Close a popover.</td>
    </tr>
    <tr>
     <td><code data-x="">showmodal</code></td>
     <td>Open a dialog element as modal.</td>
    </tr>
    <tr>
     <td><code data-x="">close</code></td>
     <td>Close a dialog element.</td>
    </tr>
  </table>

`auto` is the default — you are free to omit the `invokeaction` attribute if you want this automatic behaviour. 

Using invokers for the dialog element looks much the same as the popover example:

```html
<button invoketarget="my-dialog">Open Dialog</button>

<dialog id="my-dialog">
  Dialog content goes here.
  <button invoketarget="my-dialog" invokeaction="close">Close dialog</button>
</dialog>
```

Along with built-in actions, developers can write custom actions. This is outside the scope of this article as a custom action [could do anything](https://codepen.io/keithamus/pen/abXbzqv) — it need not be related to dialogs or popovers. 

While a selling point of invokers is forgoing JavaScript, they also provide a new JavaScript `invoke` event should you need more than the default behaviour. This event is fired on the popover or dialog, not the button.

```js
document.querySelector("[popover]").addEventListener("invoke", function(event) {
    console.log(event.action);
    console.log(event.invoker);
    // do something useful here...
  });
```

Within the event handler you can get a reference to whichever button triggered the invocation with `event.invoker` and determine the action specified by `invokeaction` with `event.action`.

## Popover methods and events

For many use cases, the popover API doesn’t require JavaScript. What if we want to display a toast notification without a user first interacting with a button, for example?

There are methods to show, hide, or toggle a popover element: `.showPopover()`, `.hidePopover()` and `.togglePopover()`, respectively. 

```js
document.getElementById('toast').showPopover();
```

When it comes to listening to events on the popover, there’s just one: a `toggle` event that fires both when the popover gets shown and when it gets hidden (there are no separate open or close events). This would be useful for a toast alert that automatically disappears after a set amount of time, for example, as there’s no markup or CSS based way to do that. 

Its worth checking that the popover isn’t already hidden before calling `hidePopover()`. We can do that with either `.matches(':popover-open')` or [`.checkVisibility()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/checkVisibility), both of which will return `true` if the popover is open. 

```js
toast.addEventListener("toggle", function (event) {
  if (event.target.matches(":popover-open")) {
    setTimeout(function () {
      toast.hidePopover();
    }, 3000);
  }
});
```

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="XWxVWyw" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/XWxVWyw">
  Toast using popover API with entry and exit animation</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Default popover styles

By default a popover is set to `position: fixed` and displayed in the center of the viewport with a solid black border but you're free to style it however you like. The styles the browser applies to a popover look something like this:

```css
[popover] {
    position: fixed;
    width: fit-content;
    height: fit-content;
    inset: 0px;
    margin: auto;
    border: solid;
    padding: 0.25em;
}
```

If I wanted to position a popover in the bottom left, for example, I'd need to set `top` and `right` to either `auto`, `initial` or `unset`.

```css
.toast {
    inset: unset;
    bottom: 12px;
    left: 12px;
}
```

## Beyond `z-index`: The top layer
Some JavaScript frameworks have something called _portals_ for rendering things like tooltips and dialogs. I always found portals difficult to work with. The [React docs](https://react.dev/reference/react-dom/createPortal#rendering-to-a-different-part-of-the-dom) describe portals like so: 

> "Portals let your components render some of their children into a different place in the DOM. This lets a part of your component “escape” from whatever containers it may be in. For example, a component can display a modal dialog or a tooltip that appears above and outside of the rest of the page... You can use a portal to create a modal dialog that floats above the rest of the page, even if the component that summons the dialog is inside a container with overflow: hidden."

When working with either the `<dialog>` element (rather than crafting one out of divs) or the `popover` attribute, you can avoid this issue entirely — no portals required. Their location in the DOM doesn't matter. Its often convenient to collocate the markup for a popover or `<dialog>` together with the button that opens it. They can appear anywhere in your markup and won't get cropped by `overflow: hidden` on a parent element. They make use of the top layer, which is a native web solution for rendering content above the rest of the document. The top layer sits above the document and always trumps `z-index`. An element in the top layer can also make use of a styleable `::backdrop` pseudo-element.

## Animate an element into and out of the top layer
By default, when a popover or dialog is opened, it instantly appears. You might want to add an entry animation — perhaps a quick opacity fade-in, for example. `@starting-style` is used to animate an element into view with a CSS `transition` (you don't need `@starting-style` when working with `@keyframes`). `@starting-style` works both when you're adding a new element to the DOM and when an element is already in the DOM but is being made visible by changing its display value from `display: none`. When in a closed state, both the popover attribute and the `<dialog>` element make use of `display: none` under the hood, so `@starting-style` can be used to animate them onto the page. 

The following transition will fade and spin the popover into view, and scale down the size of the popover for the exit transition.

```css
/*  Transition to these styles on entry, and from these styles on exit   */
[popover]:popover-open {
  opacity: 1;
  rotate: 0turn;
  transition: rotate .5s, opacity .5s, display .5s allow-discrete, overlay .5s allow-discrete;
}

/*   Entry transition starts with these styles  */
@starting-style {
  [popover]:popover-open {
    opacity: 0;
    rotate: 1turn;
  }
}

/*  Exit transition ends with these styles  */
[popover]:not(:popover-open) {
  scale: 0;
  transition: scale .3s, display .3s allow-discrete, overlay .3s allow-discrete;
}
```

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="LYaBaaP" data-user="cssgrid" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cssgrid/pen/LYaBaaP">
  Popover entry and exit transitions</a> by Ollie Williams (<a href="https://codepen.io/cssgrid">@cssgrid</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

The popover will transition from its `@starting-style` styles to its `[popover]:popover-open` styles every time its opened.

The `overlay` transition is necessary boilerplate when transitioning an element in or out of the top layer. The [`overlay`](https://drafts.csswg.org/css-position-4/#overlay) property was added to CSS purely for this use case and has no other practical application. It is an unusual property to the extent that, outside of transitions, it can only be specified by the browser — you can't set it with your own CSS. By default, a dialog or popover is instantly removed from the top layer when closed. This will lead to the element getting clipped and obscured. By transitioning `overlay`, the element stays in the top layer until the transition has finished. 

`transition-behavior` is a new CSS property that can be set to either `normal` or `allow-discrete`. In the above code example I'm using the shorthand.

Similarly for the `display` property, by including it in the transition and specifying `transition-behavior: allow-discrete` we ensure that a change from `display: none` happens at the very start of the entrance transition and that a change to `display: none` happens at the very end of the exit transition.

`@starting-style` has some useful applications outside of working with popovers and dialogs, but that's a topic for a different article.

You can transition the `::backdrop` pseudo-element in a similar way.

e.g.

```css
@starting-style {
  [popover]:popover-open::backdrop {
    opacity: 0;
  }
}
```

Now lets look at doing the same transition with a `<dialog>` element: 

```css
/*  Transition to these styles on entry, and from these styles on exit   */
dialog:open {
  opacity: 1;
  rotate: 0turn;
  transition: rotate .5s, opacity .5s, display .5s allow-discrete, overlay .5s allow-discrete;
}

/*   Entry transition starts with these styles  */
@starting-style {
  dialog:open {
    opacity: 0;
    rotate: 1turn;
  }
}

/*  Exit transition ends with these styles.  */
dialog:closed {
  scale: 0;
  transition: scale .3s, display .3s allow-discrete, overlay .3s allow-discrete;
}
```

The `:open` and `:closed` selectors are new pseudo-selectors. They work for details, dialog, and select elements — but not for popovers. You can use `dialog[open]` and `dialog:not([open])` for the time being for better browser support.

These examples all work in Chrome. `@starting-style` and `transition-behavior` are part of [Interop 2024](https://web.dev/blog/interop-2024), meaning they'll likely be fully supported by the end of the year. [Safari 17.4](https://developer.apple.com/documentation/safari-release-notes/safari-17_4-release-notes#Web-Animations) added support for `transition-behavior: allow-discrete`. WebKit have yet to declare a [position](https://github.com/WebKit/standards-positions/issues/169) on the `overlay` property.

## Anchor positioning

With a component like a toast or a dialog, we generally want to position the element in relation to the viewport. We typically display a dialog in the center of the screen, and a toast at the bottom. That’s easy to do. There are other times when you need to position an element in relation to another element on the page. For a dropdown menu, for example, we want to place the popover in relation to the button that opened it. This is more challenging.

![](/youtube-menu-example.png)

This sort of behaviour usually requires JavaScript and led to the creation of the popular JavaScript libraries Popper, Floating UI and Tether. With the addition of anchor positioning to CSS, we'll no longer need to reach for JavaScript. The [`anchor()` function](https://drafts.csswg.org/css-anchor-position-1/) allows developers to tether an absolutely positioned element to one or more other elements on the page. Unfortunately it's a work-in-progress so I'll revisit the topic when the spec and implementation are more solid. 

Even without anchor positioning, the use of the top layer by popovers simplifies positioning. Let's say you have a button with `position: static`, a dropdown set to `position: absolute` and some ancester div with a position of `relative`. Without the popover API, this could get tricky: `.getBoundingClientRect()` gives coordinates relative to the viewport but in this scenario positioning the dropdown is relative to the ancester. By making use of the popover API, you don't need to worry about positioned ancestors because the popover is in the top layer, so `getBoundingClientRect()` is probably enough for your positioning needs:

```js
const popover = document.querySelector("#my-popover");
const buttonPosition = document.querySelector("#popover-invoker").getBoundingClientRect();

popover.style.left = `${buttonPosition.left}px`;
popover.style.top = `${buttonPosition.bottom + 4}px`;
```

## Conclusion

I covered a lot in this article but there's more to come. The popover attribute can be useful all by itself but some forthcoming web APIs will help cover more use cases. Anchor positioning looks set to be the most useful CSS feature since grid. There's a strong chance we'll finally get an easy and standard way to achieve styled tooltips on the web with [`interesttarget`](https://open-ui.org/components/invokers.explainer/), a declarative way to show a popover on hover. Stay tuned.
