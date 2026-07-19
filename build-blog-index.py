#!/usr/bin/env python3
"""
build-blog-index.py
Extracts text content from all blog HTML files and produces blog-index.json
for the unified search bar. Run this whenever a new blog post is added.

Usage:  python3 build-blog-index.py
        python3 build-blog-index.py --check
Output: js/blog-index.json and hugo-site/static/js/blog-index.json
"""

import os, re, json, glob, sys
from html.parser import HTMLParser

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DIR = os.path.join(ROOT_DIR, 'blog')
OUT_FILES = [
    os.path.join(ROOT_DIR, 'js', 'blog-index.json'),
    os.path.join(ROOT_DIR, 'hugo-site', 'static', 'js', 'blog-index.json'),
]

# ── HTML text extractor ──────────────────────────────────────────────────────

class TextExtractor(HTMLParser):
    """Strip HTML tags and extract visible text from a chunk of HTML."""
    SKIP_TAGS = {'script', 'style', 'noscript', 'svg', 'code'}

    def __init__(self):
        super().__init__()
        self.pieces = []
        self._skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP_TAGS:
            self._skip_depth += 1

    def handle_endtag(self, tag):
        if tag in self.SKIP_TAGS and self._skip_depth > 0:
            self._skip_depth -= 1

    def handle_data(self, data):
        if self._skip_depth == 0:
            self.pieces.append(data)

    def get_text(self):
        return ' '.join(self.pieces)


def extract_body_text(html):
    """Pull text from inside the ba-body element(s) or <article>."""
    body_html = ''
    # Try single wrapping ba-body element (div or main)
    m = re.search(r'<(?:div|main|section|article)\s+class="ba-body"[^>]*>(.*)', html, re.DOTALL)
    if m:
        body_html = m.group(1)
    else:
        # Some posts use multiple <p class="ba-body">
        parts = re.findall(r'class="ba-body"[^>]*>(.*?)</', html, re.DOTALL)
        if parts:
            body_html = ' '.join(parts)
    # Fallback: blog-article wrapper
    if not body_html:
        m = re.search(r'class="blog-article"[^>]*>(.*)', html, re.DOTALL)
        if m:
            body_html = m.group(1)
    # Fallback: bare <article> tag
    if not body_html:
        m = re.search(r'<article[^>]*>(.*?)</article>', html, re.DOTALL)
        if m:
            body_html = m.group(1)
    # Last resort: everything inside <main>
    if not body_html:
        m = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
        if m:
            body_html = m.group(1)
    if not body_html:
        return ''
    ext = TextExtractor()
    ext.feed(body_html)
    return ext.get_text()


def extract_title(html):
    """Get the <title> text, strip ' | PsychoPharmRef'."""
    m = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
    if m:
        return re.sub(r'\s*\|\s*PsychoPharmRef\s*$', '', m.group(1)).strip()
    return ''


def extract_description(html):
    """Get og:description meta content."""
    m = re.search(r'<meta\s+property="og:description"\s+content="([^"]*)"', html)
    if m:
        return m.group(1).strip()
    return ''


def normalize_text(text):
    """Collapse whitespace, lowercase, strip punctuation for indexing."""
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_keywords(text, min_len=4, top_n=80):
    """
    Extract the most distinctive words from the body text.
    Returns a de-duped list of lowercase tokens that appear more than once
    or are long/clinical-sounding, capped at top_n.
    """
    # Common stop words to exclude
    STOP = {
        'a','an','the','and','or','but','in','on','at','to','for','of','is',
        'it','that','this','with','are','was','were','be','been','being',
        'have','has','had','do','does','did','will','would','could','should',
        'may','might','can','shall','from','by','as','into','through','about',
        'between','after','before','during','above','below','than','such',
        'both','each','every','other','some','any','all','most','more','less',
        'very','just','also','not','only','then','here','there','when','where',
        'which','what','who','whom','how','their','they','them','these','those',
        'your','our','its','his','her','she','him','her','we','you','my','me',
        'no','nor','so','too','over','under','out','up','down','off','own',
        'same','while','because','until','although','however','therefore',
        'including','without','within','among','across','another','whether',
        'along','since','often','still','even','much','many','well','like',
        'use','used','using','one','two','three','per','new','need','make',
        'made','take','taken','given','give','high','low','see','seen','case',
        'cases','first','second','based','associated','related','common',
        'include','includes','often','rather','able','likely','time','times',
        'important','note','notes','known','several','show','shows','shown',
        'specific','particularly','possible','study','studies','found',
        'suggest','suggests','typically','usually','generally','significantly',
        'patients','patient','treatment','clinical','table','figure','data',
        'results','effect','effects','risk','dose','drug','drugs','medication',
        'medications','symptoms','symptom','disorder','disorders','diagnosis',
        'therapy','management','however','example','compared','evidence',
        'following','available','different','increased','decreased','levels',
        'report','reported','response','condition','conditions','practice',
        'review','research','suggest','recommended','according','standard',
    }
    words = re.findall(r'[a-z][a-z\'-]{2,}', text.lower())
    # Count frequencies
    freq = {}
    for w in words:
        w = w.strip("'-")
        if len(w) >= min_len and w not in STOP:
            freq[w] = freq.get(w, 0) + 1
    # Sort by frequency descending, then alphabetically
    ranked = sorted(freq.keys(), key=lambda w: (-freq[w], w))
    return ranked[:top_n]


# ── Main ─────────────────────────────────────────────────────────────────────

def build_index(verbose=True):
    index = []
    files = sorted(
        f for f in glob.glob(os.path.join(BLOG_DIR, '*.html'))
        if os.path.basename(f) != 'sidebar.html'
    )
    if verbose:
        print(f'Scanning {len(files)} blog files...')

    for fpath in files:
        fname = os.path.basename(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            html = f.read()

        title = extract_title(html)
        desc = extract_description(html)
        body = normalize_text(extract_body_text(html))
        keywords = extract_keywords(body)

        if not title:
            continue

        entry = {
            'file': fname,
            'title': title,
            'desc': desc,
            'keywords': keywords,
            # Also store a short snippet (first ~300 chars of body) for preview
            'snippet': body[:300].rsplit(' ', 1)[0] if len(body) > 300 else body,
        }
        index.append(entry)
        if verbose:
            print(f'  ✓ {fname} — {len(keywords)} keywords')

    return index


def serialize_index(index):
    return json.dumps(index, indent=1)


def write_index(index):
    payload = serialize_index(index)
    for out_file in OUT_FILES:
        os.makedirs(os.path.dirname(out_file), exist_ok=True)
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write(payload)

        size_kb = os.path.getsize(out_file) / 1024
        print(f'\nWrote {out_file} ({len(index)} posts, {size_kb:.1f} KB)')


def check_index(index):
    expected = serialize_index(index)
    stale = []
    missing = []

    for out_file in OUT_FILES:
        if not os.path.exists(out_file):
            missing.append(out_file)
            continue
        with open(out_file, 'r', encoding='utf-8') as f:
            if f.read() != expected:
                stale.append(out_file)

    if missing or stale:
        print('ERROR: blog index output is stale or missing.')
        for out_file in missing:
            print(f'  missing: {out_file}')
        for out_file in stale:
            print(f'  stale:   {out_file}')
        print('\nRun `npm run build:blog-index` and commit the updated generated files.')
        return 1

    print(f'OK — blog index files are current ({len(index)} posts).')
    return 0


def main():
    check = False
    for arg in sys.argv[1:]:
        if arg == '--check':
            check = True
        else:
            print(f'Usage: {sys.argv[0]} [--check]', file=sys.stderr)
            return 2

    index = build_index(verbose=not check)
    if check:
        return check_index(index)
    write_index(index)
    return 0


if __name__ == '__main__':
    sys.exit(main())
