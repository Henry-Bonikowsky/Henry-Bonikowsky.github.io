---
title: Whitworth Men's Volleyball
tagline: The club team's website, with a login-protected editor so officers can update it without me.
tier: secondary
order: 10
kind: website · CMS
status: Live
stack: [Cloudflare Workers, D1, R2, Cloudflare Access, vanilla JS]
repo: https://github.com/Henry-Bonikowsky/whitworth-mvb
link: https://whitworthmensvolleyball.com
summary: A website for the Whitworth men's volleyball club, run on a Cloudflare Worker with a D1 database, R2 photo storage, and an officer-only editor behind Cloudflare Access.
featured: true
---

![The site's home page: the WHITWORTH wordmark with a volleyball as the dot of the i, above a volleyball net](/shots/whitworth-mvb-home.png)

## What it is

The club needed a site that officers could keep current: schedule, results, roster,
announcements, and photos. So the public page renders from one API call, and officers edit
everything at `/admin`. There is no build step and no dependencies: a single Worker serves
the static site and the API.

![The officer editor: tabs for games, roster, announcements, and officers, and a form for adding a game with photos](/shots/whitworth-mvb-admin.png)

*The officer editor, running locally against a dev database.*

## How it's built

- **Cloudflare Worker** for the API and the static assets, **D1** for the data, **R2** for photos.
- **Login through Cloudflare Access** (a one-time email code). The Worker doesn't just trust
  Access: it re-verifies the signed token itself (signature, audience, issuer, expiry), then
  looks the email up in its own officer table.
- **Two roles.** Editors manage games, roster, announcements, and photos; admins also manage
  officers. The last admin can't be removed.
- **Photos** are resized in the browser before upload and stored under random keys, never
  anything derived from a person's email.
- **Tests:** a token-verification check, and a smoke test that exercises every API route
  against a local Worker (79 checks passing).

## Where it stands

Live at its own domain. The season's schedule, results, and roster haven't been filled in
yet, so most sections still say "coming soon."
