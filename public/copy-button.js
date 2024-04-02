const styles = new CSSStyleSheet();
styles.replaceSync(`
* {
    box-sizing: border-box;
}

:host {
    height: 40px;
    display: block;
}

button {
    width: 40px;
    height: 40px;
    border: 0;
    padding: 0;
    border-radius: 8px;
    background-color: var(--bg, rgb(240,240,240));
    background-image: url(/copy.svg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 18px;
}

:host(:state(confirmation)) button {
    background-image: url("/tick.svg");
    background-size: 20px;
}`);

class CopyButton extends HTMLElement {
  #internals = this.attachInternals();
  #states = this.#internals.states;
  #shadowRoot = this.attachShadow({ mode: "open" });

  connectedCallback() {
    this.#shadowRoot.adoptedStyleSheets.push(styles);
    this.#shadowRoot.innerHTML = `<button part="button"></button>`;
    this.#shadowRoot.querySelector("button").addEventListener("click", this.#onClick.bind(this));
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
