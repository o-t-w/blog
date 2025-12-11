---
pubDate: 'Dec 11 2025'
title: Focus Management with the Navigation API
heroImage: "/tab.png"
description: "Managing focus when using client-side routing"
---

<style>
          dialog {
        width: 85lvmin;
        height: 85lvmin;
        background-size: cover;
        padding: 0;
        overscroll-behavior: contain; 
      }

      ::backdrop {
        background-color: rgb(0 0 0 / 50%);
        overscroll-behavior: contain;
        overflow: hidden;
      }

      dialog button {
        position: absolute;
        width: fit-content;
        height: fit-content;
      }

      dialog div {
        display: flex;
      }

      dialog img {
        width: 100%;
        height: 100%;
      }

      .grid > a {
    border-radius: 8px;
    overflow: hidden;
}

 .grid > a:focus-visible {
    outline: solid 4px;
 }

    #close {
          right: 8px;
          top: 8px;
      }

      .grid {
        margin-bottom: 32px;
      }
</style>

By default, when a navigation is intercepted, after the promise returned by the `handler()` has resolved the browser will focus the first element that uses the `autofocus` attribute, if there is one. If not, the browser will focus the `<body>` element. That's the right behaviour the majority of the time, but in certain scenarios a different approach needs to be taken. A dialog is a clear example: when the dialog is closed, focus should move back to the link or button that opened it. Keyboard users should be able to continue from where they left off rather that having to tab from the top of the page. 

To opt out of the default behaviour, set `focusReset` to `"manual"`:

```js
event.intercept({
    focusReset: "manual",
    async handler() {
    renderRouteSomehow(event.destination.url);
    },
});
```

Click one of the below images and then close the dialog via your keyboard to see this in action:

<div class="grid">
    <a href="#edgar"><img src="/edgar.avif" alt="" /></a>
    <a href="#molly"><img src="/molly.avif" alt="" /></a>
    <a href="#floof"><img src="/floof.avif" alt="" /></a>
</div>

<dialog class="not-content" id="dialog" closedby="any">
<button aria-label="close" command="close" commandfor="dialog" id="close">x</button>
<div></div>
</dialog>

--- 

When you adopt client-side routing, you lose out on some built-in browser behaviours. In an MPA, when a user traverses back or forward through their history, the browser uses the back/forward cache to restore focus to whichever element was focused when the user was previously on that page. As the Navigation API explainer documents, it is possible to [reimplement that functionality](https://github.com/WICG/navigation-api?tab=readme-ov-file#focus-management), although it does sound rather involved. 

See [this article](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/) for a more general discussion of focus management in single page applications.

<script type="module">
    
      const cats = new URLPattern({
        hash: "(molly|edgar|floof)",
      });

      const dialog = document.querySelector("dialog");
      dialog.addEventListener("close", function () {
        if (cats.test(location.href)) {
            if (navigation.canGoBack) {
                navigation.back();
            } else {
                navigation.navigate('/blog/managing-focus-with-the-navigation-api/');
            }
        }
      });

      function render(href) {
        const url = new URL(href);
        const cat = cats.exec(href);
        if (cat) {
          dialog.style.backgroundImage = `url(/${cat.hash.groups[0]}.avif)`;
          dialog.showModal();
          return;
        } else {
          if (dialog.open) {
            dialog.close();
            return;
          }
        }
      }
      render(window.location.href); // runs once when the user first lands on the page

      navigation.addEventListener("navigate", function (event) {
        if (!event.hashChange) return;
        event.intercept({
            focusReset: "manual",
          async handler() {
            render(event.destination.url);
          },
        });
      });

</script>