---
title: Hella
tagline: An orchestration layer over small, task-specialized models, each trained to excel at one job instead of being a jack of all trades.
tier: core
order: 1
kind: orchestration · LLM training
status: Active
stack: [Python, PyTorch, unsloth, SFT + GRPO, LoRA, vLLM, Ollama]
metrics:
  - { value: "0.75", label: "precision (Opus 0.45)" }
  - { value: "0.64", label: "F1 (Opus 0.51)" }
  - { value: "0.96", label: "grounding" }
summary: An orchestration layer for code generation. A Brain decomposes intent into a spec and routes each piece to a small model trained for that job. On a held-out benchmark of real commits, the Brain beats Opus on precision (0.75 vs 0.45) and F1, by targeting the work surgically instead of over-naming files.
featured: true
---

## The bet

Frontier models are generalists. On a fast-moving, narrow domain like Minecraft
development, one model spread across everything hallucinates APIs, misses version
targeting, and forgets the conventions that separate a working plugin from one that
corrupts a world on load.

Hella takes the other bet: instead of asking one model to be good at all of it, train
several small models each to be *excellent at one task*, and put an orchestration layer on
top that decides which specialist handles which piece. A jack of all trades is master of
none. Hella is a team of masters with a good manager.

## The system

The orchestrator is the product. The individual models are components it directs.

**The Brain.** An orchestration layer that does not jump to code. It decomposes an intent
into a spec, requirements, interfaces, and dependencies, interviews on the load-bearing
decisions rather than guessing them, then dispatches each part of the work to the model
best suited to it.

**Task-specialized models.** Small models, each fine-tuned for a narrow job with LoRA via
unsloth, with a GRPO stage for preference optimization and a vLLM serving path for fast
generation. Because each one only has to be good at its slice, it can actually be good at it.

**A data pipeline.** A scraped corpus of real Bukkit/Paper/Fabric codebases, normalized
into per-task training sets that carry the version, the API surface, and the conventions.

## The benchmark

The question I wanted answered without fooling myself: can the small model *plan a code
change* better than a frontier model?

**Task.** Give the model a real intent (an actual git commit message, like
`fix(aura): skip NPCs in pull-on-hit`) plus the repo's grounded context: an index map and
the signature skeletons of the top-10 retrieved files at the commit's parent. It outputs a
plan, which files to change and the edit in each. It targets the work; it does not write
the code here.

**Data.** 60 held-out real commits from 6 of my Arcane repos, kept out of training by
commit SHA, with the files each commit actually changed as ground truth. Plus 4 vague
probes (real repo, unlocatable intent) to test whether it refuses instead of guessing.

**Grading is pure git, no model-as-judge.** Parse the files the plan names, compare to
what the commit really touched (precision, recall, F1), check the names are real repo files
(grounding), check the probes (abstention). Same prompt, same context, same grader across
all three arms: Hella, the frozen base model, and Opus.

| metric | Hella | Opus | base |
|---|---|---|---|
| **precision** | **0.747** | 0.454 | 0.239 |
| recall | 0.612 | 0.692 | 0.268 |
| **F1** | **0.638** | 0.511 | 0.214 |
| **grounding** | **0.961** | 0.933 | 0.952 |
| abstention | 3/4 | 4/4 | 1/4 |
| acted | 60/60 | 58/60 | 59/60 |

**The read.** Hella wins precision (0.75 vs Opus 0.45) and F1 by being surgical. Opus wins
recall because it over-names, listing about twice as many files, so it catches more but is
wrong more often. On precision, the metric that punishes confident-wrong, a small
specialist beats the frontier model. With n=60, treat ±0.02 as noise.

Two things keep it from gaming itself: the ground truth is what a real change did, not a
token-overlap proxy, and the context fed in is exactly what retrieval surfaces
(recall@10 = 92%), so it measures comprehension, not memorization. This is one of five axes in a unified harness that runs
into a single versioned leaderboard and doubles as a regression gate.

## Where it's going

More specialists covering more of the stack, closing the recall gap without giving up the
precision lead, and a desktop app that ships the orchestrator and its models locally via
Ollama behind a Tauri shell. Hella is the project I am actively building.
