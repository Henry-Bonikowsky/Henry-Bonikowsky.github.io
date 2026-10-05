---
title: Hella
tagline: A stack of narrow models for Minecraft plugin development, where a spec goes in and a compiling plugin comes out.
tier: core
order: 1
kind: model stack · LLM training
status: Research
stack: [Python, PyTorch, unsloth, SFT + GRPO, LoRA, vLLM, Ollama]
summary: A code-synthesis stack for Minecraft plugin development. Narrow models and a composer chain a plain-English spec into a compiling Bukkit plugin, and a held-out benchmark of real commits checks the planning stage against Opus. The training code and result files aren't published yet, so this page describes the design and the method rather than quoting numbers.
featured: true
---

## The bet

Frontier models are generalists. On a fast-moving, narrow domain like Minecraft
development, one model spread across everything hallucinates APIs, misses version
targeting, and forgets the conventions that separate a working plugin from one that
corrupts a world on load.

Hella takes the other bet: instead of one model that is good at everything, build a stack
of small models, each trained for one job, and a composer that chains them.

## The stack

Hella is not one model. Each stage has its own input and output.

**1. Retrieval (the explorer).** Intent to the files that matter.
In: a commit message like `fix(aura): skip NPCs in pull-on-hit`, plus the repo at a commit.
Out: the ranked top-10 files a developer would touch (`AuraPower.java`,
`CombatListener.java`, ...). It finds files that exist; it cannot surface a file the change
will create.

**2. Brain (orchestrator).** Intent plus retrieved context to a file-target plan.
In: the intent and those file skeletons. Out:
`AuraPower.java [modify]: guard isNPC() before the pull`. It targets the work and is
meant to refuse vague asks; it does not write the code.

**3. Coder (GRPO-trained).** Spec to compiled Java. In: "a `/flight` command that
toggles the sender's flight and persists across relog via PDC." Out: a full Bukkit plugin
(`onEnable`, a command class, a PDC store) that builds with Maven and boots on Paper.
Compiling and running is the training reward, so the output is checked, not guessed.

**4. Decomposer.** A prose feature to a requirement tree. In: "a dungeon system with
instanced portals, a boss, and loot." Out: ordered requirements the coder builds one at a
time.

**5. Edit model.** An existing file plus an instruction to an incremental edit that still
compiles. In: `SummonManager.java` and "add a cooldown to `summon()`." Out: a
SEARCH/REPLACE patch that builds.

**The composer** chains Brain to Coder to verify to repair, end to end.

## The Brain benchmark

The hardest stage to trust is the Brain, so I built a held-out benchmark for it. Can a
small model *plan a code change* better than a frontier model?

**Task.** Give it a real intent (an actual commit message) plus the repo's grounded
context: an index map and the signature skeletons of the top-10 retrieved files at the
commit's parent. It outputs which files to change and the edit in each.

**Data.** Held-out real commits from my Arcane repos, kept out of training by commit SHA,
with the files each commit actually changed as ground truth. Plus a few vague probes (real
repo, unlocatable intent) to test whether it refuses instead of guessing.

**Grading is pure git, no model-as-judge.** Parse the named files, compare to what the
commit really touched (precision, recall), check the names are real (grounding), check the
probes (abstention). Same prompt, context, and grader across every variant: the base
model, a supervised fine-tune, a GRPO stage, and Opus.

**The read.** In my runs, training moved the planner from well below Opus on precision to
well above it, and it named far fewer files per intent. Opus kept the edge on recall by
naming more files, which catches more real ones but is wrong more often. The GRPO reward
also pushed the model toward committing, so it refused vague probes less often than the
supervised version, a reward-balance problem to fix. The training code and result files
are not in a public repo yet, so I'm not quoting the numbers here.

## The box

Hella is a code-synthesis tool for Minecraft plugin development (Bukkit/Spigot/Paper).
No general chat, no other languages, no other domains. Small, well-scoped features are the
target. Large multi-file features and heavy NMS or packet work need the decomposer plus
multi-turn repair. And it does not guarantee runtime behavior: code that compiles is not
proof it behaves right in-game.

## Where it's going

The edit model turns the stack into an agentic tool that changes files in place instead of
rewriting them. A behavioral-feedback loop would close the gap between "compiles" and
"works."
