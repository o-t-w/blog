---
pubDate: 'Jun 11 2023'
title: old dialog stuff
heroImage: "/offset-path.png"
description: DO NOT PUBLISH.  
---


## Combining popover and dialog


<style>
    [popover]::backdrop {
        background-color: transparent;
    }

    dialog button:focus {
        outline: 0;
    }
</style>

<!-- <dialog closedby="closerequest" popover="manual" id="toast" style="right: auto; top: auto; left : 12px; bottom: 12px; padding: 16px 24px; max-width: 340px; line-height: 1.5; box-shadow: rgba(0,0,0,0.15) 0 5px 8px -4px;">
A non-modal popover dialog in the top layer.
<button style="background-color: transparent; border: 0; position: absolute; right: 4px; top: 4px; padding: 0;" command="hide-popover" commandfor="toast"><svg style="width: 20px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
</svg>
</button>
</dialog>

<script type="module">
    const toast = document.querySelector('#toast')
    toast.showPopover();
    const watcher = new CloseWatcher();

    watcher.onclose = () => {
      toast.hidePopover();
    };
</script> -->

```html
<dialog closedby="closerequest" popover="manual" id="toast" style="right: auto; top: auto; left : 12px; bottom: 12px; padding: 16px 24px; max-width: 340px; box-shadow: rgba(0,0,0,0.15) 0 5px 8px -4px;">
A non-modal popover dialog in the top layer.
<button style="background-color: transparent; border: 0; position: absolute; right: 4px; top: 4px; padding: 0;" command="close" commandfor="toast"><svg style="width: 20px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
</svg>
</button>
</dialog>
```
