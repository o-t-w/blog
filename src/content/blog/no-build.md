---
pubDate: 'Jul 03 2026'
title: Do we still need build tools?
heroImage: "/build-tools.png"
description: Do we still need Rspack, SWC, PostCSS, Vite, Parcel, Webpack, Turbopack, esbuild, Rollup, Rolldown, Babel, Autoprefixer, esbuild and Lightning CSS in 2026?  
---

<style>
    figure {
        margin-inline: auto;
        max-width: 550px;
    }
</style>

How necessary are build tools for frontend development in 2026? Let's take a look.

## Do we still need build tools for CSS?

### Prefixes

Autoprefixer, esbuild and Lightning CSS can automatically add vendor prefixes to CSS. This week, Autoprefixer was downloaded from NPM 49,587,933 times. If your codebase doesn't include the `stretch` keyword, `user-select`, or `box-decoration-break`, there's no reason to use a prefixing tool. There are other properties, values and selectors that require a prefix, but because they don't have a standard equivalent, they have to be written manually: e.g. `-webkit-text-stroke`, `-webkit-text-fill-color`, `-webkit-line-clamp` and `::-webkit-scrollbar`. If you write `text-stroke` in your CSS, for example, tools like Autoprefixer won't add the `-webkit` prefix because `text-stroke` is not a standardised CSS property. 

Unprefixing `user-select` is part of [Interop 2026](https://github.com/web-platform-tests/interop/blob/main/2026/README.md#:~:text=Unprefixing%20the%20%2Dwebkit%2Duser%2Dselect%20property) so will happen at some point this year. 

### Syntax lowering

"Syntax lowering" means taking modern CSS and transforming it to be compatible with older browsers. PostCSS was first to offer this functionality, and has been followed by [esbuild](https://esbuild.github.io/content-types/#css) and [Lightning CSS](https://lightningcss.dev/transpilation.html) (which is used by [Bun](https://bun.com/docs/bundler/css#syntax-lowering), Rspack and Turbopack).

The lowered features differ slightly between tools but can include:

- modern colors like `lab()`, `lch()`, `oklab()`, `oklch()`, `color()`, `hwb()`, hex colors with alpha and modern RGB/HSL syntax.
- `color-mix()`
- the `inset` shorthand
- nesting
- gradient interpolation
- `light-dark()`
- logical properties
- `system-ui` font
- Match functions like `round()`, `mod()`, `cos()`, `tan()`, `pow()` etc

These features are either baseline widely available already (meaning they have been supported by all browsers for at least two and a half years), or will become so later this year. Some, like `inset` and the `system-ui` value for `font-family`, have been supported for far longer. 

Syntax lowering comes with severe caveats. While a simple shorthand property like `inset` can be easily transformed into longhand, the full functionality of a feature like `light-dark()` cannot be emulated with any fidelity. There is rarely a way for a build tool to make a new CSS feature "just work" in exactly the same way it works in the latest browsers. Pretending to use a feature, while the output code is something very different, can end up being more confusing than helpful. And having a disconnect between what's in your authored code and what shows up in devtools makes debugging harder.

### Preprocessors: Sass and Less

Sass was once a wildly popular tool but has mostly fallen out of favour as its best features have been adopted into CSS, often in an improved form. That started with CSS custom properties and continued with nesting. Nesting has been supported by all browsers since 2023. CSS color functions like `alpha()`, `color-mix()` and CSS relative color are improvements over Sass color functions. Sass has [deprecated](https://sass-lang.com/documentation/breaking-changes/if-function/) its own `if()` function in favor of the official CSS `if()` syntax. Chrome has shipped `if()` and `@function` and it's possible those features will gain broader browser support in the future. There's also a [CSS spec](https://drafts.csswg.org/css-mixins/#defining-mixins) for mixins which is currently being [implemented in Chromium](https://bsky.app/profile/patrickbrosset.com/post/3mpxkfv25vc2k) by the Microsoft Edge team.

### `@import` bundling

Tools like [esbuild](https://esbuild.github.io/content-types/#css), [PostCSS Bundler](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-bundler), postcss-import, and [Lightning CSS](https://lightningcss.dev/bundling.html) can combine CSS files referenced by `@import` into a single `.css` output file. Similarly, Sass has its own [unique way](https://sass-lang.com/documentation/at-rules/use/) to combine multiple `.scss` files into a single `.css` file. If you're authoring more than a handful of CSS files, combining them together is one build step that will remain highly recommended.

In a no-build project, every CSS file you author needs its own CSS `@import` statement or a `link` tag — meaning each file is a separate HTTP request. David Heinemeier Hansson, the creator of Ruby on Rails, has been one of the few high-profile public advocates of a pure no-build approach to frontend development. On Hey.com, developed by DHH's company, there are 147 `<link rel="stylesheet">` elements in the `<head>` of the document. The site isn't slow. It achieves 94 on a Lighthouse performance test, but its a difficult practice to justify at such a scale and certainly isn't optimal.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">ONCE #1 is completely <a href="https://x.com/hashtag/NoBuild?src=hash&amp;ref_src=twsrc%5Etfw">#NoBuild</a> for the front-end. No bundling, no transpiling, no nothing. Just individual, vanilla CSS and JavaScripts served over HTTP/2. It&#39;s amazingly light and amazingly fast with exquisite cache expiration dynamics. Bliss to develop for too! <a href="https://t.co/BdBFX9BkXW">pic.twitter.com/BdBFX9BkXW</a></p>&mdash; DHH (@dhh) <a href="https://x.com/dhh/status/1736764094546686331?ref_src=twsrc%5Etfw">December 18, 2023</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

Jake Archibald [has written](https://jakearchibald.com/2021/f1-perf-part-7/#:~:text=A%20big%20part%20of%20gzip%20and%20brotli%20compression%20involves%20back%2Dreferences%2C%20eg%20%22the%20next%2050%20bytes%20are%20the%20same%20as%20this%20bit%20earlier%20in%20the%20resource%22.%20That%20can%20only%20happen%20in%20a%20single%20resource%2C%20so%20compressing%20lots%20of%20small%20resources%20is%20less%20efficient%20than%20compressing%20one%20combined%20resource) about the compression benefits of combining resources:

>  A big part of gzip and brotli compression involves back-references, eg "the next 50 bytes are the same as this bit earlier in the resource". That can only happen in a single resource, so compressing lots of small resources is less efficient than compressing one combined resource.

### Minification

Minification strips out comments and whitespace. Minification of CSS remains a best practice.
 
## Do we still need build tools for JavaScript? 

### Bundling ECMAScript Modules

JavaScript module bundlers include Parcel, Bun, Rspack, Webpack, Turbopack, esbuild, Rollup and its successor Rolldown (which is used by Vite).

There are various performance tradeoffs to bundling. Bundling harms caching granularity. When one small module changes, the entire bundle gets invalidated. That is largely outweighed by the positives:
- gzip / brotli compression is more efficient when performed on larger files rather than on a lot of smaller files.
- Bundlers can eliminate unused code.
- Bundlers reduce waterfalls by flattening the import chain.
- Even with HTTP/2 and HTTP/3, the sheer number of HTTP requests still matters.

The [Why do we still need bundlers?](https://rolldown.rs/in-depth/why-bundlers) page in the Rolldown docs argues:

> Although HTTP/2 theoretically supports unlimited multiplexing, most browsers / servers have a default limit of around 100 on the maximum number of concurrent streams per connection. Every network request also comes with fixed overhead (header processing, TLS encryption, multiplexing, etc.) on both the server and the client. More requests means more server load, and the actual concurrency is limited by how fast your server can serve the module files. Applications that contain thousands of unbundled modules will still create serious network bottlenecks even under HTTP/2.

While the performance benefits of bundling absolutely outweigh any negatives, if you have a small amount of JavaScript files, not bundling is perfectly viable. A post on the [V8 blog](https://v8.dev/features/modules#bundle) from 2018 states that it’s fine to skip bundling for web apps "with less than 100 modules in total and with a relatively shallow dependency tree (i.e. a maximum depth less than 5)".

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Modern JavaScript can totally be shipped <a href="https://x.com/hashtag/nobuild?src=hash&amp;ref_src=twsrc%5Etfw">#nobuild</a>. When I was in Chrome, we experimented with how feasible this was at scale. You can load around 50-100 smaller scripts/chunks before the cost of IPC benefits from using a bundler/tooling. But you can go pretty far.</p>&mdash; Addy Osmani (@addyosmani) <a href="https://x.com/addyosmani/status/2050720567473614968?ref_src=twsrc%5Etfw">May 2, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

#### Importing more than ES Modules

Some bundlers bundle more than JavaScript modules. Webpack pioneered importing [other resource types](https://webpack.js.org/concepts/#loaders) into JavaScript via what Webpack called "loaders". To some degree, equivalent functionality has made its way into web standards. Importing JSON via import attribute syntax has been supported by all browsers since early 2025. CSS module scripts are supported by Chrome/Edge and Firefox. And importing text recently landed in [Firefox 153](https://www.firefox.com/en-US/firefox/153.0beta/releasenotes/#:~:text=Developers%20can%20now%20use%20the%20text%20import%20attribute%20to%20import%20text%20files%20using%20the%20module%20system.). There's also a spec for [importing bytes](https://github.com/tc39/proposal-import-bytes), but that isn't implemented in browsers yet.

```js
import json from "./data.json" with { type: "json" };
import text from "/file.txt" with { type: "text" };
import bytes from "./photo.png" with { type: "bytes" };
import styles from "./styles.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);
```

#### Avoiding waterfalls with `modulepreload`

If module A imports module B, and module B imports module C, only after module A has loaded does the browser discover and fetch module B, and so on. The chain of nested imports means the modules are late-discovered. This creates a waterfall — a series of sequential requests. Multiple network roundtrips are necessary to fetch the entire module graph. HTTP/2 & HTTP/3 don’t help with this issue. Bundling isn’t the only solution. By preloading the files, the browser knows about them all ahead of time and can fetch them in parallel, instead of one after the other. 

Managing preload statements is its own burden. To take one real-world example, the Hey email web app has 259 `<link rel="modulepreload">` elements in the `<head>`. Some tools, like the backend framework [Ruby on Rails](https://guides.rubyonrails.org/v7.2/asset_pipeline.html#preloading-pinned-modules), provide help. 

It's recently become possible to preload other module types. In Chrome, Edge and Safari, JSON can be preloaded via `modulepreload` in the `<head>`. Chrome/Edge can also preload CSS. According to the HTML spec, it should also be possible to [preload text](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/modulepreload#:~:text=It%20can%20be%20set%20to%20%22script%22%2C%20%22style%22%2C%20%22json%22%2C%20%22text%22), but that isn't implemented anywhere yet. 

```html
<link rel="modulepreload" as="style" href="/styles.css"> 
<link rel="modulepreload" as="json" href="/data.json">
<link rel="modulepreload" as="text" href="/file.txt">
```

#### Third-party dependencies 

When bundlers first became popular within frontend development, their primary selling point wasn't performance optimisation. Bundlers were, and remain, the only way to take CommonJS dependencies that can't run in the browser and make it so they can - but that's a largely obsolete problem. Standard ES modules (ESM) have been supported in all browsers since 2018 and the ecosystem has slowly caught up. The [amount of packages](https://github.com/wooorm/npm-esm-vs-cjs) on NPM published only in ESM format has gone from just 6% in 2021 to 16% now. Dependencies published in a dual format supporting both ESM and CJS have gone from 1.7% in 2021 to 22% today. There are still plenty of backend/Node-focused packages and unmaintained legacy packages released only as CommonJS but any sane frontend package published anytime recently will be published as ESM.

Another important piece of the puzzle, import maps, have had full browser support since early 2023, and are [used by Shopify](https://shopify.engineering/resilient-import-maps), a complex mega-scale web application. Despite all that, using packages without a bundler is harder than it should be.

The simplist approach to using dependencies from the NPM (or JSR) registry is via a public CDN like [esm.sh](https://esm.sh), [UNPKG](https://unpkg.com/) or [JSPM](https://generator.jspm.io) using an import map.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://esm.sh/lit@3.3.3"
    }
  }
</script>
```

This works well, but the drawback is you have[ no control over uptime](https://www.theverge.com/2024/4/12/24128276/open-source-unpkg-cdn-down). esm.sh and UNPKG are great projects, but in the long-term there's the chance they could become unmaintained (like [Skypack](https://github.com/skypackjs/skypack-cdn/issues/362)) or pose security concerns (like [polyfill.io](https://simonwillison.net/2024/Jun/25/polyfill-supply-chain-attack/)) or go offline altogether (like RawGit). 

What if you'd prefer to self-host your dependencies? Simon Willison, co-creator of the Django framework, has [written on his blog](https://simonwillison.net/2024/Nov/23/without-a-build-system/):

> I sometimes think the hardest problem in computer science right now is taking an NPM library and figuring out how to download it and use it from a `<script>` tag without needing to involve some sort of convoluted build system.

Before NPM and bundling became popular, it was common practice to [vendor](https://htmx.org/essays/vendoring/) your dependencies. Developers manually downloaded or copy-pasted the jQuery source code (to take one example) into their own project. However antiquated it might seem, for websites with one or two dependencies that rarely get updated, this offers a better DX than modern practices. However, if you have a large amount of dependencies that are updated often, the benefit of NPM is sizeable. To check if any of your installed packages are out of date, you simply run `npm outdated`. Running one single command, `npm update`, will update all the packages to the latest version. Using NPM also enables you to receive security alerts about the packages you've installed. But the most important aspect of NPM is transitive dependencies.

Some projects, like jQuery and HTMX, are self-contained: they don’t import any other dependencies. That makes downloading and using them [incredibly simple](https://htmx.org/docs/#:~:text=easiest%20way%20to%20install%20htmx%20is%20to%20simply%20copy%20it%20into%20your%20project). But what happens when a dependency has its own dependencies? Here's the creator of HTMX [explaining the issue](https://htmx.org/essays/vendoring/#:~:text=On%20the%20other,on%20and%20on.):

> “Vendoring also has one massive drawback: there typically isn’t a good way to deal with what is called the transitive dependency problem. If htmx had sub-dependencies, that is, other libraries that it depended on, then to vendor it properly you would have to start vendoring all those libraries as well. And if those dependencies had further dependencies, you’d need to install them as well… And on and on.”

Package managers like NPM, Yarn, pnpm, and Bun download the entire dependency tree. Running `npm i lit`, for example, also downloads all the dependencies of Lit. But despite downloading all the needed code, you can't just use it on the frontend... It's tempting to attempt: 

```html
<script type="importmap">
    {
          "imports": {
            "lit": "/node_modules/lit/index.js",
        }
    }
</script>
```

But you'd actually need to map every transitive dependency as well. In the case of the Lit example, that would be:

```html
<script type="importmap">
    {
          "imports": {
            "lit": "/node_modules/lit/index.js",
            "@lit/reactive-element": "/node_modules/@lit/reactive-element/reactive-element.js",
            "lit-html": "/node_modules/lit-html/lit-html.js",
            "lit-html/": "/node_modules/lit-html/",
            "lit-element": "/node_modules/lit-element/index.js",
            "lit-element/": "/node_modules/lit-element/"
        }
    }
</script>
```

Writing an import map by hand can get complicated enough that there's a tool — [JSPM](https://jspm.org/getting-started#:~:text=JSPM%20makes%20working%20with%20import%20maps%20simpler%20by%20automating%20their%20creation%20and%20management.) — that promises to make "working with import maps simpler by automating their creation and management."

Lea Verou, a former member of the W3C Technical Architecture Group, has written about the topic of web dependencies [at length](https://lea.verou.me/blog/2026/web-deps/#rawdogging-node_modules%2F-imports) and explains the problem of directly using code within node_modules:

> First, deploying your entire node_modules directory is both wasteful, and a security risk. In fact, most serverless hosts (e.g. Netlify or Vercel) automatically remove it from the publicly deployed files after the build is finished.

> Additionally, it violates encapsulation: paths within a package are generally seen as an implementation detail of the package itself.

The reality is you should probably just use a modern bundler like esbuild or Rolldown 🤷‍♂️.

### Transpilers

Babel, tsc, SWC, esbuild and oxc-transform can take JavaScript code authored using the latest syntax and transform it to use syntax that works in older browsers. The latest version of Babel [no longer](https://babeljs.io/blog/2026/06/16/8.0.0#:~:text=also%20no%20longer%20compiles%20to%20ES5%20and%20CommonJS%20by%20default) compiles to ES5 by default. That is a massively belated change. Writing in 2024, Philip Walton, an engineer on the Chrome team, pointed out:

> most sites on the internet ship code that is transpiled to ES5, yet still doesn’t work in IE 11 — meaning the transpiler and polyfill bloat is being downloaded by 100% of their users, but benefiting none of them.

Babel has been been bloating output code to cater for browsers that no longer exist. Tools now have better defaults (and you should specify a browserslist anyway) but its a reminder that the industry-standard complex tooling we adopt to benefit users can sometimes end up harming them. Transpiling can significantly increase bundle size. Walton, an engineer on the Chrome team, [found that](https://philipwalton.com/articles/the-state-of-es5-on-the-web/):

> if you transpile this single line of code with Babel and configure it to add polyfills — even if you limited it to just the needed polyfills based on usage in the source code — it goes from being 31 bytes to 11,217 bytes minified.

While new JavaScript features keep coming, the massive leap between ES5 and ES6 will not be repeated. Adopting features too soon, like decorators, can prove to be problematic if the spec changes. Some of the most important new additions to the language, like Temporal, can't be used without a gigantic polyfill. Simply waiting for new JavaScript features to land in all browsers is a valid strategy.

### Types

[JSDoc](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html#providing-type-hints-in-js-via-jsdoc) can be used for type annotations in regular `.js` files. A modern code editor like VS Code will use the TypeScript engine to read the JSDoc comments, all without the need of a build tool. I can't say I'm a fan of the syntax, but JSDoc has been adopted by some large projects such as [Svelte](https://news.ycombinator.com/item?id=35891259#:~:text=wi-,ll%20result%20in%20smaller,dealing%20with%20build%20steps.,-We).

There is an exciting proposal for a standard called [Type Annotations](https://github.com/tc39/proposal-type-annotations) (previously called Types as Comments) but it's been stuck at stage 1 for some time.

### Minification

As well as stripping out comments and whitespace, minifiers can also uglify JavaScript, which means removing unused code and "mangling" variable names (replacing long variable names with shorter names consisting of a single letter). Minification of JavaScript remains a best practice.

### JavaScript frameworks

Some popular JS frameworks (see for example, [Preact](https://preactjs.com/guide/v11/no-build-workflows/), [Vue](https://vuejs.org/guide/extras/ways-of-using-vue.html#standalone-script)) can technically be used without a build step, but there are limitations to that approach (no JSX, no single-file components, etc). [HTM](https://github.com/developit/htm) is a JSX alternative that works without a build step. Tools like HTMX, AlpineJS and Hotwire do not require any kind of build tooling.

<figure>
<img loading="lazy" class="tweet" src="/michaeljackson.avif" alt="">
<figcaption>An <a href="https://x.com/mjackson/status/1920638972591526307">tweet</a> from React Router creator Michael Jackson</figcaption>
</figure>

## Why does this matter?

Tailwind, Typescript and JSX are ubiquitous, and they all require a build step, so this article might seem somewhat irrelevant. Frontend build tools have improved over time, yet developer satisfaction with them hasn't changed since 2016, [remaining at 3.6/5](https://2025.stateofjs.com/en-US/libraries/build-tools/#build_tools_happiness). Configuration, excessive complexity, and performance rank as the top build-tool [pain points](https://2025.stateofjs.com/en-US/libraries/build-tools/#build_tools_pain_points). When asked "What aspects of JavaScript do you struggle with the most?", dealing with build tools [ranked higher](https://2025.stateofjs.com/en-US/usage/#top_js_pain_points) than async code, security and error handling. 

<img loading="lazy" src="/pain-point-chart.avif" alt="A chart showing build tools in sixth position behind code architecture, state management, managing dependencies, dates, and performance">

Recently, the build of a project I was working on broke because the use of a perfectly valid CSS selector (`::details-content::after`) caused Lightning CSS to blow up (despite this selector being supported by all browsers). Every build tool has hundreds of open GitHub issues. On Stack Overflow there are 42497 questions about Webpack. That includes 10,845 questions that never received a single answer. My hope is that as web standards improve, build tools can become slimmer and simpler, because abandoning them altogether is not a good option on larger projects.
