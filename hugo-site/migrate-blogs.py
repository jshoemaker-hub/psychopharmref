#!/usr/bin/env python3

"""
PsychoPharmRef Blog Migration Script

Converts HTML blog posts to Hugo Markdown content files.

Usage:
    python3 migrate-blogs.py [--source /path/to/blog] [--dest ./content/blog]

Requirements:
    - Python 3.6+
    - html.parser (standard library)
    - re (standard library)
"""

import os
import sys
import re
import html
from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime
from typing import Dict, List, Tuple, Optional


class BlogHTMLParser(HTMLParser):
    """Parse blog HTML files and extract metadata and content."""

    def __init__(self):
        super().__init__()
        self.in_title = False
        self.in_ba_category = False
        self.in_ba_subtitle = False
        self.in_ba_body = False
        self.in_ba_related_grid = False
        self.in_meta_description = False
        self.in_meta_og_title = False
        self.in_json_ld = False

        self.title = ""
        self.description = ""
        self.category = ""
        self.subtitle = ""
        self.read_time = ""
        self.date_published = ""
        self.body_content = []
        self.related_posts = []
        self.json_ld_content = ""
        self.tag_depth = 0
        self.capture_text = False
        self.current_text = []

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        """Handle opening HTML tags."""
        attrs_dict = dict(attrs) if attrs else {}

        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            name = attrs_dict.get("name", "")
            prop = attrs_dict.get("property", "")
            content = attrs_dict.get("content", "")

            if name == "description":
                self.description = content
            elif prop == "og:title":
                pass  # We'll use regular title instead

        elif tag == "script" and attrs_dict.get("type") == "application/ld+json":
            self.in_json_ld = True
            self.json_ld_content = ""

        elif tag == "span" and "ba-category" in attrs_dict.get("class", ""):
            self.in_ba_category = True
            self.capture_text = True
            self.current_text = []

        elif tag == "p" and "ba-subtitle" in attrs_dict.get("class", ""):
            self.in_ba_subtitle = True
            self.capture_text = True
            self.current_text = []

        elif tag == "div" and "ba-body" in attrs_dict.get("class", ""):
            self.in_ba_body = True
            self.tag_depth = 0

        elif tag == "div" and self.in_ba_body and "ba-related-grid" in attrs_dict.get("class", ""):
            self.in_ba_related_grid = True

        # Track body depth for proper end detection
        if self.in_ba_body and tag == "div":
            self.tag_depth += 1

        # Capture body content
        if self.in_ba_body and not self.in_ba_related_grid:
            self.body_content.append(f"<{tag}")
            for key, val in attrs:
                if val:
                    self.body_content.append(f' {key}="{val}"')
                else:
                    self.body_content.append(f" {key}")
            self.body_content.append(">")

    def handle_endtag(self, tag: str) -> None:
        """Handle closing HTML tags."""
        if tag == "title":
            self.in_title = False

        elif tag == "span" and self.in_ba_category:
            self.in_ba_category = False
            if self.current_text:
                self.category = " ".join(self.current_text).strip()
            self.capture_text = False
            self.current_text = []

        elif tag == "p" and self.in_ba_subtitle:
            self.in_ba_subtitle = False
            if self.current_text:
                self.subtitle = " ".join(self.current_text).strip()
            self.capture_text = False
            self.current_text = []

        elif tag == "div" and self.in_ba_body:
            self.tag_depth -= 1
            if self.tag_depth < 0:
                self.in_ba_body = False
                return

        elif tag == "div" and self.in_ba_related_grid:
            self.in_ba_related_grid = False

        elif tag == "script" and self.in_json_ld:
            self.in_json_ld = False
            self._parse_json_ld()

        # Capture body content
        if self.in_ba_body and not self.in_ba_related_grid:
            self.body_content.append(f"</{tag}>")

    def handle_data(self, data: str) -> None:
        """Handle text content."""
        if self.in_title:
            # Clean title: remove "- PsychoPharmRef" suffix
            text = data.replace("- PsychoPharmRef", "").strip()
            if text:
                self.title = text

        elif self.capture_text:
            self.current_text.append(data.strip())

        elif self.in_json_ld:
            self.json_ld_content += data

        elif self.in_ba_body and not self.in_ba_related_grid:
            self.body_content.append(data)

    def handle_entityref(self, name: str) -> None:
        """Handle HTML entities."""
        entity = html.unescape(f"&{name};")
        if self.in_ba_body and not self.in_ba_related_grid:
            self.body_content.append(entity)

    def handle_charref(self, name: str) -> None:
        """Handle numeric character references."""
        if name.startswith("x"):
            char = chr(int(name[1:], 16))
        else:
            char = chr(int(name))
        if self.in_ba_body and not self.in_ba_related_grid:
            self.body_content.append(char)

    def _parse_json_ld(self) -> None:
        """Extract metadata from JSON-LD script."""
        try:
            import json

            data = json.loads(self.json_ld_content)
            if isinstance(data, dict):
                self.date_published = data.get("datePublished", "2026-03-01")
        except:
            pass


def extract_related_posts(html_content: str) -> List[str]:
    """Extract related post links from HTML."""
    related = []
    # Look for links in ba-related-grid
    pattern = r'href="([^"]*)"[^>]*class="ba-related-link"'
    matches = re.findall(pattern, html_content)
    for match in matches:
        # Extract filename without extension
        slug = Path(match).stem
        if slug and slug != "index":
            related.append(slug)
    return related


def extract_read_time(html_content: str) -> str:
    """Extract read time from HTML."""
    match = re.search(r'⏱️\s+([^<]+)', html_content)
    if match:
        return match.group(1).strip()
    return "15 min read"


def html_to_markdown(html_body: str) -> str:
    """Convert HTML body to Markdown (simplified)."""
    content = html_body

    # Headers
    content = re.sub(r'<h2[^>]*class="ba-h2"[^>]*>([^<]*)</h2>', r'## \1', content)
    content = re.sub(r'<h3[^>]*class="ba-h3"[^>]*>([^<]*)</h3>', r'### \1', content)

    # Strong and emphasis
    content = re.sub(r'<strong>([^<]*)</strong>', r'**\1**', content)
    content = re.sub(r'<b>([^<]*)</b>', r'**\1**', content)
    content = re.sub(r'<em>([^<]*)</em>', r'*\1*', content)
    content = re.sub(r'<i>([^<]*)</i>', r'*\1*', content)

    # Keep complex structures as-is (divs with classes)
    # These will be rendered as raw HTML by Hugo's Goldmark renderer

    return content


def migrate_blog_post(html_file: Path, dest_dir: Path) -> bool:
    """Convert a single HTML blog post to Markdown."""
    try:
        print(f"Processing {html_file.name}...", end=" ")

        # Read HTML file
        with open(html_file, "r", encoding="utf-8") as f:
            html_content = f.read()

        # Parse HTML
        parser = BlogHTMLParser()
        parser.feed(html_content)

        # Extract additional metadata
        related = extract_related_posts(html_content)
        read_time = extract_read_time(html_content)

        # Determine date
        date_published = parser.date_published or "2026-03-01"

        # Build front matter
        front_matter = f"""---
title: "{parser.title}"
date: {date_published}
description: "{parser.description}"
category: "{parser.category}"
subtitle: "{parser.subtitle}"
readTime: "{read_time}"
clinicalSummary: ""
related: {related}
draft: false
---"""

        # Convert body content to markdown
        body_text = "".join(parser.body_content)
        body_markdown = html_to_markdown(body_text)

        # Create output file
        output_file = dest_dir / f"{html_file.stem}.md"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(front_matter)
            f.write("\n\n")
            f.write(body_markdown)

        print("✓")
        return True

    except Exception as e:
        print(f"✗ ({str(e)})")
        return False


def main() -> None:
    """Main execution."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Migrate PsychoPharmRef blog HTML files to Hugo Markdown"
    )
    parser.add_argument(
        "--source",
        default="../blog",
        help="Source blog directory (default: ../blog)",
    )
    parser.add_argument(
        "--dest",
        default="./content/blog",
        help="Destination content/blog directory (default: ./content/blog)",
    )

    args = parser.parse_args()

    source_dir = Path(args.source).resolve()
    dest_dir = Path(args.dest).resolve()

    # Validate directories
    if not source_dir.exists():
        print(f"Error: Source directory not found: {source_dir}", file=sys.stderr)
        sys.exit(1)

    # Create destination directory
    dest_dir.mkdir(parents=True, exist_ok=True)

    print("PsychoPharmRef Blog Migration")
    print("=" * 50)
    print(f"Source:      {source_dir}")
    print(f"Destination: {dest_dir}")
    print()

    # Find HTML files
    html_files = sorted(source_dir.glob("*.html"))
    print(f"Found {len(html_files)} blog posts")
    print()

    # Migrate each file
    migrated = 0
    failed = 0

    for html_file in html_files:
        if migrate_blog_post(html_file, dest_dir):
            migrated += 1
        else:
            failed += 1

    # Summary
    print()
    print("=" * 50)
    print(f"Migration Complete")
    print(f"Total:     {len(html_files)}")
    print(f"Migrated:  {migrated}")
    print(f"Failed:    {failed}")
    print()
    print("Next steps:")
    print("1. Review generated Markdown files in content/blog/")
    print("2. Edit front matter and content as needed")
    print("3. Test with: hugo server -D")
    print("4. Build with: hugo --minify")


if __name__ == "__main__":
    main()
