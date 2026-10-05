---
title: Arcane Ecosystem
tagline: A modular Minecraft server platform I've built over the past year, the closest thing I've come to production.
tier: core
order: 2
kind: platform · live systems
status: Live
stack: [Java 21, Paper 1.21, MySQL, ProtocolLib, Maven reactor]
metrics:
  - { value: "81k", label: "engine LOC" }
  - { value: "77", label: "sigil effects" }
  - { value: "7", label: "addons & plugins" }
summary: My longest-running project, a Paper plugin platform built around an 81k-line ability engine, plus seven addons and plugins that share one live world through public APIs. It runs on a server I host, and every deploy lands where players are.
featured: true
---

## The longest thread

Everything else in this portfolio is a system I built to learn something. Arcane is the
system I built to *ship*. It is the project I keep coming back to, most of a year of
continuous work, and it runs live on a server I host and administer: a VPS with a proxy
in front, a panel, and one main game server. There is no separate test box, so every
deploy lands where players are. The paid store is on hold while it is rebuilt, so I'm not
claiming revenue here.

Running it live is a different bar from a research repo. It means data integrity,
anti-dupe tracking, hot reloads instead of restarts, and backwards-compatible migrations.
This is where I learned the unglamorous half of engineering.

## The engine

At the center is **Arcane Sigils**: an 81,000-line, 462-file ability engine. Players
socket "sigils" into armor and weapons; 77 registered effects fire on 26 trigger types
(attack, defense, kills, bow hits, a passive tick, and more) with conditional activation by health, biome, or time of
day.

A piece I built, shipped, and later cut shows what running real software is like: a **YAML
flow-graph DSL and visual node system** that let a server owner who does not write Java
author entirely new mechanics by wiring effects together. It worked. But the partners it
was meant for did not end up using it, so I removed it, about 4,300 lines, rather than
carry a feature nobody touched. The engine still carries a custom particle shape system,
1.8-style combat on a 1.21 server, and packet-level work through ProtocolLib.

It also runs **combat bots**: fake players driven by a rule-based state machine, with
difficulty tiers that each set 27 combat tunables. They fight with the same sigils
players use.

## The platform

The addons and plugins share one world, and the discipline that keeps that maintainable
is a hard rule: **each one reaches another's data only through its public API**, never by
reaching into internals. They integrate; they do not entangle.

- **Economy**: vaults, a market with a polling website bridge, CS:GO-style cases, and item dupe-tracking, across 19 MySQL tables.
- **Legions**: factions, chunk-claimed territory, relations, power, and banks.
- **Dungeons**: hand-built PvE dungeons with wave and boss orchestration and party runs, backed by the deepest test suite in the project.
- **WarZone**: capturable points, outposts, generated caves for mining, and a sandstorm event.
- **Duels**: ranked ELO, kits, arenas, and seasonal rewards.
- **Bots** and **Gardens**: the combat bots above, and a newer farming addon.

## Why it's here

The research projects show how I think. Arcane shows that I finish, maintain, and ship to
a live server, and that I can carry a system far past the demo.
