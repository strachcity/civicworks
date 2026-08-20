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

## Later

A wiki, maybe, in the [style of Karpathy's](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): practice notes, reading, the accumulated arguments about civic technology currently scattered across drafts. Unresolved, and worth exploring before committing to a shape.
