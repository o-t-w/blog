---
pubDate: 'Mar 17 2025'
title: text-align-last
heroImage: "/text-align-last.png"
description: Aligning the last line of text
---

`text-align-last` controls the alignment of the last line of text. This property is particularly useful when working with justified text, as shown in the following examples. 

<style>

.justify {
    font-size: 17px;
  line-height: 1.5;
    text-align: justify;
  text-wrap: pretty;
  hyphens: auto;
}
</style>

## `text-align-last: right`

<div style="text-align: right; margin-inline: auto; display: flex; gap: 16px; align-content: center; width: 580px; max-width: 100%; margin-bottom: 32px;">
<div>
<h2>Ancient Rome</h2>
<p class="justify" style="text-align-last: right;">In modern historiography, ancient Rome is the Roman civilisation from the founding of the Italian city of Rome in the 8th century BC to the collapse of the Western Roman Empire.</p>
</div> 
<img style="width: 100px; object-fit: cover;" src="/colliseum.jpg" alt="">
</div>

```css
p {
    text-align: justify;
    text-align-last: right;
    hyphens: auto;
    text-wrap: pretty;
}
```

<style>
@media(max-width: 600px) {
    .pad-mobile {
        padding-inline: 24px !important;
}
}
</style>

## `text-align-last: center`

<p class="justify pad-mobile" style="margin-top: 44px; margin-bottom: 32px !important; margin-inline: auto; text-align-last: center; background-image: linear-gradient(rgba(0, 0, 0, .6)), url(/colliseum.jpg); background-size: cover; color: white; padding: 28px 82px;">In modern historiography, ancient Rome is the Roman civilisation from the founding of the Italian city of Rome in the 8th century BC to the collapse of the Western Roman Empire.</p>

```css
p {
    text-align: justify;
    text-align-last: center;
    hyphens: auto;
    text-wrap: pretty;
}
```    