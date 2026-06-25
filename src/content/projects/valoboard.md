---
title: ValoBoard
tagline: A deterministic decision engine for Valorant, and a clean testbed for reasoning systems.
tier: core
order: 5
kind: engine · simulation
status: Active
stack: [Rust, WASM, TypeScript, Tauri, navmesh, BVH raycasting]
metrics:
  - { value: "~11k", label: "lines of code" }
  - { value: "20Hz", label: "sim tick" }
  - { value: "0", label: "aim / RNG" }
summary: A headless Rust engine that reasons over real Valorant map geometry, baked BVH raycasts and navmesh pathing, with no aim mechanics and no randomness, rendered as a 2D tactical board in a Tauri desktop app. Built so that decisions are the only variable.
featured: true
---

## Why determinism

Valorant is usually studied through aim and reactions, which are noisy. ValoBoard strips
those out on purpose. It is a board-game-style simulator: a headless engine reasons over
the **real geometry of Haven**, a baked BVH for line-of-sight raycasts, a navmesh for
movement, and runs at a fixed 20Hz with **no aim and no RNG**.

The reason to remove the noise is that it makes the model's *decisions* the only thing
that moves the outcome. If a round goes a certain way, it went that way because of a
choice, not a flick. That makes it a clean place to study and to test reasoning.

## The build

It is a real cross-stack engine, not a toy:

- A **Rust core** doing the geometry and simulation, compiled to **WASM** for the front end.
- A **navmesh** pathing layer and a **baked BVH** so sightline queries are cheap enough to run every tick.
- A **2D canvas board**, a hand-built tactical minimap with agents, sightlines, and timing, in a **Tauri** desktop shell.
- Headless probes and end-to-end verification so the engine can be checked without the UI.

## The testbed connection

ValoBoard turned out to be the ideal proving ground for [hermes](/projects/hermes), my
verification harness. Its decisions are closed-ended and well-defined, exactly the
regime where execution-grounded selection works, so I ran hermes against its decision
logic and got good results. The two projects sharpen each other: ValoBoard gives hermes a
domain where "correct" is decidable, and hermes gives ValoBoard a way to trust its logic.

## Status

Active. The geometry, simulation, and board are real and running; the next work is
deepening the decision model and widening it past Haven. It is the engineering piece I am
most proud of, one person carrying a Rust sim engine, a WASM bridge, and a designed UI
end to end.
