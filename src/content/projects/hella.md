---
title: Hella
tagline: An orchestration layer over small, task-specialized models, each trained to excel at one job instead of being a jack of all trades.
tier: core
order: 1
kind: orchestration · LLM training
status: Active
stack: [Python, PyTorch, unsloth, SFT + GRPO, LoRA, vLLM, Ollama]
metrics:
  - { value: "93%", label: "Brain grounding" }
  - { value: "91%", label: "Brain precision" }
summary: An orchestration layer for code generation. A Brain decomposes intent into a spec, then dispatches each piece to a small model trained for that specific task, on the bet that a team of specialists beats one generalist on a domain. Built end to end, from the data pipeline and per-task fine-tuning up to the orchestrator that routes and composes.
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
best suited to it and composes the results. A grounded plan and the right routing are
worth more than any single clever completion.

**Task-specialized models.** Small models, each fine-tuned for a narrow job with LoRA via
unsloth, with a GRPO stage for preference optimization and a vLLM serving path for fast
generation. Because each one only has to be good at its slice, it can actually be good at
it.

**A data pipeline.** A scraped corpus of real Bukkit/Paper/Fabric codebases, normalized
into per-task training sets that carry the version, the API surface, and the conventions
in context.

## What's measured

The Brain hits **93% grounding and 91% precision** on my eval harness: it keeps its plans
tied to the actual API surface rather than inventing one, and it keeps what it routes
relevant to what was asked. The harness runs generated plugins against a compiler and a
behavior check, and it can run Hella head-to-head against a frontier baseline on the same
specs, so "is the orchestrated team good enough yet" is a measured question, not a vibe.

## What hasn't worked, yet

This is an honest research log, so the negative results matter:

- A **GRPO checkpoint regressed** below its supervised parent on one-shot codegen, so I
  reverted to the stronger SFT adapter rather than ship the more "advanced" but worse model.
- A **trained decomposer did not beat a few-shot composer baseline**: it overfit a small
  synthetic spec set, and a gentler retrain only recovered to roughly par. The lesson was
  about corpus diversity and eval noise, not architecture.

Both are the kind of thing a leaderboard number would hide.

## Where it's going

Behavior-level evaluation beyond compile-pass, more specialists covering more of the
stack, and a desktop app that ships the orchestrator and its models locally via Ollama
behind a Tauri shell. Hella is the project I'm actively building.
