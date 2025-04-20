---
pubDate: 'Apr 20 2025'
title: Frontend complexity and the HTML renaissance
heroImage: "/renaissance.jpg"
description: Why I'm rooting for HTML.
---

Brad Frost, a design system consultant, has [written](https://bigmedium.com/ideas/a-global-design-system.html) of the wasted labour as different organizations reinvent the wheel:

> "Right now, vast numbers of human beings are devoting their time and energy to designing, building, documenting, and maintaining the exact same set of common components... By and large, these components are unexceptional commodities that assume the same general shape and behavior."

A lot of energy is being expended to deliver what should always have been part of HTML.

Developers are approaching rendering simple UI components as if they were tackling some kind of hardcore computer science software engineering problem. 

Rich Harris and Ryan Carniato, creators of Svelte and Solid, respectively, have spoken of a roadblock to gaining mass adoption: the lack of UI component libraries for their particular frameworks. The gargantuan ecosystem of React is part of the reason newer frameworks have trouble gaining traction.
For many developer picking a framework, an important part of that ecosystem is UI component libraries.

"There a Solid ShadCN port yet?" [asked](https://x.com/AdamRackis/status/1767949533361607004) one potential Solid JS user, as if a nicely styled checkbox component were the primary criteria of choosing a JavaScript framework.

I was struck by [this story](https://thenewstack.io/new-york-public-library-on-choosing-react-to-rebuild-website/) of a development team changing their tech stack because they wanted to use some aesthetically components:

Some developers are choosing tech stacks based on finding it too hard to style a checkbox:

> The old digital collections website was built using Ruby on Rails in 2013. Even though it was performant, its look was dated… They wanted to update the design of the site to be more modern... _That meant they needed a React framework._

 What effectively amounts to some CSS styling of some HTML is all too often deeply tied to a specific niche in the sprawling JavaScript ecosystem. In the longer term, this shackles teams to outdated legacy tech (like React) and creates open-source vendor lock-in.

HTML is mostly idiot-proof for anybody that can be bothered to learn it. The same can rarely be said for the series of miscellaneous dependencies and over-engineered abstractions that have defined the last decade.

> “Each layer of abstraction moves you further from the platform, ties you further into framework lock-in, and moves you further from fast.” - Harry Roberts

Most large companies build their own unique custom component library from scratch, often spending hundreds of thousands of dollars in the process. In open source, to take React component libraries alone, there's Shadcn, React Aria, Radix, Base UI, MUI, Chakra, Ant, Mantine, Origin UI, Hero UI, Semantic UI, Catalyst... those are just a few that come to mind. Each one has a huge docs site. They all work differently. When I look at the documentation for one of these projects, I feel like I'm learning an equivalent of HTML all over again. What if the documentation for a componennts was MDN? What if you didn't need to look at any documentation if you already knew how HTML worked? What if customising components to fit your brand involved nothing more than setting the `accent-color` property in CSS? Abstracting away HTML has meant there's a whole generation of developers where basic knowledge of the most fundamental language of the web is often lacking.

Content creators make entire educational courses about specific UI libraries. I regret to inform you that Radix, one of the most popular UI libraries in the React ecosystem, has been [superseded](https://x.com/vladyslavmoroz/status/1863982922568515753) by Base UI.

You can spend time (and, potentially, money) learning one of these UI libraries only for it to be deprecated and replaced by something new.

All because the default HTML elements are *slightly* too small, *slightly* too ugly, and slightly too difficult to customise with CSS.

hundreds of different, yet almost visually identical components. Radio buttons that look much the same but have different APIs, different props…
For all the diligence and sweat of myriad designers, having looked at hundreds of component libraries and design systems, there’s a limit to how different a checkbox can actually look.
I've perused dozens of these systems over the years. They're often carefully crafted by talented teams at large companies. There are a limited amount of ways that a checkbox or a radio can actually look. We need to stop reinventing the wheel.
Having worked in design systems, UI design and frontend development, I’ve lost count of the amounts of component libraries I’ve perused over the years. Most of them look almost entirely indistinct.

## The HTML renaissance

In 2022 Mozilla [published](https://www.mozilla.org/en-US/about/webvision/full/#thedeclarativeweb) their “vision for the evolution of the Web”:

> While Web experiences have become substantially more rich over the past 20 years, the expressiveness of HTML and CSS has not kept pace… the limited HTML/CSS feature set means that authors feel compelled to use larger and increasingly more complex JS libraries & frameworks for nearly any interactive site. In a better world, it would be possible to build more of these experiences using only the capabilities built into the browser.

> There are two deficiencies here that are worth addressing. The first is the lack of good standardized controls that are also easily styleable across browsers. Native app platforms such as iOS and Android provide rich libraries of controls which perform well and are styled to match the rest of the platform. By contrast, the base Web platform is comparatively deficient, with a much more limited set of built-in controls. And where the web does have equivalent controls, they’re often insufficiently styleable… which makes it difficult to make them visually consistent with the rest of the Web page. We want to fill these gaps.”

Progress is slow, but it is happening. Patrick Brosset, a Product Manager on the Edge team at Microsoft, [concluded](https://2024.stateofhtml.com/en-US/conclusion/) the 2024 State of HTML survey results with the following:

> with the increasing number of capabilities we're getting, building performant, accessible, and interactive HTML-first UIs is becoming easier all the time, making it possible to reduce JavaScript usage to where it truly matters, and letting web servers and browsers communicate how they were meant to: with HTML!

After years of inertia since HTML5, HTML is starting to deliver the base components and functionality developers need.

When you make use of the [color-scheme meta tag](https://web.dev/articles/color-scheme#the_color-scheme_meta_tag), HTML elements will support light and dark mode by default.

`accent-color` should be enough, but it’s not, because the default radio and checkbox elements look like crap in most browsers. Few websites make use of these native components. Instead we reconstruct them out of divs.

<figure>
<img style="max-width: 320px; margin-inline: auto;" src="/colorpicker.png" alt="">
<figcaption>Safari shipped an <code>alpha</code> attribute for the HTML color input, allowing the user to select an opacity value.
</figcaption>
</figure>

- In Chrome/Edge, we're finally getting a customizable `<select>`.
- There have been big improvements to the `<details>` and `<summary>` elements.
- In Safari, a toggle switch can be rendered without a single line of custom CSS, let alone JavaScript. It's just `<input switch type="checkbox">`.
- In Safari, the color input now accepts an opacity value.
- The CSS [forms spec](https://www.w3.org/TR/css-forms-1/) should eventually bring simple customization to all form controls.
- We might finally get an actually useful menu element.
- The Chrome team have been pushing for CSS-only carousels.  
- The `dialog` element has been supported in all browsers for several years. It is being improved with   There's now an optional light-dismiss functionality built in (i.e. a way to close the dialog when the user clicks outside of the dialog). We've seen big improvements to the dialog element. Dialogs that can be opened and closed without a single line of JavaScript, will reliably be displayed above other elements without worrying about z-index.
- Anchor positioning in CSS allows for the abandonment of JavaScript libraries like [THING]. The combination of the popover attribute and CSS anchor positioning.
- The `command` and `commandfor` attributes mean that opening and closing dialogs and popovers is easy to implement without JavaScript.
- Safari 18.2 added support for a week input for iOS and iPadOS.
- All browsers support `::file-selector-button` to style the button inside a file input.
- Masonry layout once relied on JS.
- The `:has` CSS selector simplifies certain tasks that previously would have required JavaScript
- In Chrome and Edge, setting [`field-sizing: content`](https://polypane.app/blog/field-sizing-just-works/) will cause an `input`, `textarea` or `select` element to automatically grow to fit the size of its content.

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

<input style="field-sizing: content; padding-inline: 8px;min-width: 80px; border: solid 1px rgb(50,50,50); height: 30px;border-radius: 2px;" type="text" placeholder="grow me...">

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">CSS magic: now you can animate height from 0 to auto via `calc-size(auto)` <br><br>Say goodbye to JS Calculate Height!<br><br>Combined with &lt;details name=&quot;&quot;&gt;, a nearly perfect and exclusive Accordion component can now be implemented. <a href="https://twitter.com/Una?ref_src=twsrc%5Etfw">@Una</a> <a href="https://twitter.com/davidbaron?ref_src=twsrc%5Etfw">@davidbaron</a> <a href="https://t.co/OKf6BEzETk">https://t.co/OKf6BEzETk</a> <a href="https://t.co/Jvy622RWwN">pic.twitter.com/Jvy622RWwN</a></p>&mdash; 一丝 (@yisibl) <a href="https://twitter.com/yisibl/status/1791452140663345300?ref_src=twsrc%5Etfw">May 17, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">As of Chrome 131 you have more options to style `&lt;details&gt;` and `&lt;summary&gt;`.<br><br>You can now use of the `display` property on these elements, and also use a `::details-content` pseudo-element to style the part that expands and collapses.<a href="https://t.co/PCTwbUpOxB">https://t.co/PCTwbUpOxB</a> <a href="https://t.co/WpmmDhgIhu">pic.twitter.com/WpmmDhgIhu</a></p>&mdash; Bramus (@bramus) <a href="https://twitter.com/bramus/status/1859275060370080186?ref_src=twsrc%5Etfw">November 20, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

While these incremental improvements might not sound revolutionary in isolation, taken as a whole, it beckons a future where framework-agnostic and tech-stack agnostic component libraries are the norm, and where fewer developers feel the need for one at all.

The first article about the new `<select>` element was published by CSS Tricks in March 2022 and its still not in all browsers. The `dialog` element was implemented in Chrome in 2014 but didn’t reach all browsers until 2022. All of this takes time, but I am hopeful that a less complex version of frontend development is possible.

## The hardest task in computer science: rendering a button?

It feels like frontend development has become both simpler and more complex at the same time. JavaScript has swallowed the whole of frontend development, yet the newfound power of HTML and CSS has made JS entirely unnecessary for a great many tasks. The building blocks of the web are increasingly abstracted into an over-engineered Rube Goldberg machine.

<figure>
<img src="/rubegoldberg.avif" alt=""/>
<figcaption>Wow, you rendered a HTML button</figcaption>
</figure>

## Abstracting away simplicity

We all understand the power of components. 
Here's how to render a date picker using one particular open source [calendar component](https://wicky.nillia.ms/cally/):

```jsx
 <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
```

Hidden away out of view is a mountain of markup I'd rather not have to ever think about. The overwhelming tangle of markup can be abstracted away and reused. Rather than needing to copy and paste a wodge of code every time you needed a date, you could simply do this:

Here's some JSX markup from a popular component library:

```jsx
    import { Select } from 'tamagui' // or '@tamagui/select'
    
    export default () => (
      <Select defaultValue="">
        <Select.Trigger>
          <Select.Value placeholder="Search..." />
        </Select.Trigger>
        <Select.Content>
          <Select.ScrollUpButton />
          <Select.Viewport>
            <Select.Group>
              <Select.Label />
              <Select.Item>
                <Select.ItemText />
              </Select.Item>
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton />
        </Select.Content>
      </Select>
    )
```

Rather than abstracting away complex markup, much of the time UI component libraries are introducing their own complexity that obscures the simplicity of HTML. The ne plus ultra of this disease is the `<Box>` compontent that renders a `<div>`.
Even as CSS and HTML become more powerful, many component libraries have entered a morass of complexity. HTML is endlessly configurable in a way that React code will never be.

## Dependency hell

Having recently contributed to a project where some truly ghastly CSS was coming from a dependency of a dependency, I can say that I am somewhat adverse to NPM-driven development. The annoyances of installing third-party dependencies are by now overtly apparent: the persistent security warnings, breaking changes between versions... Developers are spending up to fifty percent of their time managing toolchains.

Installing a dependency is quick an easy but you’re then responsible for updating it. Your dependency could get deprecated and go completely unmaintained. None of these projects last forever, they are all, to differing degrees, transient and ephemeral.

Show complex JSX: so now you’re doing an NPM install and your copying and pasting JSX markup from the documentation (would potentially could change in future versions of the component library, needing you to update your code everywhere)

![Forest Gump meme: Life is like an NPM install. You never know what you're gonna get](/npminstall.jpeg)

That's the complexity of *using* a JSX component. What about writing one. What does all this code do? It renders a HTML button...

I want to simply put a class on a HTML radio or checkbox rather than needing to hide it and reconstruct it with divs. `accent-color` got us half-way there.
