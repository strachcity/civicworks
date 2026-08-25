# CIVICWORKS

Writing guidance behind [CIVICWORKS](https://civicworks.substack.com/).

Public because there is no reason for it to be private, but written for an audience of one.

## Voice DNA

**[voice-dna.md](.claude/skills/voice-dna/voice-dna.md)** is the source of truth for how the writing behaves: the argument principles that outrank everything else, the prose rules, the drafting constraints that exist because models overproduce certain constructions, and how the same voice changes shape between a CIVICWORKS essay, a GDS blog and an email.

It is wrapped in a [Claude skill](.claude/skills/voice-dna/) that drafts, redrafts and critiques against it. The file is maintained by hand. Every few pieces, read it against what actually got published and change what has stopped being true, which is what section 5 asks for anyway: when recent finished work conflicts with the file, the writing wins.

**[Download the skill (zip)](https://raw.githubusercontent.com/strachcity/civicworks/main/dist/voice-dna-skill.zip)** to use it somewhere other than this repo, e.g. uploading to Claude.ai Skills as a zip folder. 


## Wiki

The idea came from [Karpathy's LLM wiki concept](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) – an LLM that incrementally builds and maintains a persistent wiki — a structured, interlinked collection of markdown files that sits between me and the raw sources. 

**[wiki/mechanisms.md](wiki/mechanisms.md)** holds the claims that recur across the writing: six mechanisms, the positions that have moved, the framings already spent, and an honest list of what the corpus does not have. Mined from 14 CIVICWORKS pieces, the MPA thesis and the UN80 article rather than from a structure guessed in advance.

**[wiki/reception.md](wiki/reception.md)** is the Substack data, kept separate and read with suspicion. It says which arguments travelled, not which are right. It covers 13 pieces; the most recent post is too new to have data.

**[wiki/prompts/](wiki/prompts/)** holds articles the corpus is asking for. Each states what it would argue, the evidence in hand, what is missing, and what would make the piece fail.

The loop is: publish, add it to `archive/`, re-mine, and see what it changes. A piece either instantiates a mechanism that already exists, contradicts one, or leaves an argument with nowhere to go. The third case is a prompt. `archive/README.md` has the detail.

Notes here are deliberately blunt and provisional. Prose written to essay standard turns a note into a draft, and the wiki into a backlog of unfinished essays.

## What stays out

**Notion stays in Notion.** It holds every paper read and annotated, MPA essays, a reading list. That is the raw source layer, and the wiki is a distillate that sits between the writing and it. Migrating it would import hundreds of sources to serve the eighteen that are actually load-bearing, and would turn a working file into an archive.

The rule is pull, not push. A source earns a place here when a piece of writing needs it, not when it is found. If a wiki entry wants the deeper notes, it links out.

**The archive.** [`archive/`](archive/) holds the published writing as files: 14 CIVICWORKS posts, the MPA thesis and the UN80 article. All already public, all re-minable without hunting down the originals.

## Open threads

**Deferred on purpose.** The voice file is not being reviewed yet; the writing is still evolving and a review now would fix a moving target. The findings are logged below for when it happens.

**Four places the voice file and the writing disagree**, found by running the checker over finished pieces with `--published`:
- Single-sentence paragraphs. The file says "never stacked to manufacture punch". They are stacked, repeatedly, and it works.
- Sentence length. The real baseline is 20 to 31 words with high variance. The file reads as though describing something more mixed.
- "Not just X, but Y" runs to 11 in a single essay. The checker no longer treats it as a 3B violation, since it expands rather than negates, but at that rate it is a tic.
- Hard bans and dead phrases fire inside citations and on deliberate uses. Piece 14 trips "democratising" in the title of a cited paper and "nobody" twice where it is the point of the sentence. The rules have no notion of a quoted title, and the fix is probably scope rather than vocabulary.

**Splitting the wiki.** `mechanisms.md` is around 350 lines and has seven mechanisms. Not yet worth splitting: one file per mechanism buys an index to maintain and cross-links to keep correct, and nothing is currently hard to find. The trigger is a mechanism growing past roughly 60 lines on its own, or an entry needing its own sub-pages. Length alone is not the signal.
