---
title: MinimalAI
tagline: Real-time reinforcement learning for combat, inside the game's JVM.
tier: secondary
order: 7
kind: reinforcement learning
status: Active
stack: [Python, PyTorch, DJL, PPO, Fabric / Java]
repo: https://github.com/Henry-Bonikowsky/MinimalAI
summary: A Minecraft mod that trains real neural networks with PPO reinforcement learning to fight, running live inference client-side inside the game's JVM under a tight latency budget.
featured: true
---

## What it is

Most Minecraft "AI" mods are hardcoded if-else trees. MinimalAI embeds a real ML framework
(PyTorch via DJL) and trains actual neural networks with **PPO** reinforcement learning to
play combat, learning timing, strafing, W-tapping for knockback, target selection, and
when to use totems, pearls, and shields.

## The engineering problem

The interesting constraint is latency. The policy has to run **client-side, inside
Minecraft's JVM, under ~50ms** so combat stays smooth, so this is as much a systems
problem (getting PyTorch inference fast and in-process in a hostile runtime) as a learning
problem.

It sits deliberately next to [Hella](/projects/hella) in this portfolio: where Hella is
supervised fine-tuning of a language model, MinimalAI is reinforcement learning of a
control policy. Same instinct, make a model actually *do* the task, from the other end
of the ML toolbox.
