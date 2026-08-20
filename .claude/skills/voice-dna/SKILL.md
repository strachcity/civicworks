---
name: voice-dna
description: Draft, redraft and critique writing in Jack's voice, and keep the voice file current as the writing evolves. Use for CIVICWORKS essays and practice notes, GDS or GOV.UK blogs, institutional papers, newsletter copy, LinkedIn posts, professional emails and internal notes. Also use when asked to edit, tighten, restructure or line-edit an existing draft, when asked whether something "sounds like me", or when a finished piece or an edit should teach the voice file something new.
---

# Voice DNA

Two jobs, and they run together.

1. **Write and edit** against `voice-dna.md`, the source of truth for the voice.
2. **Learn.** Every real edit is evidence about how the voice actually behaves. Capture it in `observations.md`, and promote what recurs into `voice-dna.md`.

## Files

| File | What it is | Who writes to it |
|---|---|---|
| `voice-dna.md` | Source of truth. Voice rules, AI drafting constraints, formats. | Only via the promotion process, with approval |
| `observations.md` | Dated log of evidence from real sessions. Candidates, not rules. | Append freely during a session |
| `CHANGELOG.md` | Every change made to `voice-dna.md`, with the evidence behind it | On promotion |
| `samples/` | Finished, published pieces. The ground truth the file describes | Jack, or on request |
| `scripts/check.py` | Mechanical checker for the hard rules in section 3 | Never edited during drafting |
| `references/learning.md` | How capture and promotion work in detail | Rarely |
| `references/critique.md` | The read-through pass, in order | Rarely |

## Before writing anything

Read `voice-dna.md` in full. Not a summary of it, not a memory of it from earlier in the session. It is short, and the judgment lives in the wording.

Then read `observations.md` and apply anything marked **active**. Active observations override `voice-dna.md` where they conflict: they are more recent evidence.

Then establish the format, because structure does not travel between formats. If the request does not make it obvious, ask. CIVICWORKS essay, practice note, GDS blog, institutional paper, or short professional format are different shapes of the same voice.

## Drafting

Section 1 of the voice file outranks everything else. A draft that satisfies every surface rule and has no mechanism underneath it has failed, and no amount of line-editing rescues it. So before drafting, work out what the piece actually argues: what structure, incentive, classification, funding logic or operating condition produces the thing everyone can already see. If that answer is thin, say so rather than writing around it.

Then draft. While drafting:

- Make positive claims. The reframe construction ("it isn't X, it's Y") drafts at zero. If a passage genuinely wants one, flag it as a suggestion under the draft instead of writing it in.
- No em dashes. Commas, periods, colons, semicolons, parentheses.
- Ground it in the work, the organisation, the decision, the failure, the constraint, the thing somebody actually did. If there is no real material, ask for some rather than inventing a hypothetical.
- Credit by name, with links, wherever a framing came from someone.
- Uncertainty is content. "I think", "I'm unsure", "we are too early to know" are legitimate sentences.

Then run the checker before showing anything:

```bash
python3 .claude/skills/voice-dna/scripts/check.py draft.md
```

It catches the mechanical rules: em dashes, banned vocabulary, dead phrases, reframe constructions, copula dodges, tic clusters, title case headers, Americanisms. Fix what it finds, then read the draft yourself for the things it cannot see: whether paragraphs build cumulatively, whether transitions feel causal, whether the ending leaves the harder problem open or ties a bow.

The checker is a floor, not a standard. A clean run means nothing about whether the piece is any good.

## Redrafting Jack's own text

Different rules apply. His published writing uses spaced dashes and earned negative parallelism, and those are his to place.

- Leave existing em dashes and spaced dashes alone.
- Leave existing reframe constructions alone.
- Do not smooth out repetition that is doing work, and do not swap a term for a synonym. Use the name again.
- Change what was asked for. Show anything else as a suggestion, with the reason.

When the ask is open ("tighten this", "does this work"), work through `references/critique.md` rather than jumping to line edits.

## Learning

This is the part that matters over time. Full detail in `references/learning.md`; the short version:

**Capture.** Whenever Jack rewrites a draft, rejects a suggestion, corrects a word, or says some version of "that's not how I'd put it", that is evidence. Append it to `observations.md` the moment it happens, with the date, the before and after, and what it suggests. Cheap and generous: an observation is a candidate, not a claim.

Do the same in reverse when he shares a finished piece. Read it against `voice-dna.md` and log where the writing and the file disagree. The writing wins, always; that is section 5.

**Promote.** Do not edit `voice-dna.md` in passing. Promote when an observation has recurred at least 3 times, or when Jack states a rule directly, or when he asks for a review of the log. Promotion means: propose the exact diff, name the evidence behind it, and wait for a yes. Then update `CHANGELOG.md` and mark the observations as promoted.

**Prune.** The voice file works because it is short and because every rule earns its place. If a promotion makes a section longer without making it sharper, propose the cut that pays for it. Growing the file to 400 lines of accumulated mannerisms would destroy exactly the thing it protects, which is the warning section 5 already makes.

Never promote silently. Never promote a single instance as though it were a pattern. Never let the log turn into a style guide by accretion.

## Two failure modes to watch for

**Assembly.** The voice file is a set of generative principles, and it can be read as a kit of parts instead. A draft that reuses an opening shape, an ending shape and three of the tic words from section 3F will pass the checker and sound nothing like him. Section 5 is the test: does this sound like something he would actually write, or like an imitation working very hard.

**Overfitting the log.** `observations.md` grows every session and `voice-dna.md` should not. Most observations stay observations. That asymmetry is the design.
