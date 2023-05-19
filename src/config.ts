import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://fullystacked.net/",
  author: "Ollie Williams",
  desc: "A blog about frontend development, CSS, JavaScript, HTML, Bun, Deno, and more",
  title: "Fully Stacked",
  ogImage: "logosquare.png",
  lightAndDarkMode: true,
  postPerPage: 8,
};

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 260,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/o-t-w",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/oliver-williams-8b5646184/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:yourmail@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/hypeddev",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
  {
    name: "Twitch",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
];
