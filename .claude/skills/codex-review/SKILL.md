---
name: codex-review
description: Send Meta ads output (hooks, primary text, headlines, scripts, creative briefs) to OpenAI Codex for an independent review, then apply the feedback that holds up. Use when the user says "codex review", "send to codex", "get a second opinion on these ads", or runs /codex-review.
---

# Codex review loop for Meta ads

This runs on the user's own computer, where the Codex CLI is installed and signed in (`codex login`).

## 1. Save the draft

Write the ad output to `ads/drafts/<slug>.md`. Use a short kebab-case slug, e.g. `black-friday-pt-offer`. Include:
- Offer, audience and the campaign objective, if known
- Every variant, numbered: primary text, headline, description, CTA button, and the creative or script notes

If the user names an existing file, review that file instead.

## 2. Ask Codex

Run Codex non-interactively in a read-only sandbox, from the repository root. Codex reads the files itself, so nothing needs to be pasted or quoted:

```bash
codex exec --sandbox read-only "Follow the instructions in .claude/skills/codex-review/reviewer-prompt.md and review ads/drafts/<slug>.md." > ads/reviews/<slug>-codex.md
```

- This can take a minute or two. Give the command a timeout of at least 5 minutes.
- If the output file is empty or holds only progress logs, run the command again without the `>` redirect and save Codex's final answer to that file yourself.
- If `codex` is not found, or it reports that the user is not logged in, stop and tell the user to run `codex login` in PowerShell.

## 3. Apply the feedback, critically

Codex is a second opinion, not an authority. For each suggestion:
- **Apply** it when it fixes a real weakness: a buried hook, a vague offer, a policy risk, a weak CTA.
- **Reject** it when it contradicts the user's brand voice, an explicit instruction from the user, or the offer facts, or when it would make the copy generic.

Write the revised ads to `ads/drafts/<slug>-v2.md`. A second round is fine; stop after two.

## 4. Report to the user

Give the user:
1. The revised ads.
2. A short table: Codex suggestion | Applied? | Why.
3. Any policy flags Codex raised, even the rejected ones.
