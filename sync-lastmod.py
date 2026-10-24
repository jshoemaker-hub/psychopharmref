#!/usr/bin/env python3
"""Set `lastmod:` in each Hugo content page to the date its body last changed.

The date comes from git: the most recent commit that changed the page body
(everything after the front matter). Front-matter-only edits, such as a title
tweak, don't count. A body with uncommitted changes gets today's date.

Run before committing content changes:
    python3 sync-lastmod.py            # update files
    python3 sync-lastmod.py --check    # list stale dates, change nothing
"""
import datetime
import glob
import re
import subprocess
import sys

DIRS = ["hugo-site/content/blog", "hugo-site/content/tools"]
FRONT = re.compile(r"\A---\n(.*?)\n---\n", re.S)


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True).stdout


# Markup-only edits that don't change what a reader sees (outline fixes for
# screen readers) shouldn't move the "Updated" date.
IGNORE = re.compile(r' aria-level="\d"')


def body(text):
    m = FRONT.match(text or "")
    b = text[m.end():] if m else (text or "")
    return IGNORE.sub("", b)


def body_changed_on(path):
    current = body(open(path, encoding="utf-8").read())
    head = git("show", f"HEAD:{path}")
    if not head or body(head) != current:
        return datetime.date.today().isoformat()
    newer_date = None
    for line in git("log", "--format=%H %cs", "--", path).splitlines():
        sha, date = line.split()
        if body(git("show", f"{sha}:{path}")) != current:
            return newer_date
        newer_date = date
    return newer_date  # unchanged since the file was added


def main():
    check = "--check" in sys.argv
    stale = 0
    for path in sorted(p for d in DIRS for p in glob.glob(f"{d}/*.html")):
        text = open(path, encoding="utf-8").read()
        m = FRONT.match(text)
        if not m:
            continue
        date = body_changed_on(path)
        if not date:
            continue
        front = m.group(1)
        old = re.search(r"^lastmod:\s*(\S+)", front, re.M)
        if old and old.group(1).strip("\"'") == date:
            continue
        stale += 1
        print(f"{path}: {old.group(1) if old else '(none)'} -> {date}")
        if check:
            continue
        if old:
            front = front[:old.start()] + f"lastmod: {date}" + front[old.end():]
        else:
            front += f"\nlastmod: {date}"
        open(path, "w", encoding="utf-8").write(f"---\n{front}\n---\n" + text[m.end():])
    print(f"{stale} page(s) {'need' if check else 'got'} a new lastmod")


if __name__ == "__main__":
    main()
