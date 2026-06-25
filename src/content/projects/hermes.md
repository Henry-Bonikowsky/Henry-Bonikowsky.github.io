---
title: hermes
tagline: An agent harness that refuses to call code "done" until it's proven by running it.
tier: core
order: 3
kind: verification · orchestration
status: Active
stack: [Python, MCP, differential testing, subprocess sandbox, best-of-N]
metrics:
  - { value: "exec", label: "selection basis" }
  - { value: "differential", label: "test oracle" }
summary: An execution-grounded verification harness for LLM-generated code. It enumerates every requirement a request implies, keeps execution-verified strictly separate from "looks right," names the single load-bearing fact, and blocks "done" until that fact is proven by running it.
featured: true
---

## The problem with "looks done"

Generating code is the easy half. The half that eats hours later is the gap between
*looks done* and *is done*: the requirement that was never implemented, the edge case
nobody handled, the function that exists but is never wired to the thing it was supposed
to drive. Models are especially bad at catching this in their own output, because the
same blind spot that produced the gap also rates it as fine.

hermes is a harness built around one rule: **never let a model judge correctness it
can't actually verify.**

## How it works

**Differential testing.** For a problem, hermes builds a brute-force reference oracle and
a fuzzer, then differential-tests candidate solutions against them. This turns a
hard-to-verify task into a cheaply verifiable one, the highest-leverage piece.

**Execution-based selection.** It generates a diverse best-of-N, then picks the candidate
that passes the most tests. The choice is made by *running* code, never by asking a model
which answer looks best. The research that motivated this showed model-as-judge fails
precisely on the hardest problems, exactly where you need it most.

**A comprehension gate.** Before anything is called done, hermes enumerates every
requirement the request implies, including the silent ones: wiring ("X must actually be
called by Y"), edge inputs, error paths. Each requirement is marked covered, missing,
broken, or partial, and crucially, *execution-verified is tracked separately from
read-only*. "I read it and it looks right" is never reported as proven.

**The load-bearing fact.** Finally it names the one fact whose falsehood means the build
does not do what was asked, usually an integration fact, not a local detail, and blocks
"done" until that fact is execution-proven. It is a forcing function for comprehension,
not a test counter.

## Its limits

hermes is a research harness, and it shows its seams. It is **slow**, the oracle, the
fuzzer, and best-of-N all cost generations, so it is not something you reach for on every
edit. Where it genuinely shines is **closed-ended, deterministic problems**: I ran it on
the decision logic of [ValoBoard](/projects/valoboard), where correctness is well-defined,
and it produced good results. On open-ended, taste-driven work it has much less to offer,
and the writeup says so.

The interesting part was never the throughput. It was building a system that tells you
exactly what it has and has not proven, the same discipline I want from any agent that
calls a job finished.
