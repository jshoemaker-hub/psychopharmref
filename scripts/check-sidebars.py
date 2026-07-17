#!/usr/bin/env python3
"""
check-sidebars.py — detect drift between the three PsychoPharmRef sidebars.

The site keeps three separately-maintained sidebars that must stay in sync:
  1. index.html                              in-page SPA sidebar   (tool links: data-section="id"; chapter links: /blog/slug/)
  2. blog/sidebar.html                       fetched by every static blog post   (tools: ../index.html#id; chapters: slug.html)
  3. hugo-site/layouts/partials/sidebar.html Hugo template   (tools: /#id; chapters: {{ "/blog/slug" | relURL }})

They drift when a tool section or chapter is added to one but not the others. The
symptom is nav entries that "drop off" when you open a blog post (because the shared
blog sidebar is missing them). This script normalizes every nav-sub-link to a canonical
identity — sec:<section-id> for tools, blog:<slug> for chapters — independent of the
three URL spellings, then reports any entry that is present in one sidebar but missing
from another. It checks COVERAGE across the whole sidebar (not per nav-group), so an
item filed under a different group in one file is not falsely flagged.

Usage:
    python3 scripts/check-sidebars.py           # report drift; exit 1 if any
    python3 scripts/check-sidebars.py --quiet    # only print if drift is found
Exit code 0 = every sidebar reaches the same tools + chapters, 1 = drift.
"""
import re, sys, html, os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FILES = {
    "index.html":        os.path.join(REPO, "index.html"),
    "blog/sidebar.html": os.path.join(REPO, "blog", "sidebar.html"),
    "hugo partial":      os.path.join(REPO, "hugo-site", "layouts", "partials", "sidebar.html"),
}

# Section ids that legitimately live only in the in-page SPA sidebar and are not
# expected in the shared blog/Hugo sidebars. Add ids here to silence intentional
# asymmetries (keeps the check honest without nagging).
IGNORE = set()

ANCHOR_RE = re.compile(r'<a\b([^>]*\bnav-sub-link\b[^>]*?)>(.*?)</a>', re.S)


def canonical_key(attrs):
    """Reduce an anchor's attributes to a stable identity across all three URL forms.
    Searches the whole attribute string so Hugo's nested-quote href
    (href="{{ "/blog/slug" | relURL }}") is handled correctly."""
    # 1) explicit section (index.html tool links: data-section="chem-structure")
    m = re.search(r'data-section="([^"]+)"', attrs)
    if m:
        return "sec:" + m.group(1)          # glossary category chips collapse to the base section
    # 2) chapter slug in any URL form: /blog/slug/, {{ "/blog/slug" | relURL }}
    m = re.search(r'/blog/([a-z0-9][a-z0-9-]*)', attrs)
    if m:
        return "blog:" + m.group(1)
    # 3) section deep-link fragment: ../index.html#id, /#id, #id
    m = re.search(r'#([a-z0-9][a-z0-9-]*)"', attrs)
    if m:
        return "sec:" + m.group(1)
    # 4) relative chapter file: slug.html  (blog/sidebar.html chapter links)
    m = re.search(r'"([a-z0-9][a-z0-9-]*)\.html"', attrs)
    if m and m.group(1) != "index":
        return "blog:" + m.group(1)
    return None                              # not a tool/chapter nav entry we track


def clean_label(inner):
    txt = re.sub(r'<[^>]+>', '', inner)
    return re.sub(r'\s+', ' ', html.unescape(txt)).strip()


def parse(path):
    """Return { canonical_key: label } for one sidebar file."""
    text = open(path, encoding="utf-8").read()
    out = {}
    for a in ANCHOR_RE.finditer(text):
        key = canonical_key(a.group(1))
        if key and key not in IGNORE:
            out.setdefault(key, clean_label(a.group(2)))
    return out


def main():
    quiet = "--quiet" in sys.argv
    parsed = {name: parse(path) for name, path in FILES.items()}

    universe = {}
    for entries in parsed.values():
        for k, label in entries.items():
            universe.setdefault(k, label)

    problems = []
    for k, label in universe.items():
        missing = [name for name in FILES if k not in parsed[name]]
        if missing:
            problems.append((k, label, missing))

    tool_probs = sorted([p for p in problems if p[0].startswith("sec:")], key=lambda p: p[1].lower())
    chap_probs = sorted([p for p in problems if p[0].startswith("blog:")], key=lambda p: p[1].lower())

    counts = " | ".join(f"{name}: {len(e)}" for name, e in parsed.items())
    if not (quiet and not problems):
        print(f"Sidebar entries tracked — {counts}")
        print(f"Universe: {len(universe)} unique tools+chapters across all sidebars\n")

    def emit(title, probs):
        if not probs:
            return
        print(f"✗ {title}: {len(probs)} out of sync")
        for k, label, missing in probs:
            print(f"    - {label or k}  [{k}]")
            print(f"        missing from: {', '.join(missing)}")
        print()

    if problems:
        emit("Tool / section links", tool_probs)
        emit("Chapter links", chap_probs)
        print("RESULT: drift detected — add the entries above to the sidebars that lack them.")
        print("        blog/sidebar.html and hugo-site/layouts/partials/sidebar.html are the two shared copies.")
        sys.exit(1)

    if not quiet:
        print("✓ RESULT: all three sidebars reach the same tools and chapters.")
    sys.exit(0)


if __name__ == "__main__":
    main()
