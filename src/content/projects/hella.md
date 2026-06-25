---
title: Hella
tagline: A stack of narrow models for Minecraft plugin development, where a spec goes in and a compiling plugin comes out.
tier: core
order: 1
kind: model stack · LLM training
status: Active
stack: [Python, PyTorch, unsloth, SFT + GRPO, LoRA, vLLM, Ollama]
metrics:
  - { value: "0.85", label: "plan precision (Opus 0.45)" }
  - { value: "98%", label: "grounding" }
  - { value: "5", label: "specialist models" }
summary: A code-synthesis stack for Minecraft plugin development. Five narrow models and a composer chain a plain-English spec into a compiling Bukkit plugin. Its 14B Brain plans which files a change touches at 0.85 precision on a held-out benchmark of real commits, where Opus gets 0.45.
featured: true
---

## The bet

Frontier models are generalists. On a fast-moving, narrow domain like Minecraft
development, one model spread across everything hallucinates APIs, misses version
targeting, and forgets the conventions that separate a working plugin from one that
corrupts a world on load.

Hella takes the other bet: instead of one model that is good at everything, build a stack
of small models, each excellent at one job, and a composer that chains them. A jack of all
trades is master of none. Hella is a team of masters with a good manager.

## The stack

Hella is not one model. It is five, each with its own input and output.

**1. Retrieval (the explorer).** Intent to the files that matter. `recall@10 = 92%`.
In: a commit message like `fix(aura): skip NPCs in pull-on-hit`, plus the repo at a commit.
Out: the ranked top-10 files a developer would touch (`AuraPower.java`,
`CombatListener.java`, ...). It finds files that exist; it cannot surface a file the change
will create.

**2. Brain (14B orchestrator).** Intent plus retrieved context to a file-target plan.
Precision 0.75, against Opus at 0.45. In: the intent and those file skeletons. Out:
`AuraPower.java [modify]: guard isNPC() before the pull`. It targets the work and refuses
vague asks; it does not write the code.

**3. Coder (7B, GRPO-trained).** Spec to compiled Java. In: "a `/flight` command that
toggles the sender's flight and persists across relog via PDC." Out: a full Bukkit plugin
(`onEnable`, a command class, a PDC store) that builds with Maven and boots on Paper.
Compiling and running is the training reward, so the output is checked, not guessed. Whole
plugins land about 3/7 one-shot; small decomposed features compile 6/6.

**4. Decomposer.** A prose feature to a requirement tree. Baseline 0.75. In: "a dungeon
system with instanced portals, a boss, and loot." Out: ordered requirements the coder
builds one at a time.

**5. Edit model.** An existing file plus an instruction to an incremental edit that still
compiles. In: `SummonManager.java` and "add a cooldown to `summon()`." Out: a
SEARCH/REPLACE patch that builds. This is the path to the agentic app: edit files in place,
do not rewrite them.

**The composer** (`compose_plugin.py`) chains Brain to Coder to verify to repair, end to
end: 6/6 small plugins go from spec to compiled plugin on their own.

## The Brain benchmark

The hardest stage to trust is the Brain, so I built a held-out benchmark for it. Can the
14B model *plan a code change* better than a frontier model?

**Task.** Give it a real intent (an actual commit message) plus the repo's grounded
context: an index map and the signature skeletons of the top-10 retrieved files at the
commit's parent. It outputs which files to change and the edit in each.

**Data.** 60 held-out real commits from 6 of my Arcane repos, kept out of training by
commit SHA, with the files each commit actually changed as ground truth. Plus 4 vague
probes (real repo, unlocatable intent) to test whether it refuses instead of guessing.

**Grading is pure git, no model-as-judge.** Parse the named files, compare to what the
commit really touched (precision, recall), check the names are real (grounding), check the
probes (abstention). Same prompt, context, and grader across every variant.

| variant | precision | recall | grounding | abstention | files named |
|---|---|---|---|---|---|
| base (no adapter) | 0.239 | 0.268 | 95% | 1/4 | 84 |
| Hella, SFT | 0.747 | 0.612 | 96% | 3/4 | 102 |
| **Hella, GRPO** | **0.850** | 0.572 | **98%** | 2/4 | 60 |
| Opus | 0.454 | 0.692 | 93% | 4/4 | 195 |

**The read.** Training took precision from 0.24 to 0.75 to 0.85, across the base model,
supervised fine-tuning, and a GRPO stage. The GRPO model lands at 0.85, close to twice
Opus, and it is surgical: 60 files named across 60 intents, about one each, where Opus
sprays 195. Grounding reaches 98%, so it almost never names a file that does not exist.
Opus wins recall by over-naming, which catches more real files but is wrong far more often.

**One regression to own.** The GRPO reward pushed too hard toward committing, so
abstention on the vague probes slipped from 3/4 to 2/4. That is a reward-balance fix for
the next round. The ground truth here is what a real change did, not a token-overlap proxy,
and the context fed in is exactly what retrieval surfaces (recall@10 = 92%), so the
benchmark measures comprehension, not memorization.

## The box

Hella is a code-synthesis tool for Minecraft plugin development (Bukkit/Spigot/Paper).
No general chat, no other languages, no other domains. It reliably one-shots small,
well-scoped features. Large multi-file features and heavy NMS or packet work still need the
decomposer plus multi-turn repair. And the thing it does not yet guarantee is runtime
behavior: code that compiles is not proof it behaves right in-game. That
behavioral-feedback loop is the current build.

So the box is narrow and real. A spec goes in, a built and compiling plugin comes out,
surgically and locally, inside Minecraft development.

## Where it's going

The edit model turns the stack into an agentic app that changes files in place instead of
rewriting them. The behavioral-feedback loop closes the gap between "compiles" and
"works." And a desktop app ships the whole thing locally via Ollama behind a Tauri shell.
