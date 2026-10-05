---
title: Brim Book
tagline: Make Valorant Brimstone lineup posters and keep them in a lineup book that lives in your browser.
tier: secondary
order: 11
kind: web tool · Valorant
status: Live
stack: [HTML, JavaScript, Canvas, IndexedDB]
repo: https://github.com/brimbook/brimbook.github.io
link: https://brimbook.github.io
summary: A single-page tool for making Brimstone lineup posters from four screenshots, with post-plant timing math, saved to a lineup book stored only in your browser.
featured: true
---

![Brim Book's poster maker: four screenshot slots and lineup details on the left, the poster preview on the right](/shots/brim-book-maker.png)

## What it is

A lineup is only useful if you can find it again mid-match. Brim Book turns four
screenshots (where to stand, the minimap, where to aim, where it lands) into one poster,
and keeps every poster in a searchable book you can filter by map and side.

For post-plant lineups, the poster adds a beep box: how many spike beeps after the
speed-up to wait before you throw so the defuse can't finish, for a fresh defuse and for
one already past the halfway checkpoint. Both assume the defuser tanks two seconds of fire.

## How it's built

One `index.html`, no build step, no dependencies. There is no server and no account:
lineups are stored in the browser's IndexedDB. Export saves the whole book to one JSON
file to back it up or trade it with a friend; import merges a file in without deleting
anything and skips lineups you already have.

## Its limits

Because nothing leaves your browser, clearing site data or switching devices means your
book isn't there unless you exported it.
