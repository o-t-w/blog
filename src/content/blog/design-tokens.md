---
author: Ollie Williams
pubDatetime: 2023-06-16T15:22:00Z
title: Standardising design tokens
postSlug: design-tokens
featured: false
draft: false
tags:
  - Design Tokens
  - Design Systems
ogImage: "/assets/design-tokens.png"
description: The Design Tokens Community Group standard
---
A design token is a glorified variable — but a variable that is platform agnostic. For large companies with developers working in multiple and incompatible codebases (Kotlin for Android, Swift UI for macOS, iOS, watchOS and iPadOS, React Native and Flutter for native apps, CSS/Sass for the web and HTML email) and designers working with multiple tools (Figma, Adobe Illustrator, etc), all spread over multiple teams, the *concept* of design tokens always sounded great. Until recently, despite their name, design tokens could not be used in design tools like Figma. This had limited their usefulness. With a push for standardization, we will hopefully see more tools become interoperable. 

## Standardising design tokens

The concept and term *design tokens* originated with the design system team at Salesforce. They open-sourced a tool called [Theo](https://github.com/salesforce-ux/theo). In order for design tokens to be platform agnostic, they exist in one format (usually YAML or JSON) and get translated into a range of other formats (CSS custom properties, for example). Theo did that. Amazon released a similar open-source project called [Style Dictionary](https://amzn.github.io/style-dictionary/) which became the most popular tool for working with design tokens. 

![A chart showing the number of NPM downloads of style-dictionary and Theo over the last 5 years. Style Dictonary used in far more projects](npmtrends.png)


There was another equivalent open-source tool called Diez but it is now entirely unmaintained. 

All these tools did roughly the same thing. They gained adoption at some large companies. There was, however, no standard way to write these tokens. For different CLI tools, design tools and documentation tools to be able to understand your tokens in an interoperable way they need to follow a specified standard.  

The Design Token Community Group (DTCG) was set up to standardise design tokens. Danny Banks, the creator of Style Dictionary, is one of the specification editors. Kaelig Deloumeau-Prigent, who worked on Theo at Salesforce, is a co-chair. An ex-contributor to Diez has also contributed. The Design Tokens Community Group also [includes representatives from](https://github.com/design-tokens/community-group#companies-and-open-source-projects-represented-on-the-dtcg):

- Adobe, Figma, Framer and [Sketch](https://www.sketch.com/blog/color-tokens/#:~:text=We%E2%80%99re%20also%20working%20with%20the%20W3C%20Design%20Tokens%20Community%20Group%20as%20they%20define%20a%20standard%20spec%20for%20JSON%20design%20tokens.) 
- Large companies like Atlassian, Google, Shopify and Microsoft. 
- Design system tools like InVision, Supernova, Zeplin, zeroheight, Knapsack and Chromatic

The DTCG is a W3C Community Group but the standard is [not a W3C Standard](https://design-tokens.github.io/community-group/format/#:~:text=is%20not%20a%20W3C%20Standard%20nor%20is%20it%20on%20the%20W3C%20Standards%20Track.).

## Writing tokens

The design tokens spec was designed with readability in mind. Tokens are often written and edited by hand, usually by developers. I am going to briefly look at the syntax used by the design tokens standard but you don’t necessarily have to edit JSON by hand to use design tokens. Hopefully in the future most design tools will be able to export, update and sync design tokens. 

**Important note:** **The specification is still a draft and changes could be made.** (I’ll try to keep this article up-to-date).

Design tokens are defined as JSON. You can name the file with either a `.tokens` extension or a `.tokens.json` extension. 

A token requires a name and a value:

```json
{ 
  "primary": { 
    "$value": "#CA3618",
    "$type": "color"
  }
}
```
Tokens also require a type. This can be set at the individual token level, as shown above, but it’s easier to group tokens together and define the type at the group level:

```json
{
    "colors": {
    "$type": "color",
    "primary": { 
        "$value": "#CA3618"
        },
    "secondary": { 
        "$value": "#109F53"
        }
    }
}
```
Currently, the spec mandates that colors only be specified as hex values. However, the output you generate from the tokens with a translation tool like Style Dictionary can be anything you want — RGB, HSL, etc. 

Different types defined by the standard include `color`, `dimension`, `fontWeight`, `duration`, `fontFamily`, `number` and `cubicBezier`.

```json
{
    "small": {
        "$value": "8px",
        "$type": "dimension"
    },
    "bold": {
        "$value": 500,
        "$type": "fontWeight"
    },
    "fast": {
        "$value": "200ms",
        "$type": "duration"
    },
    "sans": {
        "$value": "Inter",
        "$type": "fontFamily"
    },
    "line-height-normal": {
        "$value": 1.5,
        "$type": "number"
    },
    "entrance-easing": {
        "$value": [0, 0, 0.5, 1],
        "$type": "cubicBezier"
    }
}
```
A token may optionally include a description:

```json
{   
    "error": { 
        "$value": "#CA3618",
        "$type": "color",
        "$description": "Use this color exclusively for error states" 
    }
}
```
 
If you’re going to write and edit design tokens by hand it’s worth reading [the spec](https://tr.designtokens.org/format/#more-token-properties-tbc) in full as this was only a brief introduction.

You can check your tokens are written correctly by using a [Design Token Validator](https://animaapp.github.io/design-token-validator-site/). 

## Translating design tokens

Now that we have some tokens, we need a way to translate them into something that developers can use in their code. That could be CSS custom properties or Sass variables for web projects, or JavaScript variables for projects making use of CSS-in-JS. Style Dictionary is by far the most popular option, and is still actively maintained (unlike Theo and Diez).

Style Dictionary hasn’t landed support for the standard design tokens syntax yet (they will do once the spec is finalised). 

At the time of writing, the only open-source translation tools that have implemented support for the design tokens standard are:

- [Design Tokens CLI](https://github.com/Heydon/design-tokens-cli) 
- [Cobalt UI](https://cobalt-ui.pages.dev/) 

If you’re an engineer who would rather build your own thing there’s an early-stage project called [Universal Design Tokens](https://udt.design), a suite of JavaScript libraries for parsing and manipulating design tokens. 

There’s also [Specify](https://specifyapp.com), a rather expensive tool co-founded by Louis Chenais, a contributor to the design token specification. It’s more than a CLI tool, marketing itself as “the world's first Design Data Platform to help organizations efficiently manage their brand identity at scale”. 

I went with Design Tokens CLI for now ([repo here](https://github.com/o-t-w/tokens)). I used a GitHub Action to run Design Tokens CLI to translate the tokens into CSS custom properties (aka CSS variables): 

```yaml
name: transform
on: [push]
    
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js environment
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      # Transform the tokens
      - run: npx design-tokens-cli transform
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Update CSS output
```
I used another GitHub Action to publish the output as an NPM package on the [GitHub Packages registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) (I’m not an Android or iOS developer so I have no idea what the best solution is for those platforms).

```yaml   
name: Package
    
on:
  workflow_run:
    workflows: ["transform"]
    types:
      - completed
    
jobs:
  publish-gpr:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          registry-url: https://npm.pkg.github.com/
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}}
```
From the command line the package can then be installed on any frontend project with `npm install`. 

## Using design tokens in Figma

![A screenshot of the Figma variables UI](figmavariables.avif)

In June 2023 Figma introduced variables for defining colors, strings, numbers and booleans. Support for additional kinds of variables will land later this year. Semantically the difference in meaning between a variable and a token is an extremely fine line. Jacob Miller, a product manager at Figma, [has stated](https://twitter.com/pwnies/status/1671584984057151489) "once the W3C spec is ratified, we'll be supporting native import/export" of JSON tokens. Miller has also stated that full native support for JSON tokens is blocked by support for theming, which is still an [open issue](https://github.com/design-tokens/community-group/issues/210) for the design tokens specification. For the time being you can use the plugin API to import JSON tokens. For those on the enterprise plan there's also a REST API. 

The [Figma Tokens plugin](https://www.figma.com/community/plugin/843461159747178978) had been the go-to option for using tokens in Figma. If you can, its worth waiting for native support. Figma Tokens recently rebranded as [Tokens Studio](https://twitter.com/EstherCheran/status/1667440676336807936) and is “evolving from the Figma plugin you all know to a powerful Design Token management and Design System automation platform”.  

## Conclusion

Is this over-engineering? Here are two tasks that are incredibly simple: 

- Defining some CSS variables inside a `.css` file
- Creating reusable shared styles in Adobe Creative Cloud and Figma

How would you like to take these tasks and build a giant Rube Goldberg machine around them? That's one possible take on design tokens. Is it a better solution to just employ somebody who can help maintain a Figma design system while also knowing enough code to edit some CSS variables and keep everything in sync? If your problem is inconsistency between web-based frontend development teams you could publish an NPM package of CSS variables and bypass JSON entirely. For small teams, design tokens add unneeded complexity. For large organisations or teams serving multiple platforms, the hassle of setting them up is probably worth it.

Here are some videos featuring James Nash, an editor of the specification, if you want to hear more. 

<iframe style="width:100%; aspect-ratio: 16 / 9; height: auto;" width="560" height="315" src="https://www.youtube.com/embed/ssOdzxZdg58" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe style="margin-top: 32px; width:100%; aspect-ratio: 16 / 9; height: auto;" width="560" height="315" src="https://www.youtube.com/embed/Ots630OxRwE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

