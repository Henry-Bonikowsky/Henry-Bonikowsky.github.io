---
title: Hella
tagline: A stack of narrow models for Minecraft plugin development, where a spec goes in and a compiling plugin comes out.
tier: core
order: 1
kind: model stack · LLM training
status: Active
stack: [Python, PyTorch, unsloth, SFT + GRPO, LoRA, vLLM, Ollama]
metrics:
  - { value: "0.75", label: "plan precision (Opus 0.45)" }
  - { value: "6/6", label: "small features compiled" }
  - { value: "5", label: "specialist models" }
summary: A code-synthesis stack for Minecraft plugin development. Five narrow models (retrieval, a 14B orchestrator, a GRPO-trained coder, a decomposer, an edit model) and a composer that chains them, so a plain-English spec goes in and a built, compiling Bukkit plugin comes out.
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
commit really touched (precision, recall, F1), check the names are real (grounding), check
the probes (abstention). Same prompt, context, and grader across all three arms.

| metric | Hella | Opus | base |
|---|---|---|---|
| **precision** | **0.747** | 0.454 | 0.239 |
| recall | 0.612 | 0.692 | 0.268 |
| **F1** | **0.638** | 0.511 | 0.214 |
| **grounding** | **0.961** | 0.933 | 0.952 |
| abstention | 3/4 | 4/4 | 1/4 |
| acted | 60/60 | 58/60 | 59/60 |

**The read.** Hella wins precision (0.75 vs 0.45) and F1 by being surgical. Opus wins
recall because it over-names, listing about twice as many files, so it catches more but is
wrong more often. On precision, the metric that punishes confident-wrong, a small
specialist beats the frontier model. With n=60, treat ±0.02 as noise.

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
