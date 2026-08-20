#!/usr/bin/env python3
"""Mechanical checker for the hard rules in section 3 of voice-dna.md.

Catches what a regex can catch: em dashes, banned vocabulary, dead phrases,
reframe constructions, copula dodges, tic clusters, title case headers,
Americanisms. It cannot see whether the argument found a mechanism, whether
paragraphs build, or whether the ending earns itself. A clean run is a floor,
not a standard.

    python3 check.py draft.md
    python3 check.py draft.md --json
    python3 check.py draft.md --strict     # warnings fail too
    cat draft.md | python3 check.py -
"""

import argparse
import json
import re
import statistics
import sys

ERROR, WARN, NOTE = "error", "warn", "note"
ORDER = {ERROR: 0, WARN: 1, NOTE: 2}


# --------------------------------------------------------------------------
# word lists, taken from voice-dna.md section 3
# --------------------------------------------------------------------------

HARD_BAN = [
    "delve", "realm", "harness", "unlock", "tapestry", "cutting-edge",
    "revolutionize", "revolutionise", "showcase", "pivotal", "surpass",
    "meticulously", "vibrant", "unparalleled", "synergy", "synergize",
    "synergise", "game-changer", "game-changing", "testament", "commendable",
    "boast", "groundbreaking", "garner", "accentuate", "pioneering",
    "trailblazing", "unleash", "frictionless", "elevate", "effortless",
    "insightful", "mission-critical", "visionary", "disruptive",
    "unprecedented", "leading-edge", "democratize", "democratise",
    "state-of-the-art", "immersive", "proprietary", "plug-and-play",
    "turnkey", "paradigm-shifting", "supercharge", "captivate",
]

CONTEXT_SENSITIVE = [
    "paradigm", "landscape", "intricate", "crucial", "leverage", "innovative",
    "align", "foster", "enhance", "emphasize", "emphasise", "holistic",
    "versatile", "transformative", "redefine", "seamless", "optimize",
    "optimise", "scalable", "robust", "breakthrough", "empower", "streamline",
    "adaptive", "accelerate", "intuitive", "meticulous", "data-driven",
    "proactive", "dynamic", "predictive", "transparent", "integrated",
    "future-proof", "enduring", "interplay", "valuable",
]

# "highlight" only counts as the verb; "highlights" as a noun is fine.
HIGHLIGHT_VERB = r"\b(highlight|highlights|highlighted|highlighting)\b"

TICS = [
    "genuinely", "fundamentally", "precisely", "deliberately", "brilliant",
    "brilliantly", "meaningful", "meaningfully", "crucially", "importantly",
]

AMERICANISMS = {
    r"\borganiz(e|es|ed|ing|ation|ations|ational)\b": "organis-",
    r"\banalyz(e|es|ed|ing)\b": "analys-",
    r"\bcolors?\b": "colour",
    r"\bbehaviors?\b": "behaviour",
    r"\bfavor(s|ed|ing|able)?\b": "favour",
    r"\bhonor(s|ed|ing)?\b": "honour",
    r"\blabor\b": "labour",
    r"\bcenters?\b": "centre",
    r"\bdefense\b": "defence",
    r"\boffense\b": "offence",
    r"\btravel(ed|ing|er|ers)\b": "travell-",
    r"\bmodeling\b": "modelling",
    r"\blabeling\b": "labelling",
    r"\bcancel(ed|ing)\b": "cancell-",
    r"\bfulfill(s|ed|ing|ment)?\b": "fulfil / fulfilment",
    r"\benrollment\b": "enrolment",
    r"\bgray\b": "grey",
    r"\btoward\b(?!s)": "towards",
    r"\bprioritiz(e|es|ed|ing|ation)\b": "prioritis-",
    r"\bspecializ(e|es|ed|ing|ation)\b": "specialis-",
    r"\brecognizes?\b": "recognise",
}

DEAD_PHRASES = {
    r"in today'?s\b": "dead opener",
    r"it'?s important to (note|remember|understand)": "dead phrase",
    r"it'?s worth (noting|mentioning|remembering)": "dead phrase",
    r"\bin order to\b": "just 'to'",
    r"\bstraightforward\b": "banned",
    r"let'?s (dive|explore|unpack|dig|take a look|consider)": "dead phrase",
    r"at the end of the day": "dead phrase",
    r"\bmoving forward\b": "dead phrase",
    r"to put (this|that|it) in perspective": "dead phrase",
    r"what makes (this|it) (particularly )?interesting": "dead phrase",
    r"the implications here are": "dead phrase",
    r"\bin other words\b": "dead phrase",
    r"it goes without saying": "dead phrase",
    r"\bnobody\b": "banned word",
    r"most people don'?t (realize|realise|know|understand)": "banned",
    r"\bin this (article|essay|piece|post|blog|paper)\b": "meta commentary",
    r"\b(furthermore|additionally|moreover)\b": "mechanical connector",
    r"\bthat said\b": "mechanical connector",
    r"with that in mind": "mechanical connector",
    r"it is also worth mentioning": "mechanical connector",
    r"on top of that": "mechanical connector",
    r"let that sink in": "engagement bait",
    r"read that again": "engagement bait",
    r"\bfull stop\.": "engagement bait",
    r"this changes everything": "engagement bait",
    r"\b10x\b": "hype",
    r"i hope this helps": "chat leakage",
    r"great question": "chat leakage",
    r"would you like me to": "chat leakage",
    r"(as of|up to) my (last )?(knowledge|training) (cutoff|update)":
        "knowledge-cutoff disclaimer",
}

COPULA_DODGES = r"\b(serves as|serving as|stands as|marks a|represents a|represents the|features a|offers a)\b"

# Two different moves, and section 3B is only about the first.
#
# A reframe negates a position and substitutes another: "it isn't X, it's Y".
# That is the construction models overproduce, because it makes a shallow
# claim sound profound, and it drafts at zero.
#
# The additive construction expands a definition instead: "not simply a team,
# but a structured environment". Nothing is being displaced. It is all over
# the published writing, doing real definitional work, and flagging it as a
# 3B violation buries the reframes that matter.
REFRAME = [
    r"\bis ?n'?t\b[^.?!]{0,80}?\bit'?s\b",
    r"\bis not\b[^.?!]{0,80}?\bit is\b",
    r"\bthe (question|problem|issue|point|answer) is ?n'?t\b",
    r"\bthe (question|problem|issue|point|answer) is not\b",
    r"(?:^|\. )not \w[^.?!]{0,50}, but\b",
    r"\bless about\b[^.?!]{0,60}\bmore about\b",
    r"\bwas ?n'?t\b[^.?!]{0,80}?\bit was\b",
]

ADDITIVE = [
    r"\bnot (just|only|merely|simply)\b[^.?!]{0,70}?\bbut\b",
]

# Above this many in one piece it has stopped being a choice.
ADDITIVE_BUDGET = 4

PARTICIPLE_ANALYSIS = (
    r",\s+(highlighting|reflecting|underscoring|underlining|demonstrating|"
    r"signalling|signaling|illustrating|emphasising|emphasizing|showcasing|"
    r"revealing|indicating|suggesting that|pointing to|marking) \b"
)

SIGNIFICANCE_INFLATION = [
    r"\b(pivotal|defining|watershed|seminal) moment\b",
    r"\bin the evolution of\b",
    r"\bsetting the stage\b",
    r"\bushering in\b",
    r"\bmarks? a turning point\b",
    r"\ba new (era|chapter) (in|of|for)\b",
]

SPELLED_NUMBERS = (
    r"\b(three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|"
    r"twenty|thirty|forty|fifty|hundred|thousand)\s+"
    r"(years?|months?|weeks?|days?|hours?|minutes?|people|users?|councils?|"
    r"teams?|departments?|organisations?|projects?|services?|per cent|percent|"
    r"times|examples?|reasons?|things?)\b"
)

# Section 3C keeps these words when they are doing technical work. The phrases
# below are the ones a regex can recognise; the rest is judgment.
ALLOWED_PHRASES = [
    r"\bdynamic capabilit(?:y|ies)\b",
    r"\bintegrated (?:service|care|settlement)s?\b",
    r"\bdata-driven (?:decision|policy)\w*\b",
]


def in_allowed_phrase(text, match):
    for pat in ALLOWED_PHRASES:
        for m in re.finditer(pat, text, re.I):
            if match.start() < m.end() and m.start() < match.end():
                return True
    return False


HEADER_STOPWORDS = {
    "a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "is",
    "of", "on", "or", "the", "to", "with", "we", "it", "its", "that", "this",
}


# --------------------------------------------------------------------------
# parsing
# --------------------------------------------------------------------------

def word_pattern(word):
    """Match a word plus its ordinary inflections."""
    if "-" in word:
        return r"\b" + re.escape(word) + r"\b"
    if word.endswith("e"):
        return r"\b" + re.escape(word[:-1]) + r"(?:e|es|ed|ing|ement|ements)\b"
    if word.endswith("y"):
        return r"\b" + re.escape(word[:-1]) + r"(?:y|ies|ied|ying)\b"
    return r"\b" + re.escape(word) + r"(?:s|es|ed|ing|ly|ness|ment|ments)?\b"


SMART_QUOTES = {"\u2019": "'", "\u2018": "'", "\u201c": '"', "\u201d": '"',
                "\u02bc": "'"}


def normalise_quotes(line):
    """Straighten typographic quotes.

    Substack and every word processor emit curly apostrophes, so without this
    every rule that matches an apostrophe (the reframe constructions, half the
    dead phrases, the contraction count) silently sees nothing on real prose.
    """
    for smart, plain in SMART_QUOTES.items():
        line = line.replace(smart, plain)
    return line


def mask(line):
    """Blank out code spans, URLs and link targets, preserving line length."""
    def blank(m):
        return " " * len(m.group(0))
    line = re.sub(r"`[^`]*`", blank, line)
    line = re.sub(r"\]\([^)]*\)", blank, line)
    line = re.sub(r"https?://\S+", blank, line)
    return line


def read_lines(path):
    if path == "-":
        return sys.stdin.read().splitlines()
    with open(path, encoding="utf-8") as fh:
        return fh.read().splitlines()


def strip_structure(lines):
    """Return (checkable_lines, headers, paragraphs).

    checkable_lines is a list of (line_no, masked_text) with fenced code and
    YAML frontmatter removed.
    """
    checkable, headers = [], []
    in_fence = False
    in_front = False
    for i, raw in enumerate(lines, start=1):
        if i == 1 and raw.strip() == "---":
            in_front = True
            continue
        if in_front:
            if raw.strip() == "---":
                in_front = False
            continue
        if raw.lstrip().startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        raw = normalise_quotes(raw)
        if re.match(r"^#{1,6}\s", raw):
            headers.append((i, raw))
            continue
        checkable.append((i, mask(raw)))
    return checkable, headers


def paragraphs_of(checkable):
    """Group checkable lines into paragraphs of (start_line, text)."""
    paras, buf, start = [], [], None
    for line_no, text in checkable:
        if text.strip():
            if start is None:
                start = line_no
            buf.append(text.strip())
        elif buf:
            paras.append((start, " ".join(buf)))
            buf, start = [], None
    if buf:
        paras.append((start, " ".join(buf)))
    return paras


def is_prose(text):
    """Paragraph shape and rhythm stats only make sense over actual prose.

    Lists, quotes, tables and the wholly-italic lines that carry subtitles and
    image captions are not paragraphs, and counting them as single-sentence
    ones invents a rhythm problem that is not in the writing.
    """
    if text.startswith(("- ", "* ", "> ", "|")) or re.match(r"^\d+\.\s", text):
        return False
    if re.fullmatch(r"\*[^*]+\*", text) or re.fullmatch(r"_[^_]+_", text):
        return False
    return True


def sentences_of(text):
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z\"'(])", text.strip())
    return [p for p in parts if p.strip()]


# --------------------------------------------------------------------------
# checks
# --------------------------------------------------------------------------

class Report:
    """Collects findings, suppressing ones that pile onto the same words.

    A single phrase often trips several patterns ("meticulously" is both a
    hard ban and a context-sensitive word). Reporting it three times buries
    the other findings, so the first and most severe hit on a span wins.
    """

    def __init__(self):
        self.findings = []
        self.spans = []

    def add(self, severity, line, rule, message, excerpt="", span=None,
            scope="line"):
        if span is not None:
            for s_scope, s_line, s_sev, s_lo, s_hi in self.spans:
                if s_scope != scope or s_line != line:
                    continue
                if span[0] < s_hi and s_lo < span[1] and ORDER[s_sev] <= ORDER[severity]:
                    return
            self.spans.append((scope, line, severity, span[0], span[1]))
        self.findings.append({
            "severity": severity, "line": line, "rule": rule,
            "message": message, "excerpt": excerpt.strip(),
        })

    def counts(self):
        out = {ERROR: 0, WARN: 0, NOTE: 0}
        for f in self.findings:
            out[f["severity"]] += 1
        return out


def excerpt_at(text, match, width=34):
    lo = max(0, match.start() - width)
    hi = min(len(text), match.end() + width)
    return ("..." if lo else "") + text[lo:hi].strip() + ("..." if hi < len(text) else "")


def scan(checkable, patterns, report, severity, rule, message_for, flags=re.I):
    for line_no, text in checkable:
        for pat in patterns:
            for m in re.finditer(pat, text, flags):
                report.add(severity, line_no, rule, message_for(m, pat),
                           excerpt_at(text, m))


def check_dashes(checkable, report):
    for line_no, text in checkable:
        for m in re.finditer(r"—", text):
            report.add(ERROR, line_no, "em-dash",
                       "em dash: draft with commas, colons, semicolons or parentheses",
                       excerpt_at(text, m), m.span())
        for m in re.finditer(r"\s–\s", text):
            report.add(ERROR, line_no, "em-dash",
                       "spaced en dash: Jack adds these in editing, drafts do not",
                       excerpt_at(text, m), m.span())


def check_vocabulary(checkable, report):
    for line_no, text in checkable:
        for word in HARD_BAN:
            for m in re.finditer(word_pattern(word), text, re.I):
                report.add(ERROR, line_no, "hard-ban",
                           f'"{m.group(0)}" is on the hard ban list',
                           excerpt_at(text, m), m.span())
        for word in CONTEXT_SENSITIVE:
            for m in re.finditer(word_pattern(word), text, re.I):
                if word == "crucial" and m.group(0).lower().startswith("crucially"):
                    continue
                if in_allowed_phrase(text, m):
                    continue
                report.add(WARN, line_no, "context-sensitive",
                           f'"{m.group(0)}": would a plainer word say exactly the same thing?',
                           excerpt_at(text, m), m.span())
        for m in re.finditer(HIGHLIGHT_VERB, text, re.I):
            report.add(WARN, line_no, "context-sensitive",
                       f'"{m.group(0)}" as a verb: try "shows", "points to", or say the claim',
                       excerpt_at(text, m), m.span())


def check_phrases(checkable, report):
    for line_no, text in checkable:
        for pat, label in DEAD_PHRASES.items():
            for m in re.finditer(pat, text, re.I):
                report.add(ERROR, line_no, "dead-phrase",
                           f'"{m.group(0)}" ({label})', excerpt_at(text, m), m.span())
        for m in re.finditer(COPULA_DODGES, text, re.I):
            report.add(ERROR, line_no, "copula-dodge",
                       f'"{m.group(0)}" dodges "is" or "has". Just say "is".',
                       excerpt_at(text, m), m.span())
        for pat in SIGNIFICANCE_INFLATION:
            for m in re.finditer(pat, text, re.I):
                report.add(WARN, line_no, "significance-inflation",
                           f'"{m.group(0)}": state the fact, let the reader judge significance',
                           excerpt_at(text, m), m.span())
        for m in re.finditer(PARTICIPLE_ANALYSIS, text, re.I):
            report.add(WARN, line_no, "participle-analysis",
                       f'"{m.group(1)}": if the analysis matters, give it its own sentence',
                       excerpt_at(text, m), m.span(1))
        for pat, fix in AMERICANISMS.items():
            for m in re.finditer(pat, text, re.I):
                report.add(WARN, line_no, "british-english",
                           f'"{m.group(0)}" reads American, expected "{fix}"',
                           excerpt_at(text, m), m.span())
        for m in re.finditer(SPELLED_NUMBERS, text, re.I):
            report.add(NOTE, line_no, "digits",
                       f'"{m.group(0)}": numbers as digits',
                       excerpt_at(text, m), m.span())
        for m in re.finditer(r"\bfrom ([^,.;:]{2,28}?) to ([^,.;:]{2,28}?)\b", text, re.I):
            if not re.search(r"\d", m.group(0)):
                report.add(NOTE, line_no, "false-range",
                           '"from X to Y": is there a real middle ground? If not, be specific about one thing',
                           excerpt_at(text, m), m.span())


def check_negative_parallelism(paras, report):
    for start, text in paras:
        for pat in REFRAME:
            for m in re.finditer(pat, text, re.I):
                report.add(WARN, start, "reframe",
                           "reframe construction: drafting default is zero. "
                           "If it is earned, flag it as a suggestion instead",
                           excerpt_at(text, m), m.span(), scope="para")

    additive = []
    for start, text in paras:
        for pat in ADDITIVE:
            for m in re.finditer(pat, text, re.I):
                additive.append((start, excerpt_at(text, m)))
    if len(additive) > ADDITIVE_BUDGET:
        start, excerpt = additive[0]
        report.add(NOTE, start, "additive-parallelism",
                   f'"not just X, but Y" {len(additive)} times. It expands rather '
                   "than negates, so 3B does not ban it, but at this rate it is "
                   "a tic rather than a choice", excerpt)


def check_headers(headers, report):
    for line_no, raw in headers:
        text = re.sub(r"^#{1,6}\s+", "", raw).strip()
        text = re.sub(r"[*_`]", "", text)
        words = text.split()
        if len(words) < 3:
            continue
        candidates = [w for w in words[1:] if w.lower() not in HEADER_STOPWORDS
                      and len(w) > 2 and w.isascii() and w.isalpha()]
        if not candidates:
            continue
        capped = [w for w in candidates if w[0].isupper() and not w.isupper()]
        if len(capped) >= 2 and len(capped) / len(candidates) >= 0.5:
            report.add(WARN, line_no, "header-case",
                       "looks like title case, headers are sentence case "
                       "(ignore if these are proper nouns)", text)


def check_tics(checkable, headers, report):
    """One tic per section is voice. Clusters are parody."""
    boundaries = sorted([h[0] for h in headers])

    def section_of(line_no):
        idx = 0
        for i, b in enumerate(boundaries, start=1):
            if line_no > b:
                idx = i
        return idx

    per_section = {}
    for line_no, text in checkable:
        for tic in TICS:
            for m in re.finditer(r"\b" + tic + r"\b", text, re.I):
                per_section.setdefault(section_of(line_no), []).append(
                    (line_no, m.group(0), excerpt_at(text, m)))
    for _, hits in sorted(per_section.items()):
        if len(hits) > 1:
            words = ", ".join(f'"{w}"' for _, w, _ in hits)
            report.add(WARN, hits[0][0], "tic-cluster",
                       f"{len(hits)} register tics in one section ({words}). "
                       "One per section is voice",
                       hits[0][2])


def check_paragraph_shape(paras, report):
    run, run_start, run_text = 0, None, ""
    for start, text in paras:
        if not is_prose(text):
            run, run_start, run_text = 0, None, ""
            continue
        if len(sentences_of(text)) == 1:
            run += 1
            if run_start is None:
                run_start, run_text = start, text
            if run == 2:
                report.add(WARN, run_start, "stacked-singles",
                           "single-sentence paragraphs back to back. They are selective: "
                           "a genuine pivot or landing, never stacked for punch",
                           run_text[:70])
        else:
            run, run_start, run_text = 0, None, ""


def stats_of(paras):
    prose = [t for _, t in paras if is_prose(t)]
    sents = [s for t in prose for s in sentences_of(t)]
    lengths = [len(s.split()) for s in sents]
    words = sum(lengths)
    per_para = [len(sentences_of(t)) for t in prose]
    body = " ".join(prose)
    return {
        "words": words,
        "paragraphs": len(prose),
        "sentences": len(sents),
        "mean_sentence_words": round(statistics.mean(lengths), 1) if lengths else 0,
        "sentence_length_stdev": round(statistics.pstdev(lengths), 1) if len(lengths) > 1 else 0,
        "mean_sentences_per_paragraph": round(statistics.mean(per_para), 1) if per_para else 0,
        "single_sentence_paragraphs": sum(1 for n in per_para if n == 1),
        "contractions": len(re.findall(r"\b\w+'(s|t|re|ve|ll|d|m)\b", body)),
    }


# --------------------------------------------------------------------------
# output
# --------------------------------------------------------------------------

COLOURS = {ERROR: "\033[31m", WARN: "\033[33m", NOTE: "\033[36m"}
RESET = "\033[0m"


def render(path, report, stats, colour, published=False):
    out = [f"\n{path}"]
    if not report.findings:
        out.append("  nothing mechanical to fix.")
    findings = sorted(report.findings, key=lambda f: (ORDER[f["severity"]], f["line"]))
    for f in findings:
        tag = f["severity"].upper().ljust(5)
        if colour:
            tag = COLOURS[f["severity"]] + tag + RESET
        out.append(f"  {tag} {str(f['line']).rjust(4)}  {f['rule']}")
        out.append(f"        {f['message']}")
        if f["excerpt"]:
            out.append(f"        > {f['excerpt']}")
    c = report.counts()

    def plural(n, word):
        return f"{n} {word}" if n == 1 else f"{n} {word}s"

    out.append("")
    out.append("  " + ", ".join([plural(c[ERROR], "error"),
                                 plural(c[WARN], "warning"),
                                 plural(c[NOTE], "note")]))
    out.append(
        f"  {stats['words']} words, {stats['paragraphs']} paragraphs, "
        f"{stats['mean_sentences_per_paragraph']} sentences per paragraph "
        f"({stats['single_sentence_paragraphs']} single-sentence)")
    out.append(
        f"  sentences average {stats['mean_sentence_words']} words, "
        f"stdev {stats['sentence_length_stdev']} "
        f"(low stdev means metronome rhythm), {stats['contractions']} contractions")
    out.append("")
    if published:
        out.append("")
        out.append("  Draft-only rules muted. A rule firing here is firing on")
        out.append("  finished writing, which is evidence about the rule.")
    out.append("")
    out.append("  The checker cannot see whether the argument found a mechanism,")
    out.append("  whether the paragraphs build, or whether the ending earns itself.")
    return "\n".join(out)


# Section 3A scopes the dash rule to drafts ("my published punctuation uses
# spaced dashes; I'll add them where they belong"), and 3B scopes the reframe
# rule the same way ("when editing my text, leave mine alone"). Running them
# over a finished piece produces dozens of findings that are the rules working
# as designed, and buries everything else.
DRAFT_ONLY = {"em-dash", "reframe"}


def check_file(path, published=False):
    lines = read_lines(path)
    checkable, headers = strip_structure(lines)
    paras = paragraphs_of(checkable)
    report = Report()
    check_dashes(checkable, report)
    check_vocabulary(checkable, report)
    check_phrases(checkable, report)
    check_negative_parallelism(paras, report)
    check_headers(headers, report)
    check_tics(checkable, headers, report)
    check_paragraph_shape(paras, report)
    if published:
        report.findings = [f for f in report.findings if f["rule"] not in DRAFT_ONLY]
    return report, stats_of(paras)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="+", help="markdown files, or - for stdin")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--strict", action="store_true", help="warnings fail too")
    ap.add_argument("--published", action="store_true",
                    help="reviewing finished work: mute the draft-only rules "
                         "(em dashes, reframes) so the rest is readable")
    ap.add_argument("--no-colour", action="store_true")
    args = ap.parse_args()

    colour = sys.stdout.isatty() and not args.no_colour
    results, failed = {}, False

    for path in args.paths:
        report, stats = check_file(path, published=args.published)
        results[path] = {"findings": report.findings, "stats": stats,
                         "counts": report.counts()}
        if not args.json:
            print(render(path, report, stats, colour, args.published))
        counts = report.counts()
        if counts[ERROR] or (args.strict and counts[WARN]):
            failed = True

    if args.json:
        print(json.dumps(results, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
