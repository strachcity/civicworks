#!/usr/bin/env python3
"""Turn real edits into observation candidates, and show what is ready to promote.

Capture is the part of the learning loop that fails, because it depends on
noticing an edit while busy making one. This does it mechanically.

    observe.py diff draft.md final.md          candidates from what changed
    observe.py diff draft.md final.md --append write them into observations.md
    observe.py status                          the promotion queue

`diff` also reports where the finished text trips check.py. Those are the most
useful findings in the file: evidence that a rule is wrong, not that the
writing is.
"""

import argparse
import datetime
import difflib
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)
OBSERVATIONS = os.path.join(SKILL, "observations.md")
VOICE_FILE = os.path.join(SKILL, "voice-dna.md")
VOICE_FILE_CEILING = 200
REVIEW_AT_OPEN_ENTRIES = 20
PROMOTION_THRESHOLD = 3


# --------------------------------------------------------------------------
# diff
# --------------------------------------------------------------------------

def sentences_in(path):
    lines = check.read_lines(path)
    checkable, _ = check.strip_structure(lines)
    paras = check.paragraphs_of(checkable)
    out = []
    for _, text in paras:
        if text.startswith(("- ", "* ", "> ", "|")) or re.match(r"^\d+\.\s", text):
            continue
        out.extend(check.sentences_of(text))
    return out


def normalise(sentence):
    return re.sub(r"\s+", " ", sentence.lower()).strip()


def letters_only(sentence):
    return re.sub(r"[^a-z0-9]", "", sentence.lower())


def sentence_count(text):
    return len(re.findall(r"[.!?](?:\s|$)", text))


def banned(word):
    """Is this word one the drafting constraints already name?"""
    w = word.strip(".,;:()\"'").lower()
    for listed in check.HARD_BAN:
        if re.fullmatch(check.word_pattern(listed), w, re.I):
            return "hard ban"
    for listed in check.CONTEXT_SENSITIVE:
        if re.fullmatch(check.word_pattern(listed), w, re.I):
            return "context-sensitive"
    return None


def key(word):
    """Match words ignoring the punctuation hanging off them."""
    return word.strip(".,;:()[]\"'").lower()


def word_opcodes(before, after):
    b, a = before.split(), after.split()
    ops = difflib.SequenceMatcher(None, [key(w) for w in b],
                                  [key(w) for w in a], autojunk=False)
    cut, added, swapped = [], [], []
    for tag, i1, i2, j1, j2 in ops.get_opcodes():
        if tag == "delete":
            cut.extend(b[i1:i2])
        elif tag == "insert":
            added.extend(a[j1:j2])
        elif tag == "replace":
            swapped.append((" ".join(b[i1:i2]), " ".join(a[j1:j2])))
    return cut, added, swapped


def classify(before, after):
    """Guess what kind of edit this was. A guess, which is why Seen exists."""
    if before and not after:
        return "structure", "Cut. Ask what the sentence was doing that made it removable."
    if after and not before:
        return "argument", "Added. Something the draft did not say."

    if letters_only(before) == letters_only(after):
        return "punctuation", "Punctuation or spacing only."

    b_sents, a_sents = sentence_count(before), sentence_count(after)
    if b_sents > a_sents:
        return "rhythm", f"{b_sents} sentences joined into {a_sents}."
    if a_sents > b_sents:
        return "rhythm", f"{b_sents} sentence split into {a_sents}."

    cut, added, swapped = word_opcodes(before, after)

    if len(swapped) == 1 and not cut and not added:
        was, now = swapped[0]
        if len(was.split()) == 1 and len(now.split()) == 1:
            flag = banned(was)
            note = f' The cut word is on the {flag} list.' if flag else ""
            return "vocabulary", f'Word swap: "{was}" became "{now}".{note}'

    if cut and not added and not swapped:
        phrase = " ".join(cut)
        flag = banned(phrase)
        note = f' On the {flag} list.' if flag else ""
        tag = "vocabulary" if flag else "register"
        return tag, f'Words cut, nothing added: "{phrase}".{note}'

    if added and not cut and not swapped:
        if len(added) >= 8:
            return "argument", (f"Extended by {len(added)} words, nothing removed. "
                                "The draft stopped short of something.")
        return "register", f'Words added: "{" ".join(added)}".'

    if len(after.split()) < len(before.split()) * 0.7:
        return "register", "Cut down. Look for what was padding."
    if len(after.split()) > len(before.split()) * 1.4:
        return "argument", "Expanded. The draft was probably too thin here."
    return "register", "Rewritten. Read both and say what actually changed."


def pair_up(before_block, after_block):
    """Match replaced sentences 1:1 where the counts allow it."""
    if len(before_block) == len(after_block):
        return list(zip(before_block, after_block))
    if len(before_block) == 1 and len(after_block) > 1:
        return [(before_block[0], " ".join(after_block))]
    if len(after_block) == 1 and len(before_block) > 1:
        return [(" ".join(before_block), after_block[0])]
    return [(" ".join(before_block), " ".join(after_block))]


def changes_between(draft_path, final_path):
    before = sentences_in(draft_path)
    after = sentences_in(final_path)
    matcher = difflib.SequenceMatcher(
        None, [normalise(s) for s in before], [normalise(s) for s in after],
        autojunk=False)
    changes = []
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            continue
        if tag == "replace":
            changes.extend(pair_up(before[i1:i2], after[j1:j2]))
        elif tag == "delete":
            changes.extend((s, "") for s in before[i1:i2])
        elif tag == "insert":
            changes.extend(("", s) for s in after[j1:j2])
    return changes


def counter_evidence(final_path):
    """Checker rules the finished text trips.

    The file describes the writing, so when they disagree the writing wins.
    A rule that fires on finished work is a candidate for retirement.
    """
    report, _ = check.check_file(final_path)
    by_rule = {}
    for f in report.findings:
        by_rule.setdefault(f["rule"], []).append(f)
    return by_rule


def render_entry(before, after, date):
    tag, reading = classify(before, after)
    lines = [f"### {date} | watching | {tag}",
             "**Context:** FILL IN: what was being written, which draft."]
    lines.append(f"**Before:** {before.strip() or '(nothing)'}")
    lines.append(f"**After:** {after.strip() or '(cut)'}")
    lines.append(f"**Reading:** {reading}")
    lines.append("**Seen:** 1")
    return "\n".join(lines)


def cmd_diff(args):
    changes = changes_between(args.draft, args.final)
    date = datetime.date.today().isoformat()
    entries = [render_entry(b, a, date) for b, a in changes]

    counters = counter_evidence(args.final)

    if args.append:
        if not entries:
            print("No changes to log.")
        else:
            with open(OBSERVATIONS, "a", encoding="utf-8") as fh:
                fh.write("\n\n" + "\n\n".join(entries) + "\n")
            print(f"Appended {len(entries)} candidates to observations.md.")
            print("Fill in the Context lines, merge anything that repeats an "
                  "existing entry (bump its Seen instead), and delete the noise.")
    else:
        print(f"\n{len(changes)} changes between {args.draft} and {args.final}\n")
        for entry in entries:
            print(entry)
            print()

    if counters:
        print("\n" + "=" * 68)
        print("The finished text trips these checker rules:")
        print("The writing wins over the file, so these are candidates for")
        print("loosening a rule, not for changing the writing.\n")
        for rule, hits in sorted(counters.items()):
            print(f"  {rule} ({len(hits)})")
            for f in hits[:3]:
                print(f"      line {f['line']}: {f['message']}")
    return 0


# --------------------------------------------------------------------------
# status
# --------------------------------------------------------------------------

ENTRY_RE = re.compile(r"^### (\d{4}-\d{2}-\d{2}) \| (\w+) \| ([\w-]+)\s*$")
SEEN_RE = re.compile(r"^\*\*Seen:\*\*\s*(\d+)", re.M)


def parse_observations(path):
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    # ignore the template block
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    entries, current = [], None
    for line in text.splitlines():
        m = ENTRY_RE.match(line)
        if m:
            current = {"date": m.group(1), "status": m.group(2),
                       "tag": m.group(3), "seen": 1, "before": ""}
            entries.append(current)
        elif current is not None:
            s = SEEN_RE.match(line)
            if s:
                current["seen"] = int(s.group(1))
            elif line.startswith("**Before:**"):
                current["before"] = line[len("**Before:**"):].strip()
    return entries


def cmd_status(args):
    entries = parse_observations(args.path)
    if not entries:
        print("\nobservations.md is empty. Nothing has been captured yet.")
        print("Run: observe.py diff <draft> <final> --append\n")
        return 0

    by_status = {}
    for e in entries:
        by_status.setdefault(e["status"], []).append(e)

    print(f"\n{len(entries)} observations")
    for status in ("active", "watching", "promoted", "retired"):
        if status in by_status:
            print(f"  {status}: {len(by_status[status])}")

    open_entries = by_status.get("active", []) + by_status.get("watching", [])
    ready = [e for e in open_entries if e["seen"] >= PROMOTION_THRESHOLD]

    print("\nReady to promote" if ready else "\nNothing ready to promote yet")
    for e in sorted(ready, key=lambda e: -e["seen"]):
        print(f"  seen {e['seen']}x | {e['tag']} | {e['date']} | {e['before'][:54]}")

    close = [e for e in open_entries if e["seen"] == PROMOTION_THRESHOLD - 1]
    if close:
        print(f"\nOne more sighting away ({PROMOTION_THRESHOLD - 1} of {PROMOTION_THRESHOLD})")
        for e in close:
            print(f"  {e['tag']} | {e['date']} | {e['before'][:54]}")

    by_tag = {}
    for e in open_entries:
        by_tag[e["tag"]] = by_tag.get(e["tag"], 0) + 1
    if by_tag:
        print("\nOpen entries by tag")
        for tag, n in sorted(by_tag.items(), key=lambda kv: -kv[1]):
            print(f"  {tag}: {n}")
        argument_side = sum(by_tag.get(t, 0) for t in ("argument", "structure"))
        if len(open_entries) >= 8 and argument_side == 0:
            print("\n  Nothing tagged argument or structure. The log is learning")
            print("  surface habits only, and section 1 outranks those.")

    if len(open_entries) >= REVIEW_AT_OPEN_ENTRIES:
        print(f"\n{len(open_entries)} open entries. Time for a review pass.")

    if os.path.exists(VOICE_FILE):
        with open(VOICE_FILE, encoding="utf-8") as fh:
            n = len(fh.read().splitlines())
        room = VOICE_FILE_CEILING - n
        note = "" if room > 0 else "  OVER. Something has to come out before anything goes in."
        print(f"\nvoice-dna.md is {n} lines, ceiling {VOICE_FILE_CEILING}.{note}")
    print()
    return 0


def main():
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="command", required=True)

    d = sub.add_parser("diff", help="observation candidates from a draft and its final version")
    d.add_argument("draft")
    d.add_argument("final")
    d.add_argument("--append", action="store_true",
                   help="write candidates into observations.md")
    d.set_defaults(func=cmd_diff)

    s = sub.add_parser("status", help="the promotion queue")
    s.add_argument("path", nargs="?", default=OBSERVATIONS)
    s.set_defaults(func=cmd_status)

    args = ap.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
