---
title: ValoBoard
tagline: A deterministic decision engine for Valorant, built on the game's real map geometry, and shelved when I saw where it led.
tier: core
order: 6
kind: engine · simulation
status: Shelved
stack: [Rust, WASM, TypeScript, Tauri, navmesh, BVH raycasting]
metrics:
  - { value: "12.5k", label: "lines of Rust" }
  - { value: "20Hz", label: "sim tick" }
  - { value: "0", label: "aim / RNG" }
summary: A headless Rust engine that reasons over real Valorant map geometry, baked BVH raycasts and navmesh pathing, with no aim mechanics and no randomness, rendered as a 2D tactical board in a Tauri desktop app. I shelved the simulator once it was clear that teaching game sense this way meant rebuilding Valorant; its geometry extraction lives on in my other Valorant tools.
featured: true
---

## Why determinism

Valorant is usually studied through aim and reactions, which are noisy. ValoBoard strips
those out on purpose. It is a board-game-style simulator: a headless engine reasons over
the **real geometry of Haven**, extracted from the game files, with a baked BVH for
line-of-sight raycasts and a navmesh for movement, and runs at a fixed 20Hz with **no aim
and no RNG**.

The reason to remove the noise is that it makes *decisions* the only thing that moves the
outcome. If a round goes a certain way, it went that way because of a choice, not a flick.

## The build

- A **Rust core** doing the geometry and simulation, compiled to **WASM** for the front end.
- A **navmesh** pathing layer and a **baked BVH** so sightline queries are cheap enough to run every tick.
- A **2D canvas board**, a tactical minimap with agents, sightlines, and timing, in a **Tauri** desktop shell.
- Headless probes, a round linter, and a round benchmark so the engine can be checked without the UI.
- A map-dump tool that pulls meshes, collision, navmesh, and lighting out of the game files.

## Why I shelved it

The goal was game sense. After a summer of building, it was clear that simulating Valorant
well enough to teach it collapses into recreating Valorant, and that is not a project I
want. So I stopped the simulator in August 2026 instead of polishing it.

The same day I tested the replacement: parsing my own match replays. An open-source parser
read a real competitive match into about two million movement records, every kill and
damage event, ability placements, and clean round segmentation. Reviewing what actually
happened beats simulating what might.

The geometry work survived. The map-dump tool feeds [brim-lineups](/projects/brim-lineups),
which uses the same extracted geometry and the game's projectile constants to solve
Brimstone lineups.
