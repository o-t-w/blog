---
pubDate: 'Sep 19 2025'
title: Frontend complexity and the HTML renaissance
heroImage: "/renaissance.jpg"
description: Why I'm rooting for HTML.
---

<style>
	.styled-file::file-selector-button {
  margin-right: 12px;
  font-family: system-ui;
  user-select: none;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 15px;
  font-stretch: 104%;
  letter-spacing: 0.1px;
  text-shadow: oklch(0 0 0 / 25%) 1px 1px 1px;
color: oklch(98% 0.00011 271);
  font-weight: 450;
  background-color: #171717;
  box-shadow:
    oklch(0.05 0.3 278 / 13%) 0 1px 3px 0.5px,
    #545454 0px 1px 0px inset;
  border: solid 1px #171717;

@supports (corner-shape: squircle) {
    border-radius: 22px;
    corner-shape: squircle;
  }

	}

input[type="file"] {
	margin-inline: auto; 
	width: fit-content;
	max-width: 100%; 
	display: block; 
	background-color: rgb(238, 238, 238);
	background-color: #F1F5F9;;
	padding: 12px; 
	border-radius: 8px;
	@supports (corner-shape: squircle) {
    border-radius: 18px;
    corner-shape: squircle;
  }
}

.btn {
	font-family: system-ui;
  user-select: none;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 15px;
  font-stretch: 104%;
  letter-spacing: 0.1px;
  text-shadow: oklch(0 0 0 / 25%) 1px 1px 1px;
color: oklch(98% 0.00011 271);
  font-weight: 450;
  background-color: #171717;
  box-shadow:
    oklch(0.05 0.3 278 / 13%) 0 1px 3px 0.5px,
    #545454 0px 1px 0px inset;
  border: solid 1px #171717;

@supports (corner-shape: squircle) {
    border-radius: 22px;
    corner-shape: squircle;
  }
	}

dialog {
	border-radius: 8px;
	border: solid 1px gray;
}
</style>

HTML currently leaves a lot to be desired. Form validation still looks terrible in some browsers and can’t be styled. There’s no combo-box. The UX of `<select multiple>` is abysmal on certain platforms. The date input can’t select a range between a start and end date. There's a `<menu>` element but its indistinguishable from a `<ul>` and includes no menu-like behaviour whatsoever. I could go on. Building these sort of components with the correct focus management, keyboard navigation and accessibility is a tricky task. Understandably, open source component libraries have become wildly popular...

## The hardest task in computer science: rendering a button?

It feels like frontend development has become both simpler and more complex at the same time. JavaScript has swallowed the whole of frontend development, yet the newfound power of HTML and CSS has made JS entirely unnecessary for a great many tasks (lazy loading images, masonry layout, anchor positioning, scroll-driven animation...) Developers are approaching rendering simple UI components as if they were tackling a hardcore software engineering problem with the building blocks of the web increasingly abstracted into a Rube Goldberg machine.

<figure>
<img src="/rubegoldberg.avif" alt=""/>
<figcaption>Congratulations, you rendered a HTML element</figcaption>
</figure>

We all understand the power of components. JavaScript-based UI component libraries can abstract away intricate markup and JavaScript, but they also introduce their own complexity, often [obscuring the simplicity of HTML](https://www.radix-ui.com/themes/docs/components/box). Here's the directory for the accordion component in one open source library:

<figure>
<img src="/accordion-kobalte.png" alt=""/>
<figcaption>Abstracting away simplicity</figcaption>
</figure>

While, as the consumer of this code, you don't need to read or maintain it, it does speak to the complexity of modern frontend. By contrast, here's an accordion built with raw HTML:

```html
<details name="faq">
	<summary>Is this accordion built with the HTML details and summary elements?</summary>
	Yes.
</details>

<details name="faq">
	<summary>Does find-in-page search automatically open the relevant section?</summary>
	Yes. Try searching for this text when this section is closed.
</details>

<details class="accordion-details" name="faq">
    <summary class="accordion-summary">Lorem ipsum?</summary>
    Lorem ipsum.
</details>
```

There's now _more functionality_ built into a zero-JS HTML-only accordion than you get from the majority of popular JavaScript framework-based accordions. When 'find in page' is used to search for text within a `<details>` element, the relevant section will automatically open. You do not need to manually add `hidden="until-found"` as that behaviour is the default. The same applies to URL text fragments.

<details class="accordion-details" name="faq">
    <summary class="accordion-summary">Is this accordion built with the HTML details and summary elements?</summary>
            Yes.
</details>

<details class="accordion-details" name="faq">
    <summary class="accordion-summary">Does the relevant section open when find-in-page search is used?</summary>
        Yes. Try searching for this text when this section is closed.
</details>

<details class="accordion-details" name="faq">
    <summary class="accordion-summary">Lorem ipsum?</summary>
    Lorem ipsum.
</details>

You're free to style the accordion however you want:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">As of Chrome 131 you have more options to style `&lt;details&gt;` and `&lt;summary&gt;`.<br><br>You can now use of the `display` property on these elements, and also use a `::details-content` pseudo-element to style the part that expands and collapses.<a href="https://t.co/PCTwbUpOxB">https://t.co/PCTwbUpOxB</a> <a href="https://t.co/WpmmDhgIhu">pic.twitter.com/WpmmDhgIhu</a></p>&mdash; Bramus (@bramus) <a href="https://twitter.com/bramus/status/1859275060370080186?ref_src=twsrc%5Etfw">November 20, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Design system consultant Brad Frost has [written](https://bigmedium.com/ideas/a-global-design-system.html) of the wasted labour as developers reinvent the wheel:

> "Right now, vast numbers of human beings are devoting their time and energy to designing, building, documenting, and maintaining the exact same set of common components... By and large, these components are unexceptional commodities that assume the same general shape and behavior."

Energy is being expended to deliver what should always have been part of HTML.

"Is there a Solid ShadCN port yet?" [asked](https://x.com/AdamRackis/status/1767949533361607004) one potential Solid JS user, as if a nicely styled checkbox were the primary criteria for choosing a JavaScript framework. Rich Harris and Ryan Carniato, creators of Svelte and Solid, have spoken of a roadblock to mass adoption: the lack of UI component libraries for their respective frameworks. The gargantuan ecosystem around React — including its ready-made component kits — is part of the reason newer frameworks have trouble gaining traction. What often amounts to some nicely-styled reinvented HTML is all too often deeply tied to a specific niche in the sprawling JavaScript ecosystem. In the longer term, this shackles teams to legacy tech and creates open-source vendor lock-in. 

In open source, to take React component libraries alone, there's Shadcn, React Aria, Ariakit, Radix, Base UI, MUI, Chakra, Ant, Mantine, Origin UI, Hero UI, Semantic UI, Catalyst... those are just a few that come to mind. Most large companies build their own unique custom component library from scratch, often spending hundreds of thousands of dollars in the process. While some of these components fill genuine gaps in HTML, the bulk of these projects are reinventions of elements the browser already provides (checkbox, dialog, radio, range, etc) but with different styling. Hundreds of different, yet functionally and visually almost identical components are being designed, built and maintained. Components that look much the same but have different markup, different props, different styling APIs… Each one has a huge docs site. When I look at the documentation for one of these projects, I feel like I'm learning an equivalent of HTML all over again. What if the documentation for a component was MDN? What if you didn't need to look at documentation if you already knew how HTML worked? 

Even the most popular open source projects [go into maintenance mode](https://opencollective.com/styled-components/updates/thank-you), get deprecated or go completely unmaintained. You can spend time learning and utilising a UI library only for it to become obsolete. To take one example: Radix, perhaps the most popular component library in the React ecosystem, has been largely [superseded](https://x.com/vladyslavmoroz/status/1863982922568515753) by Base UI. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">cool to see so many of you recommending <a href="https://twitter.com/base_ui?ref_src=twsrc%5Etfw">@base_ui</a> in this thread. fwiw, i agree that radix is a liability. off all of the headless ui libs, it&#39;s the last option i&#39;d consider for any serious project. <a href="https://t.co/lykIW9nRLe">https://t.co/lykIW9nRLe</a></p>&mdash; Colm Tuite (@colmtuite) <a href="https://twitter.com/colmtuite/status/1935629877069172861?ref_src=twsrc%5Etfw">June 19, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Installing a dependency is easy but you’re then responsible for updating it in perpetuity. Radix has had 1691 GitHub issues raised over the course of its life. The annoyances of NPM-driven development are by now overtly apparent: the neverending security warnings, breaking changes between versions... That may be worthwhile for a framework or router but its questionable whether that management burden is worthwhile when what your installing is a [glorified](https://react-spectrum.adobe.com/react-spectrum/Flex.html) `div`.

Abstracting away HTML has meant there's a whole generation of developers where basic knowledge of the most fundamental language of the web is often lacking. All because the default HTML elements are slightly too ugly and difficult to customise with CSS. HTML is mostly idiot-proof for anybody that can be bothered to learn it. The same can't always be said for the miscellaneous dependencies and over-engineered abstractions that have defined the last decade.

> “Each layer of abstraction moves you further from the platform, ties you further into framework lock-in, and moves you further from fast.” - Harry Roberts

## The HTML (and CSS) renaissance

In 2022 Mozilla [published](https://www.mozilla.org/en-US/about/webvision/full/#thedeclarativeweb) their “vision for the evolution of the Web”:

> While Web experiences have become substantially more rich over the past 20 years, the expressiveness of HTML and CSS has not kept pace… the limited HTML/CSS feature set means that authors feel compelled to use larger and increasingly more complex JS libraries & frameworks for nearly any interactive site. In a better world, it would be possible to build more of these experiences using only the capabilities built into the browser.

> There are two deficiencies here that are worth addressing. The first is the lack of good standardized controls that are also easily styleable across browsers. Native app platforms such as iOS and Android provide rich libraries of controls which perform well and are styled to match the rest of the platform. By contrast, the base Web platform is comparatively deficient, with a much more limited set of built-in controls. And where the web does have equivalent controls, they’re often insufficiently styleable… which makes it difficult to make them visually consistent with the rest of the Web page. We want to fill these gaps.”

The first article about the new `<select>` element was published by CSS Tricks in March 2022 and its still not in all browsers. The `dialog` element was implemented in Chrome in 2014 but didn’t reach all browsers until 2022. Progress is slow, but it is happening. Patrick Brosset, a Product Manager on the Edge team at Microsoft, [concluded](https://2024.stateofhtml.com/en-US/conclusion/) the 2024 State of HTML survey results with the following:

> With the increasing number of capabilities we're getting, building performant, accessible, and interactive HTML-first UIs is becoming easier all the time, making it possible to reduce JavaScript usage to where it truly matters, and letting web servers and browsers communicate how they were meant to: with HTML!

After years of inertia since HTML5, HTML is starting to deliver the base components and functionality developers need. Let's take a brief look at what's new and forthcoming.

### Color picker

The best third-party color picker is probably the one in [React Aria](https://react-spectrum.adobe.com/react-aria/ColorPicker.html) from Adobe. Arguably, the UX of the browser-native color picker on iOS is superior to what can be achieved with React Aria. 

<figure>
<img style="margin-inline: auto;" src="/color-pickers.png" alt="">
<figcaption>On the left, the native iOS color picker, on the right, React Aria</figcaption>
</figure>

While I could have styled the React Aria component in all sorts of different ways, building the functionality of the native iOS picker wouldn't be possible — the native bottom sheet slides over and covers the URL bar, a behaviour that can't be achieved via JavaScript.

React Aria does offer more customization than the built-in browser picker. Building Photoshop for the web? If so, you probably need that level of control. If not, then you almost certainly don't. Both optionally allow users to select an opacity value. In HTML, this is achieved via the [`alpha` attribute](https://webkit.org/blog/16900/p3-and-alpha-color-pickers). Both offer the ability to provide color presets for the user to choose from. In HTML this is achieved via a `datalist`, which is supported in all browsers.

```html
<input alpha list="colors" type="color" value="#AA0000">

<datalist id="colors">
  <option value="#AA0000"></option>
  <option value="#FF8800"></option>
  <option value="#008800"></option>
  <option value="#0088FF"></option>
  <option value="#000088"></option>
</datalist>
```

<input alpha list="colors" type="color" value="#AA0000" style="margin-block: 32px;">

<datalist id="colors">
  <option value="#AA0000"></option>
  <option value="#FF8800"></option>
  <option value="#008800"></option>
  <option value="#0088FF"></option>
  <option value="#000088"></option>
</datalist>

### Select

You can now use `<hr>` to visually demarcate different options of a `<select>` element.

<select name="fruits" id="fruits" style="width: fit-content; display: block; font-size: 16px; font-family: system-ui; padding: 4px;">
<option value="orange">Orange</option>
<option value="lime">Lime</option>
<option value="lemon">Lemon</option>
<option value="grapefruit">Grapefruit</option>
<hr/>
<option value="banana">Banana</option>
<option value="apple">Apple</option>
</select>

The long-running endeavour to make the `<select>` element customizable is finally coming to fruition (currently supported in Chrome/Edge). 

 <select style="display: block; margin-bottom: 32px;" class="custom-select" name="" id="">
         <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="pear">Pear</option>
		<option value="banana">Banana</option>
</select>

### Checkbox and Switch

The native HTML checkbox and radio controls don't look too bad, but they're far too small in Safari. As of Safari 26, all browsers support the CSS `width` and `height` properties to set the size of these native form controls (previous versions of Safari maxed-out at a size of 16px). Together with `accent-color`, that does offer a fair amount of customization:

<div style="display: flex; justify-content: center; align-items: center;">
<input checked type="checkbox">
<input checked style="width: 20px; height: 20px; accent-color: oklch(52.7% 0.154 150.069);" type="checkbox">
<input checked style="width: 24px; height: 24px; accent-color: oklch(62.7% 0.265 303.9);" type="checkbox">
<input checked style="width: 30px; height: 30px; accent-color: oklch(68.5% 0.169 237.323);" type="checkbox">

<input checked type="radio">
<input checked style="width: 20px; height: 20px; accent-color: oklch(68.5% 0.169 237.323);" type="radio">
<input checked style="width: 24px; height: 24px; accent-color: oklch(52.7% 0.154 150.069);" type="radio">
<input checked style="width: 30px; height: 30px; accent-color: oklch(62.7% 0.265 303.9);" type="radio">
</div>

For some designers, that isn't enough control. If you want a custom `border-color`, `border-radius` or custom tick icon, that's only possible by hiding the default widget with `appearance: none`. The forthcoming `appearance: base` will offer a better solution, rendering the element in a way that is consistent across all browsers while being fully stylable via CSS.

In Safari, a toggle switch can be rendered without a single line of custom CSS. It's just `<input switch type="checkbox">`. In other browsers it'll currently render as a checkbox.

<input style="width: fit-content; display: block; margin-block: 32px;" checked switch type="checkbox">

### Dialog 

The `dialog` element has been supported in all browsers for several years. There's now an optional light-dismiss functionality built in (i.e. a way to close the dialog when the user clicks outside of the dialog). The `command` and `commandfor` attributes mean that opening and closing dialogs and popovers is easy to implement without JavaScript.

<button class="btn" commandfor="dialog-1" command="show-modal">Show modal</button>
<dialog id="dialog-1" closedby="any">
I am some dialog content...
 <button class="btn" style="display: block; margin-top: 12px;" commandfor="dialog-1" command="close">Close dialog</button>
</dialog>

### File input

All browsers support `::file-selector-button` to style the button inside a file input.

<input style="margin-block: 32px;" class="styled-file" type="file">

### Text inputs and textarea

Setting the CSS [`field-sizing`](https://polypane.app/blog/field-sizing-just-works/) property to `content` will cause an `input`, `textarea` or `select` element to automatically grow to fit the size of its content.

<div>
<input style="margin-block: 32px; field-sizing: content; padding-inline: 8px; border: solid 1px rgb(50,50,50); height: 30px; border-radius: 2px; min-width: 100px; max-width: stretch; display: block;" type="text" placeholder="grow me...">
</div>

### Form validation

The `:user-valid` and `:user-invalid` pseudo-classes are equivalent to `:valid` and `:invalid` but with a key difference: they only apply after the user has interacted with the form control either by changing its value or attempting to submit the form.

And all HTML elements support both [light and dark mode](https://web.dev/articles/color-scheme) _by default_ — with zero custom CSS.

## The Path Forward

While these improvements might not sound revolutionary in isolation, taken as a whole, they beckon a future where third-party JavaScript components are less necessary. The CSS [Forms spec](https://www.w3.org/TR/css-forms-1/) will eventually bring simple customization to all form controls, fundamentally changing how design systems are built. The Chrome team have been pushing for [CSS-only carousels](https://developer.chrome.com/blog/carousels-with-css) and are looking into [multi-select](https://groups.google.com/a/chromium.org/g/blink-dev/c/U-K17B966Ys/m/0IGWWJT8BgAJ). There's ongoing work to [standardise tooltips](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/CSSTooltipPseudo/explainer.md). We might even get a [menu element](https://open-ui.org/components/menu.explainer/) that's actually useful, and even if we don't, between `popover`, `focusgroup` and anchor positioning, it'll be fairly trivial to build your own. The [Open UI group](https://open-ui.org/) is working on standardisation for all sorts of useful things. Some third-party components will remain helpful but a simpler version of frontend development is possible.

Ryan Florence, co-creator of React Router, recently tweeted:

> Once I built a little video site for my tutorials and after you visited a video the link to it turned black (from red). One of the Ember core team members was like "How did you do that? There's no local storage or anything what is going on?!" I used `a:visited`. Sometimes we get so caught up in complexity we forget there are actually simple solutions to things. Things you forget about when you're deep in the belly of framework abstractions. Then when you see them solve a problem you just assume it's some wild magic, but it's not.

It's time that developers rediscovered the power of HTML and CSS.