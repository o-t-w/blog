---
pubDate: 'Apr 20 2025'
title: Frontend complexity and the HTML renaissance
heroImage: "/renaissance.jpg"
description: Why I'm rooting for HTML.
---

Design system consultant Brad Frost has [written](https://bigmedium.com/ideas/a-global-design-system.html) of the wasted labour as developers reinvent the wheel:

> "Right now, vast numbers of human beings are devoting their time and energy to designing, building, documenting, and maintaining the exact same set of common components... By and large, these components are unexceptional commodities that assume the same general shape and behavior."

Energy is being expended to deliver what should always have been part of HTML.

I was struck by [this story](https://thenewstack.io/new-york-public-library-on-choosing-react-to-rebuild-website/) of a development team changing their tech stack:

> The old digital collections website was built using Ruby on Rails in 2013. Even though it was performant, its look was dated… They wanted to update the design of the site to be more modern... _That meant they needed a React framework._

Some teams are making key technical decisions based . "Is there a Solid ShadCN port yet?" [asked](https://x.com/AdamRackis/status/1767949533361607004) one potential Solid JS user, as if a nicely styled checkbox component were the primary criteria of choosing a JavaScript framework. Rich Harris and Ryan Carniato, creators of Svelte and Solid, have spoken of a roadblock to gaining mass adoption: the lack of UI component libraries for their respective frameworks. The gargantuan ecosystem of React is part of the reason newer frameworks have trouble gaining traction. When picking a framework, an important part of that ecosystem is UI component libraries.

What effectively amounts to some CSS styling of some HTML is all too often deeply tied to a specific niche in the sprawling JavaScript ecosystem. In the longer term, this shackles teams to outdated legacy tech and creates open-source vendor lock-in.

HTML is mostly idiot-proof for anybody that can be bothered to learn it. The same can rarely be said for the series of miscellaneous dependencies and over-engineered abstractions that have defined the last decade.

> “Each layer of abstraction moves you further from the platform, ties you further into framework lock-in, and moves you further from fast.” - Harry Roberts

Most large companies build their own unique custom component library from scratch, often spending hundreds of thousands of dollars in the process. In open source, to take React component libraries alone, there's Shadcn, React Aria, Ariakit, Radix, Base UI, MUI, Chakra, Ant, Mantine, Origin UI, Hero UI, Semantic UI, Catalyst... those are just a few that come to mind. They all work differently. Each one has a huge docs site. When I look at the documentation for one of these projects, I feel like I'm learning an equivalent of HTML all over again. What if the documentation for a component was MDN? What if you didn't need to look at any documentation if you already knew how HTML worked? What if customising components to fit your brand involved nothing more than setting the `accent-color` property in CSS? Abstracting away HTML has meant there's a whole generation of developers where basic knowledge of the most fundamental language of the web is often lacking.

You can spend time learning one of these UI libraries only for it to become deprecated or unmaintained. To take one example: Radix, perhaps the most popular UI library in the React ecosystem, has been largely [superseded](https://x.com/vladyslavmoroz/status/1863982922568515753) by Base UI.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">cool to see so many of you recommending <a href="https://twitter.com/base_ui?ref_src=twsrc%5Etfw">@base_ui</a> in this thread. fwiw, i agree that radix is a liability. off all of the headless ui libs, it&#39;s the last option i&#39;d consider for any serious project. <a href="https://t.co/lykIW9nRLe">https://t.co/lykIW9nRLe</a></p>&mdash; Colm Tuite (@colmtuite) <a href="https://twitter.com/colmtuite/status/1935629877069172861?ref_src=twsrc%5Etfw">June 19, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

All because the default HTML elements are slightly too ugly and difficult to customise with CSS. Hundreds of different, yet functionally and visually almost identical components are being designed, built and maintained. Radio buttons that look much the same but have different markup, different props, different styling APIs… For all the diligence and sweat of myriad designers, there’s a limit to how different these components can (or should) actually look.

## The HTML renaissance

In 2022 Mozilla [published](https://www.mozilla.org/en-US/about/webvision/full/#thedeclarativeweb) their “vision for the evolution of the Web”:

> While Web experiences have become substantially more rich over the past 20 years, the expressiveness of HTML and CSS has not kept pace… the limited HTML/CSS feature set means that authors feel compelled to use larger and increasingly more complex JS libraries & frameworks for nearly any interactive site. In a better world, it would be possible to build more of these experiences using only the capabilities built into the browser.

> There are two deficiencies here that are worth addressing. The first is the lack of good standardized controls that are also easily styleable across browsers. Native app platforms such as iOS and Android provide rich libraries of controls which perform well and are styled to match the rest of the platform. By contrast, the base Web platform is comparatively deficient, with a much more limited set of built-in controls. And where the web does have equivalent controls, they’re often insufficiently styleable… which makes it difficult to make them visually consistent with the rest of the Web page. We want to fill these gaps.”

The first article about the new `<select>` element was published by CSS Tricks in March 2022 and its still not in all browsers. The `dialog` element was implemented in Chrome in 2014 but didn’t reach all browsers until 2022. Progress is slow, but it is happening. Patrick Brosset, a Product Manager on the Edge team at Microsoft, [concluded](https://2024.stateofhtml.com/en-US/conclusion/) the 2024 State of HTML survey results with the following:

> With the increasing number of capabilities we're getting, building performant, accessible, and interactive HTML-first UIs is becoming easier all the time, making it possible to reduce JavaScript usage to where it truly matters, and letting web servers and browsers communicate how they were meant to: with HTML!

After years of inertia since HTML5, HTML is starting to deliver the base components and functionality developers need.

There's now more functionality built into a zero-JS HTML-only accordion than you get from Radix and most other popular JS framework-based UI component libraries. When 'find in page' is used to search for text within a closed accordion section, that section will automatically open. The same applies when using a URL text fragment.

<details class="accordion-details" name="faq">
    <summary class="accordion-summary">Is this accordion built with the HTML details and summary elements?</summary>
        <div>
            Yes it is.
        </div>
</details>

<details class="accordion-details" name="faq">
    <summary class="accordion-summary">FAQ number 2</summary>
    <div>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa repellat animi dicta eos architecto maxime odio distinctio aliquid quas vel?
    </div>
</details>

<details class="accordion-details" name="faq">
    <summary class="accordion-summary">Does the relevant section open when find-in-page search is used?</summary>
    <div>
        Yes! Try searching for this text when this section is closed. The browser's find-in-page search will automatically open the relevant section of the accordion. URL fragments will also automatically open the correct section. You do not need to manually add <code>hidden="until-found"</code> as that behaviour is the default. 
    </div>
</details>

Test a URL fragment by clicking on <a href="#:~:text=of%20the%20accordion.-,URL%20fragments,-will%20also%20automatically">this link</a>.

You're free to style the accordion however you want:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">As of Chrome 131 you have more options to style `&lt;details&gt;` and `&lt;summary&gt;`.<br><br>You can now use of the `display` property on these elements, and also use a `::details-content` pseudo-element to style the part that expands and collapses.<a href="https://t.co/PCTwbUpOxB">https://t.co/PCTwbUpOxB</a> <a href="https://t.co/WpmmDhgIhu">pic.twitter.com/WpmmDhgIhu</a></p>&mdash; Bramus (@bramus) <a href="https://twitter.com/bramus/status/1859275060370080186?ref_src=twsrc%5Etfw">November 20, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Let's take a brief look at what else is new and forthcoming.

HTML elements support light and dark mode by default when the [color-scheme meta tag](https://web.dev/articles/color-scheme#the_color-scheme_meta_tag) is used.

Safari shipped an <code>alpha</code> attribute for the HTML color input, allowing users to select an opacity value.
<img style="max-width: 320px; margin-inline: auto;" src="/colorpicker.png" alt="">

You can now use `<hr>` to visually demarcate different options of a `<select>` element.

<select name="fruits" id="fruits">
<option value="orange">Orange</option>
<option value="lime">Lime</option>
<option value="lemon">Lemon</option>
<option value="grapefruit">Grapefruit</option>
<hr/>
<option value="banana">Banana</option>
<option value="apple">Apple</option>
</select>

Setting the CSS [`field-sizing`](https://polypane.app/blog/field-sizing-just-works/) property to `content` will cause an `input`, `textarea` or `select` element to automatically grow to fit the size of its content.

<div>
<input style="field-sizing: content; padding-inline: 8px;min-width: 80px; border: solid 1px rgb(50,50,50); height: 30px;border-radius: 2px;" type="text" placeholder="grow me...">
</div>

- In Safari, a toggle switch can be rendered without a single line of custom CSS, let alone JavaScript. It's just `<input switch type="checkbox">`.
- Chrome/Edge have been trying to standardize a customizable `<select>`.
- The `dialog` element has been supported in all browsers for several years. There's now an optional light-dismiss functionality built in (i.e. a way to close the dialog when the user clicks outside of the dialog).
- The `command` and `commandfor` attributes mean that opening and closing dialogs and popovers is easy to implement without JavaScript.
- Safari 18.2 added support for `<input type="week"/>` in iOS and iPadOS.
- We might finally get an actually useful menu element.

CSS has its own additions (this is far from a comprehensive list):
- The `:has` CSS selector simplifies certain tasks that previously would have required JavaScript
- All browsers support `::file-selector-button` to style the button inside a file input.
- The Chrome team have been pushing for CSS-only carousels.  

While these improvements might not sound revolutionary in isolation, taken as a whole, they beckon a future where third-party components are less necessary. The CSS [forms spec](https://www.w3.org/TR/css-forms-1/) should eventually bring simple customization to all form controls, fundamentally changing how design systems are built. 

## The hardest task in computer science: rendering a button?

It feels like frontend development has become both simpler and more complex at the same time. JavaScript has swallowed the whole of frontend development, yet the newfound power of HTML and CSS has made JS entirely unnecessary for a great many tasks (lazy loading, masonry layout, anchor positioning, scroll-driven animation...) Developers are approaching rendering simple UI components as if they were tackling a hardcore software engineering problem. The building blocks of the web are increasingly abstracted into an over-engineered Rube Goldberg machine.

<figure>
<img src="/rubegoldberg.avif" alt=""/>
<figcaption>Congratulations, you rendered a HTML element</figcaption>
</figure>

We all understand the power of components:

```jsx
 <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      />
```

Hidden out of view is a tangle of HTML I'd rather not have to think about. UI component libraries can abstract away intricate markup and JavaScript, but they also introduce their own complexity, often [obscuring the simplicity of HTML](https://www.radix-ui.com/themes/docs/components/box). Here's the directory for the accordion component in Kobalte, a component library for the Solid JS framework:

<figure>
<img src="/accordion-kobalte.png" alt=""/>
<figcaption>Abstracting away simplicity</figcaption>
</figure>

And here's the contents of `index.tsx`:

```tsx
import {
	type AccordionContentCommonProps,
	type AccordionContentOptions,
	type AccordionContentProps,
	type AccordionContentRenderProps,
	AccordionContent as Content,
} from "./accordion-content";
import {
	type AccordionHeaderCommonProps,
	type AccordionHeaderOptions,
	type AccordionHeaderProps,
	type AccordionHeaderRenderProps,
	AccordionHeader as Header,
} from "./accordion-header";
import {
	type AccordionItemCommonProps,
	type AccordionItemOptions,
	type AccordionItemProps,
	type AccordionItemRenderProps,
	AccordionItem as Item,
} from "./accordion-item";
import {
	type AccordionRootCommonProps,
	type AccordionRootOptions,
	type AccordionRootProps,
	type AccordionRootRenderProps,
	AccordionRoot as Root,
} from "./accordion-root";
import {
	type AccordionTriggerCommonProps,
	type AccordionTriggerOptions,
	type AccordionTriggerProps,
	type AccordionTriggerRenderProps,
	AccordionTrigger as Trigger,
} from "./accordion-trigger";

export type {
	AccordionContentOptions,
	AccordionContentCommonProps,
	AccordionContentRenderProps,
	AccordionContentProps,
	AccordionHeaderOptions,
	AccordionHeaderCommonProps,
	AccordionHeaderRenderProps,
	AccordionHeaderProps,
	AccordionItemOptions,
	AccordionItemCommonProps,
	AccordionItemRenderProps,
	AccordionItemProps,
	AccordionRootOptions,
	AccordionRootCommonProps,
	AccordionRootRenderProps,
	AccordionRootProps,
	AccordionTriggerOptions,
	AccordionTriggerCommonProps,
	AccordionTriggerRenderProps,
	AccordionTriggerProps,
};
export { Content, Header, Item, Root, Trigger };

export const Accordion = Object.assign(Root, {
	Content,
	Header,
	Item,
	Trigger,
});

/**
 * API will most probably change
 */
export {
	useAccordionContext,
	type AccordionContextValue,
} from "./accordion-context";
```

By contrast, here's the raw HTML for the accordion from earlier:

```html
<details class="accordion-details" name="faq">
    <summary class="accordion-summary">Is this accordion built with the HTML details and summary elements?</summary>
        <div>
            Yes it is.
        </div>
</details>

<details class="accordion-details" name="faq">
    <summary class="accordion-summary">FAQ number 2</summary>
    <div>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa repellat animi dicta eos architecto maxime odio distinctio aliquid quas vel?
    </div>
</details>
```

## Dependency hell

Having recently contributed to a project plagued by bad CSS coming from _a dependency of a dependency_, I am somewhat averse to NPM-driven development. The annoyances of installing third-party dependencies are by now overtly apparent: the persistent security warnings, breaking changes between versions... Developers are spending up to fifty percent of their time managing toolchains.

Installing a dependency is quick an easy but you’re then responsible for updating it. Your dependency could get deprecated and go completely unmaintained. None of these projects last forever, they are all, to differing degrees, transient and ephemeral.

![Forest Gump meme: Life is like an NPM install. You never know what you're gonna get](/npminstall.jpeg)
