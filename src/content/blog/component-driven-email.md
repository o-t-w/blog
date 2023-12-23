---
pubDate: 'Jun 18 2023'
title: Modern component-driven HTML email
postSlug: modern-component-driven-email
tags:
  - HTML Email
  - React
heroImage: "/component-email.png"
description: Using CSS variables, components and Tailwind in HTML Email
---

I've been developing for the web for years but I'm pretty new to HTML email. I wanted to try to recreate the modern developer experience I'm used to and apply it to email. Here are my thoughts on the tools I've tried out.

## MJML

MJML stands for "Mailjet Markup Language". It’s an open-source project from the email marketing platform Mailjet. MJML was originally released eight years ago but it’s still actively maintained, although hasn’t seen a major version bump since 2018. It remains the most popular framework for building emails with over 15,000 GitHub stars. MJML is primarily a library of components. It also offers the ability to write fully custom components from scratch but that is badly documented and not the main thrust of the project. The syntax for creating components is [unnecessarily complex](https://medium.com/mjml-making-responsive-email-easy/tutorial-creating-your-own-component-with-mjml-4-1c0e84e97b36). For anybody that wants full control, it’s not the best option. 

## Parcel

Parcel is an online text editor specifically designed for building emails. It’s a great tool that’s become much loved among the HTML email community. Parcel offers plenty of useful features for free but the components functionality requires a pro or business subscription. They are planning on releasing an updated version of their components feature so I might revisit this article when they do so. The [syntax](https://parcel.io/docs/components/template-syntax#creating-variables) for defining props in V1 is rather unorthodox, hopefully V2 will be an improvement. Personally, I wanted to find a free and open-source solution, but I’d highly recommend Parcel in general — which does offer plenty of useful features in its free tier. 

## React Email

Email does not support JavaScript so using a JavaScript framework to write emails is a somewhat strange idea. React email uses React purely as a templating syntax that outputs HTML markup. 

React Email describes itself as an open-source library of unstyled components. Along with customizing those components with CSS, it also enables you to write components from scratch using React.

You can see some [great-looking examples](https://react.email/examples) of React Email being used to recreate emails in the style of popular brands. 

I’m not a fan of having to use `className` instead of `class` or `style={{}}` instead of `style=""` for inline styles. I’d rather just use HTML syntax. I *do* like React as a JavaScript framework — it’s great for updating the DOM when state changes. When you remove the need for writing interactive JavaScript, React doesn’t have much going for it other than familiarity for the millions of people who already know its syntax.

React Email has marketed itself as modernising HTML email. Throwing React at the hard problems of developing for email doesn’t solve much. Using React can’t magically improve client support for any CSS or HTML features. If you like the look of the pre-built components it offers then great. If you want to write something with a lot of custom styling you'll still need to possess in-depth knowledge of how to code for email. 

## Maizzle

Maizzle is an incredibly well-documented open-source tool. Version 4.4 introduced a new [components system](https://maizzle.com/docs/components) with a syntax inspired by Blade, the templating language used by the Laravel PHP framework.

Maizzle offers a bunch of handy tools while staying out of your way. Cosmin Popovici, the creator of Maizzle, has said that the framework is “geared towards people who want to have full control” whereas, “other frameworks take some of that away in exchange for abstractions that non-email developers can use to create emails with a decent confidence that they’ll work well.” I’ve previously written about the upcoming updates to Outlook that will finally mean we can adopt more modern approaches to email markup and styling. The success of projects like MJML came from a desire to abstract away table-based layout. Increasingly then, these abstractions will be less necessary. “Stay in control and code your emails however you like”, is how [Maizzle markets itself](https://maizzle.com/). For anybody that wants to build fully custom emails with their own markup, Maizzle is the best option. 

Here’s a simple link component using some Tailwind classes:

```html
<script props>
    module.exports = {
      href: props.href
    }
</script>

<a class="hover:bg-primary no-underline inline-block bg-secondary text-primary mt-3 mx-auto rounded-md px-3 py-2" href={{href}}>
    <content />
</a>
```
### Using CSS Variables in Maizzle
Few email clients support CSS custom properties so it’s necessary to transpile them at build time. We can do that with a [PostCSS plugin](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-properties). 

```bash
npm install postcss-custom-properties --save-dev
```
Then in your [config.js file](https://maizzle.com/docs/configuration/postcss) include this code:

```js
module.exports = {
  build: {
    postcss: {
      plugins: [
        require('postcss-custom-properties')()
      ]
    }
  }
}
```
Once that’s set up you can define variables in a `<style>` tag in the `<head>` in main.html. 

```css
:root {
  --red: #c73030;
  --blue: #3030c7;
  --green: #30c783;
}
```

## Tailwind

Tailwind is a library of CSS utility classes that has become incredibly popular. Automatic support for Tailwind is one of the selling points of both Maizzle and React Email. **Tailwind was not built with email in mind**. **Many of the classes that Tailwind provides won’t work in all email clients because support for CSS in most email clients is still limited and there’s no way of getting around that.** 

Having said that, Maizzle does a lot to help transform certain Tailwind styles so that they work in email. While TailwindCSS defaults to units like `rem`, Maizzle’s default output uses `px`, which has wider compatibility with different email clients. Because the HTML `<style>` element isn’t supported by all email clients, Maizzle will transform your Tailwind classes into inline styles by default. Some styles (`:hover`, `media queries`) can’t be defined as inline styles so are automatically put in a `<style>` tag and made `!important` (because `!important` is the only way to override an inline style). Support for Tailwind in React Email is more naive in comparison. 

## Conclusion

React Email has already proven rather popular: it has 7000 GitHub stars. Maizzle is four years old and has accumulated 1900 stars. Maizzle is a mature and active project that has kept improving during that time. GitHub stars shouldn’t be used as the best arbiter of the underlying quality of either project. Sadly, React is such a hype-train that React-*anything* will garner popularity even when it's not the best option. React Email is still an early-stage beta project that doesn’t feel at all mature and is primarily popular with React developers rather than email geeks. 

I did a fair amount of research for this article but there are other approaches I haven’t personally tried out. For example, Litmus, a popular but wildly expensive product primarily focused on email client testing, offers a [design library feature](https://help.litmus.com/article/313-litmus-design-library-guide) that allows you to create snippets and partials.

