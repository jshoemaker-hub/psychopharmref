#!/usr/bin/env python3
"""
check-blog-sync.py — Detect drift between legacy blog/*.html and
hugo-site/content/blog/*.html.

Why this exists
---------------
psychopharmref.com is deployed from the Hugo source at
`hugo-site/content/blog/`. The root-level `blog/*.html` files are legacy
standalone pages that do NOT deploy. If a change is made to a legacy
file but not to its Hugo counterpart, the live site silently shows the
old content.

This script extracts the prose body from each pair of files, normalizes
whitespace, and reports any pair that differs. Run it before you
commit, or wire it into a pre-commit hook.

Usage
-----
    python3 scripts/check-blog-sync.py

Exit codes
----------
    0  — all pairs in sync
    1  — drift detected (or files missing from one side)
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEGACY = ROOT / "blog"
HUGO = ROOT / "hugo-site" / "content" / "blog"

# Start marker: first `<p class="ba-lead">`. This is the first line of
# article prose in BOTH file formats. Everything before it is either the
# legacy standalone <head>/nav or the Hugo frontmatter + template
# wrapper, which should not be compared.
#
# End marker: `<div class="ba-related">`. Share buttons and footer chrome
# differ between legacy (inlined) and Hugo (template-rendered), so we
# cut before the Related Articles block — it's present in both.
BODY_START_RE = re.compile(r'<p class="ba-lead">')
# Try these end markers in order; whichever appears first wins.
BODY_END_MARKERS = (
    '<div class="ba-related"',
    '<div class="nl-blog-cta"',
    '<footer class="ba-footer"',
)


def extract_body(html: str, legacy: bool) -> str:
    """Return a whitespace-normalized plaintext version of the article body."""
    m = BODY_START_RE.search(html)
    if not m:
        return ""
    start = m.start()
    candidates = [html.find(marker, start) for marker in BODY_END_MARKERS]
    candidates = [c for c in candidates if c != -1]
    if candidates:
        body = html[start:min(candidates)]
    elif legacy:
        end = html.find("</article>", start)
        body = html[start:end] if end > 0 else html[start:]
    else:
        body = html[start:]

    # Drop script/style blocks and HTML comments so they don't pollute diffs
    body = re.sub(r"<script\b[^>]*>.*?</script>", "", body, flags=re.S | re.I)
    body = re.sub(r"<style\b[^>]*>.*?</style>", "", body, flags=re.S | re.I)
    body = re.sub(r"<!--.*?-->", "", body, flags=re.S)

    # Strip tags, decode a few common entities, collapse whitespace
    body = re.sub(r"<[^>]+>", " ", body)
    for ent, ch in (
        ("&amp;", "&"),
        ("&nbsp;", " "),
        ("&lt;", "<"),
        ("&gt;", ">"),
        ("&quot;", '"'),
        ("&#39;", "'"),
    ):
        body = body.replace(ent, ch)
    body = re.sub(r"\s+", " ", body).strip()
    return body


def first_diff(a: str, b: str) -> int:
    """Return the index of the first differing character, or -1 if identical."""
    n = min(len(a), len(b))
    for i in range(n):
        if a[i] != b[i]:
            return i
    return -1 if len(a) == len(b) else n


def main() -> int:
    if not LEGACY.is_dir() or not HUGO.is_dir():
        print(f"ERROR: expected both {LEGACY} and {HUGO} to exist.", file=sys.stderr)
        return 2

    legacy_files = {p.name for p in LEGACY.glob("*.html") if p.name != "sidebar.html"}
    hugo_files = {p.name for p in HUGO.glob("*.html")}

    only_legacy = sorted(legacy_files - hugo_files)
    only_hugo = sorted(hugo_files - legacy_files)
    common = sorted(legacy_files & hugo_files)

    drift = []
    for name in common:
        legacy_body = extract_body((LEGACY / name).read_text(encoding="utf-8"), legacy=True)
        hugo_body = extract_body((HUGO / name).read_text(encoding="utf-8"), legacy=False)
        if legacy_body != hugo_body:
            drift.append((name, legacy_body, hugo_body))

    print(f"Checked {len(common)} blog files (legacy vs Hugo body text).\n")

    fail = False

    if only_legacy:
        fail = True
        print(f"In legacy blog/ but MISSING from hugo-site/ (will NOT deploy):")
        for n in only_legacy:
            print(f"  - {n}")
        print()

    if only_hugo:
        print(f"In hugo-site/ but not in legacy blog/ (fine, Hugo is source of truth):")
        for n in only_hugo:
            print(f"  - {n}")
        print()

    if drift:
        fail = True
        print(f"{len(drift)} file(s) have body drift. The Hugo version is what deploys.")
        print("If the legacy version has newer content, copy it into the Hugo file.\n")
        for name, legacy_body, hugo_body in drift:
            ll, hl = len(legacy_body), len(hugo_body)
            idx = first_diff(legacy_body, hugo_body)
            snippet_ctx = 60
            snap_a = legacy_body[max(0, idx - snippet_ctx): idx + snippet_ctx].replace("\n", " ")
            snap_b = hugo_body[max(0, idx - snippet_ctx): idx + snippet_ctx].replace("\n", " ")
            print(f"  - {name}")
            print(f"      legacy = {ll} chars   hugo = {hl} chars   delta = {hl - ll:+d}")
            print(f"      first diff at char {idx}")
            print(f"        legacy: ...{snap_a}...")
            print(f"        hugo:   ...{snap_b}...")
            print()

    if not fail:
        print("OK — all blog pairs are in sync.")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
