---
title: hermes
tagline: A harness that won't mark LLM-written code "done" until a test it actually ran proves it.
tier: core
order: 3
kind: verification · LLM tooling
status: In use
stack: [Python, Claude CLI, MCP, differential testing, git worktrees, Playwright]
metrics:
  - { value: "8/8", label: "planted bugs caught" }
  - { value: "22", label: "replayed gate runs" }
  - { value: "0", label: "false refusals, 7 Java nodes" }
summary: "Coding agents say \"done\" when code only looks done. hermes treats \"done\" as a claim to disprove: it writes its own acceptance test, proves that test can fail, runs a fresh test the coder never saw, and won't sign off until the requirement that matters is proven by running code. It now re-checks every item my Jarvis goal jobs tick off. Replayed on 11 real past ticks, it caught a false \"done\" in both runs, and its test generator caught 8 of 8 planted bugs."
featured: true
---

## The problem with "looks done"

Generating code is the easy half. The half that eats hours later is the gap between
*looks done* and *is done*: the requirement that was never implemented, the edge case that
crashes, the function that exists but is never wired to the thing it was supposed to
drive. Worst is reward hacking, where the agent makes the visible check pass without doing
the real work. The same blind spot that produced the gap also rates it as fine.

hermes is built on one rule: **a model never decides whether code is correct. Running the
code decides.**

## How it works

It has three layers that share that rule.

**The solver** handles one function. The model writes the simplest brute-force correct
version plus a random input generator; running the brute force on fuzzed inputs gives
expected outputs, so a hard-to-check problem becomes a cheap one. It then generates
several candidates and picks the one that passes the most cases. The pick is made by
running code, never by asking a model which answer looks best.

**The head** takes a whole goal on a real project. Opus designs its own acceptance proof,
the goal is broken into pieces, and a file-editing coder builds them. The coder never sees
the proof: its file tools can't read it, and the proof file is off disk while it works.
Then, every round, the gate:

- runs the check 7 times and distrusts it if the results disagree,
- runs it with a fault flag set, where it **must go red** (a check that can't fail proves nothing),
- has a model audit the check itself for mocks, empty asserts, and nondeterminism,
- asks whether anything in the goal is uncovered and whether the diff games the proof
  (stubs, bypasses, edited tests), and tightens the proof if it does,
- writes a fresh **held-out** test from other scenarios, runs it, and deletes it.

Underneath sits a requirement interrogator. It lists every requirement the request
implies, including the unstated ones ("X must actually be called by Y"), and keeps
execution-proven separate from "a model read it and it looks right". It then names the one
**load-bearing fact**, the thing whose falsehood means the build doesn't do what was asked,
and blocks "done" unless a requirement that actually ran backs it.

**The node gate** is the layer in daily use. My [Jarvis](/projects/jarvis) goal jobs keep
a goal tree and tick items off as they go; before a tick counts, hermes re-checks it in a
temp copy of the project. It first decides whether the item can be checked headlessly at
all. If it needs a phone, a live server, or a human's eyes, the verdict is *skip*, never
*fail*. Otherwise it writes an acceptance test, proves it can go red, and corroborates it
with a held-out test. A failure un-ticks the item and reopens it with the reason.

## Results

Every number here comes from a recorded run in the repo.

- **Test generator.** Eight plausible buggy solutions to a word-frequency problem (case
  handling, tie order, `k=0`, crashing when `k` exceeds the word count) against a 30-case
  suite Opus generated with no hand-written examples: **8/8 caught in each of 2 runs**,
  and the correct solution passed 30/30.
- **Node gate on real history.** I hand-labelled 11 items past jobs had ticked in three of
  my projects (a dungeon generator, the Arcane Gardens plugin, and Jarvis's phone app) and
  replayed the gate on each one at its tick commit, twice: 22 runs.
  - Of the 5 false "done"s, it **caught 1 in both runs**. The job had ticked "side rooms
    fit inside the spiral" even though its own proof line missed both targets; hermes
    measured the rooms at 1.42x the spiral radius (target 1.3 or less) and refused. Three
    more were correct skips (they need a phone, a server, or eyes). One was a miss: its text
    set no threshold to test, though it was closed in the same commit as the caught one, so
    that work still gets reopened.
  - Of the 5 true ones, 5 runs passed, 4 skipped, and 1 was a **false refusal**: both of
    its held-out tests broke in their own code. I fixed that and it passed twice after.
  - While gating a true item, one of its tests exposed a real bug the project's own tests
    missed: on a disk-full error the sender got its error reply twice. I confirmed it by hand.
- **Java.** On the Minecraft plugins every code item first came back *skip*. After teaching
  the gate to read Java (constructors, signatures, Javadoc, the config keys an item names),
  7 true items re-gated at their commits gave **5 passes, 2 correct skips, 0 false
  refusals**.
- **Cost.** A skip takes one model call and 12-22 s. A full gate is 3 calls and took
  94-646 s.

The first real test of the head was on a Valorant coaching app, rendering utility on its
minimap. Across six build-and-repair rounds the probes passed 7/7 and the fault check went
red when it should, yet the gate audit refused to call it done every round: the render
check drew frames through its own code path, so it would have stayed green even if the
shipped minimap component were empty.

![hermes run log: six rounds where the probe passes 7/7 and the negative control discriminates, but every gate audit returns trustworthy=False with the flaws it found](/shots/hermes-gate-audit.png)

*The run log from that run: green probes every round, and the gate audit still says no.*

## Its limits

- **It catches wrong code; it hasn't been shown to produce better code.** On the problems I
  tried, plain Opus already passed every case, so no configuration scored higher.
- **It's slow.** A full gate is minutes, not seconds.
- **The fault check is a liveness check, not mutation testing.** The test implements the
  fault flag itself, so the audit has to catch a test that fails on cue without touching
  the real code.
- **No OS sandbox yet.** Tests run in a subprocess with a timeout inside a temp copy of the
  project, which stops hangs and keeps builds out of the real tree, but not malicious code.
- **Much of my work can't be machine-checked.** Visuals, feel, and anything needing a live
  server or a phone get skipped, so a skip means "unproven", not "fine".

The point was never throughput. It was a system that says exactly what it has and hasn't
proven, the discipline I want from any agent that calls a job finished.
