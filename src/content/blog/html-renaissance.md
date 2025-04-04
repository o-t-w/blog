---
pubDate: 'Mar 22 2025'
title: Frontend complexity and the HTML renaissance
heroImage: "/buttonvs.png"
description: Why I'm rooting for HTML...
---

It feels like frontend development has become both simpler and more complex at exactly the same time. JavaScript has swallowed the whole of frontend development, yet the newfound power of HTML and CSS has made JS entirely unnecessary for a great many tasks.

Masonry layout once relied on JS.

## The hardest task in computer science: rendering a button

JavaScript developer’s have taken HTML, something a ten year old child could understand, and abstracted it into a 'software-engineering'/'computer science' Rube Goldberg machine abstraction.

<figure>
<img src="/rubegoldberg.avif" alt=""/>
<figcaption>Wow, you rendered a HTML button</figcaption>
</figure>

Developers are approaching rendering simple UI components as if they were tackling some kind of hardcore computer science software engineering problem.

Rich Harris and Ryan Carniato, creators of Svelte and Solid, respectively, have spoken of a huge roadblock to gaining adoption: the lack of UI component libraries for their particular frameworks. The gargantuan ecosystem of React is part of the reason newer frameworks have trouble gaining traction.
For many developer picking a framework, an important part of that ecosystem is UI component libraries.

I was struck by [this story](https://thenewstack.io/new-york-public-library-on-choosing-react-to-rebuild-website/) of a development team changing their tech stack because they wanted to use some React components:

> The old digital collections website was built using Ruby on Rails in 2013. Even though it was performant, its look was dated… They wanted to update the design of the site to be more modern and more accessible... _That meant they needed a React framework._

People are literally choosing tech stacks based on finding it too hard to style a checkbox. What effectively amounts to some CSS styling of some HTML is all too often deeply tied to a specific niche in the sprawling JavaScript ecosystem. In the longer term, this shackles teams to outdated legacy tech and creates open-source vendor lock-in.

I remember the time when Bootstrap seemed unassailably popular. Bootstrap consists of some CSS files with a docs site. Few people ever complained about the DX of using Bootstrap. Has the frontend churn since been genuine innovation or a series of over-engineered Rube Goldberg machines? Are endlessly reimplementing what the web already offers?

HTML is mostly idiot-proof for anybody that can be bothered to learn it. The same can rarely be said for the series of miscellaneous dependencies, type gymnastics and CSS over-engineering that have defined the last decade.

> “Each layer of abstraction moves you further from the platform, ties you further into framework lock-in, and moves you further from fast.” - Harry Roberts

What some might see as the maturing or professionalisation of frontend has, more often than not, actually led to frontend codebases that tie companies to JavaScript frameworks that are bound to become obsolete,
Far from this representing the maturing or professionalisation of frontend development, this actually coincided with the NPM-isation of web development, increasingly fragile experiences, and larger bundles.

> The JS-industrial-complex are complexity merchants. They sell increasingly baroque solutions to imagined problems, or challenges created by the JS-industrial-complex itself. It's mostly nonsense. - Alex Russell

The browser offers more than ever before, but so many UI component libraries feel like a black box of complexity, a


## Abstracting away simplicity

Here's how to render a date picker using one particular open source [calendar component](https://wicky.nillia.ms/cally/):

```html
<calendar-date>
  <calendar-month></calendar-month>
</calendar-date>
```

Hidden away out of view is a mountain of markup I'd rather not have to ever think about. Whether they're implemented with React, Vue, Svelte, or custom elements, we all understand the power of components.

We all understand the success of component-based frameworks. The overwhelming tangle of markup can be abstracted away and reused with a simple `<Date-Picker>`.

What if instead of needing to copy and paste that wodge of code every time you needed a date, you could simply do this:

```jsx
<DatePicker/>
```

Wow, amazing right?

But anyway, here's some JSX markup from a popular component library:

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

A lot of energy being expended to deliver what should be part of HTML. To take React component libraries alone, there's Shadcn, React Aria, Radix, Base UI, MUI, Chakra, Ant, Mantine, NextUI, Semantic UI, Catalyst... those are just a few that come to mind. Each one has an overwhelmingly huge docs site. They all work differently.

When I look at the documentation for one of these projects, I feel like I'm learning an equivalent of HTML all over again. I already know HTML, but now I have to look up what props I can use. What if the documentation for a checkbox component or radio component or a dialog component was MDN? What if you didn't need to look at any documentation if you already knew how HTML worked? What if customising it for your brand involved nothing more than setting the `accent-color` property in CSS? Abstracting away HTML has meant there's a whole generation of developers where basic knowledge of the most fundamental language of the web is often lacking.

Content creators make entire educational courses about specific UI libraries. Many developers could tell you all about their component library of choice, but wouldn’t be able to answer basic questions about HTML.

I regret to inform you that Radix, one of the most popular UI libraries in the React ecosystem, has been [superseded](https://x.com/vladyslavmoroz/status/1863982922568515753) by Base UI.

<blockquote data-conversation="none" class="twitter-tweet"><p lang="en" dir="ltr">We have a Radix UI course launching in January, and a whole lot more planned for 2024.<br><br>Here&#39;s some of my favorite testimonials not on <a href="https://t.co/Hd6mpwpZoz">https://t.co/Hd6mpwpZoz</a> ☺️ <a href="https://t.co/Z7mP6swRWv">pic.twitter.com/Z7mP6swRWv</a></p>&mdash; Sam Selikoff (@samselikoff) <a href="https://twitter.com/samselikoff/status/1737940021913784420?ref_src=twsrc%5Etfw">December 21, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

You can spend time (and money) learning one of these UI libraries only for it to be deprecated and replaced by the new hotness.

Having recently contributed to a project where some truly ghastly CSS was coming from a dependency of a dependency, I can say that I am somewhat adverse to NPM-driven development. The annoyances of installing third-party dependencies are by now overtly apparent: the persistent security warnings, breaking changes between versions...

Installing a dependency is quick an easy but you’re then responsible for updating it. Your dependency could get deprecated and go completely unmaintained. None of these projects last forever, they are all, to differing degrees, transient and ephemeral.

Show complex JSX: so now you’re doing an NPM install and your copying and pasting JSX markup from the documentation (would potentially could change in future versions of the component library, needing you to update your code everywhere)

![Forest Gump meme: Life is like an NPM install. You never know what you're gonna get](/npminstall.jpeg)

That's the complexity of *using* a JSX component. What about writing one. What does all this code do? It renders a HTML button...

Last time I checked, HTML already has a reusable button component:

```html
<button>Click me</button>
```

For all the huge advances in CSS and JavaScript over the years, rendering a button has become infinitely more complex than it was in the heyday of PHP and Rails. 

Some of this has been necessary. HTML has been incomplete. 

I want to simply put a class on a HTML radio or checkbox rather than needing to hide it and reconstruct it with divs. `accent-color` got us half-way there.

<figure>
<img src="/aprocalypse.avif" alt="">
<figcaption>Slide from the talk <i>The How and Why of Flexible React Components</i> by Jenn Creighton</figcaption>
</figure>

Having worked in design systems, ui design and frontend development, I’ve lost count of the amounts of component libraries I’ve perused over the years. Many of them look virtually indistinct. The design of a checkbox isn’t the best place for wildly innovative visual design. The differences are primarily confined to differing `border-radius`, `box-shadow`, etc.

The web has been so deficient that sole individuals have jointly spent...
Demonstrating the deficiencies of the web platform, Web Awesome, an open source library of web components, raised £586,622 from Kickstarter campaign. Or take the cost of a design system team: Some companies are easily spending

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Web Awesome&#39;s KickStarter is over $600k now 📈😲, which means Web Awesome Pro is getting a combo box.<br><br>There&#39;s 22 hours left ⏳ If they can get over $700k by then, Pro will get a date picker too!<br><br>I hope they make it. Spread the word! <a href="https://twitter.com/webawesomer?ref_src=twsrc%5Etfw">@webawesomer</a><a href="https://t.co/OHYQfijd1P">https://t.co/OHYQfijd1P</a></p>&mdash; Justin Fagnani (@justinfagnani) <a href="https://twitter.com/justinfagnani/status/1783217776439480329?ref_src=twsrc%5Etfw">April 24, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

"There a Solid ShadCN port yet?" [asked](https://x.com/AdamRackis/status/1767949533361607004) one JavaScript influencer, as if a nicely styled checkbox component were the primary criteria of choosing a JavaScript framework.

## Your checkbox is not a beautiful and unique flower

Some people bemoan the age of boring digital design, and long for the days of Flash experimentalism, a time when UI could take the shape of a gigantic green head.

<img src="/greenhead-ui.webp" alt="Screenshot of a digital music player in the shape of a green human head, circa 1995">

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">cant believe humans saw this then created spotify<a href="https://t.co/f6NhMmXMpX">pic.twitter.com/f6NhMmXMpX</a></p>&mdash; RIO (@riomadeit) <a href="https://twitter.com/riomadeit/status/1878556039676666024?ref_src=twsrc%5Etfw">January 12, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

While wild and unique user interfaces can _sometimes_ work and apps can distinguish themselves in a crowded marketplace through good design, I tend to think a fancy toggle switch is the wrong way to differentiate your product. I've recently been learning SwiftUI, Apple's UI framework for building native applications for Apple devices. Almost universally, developers for Apple platforms make use of the default SwiftUI components, limiting their customisation to font-family and accent color. I want the same thing for HTML: accessible built-in components that look decent by default.
In native mobile development, a switch is a switch and a checkbox is a checkbox. You customise the color to fit your brand and then you move on. It's unusual to see anything custom. There's a decent looking well-functioning switch ready for you to use, so you use it. If browsers had all the typical components demanded by app developers, if they looked fairly decent accross all browsers and platforms, and if they were easy to customise with CSS, a lot of frontend complexity could be a thing of the past.

I doubt anybody ever decided not to use a website or application because its toggle switch or checkbox or radio button didn't look unique enough.
No user is going to cast your app aside because you didn't pay a designer to craft a boutique checkbox, a whimsical radio button, or a trendy custom-crafted dropdown. There are hundreds of component libraries, yet most look practically identical. Outside of Dribbble and Behance, nobody actually cares about your custom checkbox design. I have come across custom toggle switches in native apps, but it’s an event so rare that my main reaction is to feel somewhat perturbed. I long for a time when all I really need to set is `accent-color`, and HTML does the rest.

## The design system buzzword

hundreds of different, yet almost visually identical components. Radio buttons that look much the same but have different APIs, different props…

Brad Frost, a design system consultant, has [written](https://bigmedium.com/ideas/a-global-design-system.html) of the wasted labour as different organizations reinvent the wheel:

> "Right now, vast numbers of human beings are devoting their time and energy to designing, building, documenting, and maintaining the exact same set of common components... By and large, these components are unexceptional commodities that assume the same general shape and behavior regardless of whether the design system serves a non-profit, a federal agency, a bank, a publication, an e-commerce site, a Fortune 500 enterprise, a dog salon, a startup, SaaS company, you get the picture. These basic UI components are tricky to get right. Looking across the World Wide Web, 0 of the top 100 websites use valid HTML, and our collective accessibility game is abysmal."

Design systems became an industry buzzword. I've perused dozens of these systems over the years. They're often carefully crafted by talented full-time teams at large companies. They're often released with blog-posts and fanfare. At some point I started to feel jaded. There are a limited amount of ways that a checkbox or a radio can actually look. We need to stop reinventing the wheel. But there was a reason we ended up here...

## The HTML renaissance

In 2022 Mozilla [published](https://www.mozilla.org/en-US/about/webvision/full/#thedeclarativeweb) their “vision for the evolution of the Web”:

> While Web experiences have become substantially more rich over the past 20 years, the expressiveness of HTML and CSS has not kept pace… the limited HTML/CSS feature set means that authors feel compelled to use larger and increasingly more complex JS libraries & frameworks for nearly any interactive site. In a better world, it would be possible to build more of these experiences using only the capabilities built into the browser.

> There are two deficiencies here that are worth addressing. The first is the lack of good standardized controls that are also easily styleable across browsers. Native app platforms such as iOS and Android provide rich libraries of controls which perform well and are styled to match the rest of the platform. By contrast, the base Web platform is comparatively deficient, with a much more limited set of built-in controls. And where the web does have equivalent controls, they’re often insufficiently styleable… which makes it difficult to make them visually consistent with the rest of the Web page. We want to fill these gaps.”

Progress is slow, but it is happening. Patrick Brosset, a Product Manager on the Edge team at Microsoft, [concluded](https://2024.stateofhtml.com/en-US/conclusion/) the State of HTML survey results with the following:

> “with the increasing number of capabilities we're getting, building performant, accessible, and interactive HTML-first UIs is becoming easier all the time, making it possible to reduce JavaScript usage to where it truly matters, and letting web servers and browsers communicate how they were meant to: with HTML!”

After years of stagnation and inertia since HTML5, HTML is starting to deliver the base components and functionality developers need.

When you make use of the [color-scheme meta tag](https://web.dev/articles/color-scheme#the_color-scheme_meta_tag), HTML elements will support light and dark mode by default.

<figure>
<img style="max-width: 320px; margin-inline: auto;" src="/week-input.avif" alt="">
<figcaption><a href="https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Forms">Safari 18.2</a> added support for a week input for iOS and iPadOS</figcaption>
</figure>

Public releases of design systems tend to come with fanfare and self-promotion, which I've started to find faintly ridiculous. Most of these systems look much the same.

Developers are spending up to fifty percent of their time managing toolchains.

In open source we have we have old-school just-CSS styles like Bootstrap, web components like Web Awesome and Ionic, CSS-in-JS monstrosities like Tamagui.

They’re are dozens of paid UI component products like Catalyst from Tailwind. And every large company builds their own unique custom design system from scratch.

All because the default HTML elements are *slightly* too small, *slightly* too ugly, inconsistent across platforms, and slightly too difficult to customise with CSS.

`accent-color` should be enough, but it’s not, because the default radio and checkbox elements look like crap in most browsers. Few websites make use of these native components. Instead we reconstruct them out of divs.

When I think of the best-looking native apps (Wise is a particular favourite) what sets them apart is a tasteful color scheme, high-quality photography, nice illustration, and animation. I’ve never fallen in love with an app due to a whimsically unique toggle switch.

While branding is important to business, UI components are the wrong outlet for visual ingenuity and artistic exploration.

The best-looking native apps differentiate themselves in other ways.

Frontend development has become more complex, even as HTML and CSS have massively improved. Web development feels easier and harder at the same time.  

For all the diligence and sweat of myriad designers, having looked at hundreds of component libraries and design systems, there’s a limit to how different a checkbox can actually look.

<figure>
<img style="max-width: 320px; margin-inline: auto;" src="/colorpicker.png" alt="">
<figcaption>Safari shipped an <code>alpha</code> attribute for the HTML color input, allowing the user to select an opacity value.
</figcaption>
</figure>

In all browsers, you can now use `<hr>` to visually demarcate different options of a `<select>` element.

<select name="fruits" id="fruits">
<option value="orange">Orange</option>
<option value="lime">Lime</option>
<option value="lemon">Lemon</option>
<option value="grapefruit">Grapefruit</option>
<hr/>
<option value="banana">Banana</option>
<option value="apple">Apple</option>
</select>

- In Chrome/Edge, we're finally getting a customizable `<select>`.
- There have been big improvements to the `<details>` and `<summary>` elements.
- In Safari, a toggle switch can be rendered without a single line of custom CSS, let alone JavaScript. It's just `<input switch type="checkbox">`.
- In Safari, the color input now accepts an opacity value.
- The CSS [forms spec](https://www.w3.org/TR/css-forms-1/) should eventually bring simple customization to all form controls.
- We might finally get some kind of menu element.
- The Chrome team have been pushing for CSS-only carousels.  
- The `dialog` element has been supported in all browsers for several years. It is being improved with   There's now an optional light-dismiss functionality built in (i.e. a way to close the dialog when the user clicks outside of the dialog). We've seen big improvements to the dialog element. Dialogs that can be opened and closed without a single line of JavaScript, will reliably be displayed above other elements without worrying about z-index.
- Anchor positioning in CSS allows for the abandonment of JavaScript libraries like [THING]. The combination of the popover attribute and CSS anchor positioning.
- The `command` and `commandfor` attributes mean that opening and closing dialogs and popovers is easy to implement without JavaScript.
- All browsers support `::file-selector-button` to style the button inside a file input.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">CSS magic: now you can animate height from 0 to auto via `calc-size(auto)` <br><br>Say goodbye to JS Calculate Height!<br><br>Combined with &lt;details name=&quot;&quot;&gt;, a nearly perfect and exclusive Accordion component can now be implemented. <a href="https://twitter.com/Una?ref_src=twsrc%5Etfw">@Una</a> <a href="https://twitter.com/davidbaron?ref_src=twsrc%5Etfw">@davidbaron</a> <a href="https://t.co/OKf6BEzETk">https://t.co/OKf6BEzETk</a> <a href="https://t.co/Jvy622RWwN">pic.twitter.com/Jvy622RWwN</a></p>&mdash; 一丝 (@yisibl) <a href="https://twitter.com/yisibl/status/1791452140663345300?ref_src=twsrc%5Etfw">May 17, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">As of Chrome 131 you have more options to style `&lt;details&gt;` and `&lt;summary&gt;`.<br><br>You can now use of the `display` property on these elements, and also use a `::details-content` pseudo-element to style the part that expands and collapses.<a href="https://t.co/PCTwbUpOxB">https://t.co/PCTwbUpOxB</a> <a href="https://t.co/WpmmDhgIhu">pic.twitter.com/WpmmDhgIhu</a></p>&mdash; Bramus (@bramus) <a href="https://twitter.com/bramus/status/1859275060370080186?ref_src=twsrc%5Etfw">November 20, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### CSS improvements

- `:has` simplifies some tasks that previously would have required JavaScript

In Chrome and Edge, setting [`field-sizing: content`](https://polypane.app/blog/field-sizing-just-works/) will cause an `input`, `textarea` or `select` element to automatically grow to fit the size of its content.

<input style="field-sizing: content; padding-inline: 8px;min-width: 80px; border: solid 1px rgb(50,50,50); height: 30px;border-radius: 2px;" type="text" placeholder="grow me...">


While these incremental improvements might not sound revolutionary in isolation, taken as a whole, it beckons a future where framework-agnostic and tech-stack agnostic component libraries are the norm, and where fewer developers feel the need for one at all.

--- 

I was recently working through a course about using [Typescript with React](https://www.totaltypescript.com/tutorials/react-with-typescript/components/overriding-and-removing-component-props/solution) and as I stared at the obtuse code, I couldn’t help wonder why, with the standard tools of frontend development, rendering a button had started to feel like some kind of hardcore computer-science software engineering problem.

```jsx
    type OverrideProps<T, TOverridden> = Omit<T, keyof TOverridden> & TOverridden;
    type InputProps = OverrideProps<
      ComponentProps<"input">,
      {
        onChange: (value: string) => void;
      }
    >;
```

Here’s some code from Solid JS library Kobalte UI:

```jsx
    import {
            OverrideComponentProps,
            mergeDefaultProps,
            mergeRefs,
    } from "@kobalte/utils";
    import { createMemo, splitProps } from "solid-js";
    
    import { AsChildProp, Polymorphic } from "../polymorphic";
    import { createTagName } from "../primitives";
    import { isButton } from "./is-button";
    
    export interface ButtonRootOptions extends AsChildProp {
            /** Whether the button is disabled. */
            disabled?: boolean;
    }
    
    export interface ButtonRootProps
            extends OverrideComponentProps<"button", ButtonRootOptions> {}
    
    /**
     * Button enables users to trigger an action or event, such as submitting a form,
     * opening a dialog, canceling an action, or performing a delete operation.
     * This component is based on the \[WAI-ARIA Button Pattern\](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
     */
    export function ButtonRoot(props: ButtonRootProps) {
            let ref: HTMLButtonElement | undefined;
    
            const mergedProps = mergeDefaultProps({ type: "button" }, props);
    
            const [local, others] = splitProps(mergedProps, ["ref", "type", "disabled"]);
    
            const tagName = createTagName(
                    () => ref,
                    () => "button",
            );
    
            const isNativeButton = createMemo(() => {
                    const elementTagName = tagName();
    
                    if (elementTagName == null) {
                            return false;
                    }
    
                    return isButton({ tagName: elementTagName, type: local.type });
            });
    
            const isNativeInput = createMemo(() => {
                    return tagName() === "input";
            });
    
            const isNativeLink = createMemo(() => {
                    return tagName() === "a" && ref?.getAttribute("href") != null;
            });
    
            return (
                    <Polymorphic
                            as="button"
                            ref={mergeRefs((el) => (ref = el), local.ref)}
                            type={isNativeButton() || isNativeInput() ? local.type : undefined}
                            role={!isNativeButton() && !isNativeLink() ? "button" : undefined}
                            tabIndex={
                                    !isNativeButton() && !isNativeLink() && !local.disabled ? 0 : undefined
                            }
                            disabled={
                                    isNativeButton() || isNativeInput() ? local.disabled : undefined
                            }
                            aria-disabled={
                                    !isNativeButton() && !isNativeInput() && local.disabled
                                            ? true
                                            : undefined
                            }
                            data-disabled={local.disabled ? "" : undefined}
                            {...others}
                    />
            );
    }
```

That seems like a lot of code to just reproduce what HTML can already do.

While some things in web development have become simpler over time (no more weird Internet Explorer hacks, CSS has a proper layout system, JavaScript adopted most of what was great about jQuery...) in other respects its become more complex over time.

The first article about the new `<select>` element was published by CSS Tricks in March 2022 and its still not in all browsers. The `dialog` element was implemented in Chrome in 2014 but didn’t reach all browsers until 2022. All of this takes time, but I am hopeful that a less complex version of frontend development is possible.


