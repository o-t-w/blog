---
pubDate: 'Nov 14 2025'
title: A complete guide to the HTML number input
heroImage: "/number-input.png"
description: "Styling, UX, validation"
---

<style>


    input[type="number"] {
        padding: 5px 6px;
        width: 80px;
        border-radius: 6px;
        border: solid 1px gray;
    }
    
     input[type="number"]:user-invalid {
        border-color: orangered;
        outline: solid 1px orangered;
    }

    label {
        display: block;
        margin-bottom: 4px;
        width: fit-content;
        font-size: 16px;
        font-weight: 550;
    }

    #msg {
        color: orangered;
        height: 25.5px;
        font-size: 16px;
        margin-top: 6px;
    }

    .remove-spinners::-webkit-outer-spin-button, .remove-spinners::-webkit-inner-spin-button {
        appearance: none;
    }

    .remove-spinners {
        appearance: textfield;
    }

 @media(pointer:coarse) {
    .remove-on-mobile {
            display: none;
        }
    }

 @media(pointer:coarse) {
    .remove-on-mobile {
            display: none;
        }
    }

 @media(pointer:fine) {
    .mobile-only {
            display: none;
        }
    }

    .with-custom-spinners, [command="--increment"], [command="--decrement"] {
        height: 32.5px;
        background-color: white;
        border: 0 !important;
    }
     .with-custom-spinners {
        padding-left: 10px !important;
        width: 60px !important;
        border-radius: 0 !important;
     }
    .with-custom-spinners:focus {
        outline-offset: -2px;
        outline: solid 2px #3c95ff;
    }

    .with-custom-spinners:user-invalid {
        border-radius: 0 !important;
        outline-offset: -2px;
        outline: solid 2px orangered !important;
    }

    [command="--increment"] {
        padding-inline: 10px;
        align-content: center;
        display: flex;
        border-left: solid 1px black !important;
    }

    [command="--decrement"] {
        padding-inline: 10px;
        display: flex;
        align-content: center;
        border-right: solid 1px black !important; 
    }

    .with-custom-spinners-container {
        border: solid 1px black;
        width: fit-content;
        border-radius: 6px;
        overflow: hidden;
        display: flex;
    }

    .input-with-prefix {
  min-width: 70px !important;
  border: 0 !important;
  padding: 6px !important;
  padding-left: 20px !important;
}

.input-with-prefix:focus {
  outline: 0 !important;
}

.input-shell {
  border: solid 1px black;
  width: fit-content;
  position: relative;
  align-items: center;
  display: flex;
  
  span {
  pointer-events: none;
  position: absolute;
  left: 6px;
}
  
  &:has(:invalid) {
    border-color: orangered;
  }

  &:focus-within {
  outline: solid 1px AccentColor;
  }
}

</style>

<h2 style="margin-top: 0;">Removing the increment/decrement buttons</h2>

Desktop browsers display tiny up and down arrow buttons called spinners (in Chrome you need to hover the input to see them). 

<div>
<input class="remove-on-mobile" value="0" type="number" />
</div>

Should you wish to, removing these buttons takes a few lines of CSS:

```css

/* For Chrome/Edge and Safari */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    appearance: none;
}

/* For Firefox */
input[type="number"] {
    appearance: textfield;
}
```

<div>
<input class="remove-spinners remove-on-mobile" value="0" type="number" />
</div>

The `appearance` property has not required a vendor prefix in any browser for several years but Chrome and Safari do still require non-standard `::-webkit-` prefixed selectors.

The buttons cannot be styled with CSS, but that might [change in the future](https://www.w3.org/TR/css-forms-1/#number-pseudos). It is, however, easy to implement your own increment and decrement buttons.

---

**Number inputs do not support the `pattern` attribute**. Instead we can work with the `min`, `max` and `step` attributes.

## The `step` attribute

The `step` attribute specifies the interval between allowed values. It defines the granularity of allowed numbers — essentially, how much the value should increase or decrease each time it’s adjusted. This applies both to user interactions (like clicking the spinner buttons or pressing arrow keys) and to validation.

By default, `<input type="number">` only accepts whole numbers. If you don’t specify a `step` value, the browser treats it as if `step="1"`, meaning decimal values aren’t considered valid.

In the following example, up to two decimal places are valid, which is useful for monetary values:

```html
<input type="number" step="0.01" />
```

<input style="margin-bottom: 24px;" type="number" step="0.01" />

Specifying an initial `value` or `min` attribute sets the starting-off point of the steps. For example, if the starting value is 1.5 and the step is 1, then only values like 0.5, 2.5, 3.5, and so on are considered valid.

```html
<input type="number" value="1.5" />
```

<input type="number" value="1.5" />

`step="any"` removes all restrictions, allowing any numeric value — including any amount of decimal places — instead of fixed increments.

## Custom increment and decrement buttons using the `stepUp()` and `stepDown()` methods

Incrementing and decrementing a value with JavaScript is trivial, but we need to do so in a way that respects the `min`, `max` and `step` attributes. The `stepUp()` and `stepDown()` methods make this simple.

This might be a good use case for defining custom invoker commands:

```js
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach((input) => {
    input.addEventListener("command", (event) => {
        if (event.command === "--increment") {
        input.stepUp();
        } else if (event.command === "--decrement") {
        input.stepDown();
        }
    });
    });
```

```html
<button commandfor="cost" command="--decrement">-</button>
<input id="cost" type="number" min="0.01" max="10" step="0.01" />
<button commandfor="cost" command="--increment">+</button>
```

<div class="with-custom-spinners-container ">
<button commandfor="cost" command="--decrement"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="14"><path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
</svg>
</button>
 <input
      id="cost"
      type="number"
      min="0.01"
      max="10"
      step="0.01"
      class="remove-spinners with-custom-spinners"
    />
    <button commandfor="cost" command="--increment"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="black" width="14"><path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" /></svg>
</button
    >
</div>

## Scroll to increment/decrement

One perhaps unexpected feature of the number input tripped some users up: in desktop Safari, focusing the input and then scrolling with a mouse would increase or decrease the value. While some people may have found this functionality useful, it could lead to users inadvertently changing the value when they were trying to scroll the page. This behaviour was removed in [Safari 18.4](https://developer.apple.com/documentation/safari-release-notes/safari-18_4-release-notes#Web-API). Chrome has this functionality but only when an `onwheel` event listener is set e.g. `<input type="number" onwheel />`. 

## Numeric keyboard on mobile

The default keyboard shown on iOS includes more than just numbers. This can be controlled via the HTML `inputmode` attribute. For a numbers-only keyboard, specify `inputmode="numeric"`:

```html
<input type="number" inputmode="numeric" />
```

<input class="mobile-only" type="number" inputmode="numeric" />

For a keyboard that includes only numbers and a decimal point, use `inputmode="decimal"`:

```html
<input type="number" inputmode="decimal" step="any"/>
```

<input class="mobile-only" type="number" inputmode="decimal" step="any"/>


## Allowed characters on desktop

`inputmode="numeric"` prevents users from entering anything other than whole numbers on mobile, but has no effect for users with a physical keyboard. What happens when a user types a non-numeric character? Browsers are inconsistent. In Firefox and older versions of Safari, users can type whatever they want. [Safari 26.2](https://developer.apple.com/documentation/safari-release-notes/safari-26_2-release-notes#Forms) updated the behaviour to match Chromium-based browsers. In Chrome/Edge and recent versions of Safari, disallowed characters are immediately and silently rejected: if a user types a disallowed character, it doesn't show up in the input. What characters are allowed? In all browsers a decimal point, the plus and minus symbols and the letter `e` can be typed into the input. There is no way to change this behaviour, other than via JavaScript. Notably, commas aren’t valid, so users can’t use them as delimiters when typing large numbers.

### Localisation

In many countries, including much of Europe and South America, a comma is used as the decimal separator rather than a period. Users in those countries expect to type 2,45 rather than 2.45, for example. The [HTML spec](https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number)) doesn't dictate exactly how browsers should handle localisation:

> A user agent designed for the French market **might** display the value with apostrophes between thousands and commas before the decimals, and allow the user to enter a value in that manner, internally converting it to the submission format described above.

In Firefox, users are always free to type whatever they want, but validation depends on the language set by the HTML `lang` attribute. 

```html
<html lang="de-DE">
```

For other browsers, behaviour depends on the language settings of the device. For browsers on iOS `inputmode="decimal"` displays a comma rather than a period, when appropriate for the language.

<img style="max-width: 340px; margin-inline: auto;" src="/localised-inputmode.png" alt="">

Desktop Safari (from version 26.2) has a unique behaviour: when a user presses the comma key on their keyboard it will be visibly converted to a period. In all other browsers a user can type a comma and see a comma on the screen, but under the hood the browser converts it: if a user types `2,55` the string returned by `.value` in JavaScript will be `"2.55"`, and the number returned by `.valueAsNumber` will be `2.55`, rather than `NaN`. On desktop, for languages where a comma is the commonly used decimal separator, Chrome allows users to type either a period or a comma. 

## `.valueAsNumber`

The `.valueAsNumber` property provides the value as a number rather than a string, which saves you needing to use `parseInt`, `parseFloat` or `Number()`.

```js
const input = document.querySelector('input[type="number"]');
const number = input.valueAsNumber;
```

## When the number input contains a non-numeric value and you retrieve the `.value` in JavaScript, you get an empty string

If the value entered by the user is not a number, `.value` will return an empty string `""` (whereas `.valueAsNumber` will return `NaN`) and there is no way to obtain the string that the user typed. Some developers seem to think this is a big deal. The article [_Why the number input is the worst input_](https://stackoverflow.blog/2022/12/26/why-the-number-input-is-the-worst-input/#h2-aa330d33e7200) on the Stack Overflow blog argues: "If you are building a form that requires conditional validations or calculations, it is hard to understate just how big of a problem this is... getting a blank string makes the kind of validation I routinely get asked to deliver impossible". As we'll see, validation is actually fairly straightforward.

## Validation

### Validation in JavaScript

Giving users feedback when they fill out a form is an essential aspect of UX. The `ValidityState` interface provides a whole host of useful information when validating the number input via JavaScript.

- **`badInput`** returns `true` if the value is not a number.
- **`rangeUnderflow`** returns `true` if the number is less than the minimum specified by the `min` attribute.
- **`rangeOverflow`** returns `true` if the number is greater than the maximum specified by the `max` attribute.
- **`stepMismatch`** returns `true` if the value does not conform to the constraint set by the `step` attribute. If the `step` attribute is omitted, returns true if the value is not an integer. 
- **`valueMissing`** returns `true` if the field is `required` and is empty.
- **`valid`** returns `true` if the value is a number and meets all requirements specified by the `min`, `max` and `step` attributes. If the `required` attribute is omitted then an empty input will also return `true`.

```js
const input = document.querySelector('input[type="number"]');
const feedback = document.getElementById("msg");

input.addEventListener("input", function (event) {
    if (input.validity.badInput) {
        feedback.textContent = `Value must be a number`;
    } else if (input.validity.rangeOverflow) {
        feedback.textContent = `Value must be below ${input.max}`;
    } else if (input.validity.rangeUnderflow) {
        feedback.textContent = `Value must be above ${input.min}`;
    } else if (input.validity.stepMismatch) {
        feedback.textContent = `Value must be a whole number`;
    } else if (input.validity.valueMissing) {
        feedback.textContent = `Required field cannot be empty.`;
    } else if (!input.validity.valid) {
        feedback.textContent = `Value is invalid in some inexplicable way. ${input.validationMessage}`;
    } else {
        feedback.textContent = " ";
    }
});
```
<div>
<label for="quantity">Enter a number between 1 an 10</label>
<input id="quantity" required type="number" min="1" max="10" step="1"/>
<p id="msg"></p>
</div>

### Styling error states

Like other inputs, the number input can be styled with `:valid`, `:invalid`, `:user-valid` and `:user-invalid` pseudo-classes. Additionally, there's both an `:in-range` and `:out-of-range` pseudo-class to indicate whether the value is within the limits specified by the `min` and `max` attributes. It's important to alert users to _all_ errors, so I can't think of a good use case for `:in-range` or `:out-of-range`. Unlike `rangeOverflow` and `rangeUnderflow` in JavaScript, there's no way to discern between whether the value is too high or too low in CSS.

## Datalist

Like most other input types, a `datalist` can be used for suggested values. 

```html
<input list="price" type="number" step="0.01">

<datalist id="price">
  <option value="2.99"></option>
  <option value="5.00"></option>
</datalist>
```

<input style="width: 100px;" list="price" type="number" step="0.01">

<datalist id="price">
  <option value="2.99"></option>
  <option value="5.00"></option>
</datalist>

## Including a prefix or suffix

To include a prefix or suffix that appears to be inside the input, remove the `border` from the input element and style a parent element to visibly resemble an input:

<div class="input-shell">
  <span>£</span>
  <input class="input-with-prefix" type="number" step="0.01">
</div>

```html
<div class="input-shell">
  <span>£</span>
  <input type="number" step="0.01">
</div>
```

```css
.input-shell {
  border: solid 1px black;
  width: fit-content;
  
  &:has(:invalid) {
    border-color: orangered;
  }

  &:focus-within {
  outline: solid 1px AccentColor;
  }
}

.prefix {
  pointer-events: none;
  position: absolute;
}
```

Use `pointer-events: none` on the prefix icon to ensure that clicking anywhere on the input will focus it. 

## When not to use `<input type="number" />`?

As demonstrated, its easy to use CSS to remove the increment and decrement buttons from a number input. However, a user can still use the up and down arrow buttons on their physical keyboard to change the value. This makes the number input [inappropriate](https://kilianvalkhof.com/2022/css-html/are-you-sure-thats-a-number-input/) for fields like credit card numbers, ZIP codes, social security numbers, or one-time passcodes, where `<input type="text" inputmode="numeric" />` should be used instead, together with an appropriate `pattern` attribute. If the value could potentially start with a leading 0, do not use `<input type="number" />`.

## Conclusion

There are a few anti `<input type="number" />` articles around the web but they're mostly out of date. [_Why the GOV.UK Design System team changed the input type for numbers_](https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/), published in 2020, relates all the reasons that team stopped using `<input type="number" />`. The post listed several accessibility-related bugs, all of which have since been fixed 🎉. Today, there are few reasons to avoid `<input type="number"/>`.

<script>
const input = document.getElementById('quantity');
const feedback = document.getElementById("msg");

input.addEventListener("input", function (event) {
    if (input.validity.badInput) {
        feedback.textContent = `Value must be a number`;
    } else if (input.validity.rangeOverflow) {
        feedback.textContent = `Value must be below ${input.max}`;
    } else if (input.validity.rangeUnderflow) {
        feedback.textContent = `Value must be above ${input.min}`;
    } else if (input.validity.stepMismatch) {
        feedback.textContent = `Value must be a whole number`;
    } else if (input.validity.valueMissing) {
        feedback.textContent = `Required field cannot be empty.`;
    } else if (!input.validity.valid) {
        feedback.textContent = `Value is invalid in some inexplicable way. ${input.validationMessage}`;
    } else {
        feedback.textContent = "";
    }
});

const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach((input) => {
    input.addEventListener("command", (event) => {
        if (event.command === "--increment") {
        input.stepUp();
        } else if (event.command === "--decrement") {
        input.stepDown();
        }
    });
    });
</script>

