---
author: Ollie Williams
pubDatetime: 2023-08-08T15:22:00Z
title: User-adaptive interfaces with AccentColor
postSlug: accentcolor
featured: false
draft: false
tags:
  - CSS
  - UI design
ogImage: "/assets/accentcolor.png"
description: Respecting user preferences for form controls.  
---

<h2 class="h3">System color keywords</h2>

CSS has [system color keywords](https://www.w3.org/TR/css-color-4/#css-system-colors) that reflect the colors used by the browser. The somewhat ugly default blue color of links, for example, is available as a keyword to use anywhere in your CSS. That’s not something I’ve ever reached for. One of the newer additions, however, is more useful: `AccentColor`. 

<h2 class="h3">Respecting user preferences</h2>

> There's a growing movement among designers and developers to create *user-adaptive interfaces*. If you haven't heard that term before, it's just a fancy way of saying that the interface is personalized to the user and that it will try to respect the preferences that the user has indicated in their operating system and/or browser. 

-- <cite>[*CSS needs an Accent system color*](https://blog.mayank.co/css-needs-accent-system-color)</cite>

Dark mode is the most prominent example of changing UI depending on user preferences. `prefers-reduced-motion` is another. With the new CSS keyword value `AccentColor`, we can also tie form-styling to user choices. 

<h2 class="h3">AccentColor</h2>

The color of most HTML form elements reflects the accent color used by the operating system. On most operating systems users can change this value in their settings. 

<video src="https://res.cloudinary.com/dea4odjda/video/upload/ac_none,vc_h264/v1691493883/AccentColor_wfwenw.mov" controls></video>

The rise in popularity of component libraries like shadcn is driven by the fact that native HTML form controls, depending on the browser and operating system, often look rather ugly. You can apply CSS to HTML inputs but there’s a huge limit on what you can style. It’s therefore common to use `appearance: none` to visually hide the element and to then visually rebuild it out of divs to gain full control over styling. Unlike the native HTML form controls, components you’ve handcrafted (or imported from a component library) had no way to reflect the system accent color chosen by the user. `AccentColor` brings that ability to CSS.

```css
label:has(input:checked) .checkbox {
  background-color: AccentColor;
}
```

Below is an example of a custom radio and checkbox using `AccentColor`: 

<iframe src="https://codesandbox.io/embed/accentcolor-example-53tqgg?fontsize=14&hidenavigation=1&module=%2Fstyles.css&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="AccentColor example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>