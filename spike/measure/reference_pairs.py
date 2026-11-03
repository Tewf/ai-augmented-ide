"""The topic check's own parent rule, applied to a repository: prints the "parent>child" pairs, sorted.

usage: reference_pairs.py ROOT STANDARD_CHECKS TOPIC_CHECKS PATTERN...
ROOT is the repository, STANDARD_CHECKS the standard's checks folder (for its framework), TOPIC_CHECKS the folder
checks/local of the topic extension. The topic set is built as topic.check builds it, then topic.containing is asked.
"""
import importlib.util
import sys
from pathlib import Path

root, standard, topic_dir, *patterns = sys.argv[1:]
sys.path.insert(0, standard)
from framework.check_api import MARKDOWN_SUFFIXES, files_in_scope, matches_any  # noqa: E402

spec = importlib.util.spec_from_file_location("topic", Path(topic_dir) / "topic.py")
topic = importlib.util.module_from_spec(spec)
spec.loader.exec_module(topic)

markdown = files_in_scope(Path(root), {}, MARKDOWN_SUFFIXES)
topics = {p for p in markdown if p.endswith(".md") and matches_any(p, patterns)}
for path in sorted(topics):
    parent = topic.containing(path, topics)
    if parent is not None:
        print(f"{parent}>{path}")
