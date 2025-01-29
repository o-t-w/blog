---
pubDate: 'Jan 29 2025'
title: "CSS :open pseudo-class"
heroImage: "/open.png"
description: A CSS pseudo-class for styling open dialogs, details, selects, and inputs.
---

The `:open` pseudo-class can be applied to:

- `<dialog>`
- `<details>`
- `<select>`
- `<input type="color">`
- `<input type="date">`
- `<input type="week">`
- `<input type="month">`
- `<input type="datetime-local">`

`:open` styles an input when its picker is showing.

```css
input:open {
  outline: solid black 1px;
  border-radius: 3px;
}
```

<div>
<template shadowrootmode="open">
<style>
    input:open {
  outline: solid black 1px;
  border-radius: 3px;
}
div {
    display: flex;
    gap: 24px;
    margin-block: 48px;
    place-content: center;
    place-items: center;
}
</style>
<div>
<input type="color">
<!-- <input type="date"> -->
</div>
</template>
</div>

`<dialog>` or `<details>` could already be styled with the `[open]` attribute selector, which is equivalent to `:open`, so this pseudo-class doesn't bring new styling functionality to those elements.

```css
details:open summary {
        background-color: #e1f2ff;
    }
```

<div>
<template shadowrootmode="open">
<style>
    details {
        border-radius: 6px;
        overflow: hidden;
        border: solid 1px rgb(74, 74, 74);
    }
    details:open::details-content {
        padding: 12px;
    }
    summary {
        padding: 12px;
        user-select: none;
        /* background-color: rgb(240,240,240); */
    }
    details:open summary {
        background-color: #e1f2ff;
    }
</style>
<details>
<summary>Lorem ipsum</summary>
Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam, animi?
</details>
</template>
</div>

There isn't a `:closed` pseudo-class, but `:open` can be combined with the `:not` selector.

```css
details:not(:open) {
    /* styles */
}
```

Popovers have their own seperate `:popover-open` pseudo-class, for some reason.

## Browser support

Supported in Chrome/Edge 133 and Firefox Nightly.

## Future

Hopefully we'll also get the ability to style the button that [opened a dialog or popover](https://github.com/openui/open-ui/issues/622).
