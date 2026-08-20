# CIVICWORKS

Writing guidance and working notes behind [CIVICWORKS](https://civicworks.substack.com/).

Public because there is no reason for it to be private, but written for an audience of one.

## What is here

**[Voice DNA](.claude/skills/voice-dna/voice-dna.md)** is the source of truth for how the writing behaves: the argument principles that outrank everything else, the prose rules, the drafting constraints that exist because models overproduce certain constructions, and how the same voice changes shape between a CIVICWORKS essay, a GDS blog and an email.

It is wrapped in a [Claude skill](.claude/skills/voice-dna/) that drafts and redrafts against it, and, more to the point, tries to keep it current. Every edit made to a draft is evidence about how the voice actually works. Those go into an [observations log](.claude/skills/voice-dna/observations.md), and what recurs gets promoted into the voice file itself, with the change recorded in the [changelog](.claude/skills/voice-dna/CHANGELOG.md). Whether that loop actually learns anything useful is the open question; this is the first version of finding out.

## Using it

The skill loads automatically when Claude Code runs inside this repo. To have it available everywhere:

```bash
ln -s ~/civicworks/.claude/skills/voice-dna ~/.claude/skills/voice-dna
```

The symlink keeps one source of truth, so anything the skill learns lands back here and gets committed.

The mechanical rules also run standalone:

```bash
python3 .claude/skills/voice-dna/scripts/check.py draft.md
```

Em dashes, banned vocabulary, dead phrases, reframe constructions, tic clusters, Americanisms, title case headers. It catches what a regex can catch, which is the least interesting half of the file. No dependencies, Python 3.8 or later.

## Later

Practice notes, reading, the accumulated arguments about civic technology that are currently scattered across drafts. Wiki-shaped, eventually.
