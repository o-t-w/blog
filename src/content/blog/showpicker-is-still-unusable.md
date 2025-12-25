---
pubDate: 'Dec 25 2025'
title: The showPicker() method is still unusable
heroImage: "/showpicker.png"
description:  There's still no reliable way to show a picker for any input other than <input type="file">.
---

<style>
input {
    padding-inline: 6px;
    /* width: calc(2.5ch + 12px); */
    width: 47px;
    height: 27px;
}

button {
    height: 27px;
    display: flex;
    align-items: center;
    justify-content: center;
}

body {
    font-size: 17px;
    font-family: system-ui;
    margin: 24px;
}

input {
    font: inherit;
}

.year {
    width: calc(5ch + 12px);
}

input[type="date"] {
visibility: hidden;
width: 0;
position: absolute;
width: 1px;
height: 1px;
padding: 0;
margin: -1px;
overflow: hidden;
clip: rect(0 0 0 0);
clip-path: inset(50%);
white-space: nowrap;
border: 0;
bottom: -4px;
}

.flex {
    display: grid;
    column-gap: 8px;
    row-gap: 2px;
    width: fit-content;
}

label {
    grid-row: 1;
    font-size: 15px;
    width: fit-content;
}

input {
    grid-row: 2;
    background-color: white;
    border: solid 1px black;
    border-radius: 2px;
}

.date-container {
    position: relative;
    display: flex;
    grid-row: 2;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
appearance: none;
}

/* For Firefox */
input[type="number"] {
appearance: textfield;
}

input:user-invalid {
border: solid 1px red;
}

</style>

The `showPicker()` method is useful when you want to take advantage of the browser’s native picker UI while hiding the underlying input element. The following example demonstrates a custom date input built on this approach.

<div class="flex" style="margin-bottom: 24px;">
<label for="day">Day</label>
<input id="day" min="1" max="31" type="number">
<label for="month">Month</label>
<input id="month" min="1" max="12" type="number">
<label for="year">Year</label>
<input id="year" class="year" min="1980" max="2026" type="number">
<div class="date-container">
<input min="1980-01-01" max="2026-12-31" type="date">
<button style="padding: 0; aspect-ratio: 1;" aria-label="Show date picker">
<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clip-rule="evenodd" /></svg>
</button>
</div>
</div>

Browser support for `showPicker()` has been gradually improving over the years. [Firefox Nightly](https://www.firefox.com/en-US/firefox/148.0a1/releasenotes/#:~:text=added%20support%20for%20calling%20showPicker()%20on%20text%2Dbased%20%3Cinput%3E%20elements) and [Safari 18](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/#:~:text=Fixed%20showPicker()%20method%20to%20trigger%20suggestions%20from%20a%20datalist.) added support for displaying a datalist, for example. Unfortunately though, there's still no reliable bug-free cross-browser approach for showing a picker for any input other than `<input type="file">`.

On desktop Safari, `showPicker()` works well when displaying a `file` picker or a `color` picker. It also works for `date` and `datetime-local` inputs, and to show the datalist dropdown for text-based inputs — however, a bug means the picker for those input types [can't be closed by clicking away](https://bugs.webkit.org/show_bug.cgi?id=261743), making use of `showPicker()` untenable.

On iPadOS and iOS, `showPicker()` [only works for file inputs](https://bugs.webkit.org/show_bug.cgi?id=261703). It's possible to open a picker programmatically on those operating systems via the `focus()` method, but browser inconsistencies make that approach difficult. `focus()` will show a picker for a `select`, `date`, `datetime-local`, `time`, `month`, `week` or `color` input on iPadOS and iOS but will not show a picker on any desktop browser. `click()` will open a color picker and file picker on all desktop browsers, but not on Safari or iOS. In Safari on macOS, `click()` will also open `date` and `datetime-local` pickers — but no other browser will. When using `click()`, Safari again suffers from the previously mentioned bug where closing the picker is far more difficult that it should be. 

You might think of using `showPicker()` as a progressive enhancement, but there is no way to determine whether `showPicker()` is supported for a [particular input type](https://github.com/whatwg/html/issues/7790). The following will return `true` if the `showPicker` method is supported for *any* input type, which isn't particularly helpful information:

```js
if ("showPicker" in HTMLInputElement.prototype) {
  // ...
}
```

<script type="module">

const dateInput = document.querySelector('input[type="date"]');
document.querySelector('button').addEventListener('click', function() {
const date = Temporal.PlainDate.from({
    year: year.value || 2025,
    month: month.value || 1,
    day: day.value || 1
});
dateInput.value = date.toString();
dateInput.showPicker();
});

dateInput.addEventListener('change', function(event) {
    if (event.currentTarget.value === "") {
        day.value = "";
        month.value = "";
        year.value = "";
    } else {
const date = Temporal.PlainDate.from(event.currentTarget.value);
day.value = date.day;
month.value = date.month;
year.value = date.year;
    }
});

</script>