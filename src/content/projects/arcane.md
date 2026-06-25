---
title: Arcane Ecosystem
tagline: A modular Minecraft server platform I've built over the past year, the closest thing I've come to production.
tier: core
order: 2
kind: platform · live systems
status: Live
stack: [Java 21, Paper 1.21, MySQL, HikariCP, ProtocolLib, custom DSL]
metrics:
  - { value: "56k", label: "engine LOC" }
  - { value: "7", label: "integrated addons" }
  - { value: "44", label: "sigil effects" }
repo: https://github.com/Henry-Bonikowsky/Arcane-Sigils
summary: My longest-running project, a Paper plugin platform built around a 56k-line ability engine, plus seven interlocking addons that share one live world through public APIs. It is the project closest to a commercial server with real players and revenue.
featured: true
---

## The longest thread

Everything else in this portfolio is a system I built to learn something. Arcane is the
system I built to *ship*. It is the project I keep coming back to, the better part of a
year of continuous work, and it is the closest my work has come to production: it is built
to run a commercial Minecraft server with hundreds of players and real revenue.

That is a different bar from a research repo. It means uptime, data integrity, anti-dupe,
backwards-compatible migrations, and a player base that treats every regression as a
personal betrayal. This is where I learned the unglamorous half of engineering.

## The engine

At the center is **Arcane Sigils**: a 56,000-line, 213-file ability engine. Players socket
"sigils" into armor and weapons; 44 distinct effects fire on triggers (attack, defend,
kill, death, passive) with conditional activation by health, biome, or time of day.

A piece I built, shipped, and later cut shows what running real software is like: a **YAML
flow-graph DSL and visual node system** that let a server owner who does not write Java
author entirely new mechanics by wiring effects together. It worked. But the partners it
was meant for did not end up using it, so I removed it rather than carry a feature nobody
touched, the kind of call you only have to make on something real. The engine still
carries a custom particle system, an 1.8 PvP combat model backported to 1.21, and
packet-level work through ProtocolLib.

It also runs **bots that make their decisions with AI** rather than fixed scripts. That is
the thread tying this project back to the rest of my work: even the production system I
built to ship has a model making choices inside the live world.

## The platform

Seven addons share one world, and the discipline that keeps that maintainable is a hard
rule: **each addon reaches another's data only through its public API**, never by reaching
into internals. They integrate; they do not entangle.

- **Economy** — vaults, a market with a database-backed web bridge, CS:GO-style cases, and item dupe-tracking across 11 MySQL tables.
- **Legions** — factions, territory claiming, power, and banks.
- **Dungeons** — instanced PvE with parties and tiered bosses, backed by a deep test suite.
- **WarZone** — a procedurally generated mining system and a sandstorm event.
- **Duels, Arena, Cosmetics** — ranked ELO matchmaking, PvP, and player customization.

## Why it's here

The research projects show how I think. Arcane shows that I finish, maintain, and ship to
real people. It is the nearest thing I have to users and revenue, and the clearest proof
that I can carry a system far past the demo.
