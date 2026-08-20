# CIVICWORKS

Writing guidance behind [CIVICWORKS](https://civicworks.substack.com/).

Public because there is no reason for it to be private, but written for an audience of one.

## Voice DNA

**[voice-dna.md](.claude/skills/voice-dna/voice-dna.md)** is the source of truth for how the writing behaves: the argument principles that outrank everything else, the prose rules, the drafting constraints that exist because models overproduce certain constructions, and how the same voice changes shape between a CIVICWORKS essay, a GDS blog and an email.

It is wrapped in a [Claude skill](.claude/skills/voice-dna/) that drafts, redrafts and critiques against it. The file is maintained by hand. Every few pieces, read it against what actually got published and change what has stopped being true, which is what section 5 asks for anyway: when recent finished work conflicts with the file, the writing wins.

### Using it

The skill loads automatically when Claude Code runs inside this repo. To have it available everywhere:

```bash
ln -s ~/civicworks/.claude/skills/voice-dna ~/.claude/skills/voice-dna
```

The symlink keeps one source of truth, so an edit made anywhere lands back here and gets committed.

The mechanical rules also run standalone:

```bash
python3 .claude/skills/voice-dna/scripts/check.py draft.md
```

Em dashes, banned vocabulary, dead phrases, reframe constructions, tic clusters, Americanisms, title case headers. It catches what a regex can catch, which is the least interesting half of the file. No dependencies, Python 3.8 or later.

Worth pointing it at finished pieces as well as drafts. A rule that fires on something already published is a rule that needs loosening, and that is the most useful thing it does.

## Wiki

**[wiki/mechanisms.md](wiki/mechanisms.md)** holds the claims that recur across the writing: six mechanisms, the positions that have moved, the framings already spent, and an honest list of what the corpus does not have. Mined from 13 CIVICWORKS pieces, the MPA thesis and the UN80 article rather than from a structure guessed in advance.

**[wiki/reception.md](wiki/reception.md)** is the Substack data, kept separate and read with suspicion. It says which arguments travelled, not which are right.

Notes here are deliberately blunt and provisional. Prose written to essay standard turns a note into a draft, and the wiki into a backlog of unfinished essays.

## Open threads

Decisions parked rather than made.

**Publishing the archive.** The 13 essays sit in `archive/`, gitignored. The wiki cites them by number and would read better citing them by file. Committing them puts already-public writing into a public repo, which is a choice, not a default.

**Which capability schema.** The thesis uses four dimensions and nine routines; *Beyond the waterfall state* uses three capabilities. Everything downstream of that essay inherits the thinner one. Unreconciled.

**Three places the voice file and the writing disagree**, found by running the checker over finished pieces:
- Single-sentence paragraphs. The file says "never stacked to manufacture punch". They are stacked, repeatedly, and it works.
- Sentence length. The real baseline is 20 to 31 words with high variance. The file reads as though describing something more mixed.
- "Not just X, but Y" appears 4 to 11 times per recent essay. Section 3B targets the reframe ("it isn't X, it's Y"), which is a different construction: one negates, the other expands. The checker currently collapses them.

**Two checker improvements identified and not built.** Separating the additive construction from the reframe, and a `--published` mode that mutes the draft-only rules so finished work can be reviewed without 70 em dash findings.

**Splitting the wiki.** `mechanisms.md` is past 280 lines. One more ingest and it wants one file per mechanism plus an index.
