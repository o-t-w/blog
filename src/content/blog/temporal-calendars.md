---
pubDate: 'Jan 13 2025'
title: Calendars in Temporal
heroImage: "/calendars.png"
description: Understanding calendars in the Temporal API
---

`Temporal.ZonedDateTime`, `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainYearMonth`, `Temporal.PlainMonthDay` always have a calendar. `PlainTime` and `Instant` do not have a calendar.

## Specifying a calendar

The following examples set the calendar to `'gregory'` (the Gregorian calendar).

As part of a string:

```js
const date = Temporal.PlainDate.from('2025-12-24[u-ca=gregory]');
```

Using an object:

```js
const date = Temporal.PlainDate.from({day: 24, month: 12, year: 2025, calendar: 'gregory'});
```

Constructor:

```js
new Temporal.PlainDate(2025, 12, 24, 'gregory');
```

If you omit the calendar when using `.from` or a constructor, the ISO 8601 calendar is used by default.

The naming of certain methods makes it clear that the ISO calendar will be used:

- `Temporal.Now.zonedDateTimeISO()`
- `Temporal.Now.plainDateTimeISO()`
- `Temporal.Now.plainDateISO()`
- `instant.toZonedDateTimeISO()`

These methods can only create dates that use the ISO 8601 calendar.

An ISO date can be converted to use a different calendar system using the `withCalendar` method:

```js
const dateToday = Temporal.Now.plainDateISO();
const jewishYear = dateToday.withCalendar('hebrew').year; // 5785
const islamicYear = dateToday.withCalendar('islamic').year; // 1446
const chineseYear = dateToday.withCalendar('chinese').year; // 4661
```

## Which calendars are supported by Temporal?

- `buddhist`: Thai Buddhist calendar
- `chinese`: traditional Chinese calendar
- `coptic`
- `dangi`: traditional Korean calendar
- `ethiopic`
- `gregory`: Gregorian calendar
- `hebrew`: Jewish religious calendar
- `indian`
- `islamic`
- `iso8601`: Gregorian calendar using the ISO 8601 calendar week rules
- `japanese`: Japanese Imperial calendar
- `persian`: calendar used in Iran and Afghanistan

See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getCalendars#supported_calendar_types) for the complete list.

## How do you find a users preferred calendar?

`Intl.DateTimeFormat().resolvedOptions().calendar` will return the users preferred calendar:

```js
const calendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
```

The `getCalendars()` method of `Intl.Locale` will return an array of all calendars used in the given locale.

```js
// for a specified locale e.g. China
new Intl.Locale('zh-CN').getCalendars() // ["gregory", "chinese"]

// for the users locale
const locale = new Intl.DateTimeFormat().resolvedOptions().locale;
new Intl.Locale(locale).getCalendars();
```

## How widespread are non-Gregorian calendars?

For civil administration, business and commerce, the Gregorian calendar is an international standard used by almost all countries. Alternative calendars are primarily used for religious or cultural purposes. For example, in China the Gregorian calendar is the official calendar but the Chinese calendar is used for traditional holidays like Chinese New Year.

## What is the difference between the ISO 8601 calendar and the Gregorian calendar?

The standard calendar used in computing is the ISO 8601 calendar, which is based on the Gregorian calendar.

In some countries that follow the Gregorian calendar, Sunday is considered the first day of the week. According to the ISO standard, Monday is the start of the week. 

ISO 8601 specifies a week-numbering system that is absent from the Gregorian calendar. If the 30th of December 2024 is a Monday, and the Wednesday of that same week is the 1st of January 2025, in which year is that week? According to the ISO, the answer is 2025. As defined by the standard, the first week of the year is the week that contains the first Thursday of the year.

## What are the practical differences between the `gregory` and `iso8601` calendar’s in the Temporal API?

The most significant difference is the week-numbering rule used by the 8601 calendar, which will be reflected in the value of the `weekOfYear` and `yearOfWeek` properties. Here’s some code using the `iso8601` calendar:

```js
const firstDay2027 = Temporal.PlainDate.from('2027-01-01'); 
console.log(firstDay2027.weekOfYear) // 53
console.log(firstDay2027.yearOfWeek) //2026

const lastDay2029 = Temporal.PlainDate.from('2029-12-31');
console.log(lastDay2029.weekOfYear) // 1
console.log(lastDay2029.yearOfWeek) // 2030
```

Here’s the same code using the Gregorian calendar:

```js
const firstDay2027 = Temporal.PlainDate.from('2027-01-01[u-ca=gregory]');
console.log(firstDay2027.weekOfYear) // 1
console.log(firstDay2027.yearOfWeek) // 2027

const lastDay2029 = Temporal.PlainDate.from('2029-12-31[u-ca=gregory]');
console.log(lastDay2029.weekOfYear) // 53
console.log(lastDay2029.yearOfWeek) // 2029
```

The other difference is a pretty niche consideration. A date using the `'gregory'` calendar has `era` and `eraYear` properties.

```js
const date = Temporal.PlainDate.from('2025-01-22[u-ca=gregory]');
date.era // “ce”
date.eraYear // 2025
```

Both the `era` and `eraYear` properties will be `undefined` in any ISO 8601 calendar date. If you’re working with historical dates before 1, then this difference is worth bearing in mind.

## Avoid mismatching calendars

`"iso8601"` is the default calendar used by the Temporal API. You can check the calendar used by a Temporal date via the `.calendarId` property. The default calendar used by the Internationalisation API is locale dependent, but will be `"gregory"` for most users.

```js
const dtf = new Intl.DateTimeFormat();
console.log(dtf.resolvedOptions().calendar);
// "gregory"

const date = Temporal.PlainMonthDay.from('12-24');
console.log(date.calendarId);
// "iso8601" 
```

While these calendars are largely equivalent, the mismatching defaults can lead to errors when using `toLocaleString()` or `Intl.DateTimeFormat` if you don’t explicitly specify a calendar:

```js
const date1 = Temporal.PlainYearMonth.from('2025-07');
const date2 = Temporal.PlainMonthDay.from('07-11');
date1.toLocaleString(); // "Mismatching Calendars" error
date2.toLocaleString(); // "Mismatching Calendars" error
```

```console
Uncaught RangeError: calendars "iso8601" and "gregory" aren't compatible
```

This can be solved by setting the calendar used by `toLocaleString` or `Intl.DateTimeFormat`:

```js
monthDayToday.toLocaleString('en-GB', {calendar: 'iso8601', month: 'long', day: 'numeric'});
```

Or by setting the calendar used by the Temporal date:

```js
const dateToday = Temporal.Now.plainDateISO().withCalendar('gregory');
const monthDayToday = dateToday.toPlainMonthDay();
```

## See also

This is not a comprehensive article. Be sure to read:

- [Supporting Calendar Systems in Temporal](https://tc39.es/proposal-temporal/docs/calendar-review.html)
- [Calendars in Temporal](https://tc39.es/proposal-temporal/docs/calendars.html)
