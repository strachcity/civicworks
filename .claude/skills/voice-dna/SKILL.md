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
| `scripts/observe.py` | Turns real edits into observation candidates, and shows the promotion queue | Never edited during drafting |
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

Write the draft to a file rather than only into the conversation, and keep it
after he edits it. A kept draft is what makes the diff in **Trigger 1**
possible, and a draft that only ever existed as chat output teaches this file
nothing.

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

The mechanism only works if capture actually happens, and capture is the part
that fails: noticing an edit is hardest while busy making one. So it does not
run on vigilance. It runs on four triggers, and each has a mechanical step.

### Trigger 1: Jack pastes back a finished or reworked piece

The highest-signal moment there is. Most of his editing happens in Substack or
a text editor, invisible to this session, and a finished piece carries all of
it at once.

Run the diff:

```bash
python3 .claude/skills/voice-dna/scripts/observe.py diff draft.md final.md --append
```

It writes candidate entries into `observations.md`: before, after, and a guess
at what kind of edit it was. Then do the part the script cannot. Fill in the
Context lines. Merge anything that repeats an existing entry, bumping its
**Seen** rather than adding a duplicate, because the count is what drives
promotion and duplicates would inflate it. Delete the noise: not every diff is
evidence about voice, some are just this piece.

The script also reports where the finished text trips `check.py`. Those are the
most valuable findings in the file. A rule firing on writing Jack published is
evidence the rule is wrong, so raise it as a candidate for loosening.

If there is no draft file to compare against, read the piece against
`voice-dna.md` by hand and log the disagreements.

### Trigger 2: a correction inside a session

He rewrites a sentence, rejects a suggestion, supplies a word, or says some
version of "that's not how I'd put it". Log it immediately, before continuing.
Not at the end, because by then the exact before-and-after has gone.

A stated rule ("I never do X") goes in as **active** and is promotable on its
own. Everything else goes in as **watching**.

### Trigger 3: end of any drafting session

Before the work is finished, ask one question: what changed between what I
wrote and what he kept? If anything did, and it is not already logged, log it
now. If nothing did, say nothing; an empty session is a real result and does
not need an entry invented for it.

### Trigger 4: a review pass

He asks for one, or `observe.py status` says the queue is ready:

```bash
python3 .claude/skills/voice-dna/scripts/observe.py status
```

It shows what has hit 3 sightings, what is one away, the spread of tags, and
whether `voice-dna.md` is near its 200-line ceiling. Take the ready list and
propose promotions. Watch the tag spread too: a log that is all `vocabulary`
and `punctuation` is learning surface habits, and section 1 outranks those.

### Promotion

Never in passing, never mid-draft, never silently. Promote when an observation
has recurred at least 3 times across separate sessions, when Jack states a rule
directly, or at a review pass.

A promotion proposal is the exact diff to `voice-dna.md`, the dated evidence
behind it, what it costs in length, and the honest case against. Then wait for
a yes. After approval: edit the file, add a `CHANGELOG.md` entry, mark the
observations `promoted`.

The voice file works because it is short and because every rule earns its
place. If a promotion makes a section longer without making it sharper, propose
the cut that pays for it. Growing it into 400 lines of accumulated mannerisms
would destroy the thing it protects, which is the warning section 5 already
makes.

## Two failure modes to watch for

**Assembly.** The voice file is a set of generative principles, and it can be read as a kit of parts instead. A draft that reuses an opening shape, an ending shape and three of the tic words from section 3F will pass the checker and sound nothing like him. Section 5 is the test: does this sound like something he would actually write, or like an imitation working very hard.

**Overfitting the log.** `observations.md` grows every session and `voice-dna.md` should not. Most observations stay observations. That asymmetry is the design.

**Logging nothing.** The quieter failure, and the more likely one. A session where a draft was rewritten and no observation was written is a session that taught this file nothing. If in doubt, log it: a weak candidate sits at `watching` and costs a few lines, while a missed edit is gone.
