# The learning loop

`voice-dna.md` describes where the voice has arrived. Writing keeps happening, so the file goes stale unless something updates it. This is that something.

The design has one asymmetry at its centre: **capture is cheap and promotion is expensive.** Observations accumulate freely. Rules do not. Without that gap the file would grow into a list of every passing preference, which is the failure mode section 5 of the voice file warns about.

## 1. Capture

Append to `observations.md` whenever any of these happen. Do it in the moment, not at the end of the session.

**A rewrite.** Jack changes a sentence you drafted. Log the before and the after, verbatim. The diff is the evidence; your reading of it is a guess.

**A rejection.** He turns down a suggestion, a structure, an opening, an ending. Log what was offered and what he said.

**A correction.** He supplies a word, a spelling, a piece of punctuation, a formatting choice. Small ones matter most, because they repeat.

**A stated rule.** "I never do X." "Always Y." These go straight in, marked as stated rather than inferred, and they are promotable on their own.

**A finished piece.** He shares something published or final. Read it against `voice-dna.md` and log every place they disagree. The writing wins. If three published pieces open with a scene and the file says openings vary, the file is describing an older average.

**A near miss.** A draft he accepted but visibly reworked, or accepted with a shrug. Worth logging, weakly.

### Entry format

```markdown
### 2026-08-20 | active | punctuation
**Context:** CIVICWORKS essay on procurement, second draft.
**Before:** `The team had, in effect, three options.`
**After:** `The team had three options.`
**Reading:** Hedging insertions get cut. Possibly a wider pattern about "in effect", "to some extent", "arguably".
**Seen:** 1
```

Fields:

- **Date** and **status**: `active`, `watching`, `promoted`, or `retired`.
  - `active` applies immediately to new drafts and overrides `voice-dna.md` on conflict.
  - `watching` is a hypothesis waiting for more instances. Do not act on it.
  - `promoted` has moved into the voice file.
  - `retired` did not hold up. Keep it. Knowing which patterns were wrong is worth as much as knowing which were right.
- **Tag**: one of `argument`, `structure`, `rhythm`, `register`, `vocabulary`, `punctuation`, `formatting`, `format-specific`, `openings`, `endings`.
- **Seen**: how many separate occasions, not how many instances in one piece. Three edits to the same paragraph is one occasion.

Start new observations at `watching` unless Jack stated the rule outright, in which case go straight to `active`.

## 2. Promote

Promotion moves an observation into `voice-dna.md`. It happens on one of three triggers:

1. **Recurrence.** `Seen: 3` or more, across separate sessions.
2. **Statement.** Jack states the rule directly.
3. **Review.** He asks for one, or a natural checkpoint arrives (a finished piece, a run of sessions, the log passing roughly 20 open entries).

Never on your own initiative mid-draft.

The promotion proposal has four parts, and all four are required:

1. The observation, with its evidence. Actual before-and-after pairs, dated.
2. The exact diff to `voice-dna.md`: which section, which line, the current wording, the proposed wording.
3. What it costs. A rule added is a rule to be read every time. If the section is now longer without being sharper, name the cut that pays for it.
4. The honest case against. Is 3 occasions enough? Was it one piece with a particular subject? Would this rule have made a piece he liked worse?

Then wait. No edit to `voice-dna.md` without a yes.

After approval:

- Edit `voice-dna.md`, keeping the register of the existing file. It is written in his voice, about his voice, and a promoted rule that reads like a linter message will stand out badly.
- Add a `CHANGELOG.md` entry: date, section, what changed, evidence, observation IDs.
- Mark the observations `promoted` and note the changelog date.

## 3. Prune

Run this whenever the file grows, and at any review.

**Retire what stopped being true.** A rule contradicted by two recent finished pieces goes. Section 5: when recent finished work conflicts with the file, the writing wins.

**Merge overlaps.** Two rules describing one habit become one rule.

**Cut what never fires.** A rule that has not changed a draft in months was probably a one-off dressed as a pattern.

**Watch the ratio.** Section 3 is a list of hard constraints and can absorb specifics. Sections 1 and 5 are judgment, and they degrade when they get longer. If a proposed addition to section 1 is really an example rather than a principle, it belongs in `observations.md`.

Target: `voice-dna.md` stays close to its current length. Under 200 lines. If it wants to grow past that, something in it has stopped earning its place.

## 4. What this cannot do

Worth being straight about, since the point of the first version is to find out whether the approach works at all.

The loop only sees what happens inside a session. Edits made in Substack, in Google Docs, in a text editor at 11pm, are invisible unless the finished piece comes back here. So the highest-value habit by far is pasting the published version in afterwards and asking for a read against the file. That single action carries more signal than a week of in-session edits.

Inference from a diff is a guess. A cut word might be a rule or might be that sentence. The `watching` status and the recurrence threshold exist because of this. Three occasions is a low bar for a pattern, and it is still better than one.

And the log measures what gets edited, which is not the same as what matters. Punctuation and vocabulary generate visible diffs. Whether the argument found the mechanism underneath the observation generates a conversation, or a piece quietly abandoned. Section 1 outranks the rest of the file, and it is the part this loop is worst at learning. Log the conversations too, in whatever form they arrive.
