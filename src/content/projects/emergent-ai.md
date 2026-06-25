---
title: emergent-ai
tagline: Can intelligence emerge from environment design alone, with no reward function?
tier: core
order: 3
kind: research
status: Completed
stack: [Java, agent simulation]
metrics:
  - { value: "9", label: "experiments" }
  - { value: "0", label: "reward functions" }
repo: https://github.com/Henry-Bonikowsky/emergent-ai
summary: A research project asking whether you can build environments where the easiest path is the intelligent path, defining only physics and letting agents discover what works through pure trial and error, with no explicit reward signal.
featured: true
---

## The question

Most machine learning starts by telling the agent what success looks like: here is the
reward, now optimize it. emergent-ai asked the inverse. What if you never tell the agent
what is good or bad, you only define the physics of a world, and let it figure the rest
out?

The hope was that intelligence might be coaxed out of environment design alone: build a
world where the easiest path *is* the intelligent one, and the agent finds it because it
is lazy, not because you told it to.

## Nine attempts

I ran it as a documented series. Each version defined a world and watched what the agents
actually did. What they did, almost every time, was find the cheapest exploit:

- **Passivity**, when doing nothing survived, they did nothing.
- **Wall-hugging**, when spamming movement against a wall earned free survival, they hugged the wall.
- **Exploit-seeking** instead of learning, whatever the laziest winning behavior was, they converged on it.

## The finding

> The problem is always the environment, never the agent.

Agents will always find the easiest path. If that path is not intelligent, the
environment is the thing that is broken. And the reason nature produces intelligence is
that its environments **self-correct**: an exploit that works draws more agents to it,
which depletes the resource it depends on, which makes the exploit fail. Success
automatically manufactures the conditions for its own failure. Agents are each other's
environment.

This is a completed exploration rather than a benchmark-beating system, and that is the
point: it was an experiment to *learn something*, and it did. The intuition it left me
with, that you shape behavior by shaping the world it happens in, not by patching the
behavior, runs straight through everything I've built since.
