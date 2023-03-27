---
author: Ollie Williams
pubDatetime: 2023-03-25T15:22:00Z
title: The submitter parameter for FormData
postSlug: submitter-parameter-for-formdata
featured: false
draft: false
tags:
  - forms
  - javascript
ogImage: "/public/logosquare.png"
description: Learn about the new submitter parameter for FormData
---

## Buttons can send values too

In forms, buttons are usually used just to submit the form. Optionally though, a submit button can have a name and, also optionally, a value.

```html
<button name="foo" value="bar" type="submit">Submit</button>
```

There are two ways to submit a form on the web: either let the default behaviour of HTML handle it, or call `event.preventDefault()` on the submit event and use JavaScript to send the data. When using the HTML approach, the name and value of the button are sent to the server alongside the rest of the form data automatically.

## Multiple submit buttons

If you have multiple buttons in the same form that each have a `name`, it will only send data for one of those buttons — the one that was actually clicked by the user to submit the form.

```html
<form action="/test-form" method="post">
  <button name="_action" value="delete" type="submit">Delete</button>
  <button name="_action" value="disable" type="submit">Disable</button>
</form>
```

## Sending a form with JavaScript

When using the `FormData` constructor in JavaScript, unlike a HTML form submission, no button data is included by default.

```js
const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const formdata = new FormData(form);
  console.log(formdata.has("_action")); // logs false

  fetch("/test-form", {
    method: "POST",
    body: formdata,
  });
});
```

There’s now a way to match the HTML behaviour when using JavaScript. `event.submitter` has long existed as a way to identify the button that was used to submit the form. By passing it as the second argument to the `FormData()` constructor, the `name` and `value` of the relevant button get included in the `FormData` object:

```js
const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formdata = new FormData(form, event.submitter);
  console.log(formdata.has("_action")); // logs true

  fetch("/test-form", {
    method: "POST",
    body: formdata,
  });
});
```

A live example of the code can be found on [StackBlitz](https://stackblitz.com/edit/express-simple-a2vqxo?embed=1&file=pages/index.html).

The submitter parameter for the FormData constructor has been supported since [Chrome 112](https://developer.chrome.com/blog/chrome-112-beta/#add-optional-submitter-parameter-to-the-formdata-constructor), [Firefox 111](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/111#:~:text=The%20FormData%20constructor,for%20more%20details.) and [Safari 16.4](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes#:~:text=Added%20support%20for%20a%20submitter%20parameter%20in%20the%20FormData%20constructor.).
