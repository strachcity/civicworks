---
name: voice-dna
description: Draft, redraft and critique writing in Jack's voice. Use for CIVICWORKS essays and practice notes, GDS or GOV.UK blogs, institutional papers, newsletter copy, LinkedIn posts, professional emails and internal notes. Also use when asked to edit, tighten, restructure or line-edit an existing draft, when asked whether something "sounds like me", or when reviewing the voice file itself against recent finished writing.
---

# Voice DNA

`voice-dna.md` is the source of truth for how the writing behaves. This skill
writes and edits against it.

| File | What it is |
|---|---|
| `voice-dna.md` | The voice. Argument principles, prose rules, AI drafting constraints, formats |
| `references/critique.md` | The read-through pass, in order |
| `scripts/check.py` | Mechanical checker for the hard rules in section 3 |

## Before writing anything

Read `voice-dna.md` in full. Not a summary of it, not a memory of it from
earlier in the session. It is short, and the judgment lives in the wording.

Then establish the format, because structure does not travel between formats.
If the request does not make it obvious, ask. CIVICWORKS essay, practice note,
GDS blog, institutional paper, or short professional format are different
shapes of the same voice.

## Drafting

Section 1 of the voice file outranks everything else. A draft that satisfies
every surface rule and has no mechanism underneath it has failed, and no amount
of line-editing rescues it. So before drafting, work out what the piece
actually argues: what structure, incentive, classification, funding logic or
operating condition produces the thing everyone can already see. If that answer
is thin, say so rather than writing around it.

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

It catches the mechanical rules: em dashes, banned vocabulary, dead phrases,
reframe constructions, copula dodges, tic clusters, title case headers,
Americanisms. Fix what it finds, then read the draft yourself for the things it
cannot see: whether paragraphs build cumulatively, whether transitions feel
causal, whether the ending leaves the harder problem open or ties a bow.

The checker is a floor, not a standard. A clean run means nothing about whether
the piece is any good.

## Redrafting Jack's own text

Different rules apply. His published writing uses spaced dashes and earned
negative parallelism, and those are his to place.

- Leave existing em dashes and spaced dashes alone.
- Leave existing reframe constructions alone.
- Do not smooth out repetition that is doing work, and do not swap a term for a synonym. Use the name again.
- Change what was asked for. Show anything else as a suggestion, with the reason.

When the ask is open ("tighten this", "does this work"), work through
`references/critique.md` rather than jumping to line edits.

## What this skill does not cover

Working notes in `wiki/` are deliberately not in this voice. They are blunt,
claim-first and provisional, and that is what keeps them usable. Prose written
to CIVICWORKS standard turns a note into a draft, and the wiki into a backlog
of unfinished essays. Do not apply the voice file to them, and do not treat
`check.py` findings there as faults.

## Reviewing the voice file

Jack maintains `voice-dna.md` himself. Never edit it as a side effect of a
drafting session, and never treat a single correction as a new rule.

When he asks for a review, the job is to surface disagreements between the file
and the writing, not to resolve them:

- Read recent finished pieces against the file and report where they diverge. Section 5 is explicit that when recent finished work conflicts with the file, the writing wins, so a divergence is usually evidence about the file.
- Run `check.py` over finished pieces. A rule that fires on something he published is a rule worth loosening, and this is the most useful thing the checker does.
- Point at rules that never seem to fire, and at anything that has grown longer without getting sharper.

Report what you found and stop. He makes the edits.

## Two failure modes to watch for

**Assembly.** The voice file is a set of generative principles, and it can be
read as a kit of parts instead. A draft that reuses an opening shape, an ending
shape and three of the tic words from section 3F will pass the checker and
sound nothing like him. Section 5 is the test: does this sound like something
he would actually write, or like an imitation working very hard.

**Deference.** Closeness to the file is not the goal, good writing is. If a rule
would make a passage worse, say so and write the better version, flagging the
conflict. The file says this itself: spirit over letter, always.
