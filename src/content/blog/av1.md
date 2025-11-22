---
pubDate: 'Oct 31 2023'
title: The AV1 video codec gains broader support
tags:
  - video
heroImage: "/m3.jpg"
description: The next-gen royalty-free video codec is supported on new Apple devices.
---
_This article was updated on 21 November, 2025_

HP and Dell recently [disabled support](https://arstechnica.com/gadgets/2025/11/hp-and-dell-disable-hevc-support-built-into-their-laptops-cpus/) for the HEVC/H.265 video codec in some laptops in order to avoid licensing costs. It's a reminder of the importance of royalty-free codecs. 

AV1 is an open-source royalty-free video codec created by the Alliance for Open Media (AOM), a group founded by Google, Mozilla, Cisco, Microsoft, Netflix, Amazon, and Intel. Apple is also a member. Work on AV2 is already underway, but hardware and software support for AV1 is still a work in progress. Let's take a look...

## Hardware support

The Google Pixel 10, released in August 2025, is the first smartphone to support [recording video](https://www.androidauthority.com/pixel-10-video-recording-av1-vp9-3586429/) using AV1. 

### Decoding

Support for viewing AV1 videos is now ubiquitous on new devices. 

The [iPhone 15 Pro and iPhone 15 Pro Max](https://bitmovin.com/apple-av1-support/), released in 2023, featured an AV1 hardware decoder. The following year, all versions of the iPhone 16 [support AV1](https://www.apple.com/uk/iphone-16/specs/#:~:text=Supported%20formats%20include%20HEVC%2C%20H.264%20and%C2%A0AV1), including the budged 16e, had support. 

Apple's [M3 chip](https://www.apple.com/newsroom/2023/10/apple-unveils-m3-m3-pro-and-m3-max-the-most-advanced-chips-for-a-personal-computer/) brought support to Apple computers, which has continued with successive chips.

### Hardware-accelerated encoding

While hardware-accelerated AV1 decoding is common on new devices, hardware-accelerated encoding remains rare ([Intel Arc](https://www.intel.com/content/www/us/en/products/docs/discrete-gpus/arc/desktop/b-series/overview.html), [GeForce RTX 40](https://www.nvidia.com/en-gb/geforce/graphics-cards/40-series/) are two of the only examples I could find, but there may be more).

## Exporting AV1

Significantly, Premiere Pro and Adobe Media Encoder do not support AV1 video exports. Motion graphics app Cavalry added support for AV1 export in 2025.

## Browser support

Microsoft Edge belatedly added support for AV1 in January 2024. [All web browsers](https://caniuse.com/av1) now support AV1.
