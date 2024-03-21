---
pubDate: 'Mar 21 2024'
title: Sharing styles between shadow DOM
tags:
  - web components
heroImage: "/sharing-styles.png"
description: Sharing styles between web components using CSS modules.
---

Developers love to complain about the "global scope" of CSS. Shadow DOM offered a solution, but has been met with its own complaints. The style encapsulation offered by shadow DOM is great, but it also has drawbacks. Did I need to define `* { box-sizing: border-box; }` for every different component? Could I not use any CSS utility classes? These were some of the immediate questions I had when first working with shadow DOM, and the answers didn't please me.

CSS module scripts offer a solution. We can opt-in to certain shared styles, while still avoiding the global scope of CSS.

```js
import sharedStyles from "./shared.css" with { type: "css" };
import cardStyles from "./card.css" with { type: "css" };

class MyCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.adoptedStyleSheets.push(sharedStyles, cardStyles);
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = "<div><slot></slot></div>";
    }
}

customElements.define("my-card", MyCard);
```

Opting in to the shared stylesheet is only one line of code per component.

Read more about import attributes and [CSS modules here](/constructable).