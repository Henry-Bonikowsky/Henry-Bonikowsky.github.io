---
title: brim-lineups
tagline: A Rust solver that finds Brimstone molly lineups to any spot, using physics and geometry pulled from the game files.
tier: secondary
order: 12
kind: solver · Valorant
status: Calibrating
stack: [Rust, raycasting, game-file extraction]
repo: https://github.com/Henry-Bonikowsky/brim-lineups
summary: Computes every physically possible Brimstone incendiary lineup to a chosen spot on any Valorant map, ranked by time to land, from projectile constants and 3D map geometry extracted from the game files.
featured: true
---

## What it is

Lineup sites list the throws someone happened to find. brim-lineups searches all of them.
Give it a map and a target spot, and it flies throws from every reachable standing
position against the map's real collision geometry, then ranks the ones that land within
tolerance by flight time.

## How it works

- **Physics from the files.** Launch speed, gravity scale, bounce restitution, friction,
  and the per-bounce damping rule come from the game's projectile data. Gravity and speed
  were then cross-checked against a frame-timed throw straight up in-game.
- **Geometry from the files.** Map meshes and collision come from the same extraction tool
  as [ValoBoard](/projects/valoboard), with non-blocking volumes filtered out.
- **Lineups you can repeat.** Every stand position must be a real corner you can walk
  into and get stopped on the same spot every time. Each lineup also gets a forgiveness
  score: the share of small aim errors that still land on target.
- **Speed.** A run on Ascent returned 154 distinct lineups to one spot in 28 seconds.

## Its limits

The first computed lineup I threw in-game landed on target. Since then, bouncing throws
have been the hard part: some values that matter for bounces aren't in the game files, so
throws that clip a ledge or bounce several times aren't reliable yet. Direct throws are
the trustworthy subset.
