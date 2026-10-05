---
title: Jarvis
tagline: A voice assistant on my PC that runs Claude Code with full control of the machine and works on long jobs in the background.
tier: secondary
order: 13
kind: agent · voice
status: Active
stack: [Python, Claude Code, faster-whisper, Kokoro TTS, openWakeWord, MCP]
summary: A wake-word voice assistant that hands each request to a persistent Claude Code session with shell, file, and screen control, runs long work as background jobs, and reports back by voice or to my phone.
featured: true
---

## What it is

Say "Jarvis" and talk. A wake-word model hears the name, Whisper transcribes the request
locally, a persistent Claude Code session does the work, and Kokoro speaks the answer
sentence by sentence as it is written. Keeping one Claude process alive is what makes it
conversational: replies start in a few seconds instead of paying a cold start every turn.

## What it can do

- **Full PC control.** Shell, files, the connectors I use, and a small MCP server I wrote
  for the screen: screenshot, click, type, keys, scroll, and window focus.
- **Background jobs.** Anything long goes to a separate worker session, so Jarvis stays
  free to talk. When a job finishes it tells me: out loud if I'm at the PC, as a push to my
  phone if I'm not.
- **Goal jobs.** For open-ended work, a goal job keeps a goal tree in the project and takes
  one step at a time in a fresh session, drilling into whatever fails instead of retrying,
  and stops to ask when only I can answer.
- **Standing permissions.** Sending, buying, deleting, and submitting need my yes, unless I
  have approved a checklist for that kind of action. Then it goes ahead only if it can
  verify every item, and it logs the evidence.
- **Memory.** Durable notes about how I work live in a notes vault it reads and updates.

## Where it stands

New. The voice pipeline and screen-control tests pass. The check that its own synthetic
mouse movement isn't mistaken for me being at the PC currently fails, so away detection
isn't trustworthy yet.
