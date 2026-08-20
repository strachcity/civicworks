#!/usr/bin/env python3
"""Tests for observe.py. Run: python3 -m unittest discover -s scripts"""

import os
import tempfile
import unittest

import observe


def classify(before, after):
    return observe.classify(before, after)


def write(text):
    fd, path = tempfile.mkstemp(suffix=".md")
    with os.fdopen(fd, "w", encoding="utf-8") as fh:
        fh.write(text)
    return path


class TestClassify(unittest.TestCase):
    def test_pure_cut(self):
        tag, reading = classify(
            "The team had, in effect, three options open to them.",
            "The team had three options open to them.")
        self.assertEqual("register", tag)
        self.assertIn("in effect", reading)

    def test_cut_of_banned_word(self):
        tag, reading = classify(
            "They wanted to harness the data properly and at speed.",
            "They wanted to use the data properly and at speed.")
        self.assertEqual("vocabulary", tag)
        self.assertIn("hard ban", reading)

    def test_punctuation_only(self):
        tag, _ = classify("The grant is split in two: capital and revenue.",
                          "The grant is split in two, capital and revenue.")
        self.assertEqual("punctuation", tag)

    def test_sentences_joined(self):
        tag, reading = classify("Officers think in cycles. A service is a poor thing.",
                                "Officers think in cycles, and a service is a poor thing.")
        self.assertEqual("rhythm", tag)
        self.assertIn("joined", reading)

    def test_sentence_split(self):
        tag, reading = classify("Officers think in cycles, and a service is poor.",
                                "Officers think in cycles. A service is poor.")
        self.assertEqual("rhythm", tag)
        self.assertIn("split", reading)

    def test_large_addition_reads_as_argument(self):
        tag, _ = classify(
            "What produces it is the shape of the grant.",
            "What produces it is the shape of the grant: capital money for "
            "building, revenue money for running, and a rule that the first "
            "cannot become the second.")
        self.assertEqual("argument", tag)

    def test_deleted_sentence(self):
        tag, _ = classify("A sentence that did not survive the edit.", "")
        self.assertEqual("structure", tag)

    def test_inserted_sentence(self):
        tag, _ = classify("", "A sentence that was not in the draft at all.")
        self.assertEqual("argument", tag)


class TestDiff(unittest.TestCase):
    def test_unchanged_files_produce_nothing(self):
        text = "# A header\n\nOne sentence. And a second one here.\n"
        a, b = write(text), write(text)
        try:
            self.assertEqual([], observe.changes_between(a, b))
        finally:
            os.unlink(a), os.unlink(b)

    def test_change_is_detected(self):
        a = write("# H\n\nThe council spent 3 years on it. Then it stopped.\n")
        b = write("# H\n\nThe council spent 3 years on it. Then it quietly stopped.\n")
        try:
            changes = observe.changes_between(a, b)
            self.assertEqual(1, len(changes))
            self.assertIn("quietly", changes[0][1])
        finally:
            os.unlink(a), os.unlink(b)

    def test_counter_evidence_flags_finished_text(self):
        b = write("# H\n\nWhatever the landscape looks like, the work went on.\n")
        try:
            self.assertIn("context-sensitive", observe.counter_evidence(b))
        finally:
            os.unlink(b)


class TestStatusParsing(unittest.TestCase):
    def test_template_block_is_ignored(self):
        path = write(
            "# Observations\n\n```markdown\n### YYYY-MM-DD | watching | tag\n"
            "**Seen:** 1\n```\n\n### 2026-01-01 | active | vocabulary\n"
            "**Before:** something\n**Seen:** 4\n")
        try:
            entries = observe.parse_observations(path)
            self.assertEqual(1, len(entries))
            self.assertEqual(4, entries[0]["seen"])
            self.assertEqual("active", entries[0]["status"])
        finally:
            os.unlink(path)

    def test_missing_seen_defaults_to_one(self):
        path = write("### 2026-01-01 | watching | rhythm\n**Before:** x\n")
        try:
            self.assertEqual(1, observe.parse_observations(path)[0]["seen"])
        finally:
            os.unlink(path)

    def test_empty_file(self):
        self.assertEqual([], observe.parse_observations("/nonexistent/path.md"))


if __name__ == "__main__":
    unittest.main()
