---
title: Jarvis
tagline: A voice assistant on my PC that runs Claude Code with full control of the machine and works on long jobs in the background.
tier: secondary
order: 13
kind: agent · voice
status: Active
stack: [Python, Claude Code, faster-whisper, Silero VAD, Chatterbox TTS, MCP]
summary: A voice assistant that answers to its name anywhere in a sentence, hands real work to a persistent Claude Code session with shell, file, and screen control, runs long work as background jobs whose ticked goals hermes re-checks, and reports back by voice or to my phone.
featured: true
---

## What it is

Say "Jarvis" anywhere in a sentence and talk. A voice-activity model picks out speech,
Whisper transcribes it locally on the GPU and checks for the name, and a cloned JARVIS
voice (Chatterbox, on the GPU, with Kokoro as a fallback) speaks the answer sentence by
sentence as it is written. You can talk over it to cut it off.

It runs as two Claude sessions that sound like one. A small front session with a short
context and a single tool hears every utterance and answers conversation itself; anything
that needs doing it hands to the worker, a persistent Claude Code session with every tool.
Keeping both processes alive is what makes it conversational: no cold start every turn.

After it speaks, it keeps listening for a short while without needing its name, so a
filter decides whether what it hears is meant for it or is me talking to someone else. A
labelled set of 149 utterances checks that filter, and it passes.

## What it can do

- **Full PC control.** Shell, files, the connectors I use, and a small MCP server I wrote
  for the screen: screenshot, click, type, keys, scroll, and window focus.
- **Background jobs.** Anything long goes to a separate worker session, so Jarvis stays
  free to talk. When a job finishes it tells me: out loud if I'm at the PC, as a push to my
  phone if I'm not.
- **Goal jobs.** For open-ended work, a goal job keeps a goal tree in the project and takes
  one step at a time in a fresh session, drilling into whatever fails instead of retrying,
  and stops to ask when only I can answer. Before a ticked item counts,
  [hermes](/projects/hermes) re-checks it against the real project, and un-ticks it if a
  test it ran says it isn't done.
- **Standing permissions.** Sending, buying, deleting, and submitting need my yes, unless I
  have approved a checklist for that kind of action. Then it goes ahead only if it can
  verify every item, and it logs the evidence.
- **Memory.** Durable notes about how I work live in a notes vault it reads and updates.

## Where it stands

In daily use. The conversation, screen-control, and addressee-filter tests pass. The
check that its own synthetic mouse movement isn't mistaken for me being at the PC still
fails, so away detection isn't trustworthy yet.
