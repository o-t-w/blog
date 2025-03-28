---
pubDate: 'Mar 28 2025'
title: Is CSS-in-JS still a thing?
heroImage: "/css-in-js.jpg"
description: styled-components goes into maintenance mode. Newer tools like StyleX and vanilla-extract haven't matched its popularity.
---

The most popular CSS-in-JS library has gone into maintenance mode. Here's what the lead maintainer of styled-components [had to say](https://opencollective.com/styled-components/updates/thank-you):

> The React core team has decided to defacto-deprecate certain APIs like the Context API (not available in RSC with no migration path.)
> The ecosystem in general has largely moved on from css-in-js as a concept while other technologies like tailwind have absolutely exploded in popularity.
> For new projects, I would not recommend adopting styled-components or most other css-in-js solutions.

This has been a long time coming. The wild success of Styled Components was proof that the collective wisdom of the React community can be pretty stupid.

In a 2022 [Q&A](https://www.youtube.com/watch?v=jWafEXS7EE0&t=1276s), Dan Abramov talked of the React core team becoming more opinionated about styling approaches:

> “We’re getting a few more opinions now because there are a few more constraints like streaming server rendering, server components. We start caring a bit more about performance. Overall we’re thinking for dynamic stuff just use inline styles. For things that don’t change use something that compiles to CSS so that it doesn’t have extra runtime costs. **A lot of these approaches with runtimes are really expensive.**”

This statement reiterated what had been [said by Sebastian Markbage](https://github.com/reactwg/react-18/discussions/110#:~:text=While%20this%20technique,use%20at%20Facebook.).

> Our preferred solution is to use `<link rel="stylesheet">` for statically extracted styles and plain inline styles for dynamic values. E.g. `<div style={{...}}>`. You could however build a CSS-in-JS library that extracts static rules into external files using a compiler.

In the popular blog post [_Why We’re Breaking Up with CSS-in-JS_](https://dev.to/srmagura/why-were-breaking-up-wiht-css-in-js-4g9b), a maintainer of Emotion argued that CSS-in-JS libraries like Emotion and styled-components add runtime overhead, increase bundle size and clutter the React DevTools. 

Guillermo Rauch, CEO of Vercel, has been belatedly critical of runtime CSS-in-JS:

> I do remember large customers telling us about the runtime cost of some CSS-in-JS solutions hurting their apps.

Those more attuned to web performance have been beating the drum for years: Alex Russell, a Product Manager on Microsoft Edge, has referrred to the approach as a "full-on catastrophe":

Notably, Facebook itself [used regular CSS](https://engineering.fb.com/2020/05/08/web/facebook-redesign/) until around 2020, when they created StyleX, a zero-runtime take on CSS-in-JS.

## CSS is good now

CSS itself is an increasingly powerful and capable language. Some new additions like `@layer` and the `:where` pseudo-class can improve maintainability in large projects. We should soon see better browser support for [`@scope`](https://fullystacked.net/scope-in-css/) and a more powerful version of the [`attr()` function](https://fullystacked.net/attr-function/). Theming can be mostly solved by the `light-dark()` function. CSS has nesting and variables. 

But on a very large project there remain some DX benefits to CSS-in-JS: colocation and scoped styles. Could we get that without the performance drawbacks?

## Does CSS-in-JS still suck?

More recent competitors in this space, like StyleX and vanilla-extract, compile styles to a static CSS file at compile/build time, much like a CSS preprocessor, so avoid the runtime cost of older CSS-in-JS approaches. Despite the performance outlook, newer libraries have yet to catch up in terms of popularity.

According to the [State of CSS 2024 survey](https://2024.stateofcss.com/en-US/tools/#css_in_js), styled-components remains the most popular CSS-in-JS solution. 

<img src="/css-in-js-chart.avif" alt="">

GitHub stars tell a similar story: 

- styled-components: 40,800 ⭐️
- Emotion: 17,700 ⭐️
- vanilla-extract: 9800 ⭐️
- StyleX: 8600 ⭐️

Despite being released by Meta, StyleX hasn't particularly taken off. As teams migrate away from older libraries, they’re primarily migrating to Tailwind (86,700 ⭐️). Here’s [Sunil Pai](https://x.com/threepointone/status/1842993788089966896), creator of one of the earliest CSS-in-JS libraries: 

> “I now use Tailwind and recommend it. It solves the social problem extremely well, and that’s kinda mostly what matters when working with other people.”

Vanilla Extract sounds like its solving something of a [niche problem](https://x.com/markdalgleish/status/1583139828769517568):

> It's targeted more at people building large design systems with lots of design tokens, theming, etc. where you want to programatically generate your styles in a type-safe way.

All most of use really need is [colocation and scoped styles](https://blog.mayank.co/is-css-in-js-actually-bad).

There has been almost an entire decade of churn in this space, from Glamor (unmaintained) to Glamorous ([deprecated](https://github.com/paypal/glamorous/issues/419)), to styled-components (maintenance mode) and JSS([unmaintained](https://github.com/cssinjs/jss#:~:text=no%20longer%20maintained)) and styled-jsx (mostly dead) and Emotion, to Linaria, and onto the myriad projects we have now. By contrast, frameworks like Svelte and Vue seem to have solved this problem.