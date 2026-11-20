---
name: codex-review
description: Send Meta ads output (hooks, primary text, headlines, scripts, creative briefs) to OpenAI Codex for an independent review, then apply the feedback that holds up. Use when the user says "codex review", "send to codex", "get a second opinion on these ads", or runs /codex-review.
---

# Codex review loop for Meta ads

This runs on the user's own computer, where Codex is installed and signed in.

## 1. Save the draft

Write the ad output to `ads/drafts/<slug>.md`. Use a short kebab-case slug, e.g. `black-friday-pt-offer`. Include:
- Offer, audience and the campaign objective, if known
- Every variant, numbered: primary text, headline, description, CTA button, and the creative or script notes

If the user names an existing file, review that file instead.

## 2. Ask Codex

Send Codex this prompt, with the draft pasted in full where the placeholder is:

> You are a senior Meta ads reviewer. Review the ads below. Do not rewrite them in full.
> For each variant, score 1-10 on each of: hook (first 125 characters), clarity of the offer, CTA, fit with the audience, and Meta ad-policy risk (personal attributes such as "Are you overweight?", before/after claims, health or income promises, sensational language).
> Then list your top 5 specific changes, most important first. Quote the exact line each change applies to and say why.
> End with one line, "Ship / Revise / Rework", for each variant.
>
> --- ADS ---
> {draft}

How to send it:
- **Preferred:** call the Codex MCP tool (usually `mcp__codex__codex`, from `.mcp.json`) with that prompt and `sandbox: "read-only"`.
- **Fallback**, if the MCP tool is unavailable:
  `codex exec --sandbox read-only "$(cat <prompt-file>)"`
  Write the prompt to a temporary file first.

Save Codex's full reply to `ads/reviews/<slug>-codex.md`.

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
