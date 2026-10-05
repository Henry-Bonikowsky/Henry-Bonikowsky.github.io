---
title: dagogy
tagline: An adaptive tutor that finds the edge of what you know, then teaches only the steps you're missing.
tier: core
order: 4
kind: product · LLM app
status: Not yet deployed
stack: [Next.js, TypeScript, Supabase, Stripe, Claude API, Vitest]
metrics:
  - { value: "178", label: "passing tests" }
summary: A tutoring web app for college students. A short adaptive quiz maps what you already know, a planner turns that into a dependency map of steps to the goal, and each step is a lesson gated by a check question that is graded on the server. Built and tested end to end, with payments wired in; it is not deployed yet.
featured: true
---

![dagogy's probe screen: one conceptual question with four options and a "Not sure" choice](/shots/dagogy-probe.png)

*The probe screen, running locally on the app's test fixtures.*

## The idea

Most tutoring starts at chapter one. dagogy starts by measuring. You type what you're
stuck on, and a **probe** asks one conceptual question at a time, binary-searching each
strand of the topic: right answers go deeper, misses and "not sure" go more basic, and a
strand stops once its edge is found. The probe measures and never teaches, so it doesn't
correct you or reveal whether an earlier answer was right.

From that edge map, a **planner** builds a dependency map from what you know to the goal,
and you learn **one step at a time**. Each step ends in a check question; miss it and it's
explained another way.

## How it's built

- **Models by job.** A stronger model (Claude Sonnet) plans the map and fact-checks it with
  web search; a cheaper one (Claude Haiku) runs the probe, lessons, and follow-up
  questions. The probe, plan, and lesson calls use structured output; the fact-check
  can't, because citations from web search don't mix with it.
- **Answers never reach the browser.** Quiz grading is server-side; the correct option is
  stripped from every response, and tests assert it.
- **Deny-all database access.** Row-level security denies everything, and every query
  goes through the server with an explicit user check, so a user's own token can't read
  answers or flip a topic to paid.
- **Payments.** Three free topics, then a per-topic unlock through Stripe Checkout with a
  webhook. The free-topic counter only ever goes up, so deleting a started topic can't
  refund a slot.
- **Tests without API calls.** A fake-model mode serves canned fixtures, so the whole
  suite, including a scripted end-to-end walkthrough, runs with zero model calls.

## Where it stands

The web app works end to end locally and the suite is green. It is **not deployed**, so
there's no live link yet. A native mobile app (Expo) that reuses the same API lives on a
branch, and it hasn't been verified on a device.
