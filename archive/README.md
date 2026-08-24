# Archive

Published writing, kept as files so the wiki can be re-mined without hunting the originals down.

All of it is already public. Nothing unpublished goes here.

## What is here

`01` to `13` are CIVICWORKS posts in publication order, exported from Substack as markdown. Piece `03` is a guest post by Jack O'Connor and is excluded from anything about voice, since the voice file describes one writer and not the publication.

`x1` and `x2` are published elsewhere. Both are machine-extracted working copies with the canonical source in their frontmatter; the extraction lost layout and figures, so quote from the source, not from these.

## Notes are not archived

Substack notes stay on Substack. They are too short to mine, there are too many of them, and numbering them alongside the articles would break publication order, which the mechanism tables depend on.

When a note supplies something the wiki actually needs — a second sighting, a formulation sharper than the published one, an argument with nowhere else to go — cite it where it is used, with its date and link, and say it is a note. The wiki should never leave the impression that an argument was published at length when it was a paragraph.

## Adding a piece

Export it, name it by publication order, and give it frontmatter matching the others: title, subtitle, author, date, publication, source. Then re-run the mining pass, which means reading it against `wiki/mechanisms.md` and asking three questions.

**Does it instantiate a mechanism that already exists?** Add the row. A sixth sighting of M1 matters less than the first, but the count is the argument.

**Does it contradict something?** That is the valuable case. `wiki/mechanisms.md` holds positions that have moved, and a contradiction belongs there rather than being smoothed over.

**Does it leave something with nowhere to go?** An argument that ran out of room, a question arrived at again, a claim with more evidence than the piece used. That is a prompt, and it goes in `wiki/prompts/`.

Then run the checker over it with `--published`. Rules that fire on finished writing are evidence about the rules.

## Divergence

These are snapshots. Edit a piece on Substack and the copy here goes stale. Nothing detects that, so re-export rather than patching by hand.
