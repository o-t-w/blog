---
author: Ollie Williams
pubDatetime: 2023-06-16T15:22:00Z
title: Looking forward to standardised design tokens
postSlug: design-tokens
featured: false
draft: false
tags:
  - Design Tokens
  - Design Systems
ogImage: "/assets/design-tokens.png"
description: The Design Tokens Community Group standard
---
A design token is a glorified variable — but a variable that is platform agnostic. For larger companies, with many designers and developers working in multiple and incompatible codebases (Kotlin for Android, Swift UI for macOS, iOS, watchOS and iPadOS, React Native and Flutter for native apps, CSS/Sass for the web and HTML email) and spread over multiple teams, the *concept* of design tokens always sounded great. Actually setting everything up in a way that provides developer and designer ergonomics has been a different story. Until recently, despite their name, design tokens could not be used in design tools like Figma. This had limited their usefulness. With a push for standardization, we will hopefully see more tools become interoperable. 

## Standardising design tokens

The concept and term *design tokens* originated with the design system team at Salesforce. They open sourced a tool called [Theo](https://github.com/salesforce-ux/theo). In order for design tokens to be platform agnostic, they exist in one format (usually YAML or JSON) and get translated into a range of other formats (CSS custom properties, for example). Theo did that. Amazon released a similar open source project called [Style Dictionary](https://amzn.github.io/style-dictionary/) which became the most popular tool for working with design tokens. 

![](https://paper-attachments.dropboxusercontent.com/s_1E8574FAB51EBE7A111F39A4D0690E0DFF904225D420CA21DB47D96678EC5246_1686771193498_Screenshot+2023-06-14+at+20.32.08.png)


There was another equivalent open source tool called Diez but it is now entirely unmaintained. 

All these tools did roughly the same thing. They gained adoption at some large companies. There was, however, no standard way to write these tokens. Some developers used a format called YAML, others used JSON. In order for different tools to be able to understand your tokens they need to follow a clearly specified standard. 

The Design Token Community Group (DTCG) was set up to standardise design tokens. Danny Banks, the creator of Style Dictionary, is one of the specification editors. Kaelig Deloumeau-Prigent, who worked on Theo at Salesforce, is a co-chair. An ex-contributor to Diez has also contributed. The Design Tokens Community Group also [includes representatives from](https://github.com/design-tokens/community-group#companies-and-open-source-projects-represented-on-the-dtcg):

- Adobe, Figma, Framer and [Sketch](https://www.sketch.com/blog/color-tokens/#:~:text=We%E2%80%99re%20also%20working%20with%20the%20W3C%20Design%20Tokens%20Community%20Group%20as%20they%20define%20a%20standard%20spec%20for%20JSON%20design%20tokens.) 
- Large companies like Atlassian, Google, Shopify and Microsoft. 
- Design system tools like InVision, Supernova, Zeplin, zeroheight, Knapsack and Chromatic

The DTCG is a W3C Community Group but the standard is [not a W3C Standard](https://design-tokens.github.io/community-group/format/#:~:text=is%20not%20a%20W3C%20Standard%20nor%20is%20it%20on%20the%20W3C%20Standards%20Track.).

## Writing tokens

The design tokens spec was designed with readability in mind. Tokens are often written and edited by hand, usually by developers. I am going to briefly look at the syntax used by the design tokens standard but you don’t necessarily have to edit JSON by hand in order to use design tokens. Hopefully in the future most design tools will be able to export, update and sync design tokens. 

**Important note:** **The specification is still a draft and changes could be made.** (I’ll try to keep this article up-to-date).
****
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
Currently the spec mandates that colors only be specified as hex values. However, the output you generate from the tokens with a translation tool like Style Dictionary can be anything you want — RGB, HSL, etc. 

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
{   "error": { 
        "$value": "#CA3618",
        "$type": "color",
        "$description": "Use this color exclusively for error states" 
    }
}
```
 
If you’re going to write and edit design tokens by hand it’s worth reading [the spec](https://tr.designtokens.org/format/#more-token-properties-tbc) in full as this was only a brief introduction.

You can check your tokens are formatted correctly by using a [Design Token Validator](https://animaapp.github.io/design-token-validator-site/). 

## Translating design tokens

Now that we have some tokens, we need a way to translate them into something that developers can actually use in their code. That could be CSS custom properties or Sass variables for web projects, or JavaScript variables for projects making use of CSS-in-JS. Style Dictionary is by far the most popular option, and is still actively maintained (unlike Theo and Diez).

Unfortunately Style Dictionary hasn’t landed support for the standard design tokens syntax yet (they will do once the spec is finalised). 

At the time of writing, the only open source translation tools that have implemented support for the design tokens standard are:

- [Design Tokens CLI](https://github.com/Heydon/design-tokens-cli) 
- [Cobalt UI](https://cobalt-ui.pages.dev/) 

If you’re an engineer who would rather build your own thing there’s an early stage project called [Universal Design Tokens](https://udt.design), a suite of JavaScript libraries for parsing and manipulating design tokens. 

There’s also [Specify](https://specifyapp.com), a rather expensive tool co-founded by Louis Chenais, a contributor to the design token specification. It’s more than a CLI tool, marketing itself as “the world's first Design Data Platform to help organizations efficiently manage their brand identity at scale”. 

I went with Design Tokens CLI for now ([repo here](https://github.com/o-t-w/tokens)). I used a GitHub Action to run Design Tokens CLI to translate the tokens into CSS custom properties and used another GitHub Action to publish the output as an NPM package on the [GitHub Packages registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) so that it can be installed by any frontend project (I’m not a Android or iOS developer so I have no idea what the best solution is for those platforms).
 
I’d never used GitHub Actions before and they aren’t a lot of fun but this worked for me. One action translates the tokens:

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
      # Add files that were created during a run
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Update CSS output
```
Another publishes it as a package:

```yaml
# This workflow will run tests using node and then publish a package to GitHubPackages when a release is created
# For more information see: https://docs.github.com/en/actions/publishing-packagespublishing-nodejs-packages
    
name: Package
    
# Only trigger, when the build workflow succeeded
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
From the command line I can then install the package in any frontend project with `npm install` and make use of the CSS custom properties. 

## Using design tokens in Figma

For working with tokens in Figma, the [Figma Tokens plugin](https://www.figma.com/community/plugin/843461159747178978) has been the go-to option. Figma has natively supported the creation of reusable styles for years. This included some visual properties (like color) but not others (like border radius or spacing). The Figma Tokens plugin brings the ability to apply values defined in your design system (via tokens) to more properties. Native support for tokens has been the most requested feature from Figma users for a few years. Hopefully it will be announced at the upcoming Schema 2023 next week. 

Figma Tokens recently rebranded as [Tokens Studio](https://twitter.com/EstherCheran/status/1667440676336807936) and is “evolving from the Figma plugin you all know to a powerful Design Token management and Design System automation platform”.  

## Conclusion

Is this over-engineering? Here are two tasks that are incredibly simple: 

- Defining some CSS variables inside a `.css` file
- Creating reusable shared styles in Adobe Creative Cloud and Figma

How would you like to take these tasks and build a giant Rube Goldberg machine around them? That's one possible take on design tokens. Is it a better solution to just employ somebody who can both help maintain a Figma design system while also knowing enough code to edit some CSS variables and keep everything in sync? If your problem is inconsistency between web-based frontend development teams you could publish an NPM package of CSS variables and bypass JSON entirely. That’s certainly a simpler option. If you maintain native apps, design tokens might be worthwhile. I'll always think design tokens add unneeded complexity for small teams. For large organisations or teams serving multiple platforms, the hassle of setting them up is probably worth it.

Here are some videos featuring James Nash, an editor of the specification, if you want to hear more. 


https://www.youtube.com/watch?v=ssOdzxZdg58&


[https://youtu.be/ssOdzxZdg58](https://youtu.be/ssOdzxZdg58) 



https://www.youtube.com/watch?v=Ots630OxRwE&


[https://youtu.be/Ots630OxRwE](https://youtu.be/Ots630OxRwE)
