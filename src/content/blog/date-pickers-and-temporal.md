---
pubDate: 'Jan 01 2025'
title: Date pickers and the Temporal API
heroImage: "/placeholder.png"
description: ISO 8601, date and time inputs, and the Temporal API
---

Here's what the [Temporal docs](https://tc39.es/proposal-temporal/docs/plaindatetime.html) have to say:

> “Because `Temporal.PlainDateTime`does not represent an exact point in time, most date/time use cases are better handled using exact time types like `Temporal.ZonedDateTime` and `Temporal.Instant`. But there are cases where `Temporal.PlainDateTime` is the correct type to use:
> - Passing data to/from a component that is unaware of time zones, e.g. a UI date/time picker.

**_All HTML date inputs are unaware of time zones._** So we need to use Plain types when working with the HTML date, time, datetime-local and month inputs. What's the best way to do that?

There are multiple ways to a get a value from the different date/time HTML inputs: `.value`, `.valueAsNumber` and `.valueAsDate`.

## Two inadvisable ways to get the value from a HTML date input

`valueAsNumber` and `valueAsDate` should both be avoided.

### `.valueAsNumber`

While `.valueAsNumber` is usually used in conjunction with `<input type="number">`, it also works for date, week, month and time `input` elements.

For a date input, `.valueAsNumber` returns the number of milliseconds elapsed from midnight UTC on the morning of 1970-01-01 to midnight UTC on the morning of the parsed date.

For a month input, `.valueAsNumber` returns the number of months between January 1970 and the chosen month.

For a time input, `.valueAsNumber` returns the number of milliseconds since the start of the day. So 12:00 noon will return 43200000 because there are 86400000 milliseconds in a day.

The datetime-local input does not support `.valueAsNumber`.

### `.valueAsDate`

For a date input, `.valueAsDate` returns a new Date object representing midnight UTC on the morning of the parsed date.

For a month input, `.valueAsDate` returns a new Date object representing midnight UTC on the morning of the first day of the parsed month.

For a time input, `.valueAsDate` returns a new Date object representing the parsed time in UTC on 1970-01-01. It should go without saying that this is not a sensible way to represent a time, and makes it clear why Temporal types like `PlainTime` are useful.

The datetime-local input does not support `.valueAsDate`.

## The ISO 8601 format

ISO 8601 is a standard for formatting dates, times and durations. It specifies a YYYY-MM-DD format for dates.

You can get and set the `.value` of the HTML date input, time input, datetime-local input and month input as an ISO 8601 string.

```html
<input type="date" value="2025-11-27" />
<input type="month" value="2025-11" />
<input type="time" value="13:30" />
<input type="datetime-local" value="2025-11-27T13:30" />
```

The `from()` method of `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainTime` and `Temporal.PlainYearMonth` all accept an ISO 8601 string as an argument.

## Date input

Create a `PlainDate` object when working with a `<input type="date">`

```js
const dateInput = document.querySelector('input[type="date"]');
const date = Temporal.PlainDate.from(dateInput.value);
```

## Time input

Create a `PlainTime` object working with `<input type="time">`

```js
const timeInput = document.querySelector('input[type="time"]');
const time = Temporal.PlainTime.from(timeInput.value);
```

## datetime-local

Create a `PlainDateTime` object when working with `<input type="datetime-local">`

```js
const datetimeInput = document.querySelector('input[type="datetime-local"]');
const dateTime = Temporal.PlainDateTime.from(datetimeInput.value);
```

You can also specify a timezone to create a `ZonedDateTime`. You can specify the timezone as a string like `'America/New_York'`, or get the users system timezone by using `Temporal.Now.timeZoneId()`.

```js
const timeZone = Temporal.Now.timeZoneId();
const zonedDateTime = Temporal.PlainDateTime.from(datetimeInput.value).toZonedDateTime(timeZone);
```

You could optionally let the user explicity choose a timezone with a dropdown. `Intl.supportedValuesOf('timeZone')` returns all the supported timezones.

## `PlainDateTime` from seperate date and time inputs

Should you choose to use seperate inputs for date and time rather than using `<input type="datetime-local">`, the Temporal API makes it easy to combine a date and time value into a `plainDateTime` object.

```js
const dateInput = document.querySelector('input[type="date"]');
const timeInput = document.querySelector('input[type="time"]');

const date = Temporal.PlainDate.from(dateInput.value);
const dateTime = date.toPlainDateTime(timeInput.value);
```

## Month input

Create a `PlainYearMonth` object when working with `<input type="month">`

```js
const monthInput = document.querySelector('input[type="month"]');
const yearMonth = Temporal.PlainYearMonth.from(monthInput.value);
```

_`<input type="month">` is not supported by all browsers._

## Week input

Some browsers support a week input. `<input type="week">` does not map to any Temporal type.

## Third-party date pickers

Because ISO 8601 is a standard, it is used by many open-source third-party custom date pickers. If a custom date or time picker returns an ISO 8601 string, you will be able to construct a Temporal type from it in the same fashion as when working with standard HTML date/time inputs. The [Cally web component](https://wicky.nillia.ms/cally/components/calendar-date/), to take one example, returns its value as an ISO 8601 formatted string.
