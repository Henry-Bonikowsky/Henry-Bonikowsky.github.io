---
title: Hytale Security Disclosure
tagline: Four vulnerabilities in a production game client, responsibly disclosed.
tier: secondary
order: 6
kind: security research
status: Disclosed
stack: [reverse engineering, CVSS, responsible disclosure]
metrics:
  - { value: "9.4", label: "max CVSS" }
  - { value: "4", label: "findings" }
repo: https://github.com/Henry-Bonikowsky/hytale-security-disclosure
summary: Authorized security research on a production game client, written up as a formal disclosure of four CVSS-scored vulnerabilities including a critical hardcoded-credentials finding, with researcher contact, dates, and severity ratings.
featured: true
---

## What it is

A formal vulnerability disclosure for a production game client, from authorized research.
Four findings, each scored on CVSS and documented to the line:

- A **critical (9.4)** hardcoded credentials exposure.
- A **high** static API token leak, and a **high** anti-tamper / injection gap.
- A **medium** plaintext-token-in-memory issue.

## Why it's here

Anyone can find a bug. The thing I wanted to demonstrate is the *handling*: research done
with authorization, severity assessed honestly with a standard rubric rather than
hyped, and the whole thing written up as a disclosure, contact, dates, scope, rather
than dropped as an exploit.

For work at the intersection of capable systems and the people responsible for them, how
you behave when you find a hole matters at least as much as finding it. This is the side
of me that reads the security implications first.
