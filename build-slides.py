#!/usr/bin/env python3
"""
build-slides.py — Convert a NotebookLM slide deck PDF into a per-chapter
                  image carousel + manifest for the .ba-slides component.

Workflow per chapter:
    1. Drop the PDF at  blog/slides/<slug>.pdf
    2. Run:             python3 build-slides.py <slug>
    3. Paste the printed snippet into the chapter (between </header> and
       <div class="ba-body">)
    4. Mirror the affected files to hugo-site/static/

The carousel reads blog/slides/<slug>/manifest.json at runtime, so the
chapter's snippet does not change between rebuilds — only the images and
manifest do.

Requires: poppler-utils (pdftoppm) on PATH. macOS: `brew install poppler`.

Usage:
    python3 build-slides.py <slug>          # build one chapter
    python3 build-slides.py --all           # rebuild every PDF in slides/
    python3 build-slides.py <slug> --dpi 180 --width 1600
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

# Repo layout
REPO       = Path(__file__).resolve().parent
BLOG_DIR   = REPO / "blog"
SLIDES_DIR = BLOG_DIR / "slides"
HUGO_STATIC_SLIDES = REPO / "hugo-site" / "static" / "blog" / "slides"

# Image output
DEFAULT_DPI   = 150
DEFAULT_WIDTH = 1400  # px; -scale-to-x in pdftoppm
PNG_PREFIX    = "page"


def die(msg: str, code: int = 1) -> None:
    print(f"build-slides: {msg}", file=sys.stderr)
    sys.exit(code)


def need_pdftoppm() -> str:
    p = shutil.which("pdftoppm")
    if not p:
        die("pdftoppm not found. Install poppler-utils:\n"
            "  macOS:  brew install poppler\n"
            "  Ubuntu: sudo apt install poppler-utils")
    return p


def pdf_for(slug: str) -> Path:
    pdf = SLIDES_DIR / f"{slug}.pdf"
    if not pdf.is_file():
        die(f"{pdf} not found. Drop the NotebookLM PDF there first.")
    return pdf


def title_for(slug: str) -> str:
    chapter = BLOG_DIR / f"{slug}.html"
    if not chapter.is_file():
        return slug.replace("-", " ").title()
    text = chapter.read_text(encoding="utf-8", errors="replace")
    m = re.search(r'<h1[^>]*class="[^"]*ba-title[^"]*"[^>]*>(.*?)</h1>', text, re.S)
    if m:
        return re.sub(r"<[^>]+>", "", m.group(1)).strip()
    m = re.search(r"<title>(.*?)</title>", text, re.S)
    if m:
        return re.sub(r"\s*\|\s*PsychoPharmRef\s*$", "",
                      m.group(1).strip(), flags=re.I)
    return slug.replace("-", " ").title()


def convert(slug: str, dpi: int, width: int, force: bool) -> dict:
    pdftoppm = need_pdftoppm()
    pdf      = pdf_for(slug)
    out_dir  = SLIDES_DIR / slug

    # Skip if up-to-date
    manifest_path = out_dir / "manifest.json"
    if (not force
        and manifest_path.is_file()
        and manifest_path.stat().st_mtime >= pdf.stat().st_mtime):
        print(f"  [skip] {slug} (up to date — pass --force to rebuild)")
        return json.loads(manifest_path.read_text())

    # Fresh dir
    if out_dir.exists():
        for f in out_dir.iterdir():
            if f.is_file(): f.unlink()
    else:
        out_dir.mkdir(parents=True)

    # Run pdftoppm (-scale-to-x sets width, height auto-scales preserving aspect)
    cmd = [
        pdftoppm,
        "-png",
        "-r", str(dpi),
        "-scale-to-x", str(width),
        "-scale-to-y", "-1",
        str(pdf),
        str(out_dir / PNG_PREFIX),
    ]
    print(f"  [conv] {' '.join(cmd)}")
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as e:
        die(f"pdftoppm failed for {slug}:\n{e.stderr}")

    # pdftoppm writes page-1.png, page-12.png, etc. Normalise to page-001.png.
    pages_raw = sorted(out_dir.glob(f"{PNG_PREFIX}-*.png"),
                       key=lambda p: int(re.search(r"-(\d+)\.png$", p.name).group(1)))
    if not pages_raw:
        die(f"no pages produced for {slug} — is the PDF valid?")
    n = len(pages_raw)
    # Absolute paths (/blog/slides/...) so they resolve correctly from both the
    # static /blog/<slug>.html preview and Hugo's /blog/<slug>/ pretty URL.
    pages_rel: list[str] = []
    for i, p in enumerate(pages_raw, start=1):
        new_name = f"{PNG_PREFIX}-{i:03d}.png"
        new_path = out_dir / new_name
        if p.name != new_name:
            p.rename(new_path)
        pages_rel.append(f"/blog/slides/{slug}/{new_name}")

    manifest = {
        "slug": slug,
        "title": title_for(slug),
        "pdf": f"/blog/slides/{slug}.pdf",
        "pages": pages_rel,
        "page_count": n,
        "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "NotebookLM Slide Deck",
    }
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    # Mirror to hugo-site/static if it exists
    hugo_target = HUGO_STATIC_SLIDES / slug
    if HUGO_STATIC_SLIDES.parent.exists():
        if hugo_target.exists():
            shutil.rmtree(hugo_target)
        shutil.copytree(out_dir, hugo_target)
        # Also mirror the source PDF
        shutil.copy2(pdf, HUGO_STATIC_SLIDES / f"{slug}.pdf")
        print(f"  [hugo] mirrored to {hugo_target.relative_to(REPO)}")

    print(f"  [ok]   {slug}: {n} pages -> blog/slides/{slug}/")
    return manifest


def snippet(slug: str, manifest: dict) -> str:
    title = manifest.get("title", slug)
    return f"""\
<!-- Slide Overview (generated by build-slides.py for {slug}) -->
<aside class="ba-slides" data-slides-slug="{slug}" aria-label="Slide overview">
  <button class="ba-slides-toggle" type="button" aria-expanded="false" aria-controls="slides-panel-{slug}">
    <svg class="ba-slides-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>
    <span class="ba-slides-label">Slide Overview</span>
    <span class="ba-slides-count" data-slide-count></span>
    <svg class="ba-slides-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>
  </button>
  <div class="ba-slides-panel" id="slides-panel-{slug}" hidden>
    <div class="ba-slides-stage">
      <button class="ba-slides-prev" type="button" aria-label="Previous slide">&#8249;</button>
      <div class="ba-slides-track" data-slides-track></div>
      <button class="ba-slides-next" type="button" aria-label="Next slide">&#8250;</button>
    </div>
    <div class="ba-slides-bar">
      <div class="ba-slides-dots" data-slides-dots aria-hidden="true"></div>
      <div class="ba-slides-actions">
        <span class="ba-slides-pos" data-slides-pos>1 / 1</span>
        <button class="ba-slides-fs" type="button" data-slides-fs aria-label="Fullscreen">&#9974;</button>
        <a class="ba-slides-dl" href="/blog/slides/{slug}.pdf" download>Download PDF</a>
      </div>
    </div>
  </div>
</aside>
<!-- /Slide Overview -->
"""


def find_all_slugs() -> list[str]:
    if not SLIDES_DIR.is_dir():
        return []
    return sorted(p.stem for p in SLIDES_DIR.glob("*.pdf"))


def main() -> None:
    ap = argparse.ArgumentParser(description="Build slide carousels from NotebookLM PDFs.")
    ap.add_argument("slug", nargs="?", help="chapter slug (e.g. schizophrenia)")
    ap.add_argument("--all", action="store_true", help="rebuild every PDF in blog/slides/")
    ap.add_argument("--dpi", type=int, default=DEFAULT_DPI)
    ap.add_argument("--width", type=int, default=DEFAULT_WIDTH, help="output image width in px")
    ap.add_argument("--force", action="store_true", help="rebuild even if up to date")
    ap.add_argument("--no-snippet", action="store_true", help="skip printing the paste-in HTML")
    args = ap.parse_args()

    SLIDES_DIR.mkdir(parents=True, exist_ok=True)

    if args.all:
        slugs = find_all_slugs()
        if not slugs:
            die("no PDFs found in blog/slides/")
    elif args.slug:
        slugs = [args.slug]
    else:
        ap.print_help()
        sys.exit(2)

    print(f"build-slides: {len(slugs)} chapter(s) — dpi={args.dpi}, width={args.width}")
    for s in slugs:
        manifest = convert(s, args.dpi, args.width, args.force)
        if not args.no_snippet and not args.all:
            print()
            print("Paste this between </header> and <div class=\"ba-body\"> in "
                  f"blog/{s}.html and hugo-site/static/{s}.html (and the equivalent")
            print("Hugo content file). It is the same in every chapter except the slug.")
            print()
            print(snippet(s, manifest))


if __name__ == "__main__":
    main()
