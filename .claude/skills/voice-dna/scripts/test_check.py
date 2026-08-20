#!/usr/bin/env python3
"""Tests for check.py. Run: python3 -m unittest discover -s scripts"""

import unittest
import check


def run(text):
    import tempfile, os
    fd, path = tempfile.mkstemp(suffix=".md")
    with os.fdopen(fd, "w", encoding="utf-8") as fh:
        fh.write(text)
    try:
        report, stats = check.check_file(path)
    finally:
        os.unlink(path)
    return report.findings, stats


def rules(text):
    return sorted({f["rule"] for f in run(text)[0]})


class TestHardRules(unittest.TestCase):
    def test_em_dash(self):
        self.assertIn("em-dash", rules("The team knew — and said so."))

    def test_spaced_en_dash(self):
        self.assertIn("em-dash", rules("The team knew – and said so."))

    def test_number_range_en_dash_allowed(self):
        self.assertNotIn("em-dash", rules("The 2019–2021 programme."))

    def test_hard_ban_inflections(self):
        for word in ["delving", "unlocked", "showcasing", "elevating", "captivates"]:
            self.assertIn("hard-ban", rules(f"They spent months {word} the work."), word)

    def test_dead_phrase(self):
        self.assertIn("dead-phrase", rules("Furthermore, the team disagreed."))

    def test_copula_dodge(self):
        self.assertIn("copula-dodge", rules("The paper serves as a warning."))

    def test_reframe(self):
        self.assertIn("negative-parallelism",
                      rules("It isn't a technology problem, it's a funding problem."))
        self.assertIn("negative-parallelism",
                      rules("The question isn't whether to build it."))


class TestSoftRules(unittest.TestCase):
    def test_context_sensitive(self):
        self.assertIn("context-sensitive", rules("A robust approach to delivery."))

    def test_british_english(self):
        self.assertIn("british-english", rules("The team organized the work."))

    def test_towards(self):
        self.assertIn("british-english", rules("Progress toward the goal."))
        self.assertNotIn("british-english", rules("Progress towards the goal."))

    def test_tic_cluster(self):
        one = rules("This was genuinely difficult work for the team involved.")
        self.assertNotIn("tic-cluster", one)
        many = rules("Crucially this was genuinely and fundamentally brilliant work.")
        self.assertIn("tic-cluster", many)

    def test_header_case(self):
        self.assertIn("header-case", rules("# Unlocking The Future Of Data\n\nText here.\n"))
        self.assertNotIn("header-case", rules("# What the funding cycle does\n\nText here.\n"))

    def test_stacked_singles(self):
        text = "One sentence here.\n\nAnother sentence here.\n\nA third one here.\n"
        self.assertIn("stacked-singles", rules(text))

    def test_participle_analysis(self):
        self.assertIn("participle-analysis",
                      rules("The budget fell, reflecting broader pressures on councils."))


class TestParsing(unittest.TestCase):
    def test_code_fences_skipped(self):
        text = "Real text here.\n\n```\ndelve into the realm\n```\n"
        self.assertNotIn("hard-ban", rules(text))

    def test_inline_code_skipped(self):
        self.assertNotIn("hard-ban", rules("The flag is `--unlock` in the CLI."))

    def test_urls_skipped(self):
        self.assertNotIn("hard-ban", rules("See [the post](https://x.com/showcase-2024)."))

    def test_frontmatter_skipped(self):
        self.assertNotIn("hard-ban", rules("---\ntitle: Delve\n---\n\nReal text.\n"))

    def test_duplicate_spans_suppressed(self):
        # "meticulously" is both a hard ban and inflects a context-sensitive word.
        found = [f for f in run("They meticulously rebuilt it.")[0]]
        self.assertEqual(1, len(found))
        self.assertEqual("hard-ban", found[0]["rule"])

    def test_stats(self):
        _, stats = run("One sentence. Two sentences here.\n\nA second paragraph now.\n")
        self.assertEqual(2, stats["paragraphs"])
        self.assertEqual(3, stats["sentences"])


class TestNonProse(unittest.TestCase):
    def test_italic_caption_is_not_a_paragraph(self):
        text = ("A real paragraph with two sentences. Here is the second one.\n\n"
                "*Waterfall policymaking, The Radical How.*\n\n"
                "*Source: 2023 OECD Digital Government Index.*\n\n"
                "Another real paragraph. With a second sentence again.\n")
        self.assertNotIn("stacked-singles", rules(text))

    def test_captions_excluded_from_stats(self):
        _, stats = run("Real prose here. A second sentence.\n\n*A caption.*\n")
        self.assertEqual(1, stats["paragraphs"])

    def test_genuine_stacking_still_caught(self):
        text = ("One sentence standing alone.\n\nAnother sentence standing alone.\n\n"
                "A third one alone as well.\n")
        self.assertIn("stacked-singles", rules(text))


class TestRealProse(unittest.TestCase):
    """Typographic quotes are what actual exports contain."""

    def test_curly_apostrophe_reframe_is_caught(self):
        self.assertIn("negative-parallelism",
                      rules("It isn\u2019t a technology problem, it\u2019s a funding problem."))

    def test_curly_apostrophe_dead_phrase_is_caught(self):
        self.assertIn("dead-phrase", rules("It\u2019s worth noting that the team disagreed."))

    def test_curly_apostrophes_count_as_contractions(self):
        _, stats = run("I\u2019m sure it\u2019s fine and they aren\u2019t wrong about it.\n")
        self.assertEqual(3, stats["contractions"])

    def test_dynamic_capabilities_is_allowed(self):
        # Section 3C names this as the word doing technical work.
        self.assertNotIn("context-sensitive", rules("A theory of dynamic capabilities in the state."))
        self.assertIn("context-sensitive", rules("It was a dynamic and exciting programme."))

    def test_integrated_service_is_allowed(self):
        self.assertNotIn("context-sensitive", rules("They built an integrated service for it."))


class TestCleanProse(unittest.TestCase):
    def test_clean_passage_is_quiet(self):
        text = (
            "# What the funding cycle does to service teams\n\n"
            "Camden's residents team rebuilt its housing repairs journey twice in 4 "
            "years, because the money arrived in 18-month tranches and each tranche "
            "had to buy something visibly new. The second rebuild was competent work "
            "by people who knew the first one had been fine.\n\n"
            "The usual explanation is short-termism, and it is partly right. What "
            "produces it is the shape of the grant: capital money for building, "
            "revenue money for running, and a rule that the first cannot become the "
            "second.\n"
        )
        self.assertEqual([], rules(text))


if __name__ == "__main__":
    unittest.main()
