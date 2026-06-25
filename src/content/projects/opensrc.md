---
title: opensrc
tagline: So coding agents read real source instead of hallucinating it.
tier: secondary
order: 5
kind: developer tooling
status: Released
stack: [Rust, npm, Turborepo]
summary: A CLI that fetches and caches any package's actual source from npm, PyPI, crates.io, or GitHub, so an AI coding agent can read the real implementation instead of guessing at an API from incomplete docs.
featured: true
---

## The idea

AI coding agents hallucinate APIs because they work from types and docs, not from the
implementation. opensrc closes that gap: a fast CLI that resolves a dependency, fetches
its real source from the registry (npm, PyPI, crates.io) or GitHub, and caches it locally
so the agent can grep and read how the thing actually works before it writes against it.

It ships as an Apache-licensed Rust binary with a docs site and a companion Claude skill,
so an agent can reach for it as a tool. It is the most *finished* thing in this list, a
small, sharp utility that does one job and does it cleanly.

This is the kind of tooling I find myself building constantly: not the model, but the
scaffolding around it that turns a capable model into a reliable one.
