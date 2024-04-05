---
pubDate: 'Apr 02 2024'
title: Custom pseudo-classes for web components with the CustomStateSet API
heroImage: "/custompseudo.png"
description: Custom CSS pseudo-classes for custom elements
---

CSS has pseudo-classes to style HTML elements based on state — there's `:invalid`, `:hover`, `:checked`, `:placeholder-shown`, etc. In a similar vein, with the `CustomStateSet` API, web components can expose their own pseudo-classes like `:state(loading)`, `:state(done)`, etc.

## Browser support 
[Safari 17.4](https://developer.apple.com/documentation/safari-release-notes/safari-17_4-release-notes#New-Features) added support for the CustomStateSet API. It is also available in Firefox Nightly. Chrome had supported an older deprecated syntax. Chrome supports the new syntax as of [version 125](https://chromestatus.com/feature/5586433790443520). 

---

Let's look at an example: a button that copies text to the users clipboard. The user clicks the button, the text is copied, and the button temporarily displays a confirmation that the action was successful. While the confirmation is showing, I'm going to say the custom element is in its _confirmation state_. 

<copy-button value="razmataz shakalaka ✨: this text was copied to your clipboard"></copy-button>

Being able to style based on state is useful for both the creator and the consumer of the custom element. In the examples below, the author of the custom element is using the state to change the icon from a copy symbol to a tick symbol. The user of the custom element is using the state to customise the `background-color` to their preferred shade of green.

Styling from inside the shadow DOM:

```css
:host(:state(confirmation)) button {
    background-image: url("/tick.svg");
}
```

Styling from outside the shadow DOM:

```css
copy-button:state(confirmation) {
        --bg: #34d399;
    }
```

<copy-button value="razmataz shakalaka ✨: this text was copied to your clipboard" class="green-bg" style="margin-top: 1.5em; display: block;"></copy-button>

The custom state selector can be combined with `::part` to select a particular part of the custom element to style from outside the shadow DOM:

```css
copy-button:state(confirmation)::part(button) {
        background-color: #34d399;
    }
```

That's the CSS syntax, but how do we set this up?

## Adding state to a custom element
The [`.attachInternals()` method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/attachInternals) returns an [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) object. `ElementInternals` has a `.states` property that returns a [`CustomStateSet`](https://developer.mozilla.org/en-US/docs/Web/API/CustomStateSet) object. 

```js
class CopyButton extends HTMLElement {
    #internals = this.attachInternals();
    #states = this.#internals.states;

    // more code...
}
```

By using the private class field syntax (`#`), the state can't be changed by code outside of the class. 

`CustomStateSet` has an `.add()` and `.delete()` method for adding and deleting states.

```js
const styles = new CSSStyleSheet();
styles.replaceSync(`
button {
    background-color: var(--bg, rgb(240,240,240));
    background-image: url(/copy.svg);
}   

:host(:state(confirmation)) button {
    background-image: url("/tick.svg");
}`);

class CopyButton extends HTMLElement {
  #internals = this.attachInternals();
  #states = this.#internals.states;
  #shadowRoot = this.attachShadow({ mode: "open" });

  connectedCallback() {
    this.addEventListener("click", this.#onClick.bind(this));
    this.#shadowRoot.adoptedStyleSheets.push(styles);
    this.#shadowRoot.innerHTML = `<button part="button"></button>`;
  }

  get confirmation() {
    return this.#states.has("confirmation");
  }

  #onClick(event) {
    navigator.clipboard.writeText(this.getAttribute("value"));
    this.#states.add("confirmation");
    setTimeout(() => {
      this.#states.delete("confirmation");
    }, 2000);
  }
}

customElements.define("copy-button", CopyButton);
```

## Selecting components based on custom state with `querySelector`
Not only can you style components based on state, you can also select components with JavaScript based on state. `querySelector` and `querySelectorAll` accept any valid CSS selector as an argument, so we can use the same syntax. If you create a `<toggle-button>` web component with a custom _selected_ state, for example, the following would select only those elements in that state:

```js
const selectedButtons = document.querySelectorAll('toggle-button:state(selected)');
```

<style>
    .green-bg:state(confirmation)::part(button) {
        background-color: #34d399;
    }
</style>
<script type="module" src="/copy-button.js"></script>