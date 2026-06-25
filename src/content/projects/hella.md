---
title: Hella
tagline: A code model that learns the part of the stack frontier models keep getting wrong.
tier: core
order: 1
kind: code model · LLM training
status: Active
stack: [Python, PyTorch, unsloth, SFT + GRPO, LoRA, vLLM, Ollama]
metrics:
  - { value: "93%", label: "Brain grounding" }
  - { value: "91%", label: "Brain precision" }
summary: A domain-specialized code model for Minecraft development, where frontier models hallucinate APIs and miss version targeting. A scraped-corpus data pipeline, supervised and GRPO fine-tuning, and an agent layer whose Brain orchestrator decomposes intent into a spec before any code is written.
featured: true
---

## The gap

Ask a frontier model to write a Paper plugin and it will confidently call methods that
were removed three versions ago, target the wrong API, and miss the conventions that
separate a plugin that works from one that corrupts a world on load. The Minecraft stack
moves fast and is poorly represented in general training data, so even very strong models
fall into the same potholes.

Hella is a bet that a small model, trained on the right corpus and wrapped in the right
harness, can be more *useful* on this narrow domain than a much larger general one, not
because it is smarter, but because it is grounded.

## The system

Hella is three layers, built end to end:

**A data pipeline.** A scraped corpus of real Bukkit/Paper/Fabric codebases, normalized
into training examples that carry the version, the API surface, and the conventions in
context.

**A fine-tuning loop.** Supervised fine-tuning with LoRA via unsloth, plus a GRPO stage
for preference optimization, with a vLLM serving path for fast generation during eval.

**An agent layer.** Above the raw model sits a *Brain* orchestrator. It does not jump
to code, it decomposes an intent into a spec (requirements, interfaces, dependencies),
interviews on the load-bearing decisions, and only then dispatches a worker fleet to
implement against that spec. The Brain is where most of the leverage lives: a grounded
plan is worth more than a clever completion.

## What's measured

The Brain orchestrator hits **93% grounding and 91% precision** on my eval harness, it
keeps its plans tied to the actual API surface rather than inventing one, and it keeps
what it proposes relevant to what was asked.

The harness itself runs generated plugins against a compiler and a behavior check, and it
can run Hella head-to-head against a frontier baseline on the same specs, so "is the small
model good enough yet" is a measured question, not a vibe.

## What hasn't worked, yet

This is an honest research log, so the negative results matter:

- A **GRPO checkpoint regressed** below its supervised parent on one-shot codegen, so I
  reverted to the stronger SFT adapter rather than ship the more "advanced" but worse model.
- A **trained decomposer did not beat a few-shot composer baseline**, it overfit a small
  synthetic spec set, and a gentler retrain only recovered to roughly par. The lesson was
  about corpus diversity and eval noise, not architecture.

Both are the kind of thing a leaderboard number would hide.

## Where it's going

Behavior-level evaluation beyond compile-pass, a larger and more diverse real corpus to
push the decomposer past baseline, and a desktop app that ships the model locally via
Ollama behind a Tauri shell. Hella is the project I'm actively building.
