---
pubDate: 'Feb 16 2025'
title: The false promise of design tokens
heroImage: "/design-tokens-false.png"
description: Design tokens in theory and practice
---

Speaking on the [On Theme podcast](https://www.designsystemsontheme.com/p/all-the-things-you-shouldn-t-do-for-design-system-success-with-dan-mall) recently, design system consultant Dan Mall had this to say:

> “I work with a ton of organizations that, when I asked them, why did you work on tokens first? They said because the promise of tokens is if we have tokens set up, then whenever a rebrand comes along or we need to change the brand color, we could just flip a switch and the brand color will change everywhere. I'm like, cool. __Can you show me how you flip that switch? Like where do we log in to flip the switch? And they'll go, no, no, like in theory, that's how it works. I'm like, okay, does it actually work though? And they're like no, we'd have to do more work to get that to happen__. Like how much more work? Six months more work. How long did you spend on tokens in the first place? Like six months to a year. So you spent a year and it would be a year and a half doing something that actually doesn’t work right now”.

Defining and managing Figma variables is simple. Managing an Adobe Creative Cloud Library is simple. Opening a `.css` file and creating or updating a CSS custom property is simple. Opening the [assets catalog](https://developer.apple.com/documentation/xcode/managing-assets-with-asset-catalogs) in Xcode and creating or updating color values is simple. Updating a JSON file is also simple, but setting up a process that takes that file and utilises it throughout every different codebase is far from easy.

Speaking on that same podcast, here's [Jina Anne](https://www.designsystemsontheme.com/p/when-design-systems-became-a-thing-with-jina-anne), who helped popularise the concept of design tokens:

> “Sometimes I do think people are tokenizing when they don't need to tokenize and they're overcomplicating things, and sometimes I think we created a monster.”

I'm unconvinced that managing colors and other design variables is a labourious enough task to warrant the technical complexity of design tokens.
