---
title: Hella
tagline: A pipeline that turns a rough Minecraft plugin idea into a full spec, then into a plugin that compiles and loads on Paper.
tier: core
order: 1
kind: idea → spec → plugin · LLM pipeline
status: Research
stack: [Python, Claude CLI, Java 21, Maven, Paper 1.21.11, mineflayer, RCON]
summary: An idea-to-plugin pipeline for Minecraft servers. It asks the owner the questions that matter, writes a full spec in about five minutes, then builds a Paper plugin that has to compile and load before it counts. On my Arcane Gardens test case, an LLM judge scored its spec about 95% against my own design docs, versus 49-56% for plain Opus (flattered, since a simulated owner answered its questions from my notes). Four generated plugins were bot-tested in-game, and the bugs found were fixed and re-run.
featured: true
---

## The problem

The slow part of a server plugin is not the code. It is the spec: every decision about
what players see, what breaks when the server restarts mid-timer, what an admin has to
set up, and which choices only the owner can make. Ask a frontier model for a plugin from
a rough idea and it skips most of that, so the code it writes rests on guesses.

## What I built

Hella is a pipeline in three steps.

**1. Idea to spec** (`idea_to_spec.py`). A rough idea goes in: a few paragraphs, no
decisions. The pipeline drafts a design, finds the forks in it, critiques it, works through
the mechanics, and sweeps for edge cases (admin setup, malformed input, vanilla survival
interactions). From that it asks the owner numbered questions. The owner answers any
of them, or says "your call" and the rest are defaulted and listed as
"Defaulted (veto to change)". Out comes a full spec: player story, decisions, failure
modes, admin setup, build order. Every stage is cached, so a rerun only redoes what
changed.

![Hella's owner questions for Arcane Gardens: numbered decisions, each with options and their costs, from the v17 run](/shots/hella-owner-questions.png)

**2. Spec to plugin** (`spec_to_plugin.py`). The spec becomes a Maven project. It only
counts if it compiles and boots on a real Paper 1.21.11 server with
`Enabling <name>` and no errors, with up to three fix rounds.

**3. In-game tests.** A throwaway Paper server, mineflayer bots as players, and RCON for
admin actions and state checks. The bots play through the flows in the spec and the
results go in a table with the log line as evidence.

## Results

**Spec quality.** I scored specs with an LLM judge against a rubric built from my own
hand-written Arcane Gardens docs, and the judge had to quote the spec for every point it
gave. Same rough idea for both:

- Hella's spec scored 95.5 and 94.6 in two judge runs (full run from scratch: 290 s).
- Plain Opus scored 48.9-55.7.
- On a second case (WarZone Moving Caves) it was 90.0 and 91.2, versus 53.8 for plain Opus.

There is a big caveat. In these evals a simulated owner answers the pipeline's questions
from about 52 KB of my real Gardens notes, so my own decisions leak in through the
answers. Plain Opus got no answers. The gap shows that asking the right questions is worth
a lot, but it overstates what the pipeline does on its own.

**Plugins that work in-game.** Four generated plugins (Arcane Gardens, Moving Caves, a crop
contest, a bounty board) all compiled, loaded, and were bot-tested in-game. On Gardens,
120 of 121 flows passed. The tests found real bugs: a cave selection that always failed,
a wand that refused every valid block, a prize marked delivered into a full inventory, a
catch-up loop that slowed boot to 56 s. Each was fixed at the root and the same bot
scripts were re-run on the rebuilt jars, which passed (the catch-up boot dropped to 10 s).

## The box

Paper plugins only. No mods, no other languages. "Compiles and loads" is the bar the
build step checks automatically; whether a plugin plays right still takes the in-game
bot pass. The headline score comes from my own test cases, judged by a model, with my
own notes behind the owner answers.

## Where it's going

The next test is a live run on a new idea, with me answering the questions instead of a
simulated owner, to see how good the spec is without my notes behind it.
