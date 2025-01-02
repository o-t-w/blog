---
pubDate: 'Jan 02 2025'
title: "Get a Unix timestamp with the Temporal API"
heroImage: "/unixtime.png"
description: Get a Unix timestamp using Temporal.Instant or Temporal.ZonedDateTime
---

## What is a Unix timestamp?

Unix timestamp measures the amount of time that has elapsed since January 1, 1970 at 00:00:00 (midnight) UTC. This date is known as the Unix epoch. It is called "Unix time" because it originated with the Unix operating system, but has since become widely used in general computer programming. It can be measured in seconds, milliseconds or nanoseconds. It is an ever increasing count of time that started at 0 on January 1, 1970. At the moment I type this, is at 1735836441692 milliseconds. Unix timestamps always use UTC (Coordinated Universal Time). A Unix timestamp represents a simultaneous moment in time — the number of elapsed seconds/milliseconds is the same wherever you are in the world.

## `Temporal.Instant` and `Temporal.ZonedDateTime`

Both `Temporal.Instant` and `Temporal.ZonedDateTime` are capable of returning a Unix timestamp.

A Temporal `Instant` represents an exact point in time. An `Instant` contains no time zone or calendar information, and has no concept of days, months, or hours. `Temporal.Instant` stores an integer count of nanoseconds since the Unix epoch.

According to the [docs](https://tc39.es/proposal-temporal/docs/zoneddatetime.html#:~:text=T-,emporal.ZonedDateTime%20can%20be%20considered%20a%20combination%20of%20Temporal.Instant%2C%20Temporal.PlainDateTime%2C%20and%20a%20time%20zone), `Temporal.ZonedDateTime` "can be considered a combination of `Temporal.Instant`, `Temporal.PlainDateTime`, and a time zone".

<img style="border-radius: 0" src="/temporal-object-model.svg" alt="A diagram of the Temporal object model showing that ZonedDateTime has functionality of both PlainDateTime and a Temporal Instant">

`ZonedDateTime` has all the properties of `PlainDateTime` and all the properties of `Instant`.

## An important difference between Temporal and the legacy `Date` object

- `Date` uses milliseconds
- Temporal uses nanoseconds

Both the legacy JavaScript `Date` object and `Temporal.Instant` count from the same epoch (January 1, 1970), but at different levels of fidelity.

The legacy JavaScript `Date` object represents a count of __milliseconds__ since the Unix epoch. `Date` does not support nanoseconds. The smallest unit of time that a `Date` object can represent is one millisecond. `Date.now()` returns milliseconds.

`Temporal.Instant` internally uses a count of __nanoseconds__ since the Unix epoch.

For the sake of interoperability, Temporal is flexible enough to be able to easily return either milliseconds via the `.epochMilliseconds` property or nanoseconds via the `.epochNanoseconds` property.

Because the `Date` object has existed since the creation of JavaScript, certain pre-existing APIs require milliseconds since epoch. When setting the expiry date for a cookie using the CookieStore API, for example, the [expiry date](https://developer.mozilla.org/en-US/docs/Web/API/CookieStore/set#expires) must be provided as a Unix timestamp given in milliseconds.

```js
cookieStore.set({
    name: 'temp1',
    value: '1234',
    expires: Temporal.Now.instant().add({hours: 24}).epochMilliseconds
});
```

In the above example, the cookie is set to expire in 24 hours time.

## Get a Unix timestamp with Temporal

Both `Temporal.Instant` and `Temporal.ZonedDateTime` have the following properties for returning a Unix timestamp:

- `.epochNanoseconds`
- `.epochMilliseconds`

Example using a `ZonedDateTime`:

```js
const rightNow = Temporal.Now.zonedDateTimeISO();
rightNow.epochNanoseconds;
// e.g. 1735851022964000000
rightNow.epochMilliseconds;
// e.g. 1735851022964
```

Example using an `Instant`:

```js
const rightNow = Temporal.Now.instant();
rightNow.epochNanoseconds;
// e.g. 1735851022964000000
rightNow.epochMilliseconds;
// e.g. 1735851022964
```
