#!/usr/bin/env python3
"""
Add a free-licence photo to a Newsroom piece, with its credit.

    python3 scripts/fetch-news-photo.py --manifest            # every row of scripts/news-photos.tsv
    python3 scripts/fetch-news-photo.py <slug> "commons:File:Name.jpg" [--focus 0.3] [--alt "…"]
    python3 scripts/fetch-news-photo.py <slug> awm:H19367 --alt "…"

For each image it:
  1. reads the licence and author from the source (Wikimedia Commons API, or the
     Australian War Memorial item page) and refuses anything that is not public
     domain, CC0, CC BY or CC BY-SA;
  2. downloads it, crops to 16:9 around --focus (0 = keep the top, 1 = the bottom)
     and saves hugo-site/static/news/photos/<slug>.jpg at 1200x675;
  3. writes photo / photoAlt / photoCredit / photoCreditUrl / photoLicense into the
     front matter of hugo-site/content/news/<slug>.html (the illustrated cover stays as
     the fallback and is used again if the photo lines are removed).

Needs Pillow (pip3 install pillow certifi) and normal internet access. certifi supplies the
web certificates that python.org builds of Python on macOS lack.
"""
import argparse, html, io, json, os, re, ssl, sys, urllib.error, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'hugo-site', 'content', 'news')
PHOTOS = os.path.join(ROOT, 'hugo-site', 'static', 'news', 'photos')
MANIFEST = os.path.join(ROOT, 'scripts', 'news-photos.tsv')
UA = 'PsychoPharmRef-newsroom/1.0 (https://psychopharmref.com; jshoemakerhwc@gmail.com)'
OK_LICENCE = re.compile(r'^(public domain|pd\b|cc0|cc[ -]by(-sa)?[ -]\d)', re.I)


try:
    import certifi
    SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL_CTX = ssl.create_default_context()


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    try:
        with urllib.request.urlopen(req, timeout=60, context=SSL_CTX) as r:
            return r.read()
    except urllib.error.URLError as e:
        if isinstance(e.reason, ssl.SSLCertVerificationError):
            sys.exit('  ✗ Python cannot verify web certificates. Run:  pip3 install certifi  and try again.')
        raise


def strip_tags(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s or '')).strip()


def from_commons(title):
    api = ('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo'
           '&iiprop=url|extmetadata&iiurlwidth=2000&titles=' + urllib.parse.quote(title))
    pages = json.loads(get(api))['query']['pages']
    page = next(iter(pages.values()))
    if 'imageinfo' not in page:
        sys.exit(f'  ✗ {title}: not found on Commons')
    info = page['imageinfo'][0]
    meta = {k: v.get('value', '') for k, v in info.get('extmetadata', {}).items()}
    licence = strip_tags(meta.get('LicenseShortName'))
    artist = strip_tags(meta.get('Artist')) or 'Unknown author'
    artist = re.sub(r'\s+', ' ', artist)[:90]
    return {
        'image': info.get('thumburl') or info['url'],
        'licence': licence,
        'credit': f'{artist} / Wikimedia Commons',
        'page': info['descriptionurl'],
    }


def from_awm(item):
    page = f'https://www.awm.gov.au/collection/{item}'
    text = get(page).decode('utf-8', 'replace')
    if not re.search(r'public\s+domain', text, re.I):
        sys.exit(f'  ✗ AWM {item}: page does not say public domain')
    m = re.search(r'<meta[^>]+property="og:image"[^>]+content="([^"]+)"', text) or \
        re.search(r'<meta[^>]+content="([^"]+)"[^>]+property="og:image"', text)
    if not m:
        sys.exit(f'  ✗ AWM {item}: no image found on the item page')
    return {'image': html.unescape(m.group(1)), 'licence': 'Public domain',
            'credit': f'Australian War Memorial {item}', 'page': page}


def save_photo(url, slug, focus):
    from PIL import Image
    im = Image.open(io.BytesIO(get(url))).convert('RGB')
    w, h = im.size
    tw, th = 16, 9
    if w / h > tw / th:                      # too wide: crop the sides, centred
        nw = round(h * tw / th)
        x = (w - nw) // 2
        im = im.crop((x, 0, x + nw, h))
    else:                                    # too tall: crop top/bottom around focus
        nh = round(w * th / tw)
        y = round((h - nh) * min(max(focus, 0), 1))
        im = im.crop((0, y, w, y + nh))
    if im.width < 800:
        print(f'  ! {slug}: source is only {im.width}px wide after cropping; it will look soft')
    im = im.resize((1200, 675), Image.LANCZOS)
    os.makedirs(PHOTOS, exist_ok=True)
    out = os.path.join(PHOTOS, slug + '.jpg')
    im.save(out, 'JPEG', quality=82, optimize=True, progressive=True)
    return out


def write_front_matter(slug, fields):
    path = os.path.join(CONTENT, slug + '.html')
    src = open(path, encoding='utf-8').read()
    m = re.match(r'---\n(.*?)\n---\n', src, re.S)
    if not m:
        sys.exit(f'  ✗ {slug}: no front matter')
    fm = [l for l in m.group(1).split('\n') if not re.match(r'photo\w*:', l)]
    i = next((n for n, l in enumerate(fm) if l.startswith('coverAlt:')), len(fm) - 1) + 1
    fm[i:i] = [f'{k}: {json.dumps(v, ensure_ascii=False)}' for k, v in fields.items()]
    open(path, 'w', encoding='utf-8').write('---\n' + '\n'.join(fm) + '\n---\n' + src[m.end():])


def run(slug, source, focus, alt):
    if not os.path.exists(os.path.join(CONTENT, slug + '.html')):
        sys.exit(f'  ✗ {slug}: no such newsroom piece')
    kind, _, ref = source.partition(':')
    info = from_commons(ref) if kind == 'commons' else from_awm(ref) if kind == 'awm' else None
    if not info:
        sys.exit(f'  ✗ {slug}: unknown source "{source}"')
    if not OK_LICENCE.match(info['licence']):
        print(f'  ✗ {slug}: licence "{info["licence"]}" is not free to reuse; keeping the illustration')
        return False
    save_photo(info['image'], slug, focus)
    write_front_matter(slug, {
        'photo': f'/news/photos/{slug}.jpg',
        'photoAlt': alt,
        'photoCredit': info['credit'],
        'photoCreditUrl': info['page'],
        'photoLicense': info['licence'],
    })
    print(f'  ✓ {slug}: {info["credit"]} ({info["licence"]})')
    return True


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('slug', nargs='?')
    ap.add_argument('source', nargs='?')
    ap.add_argument('--focus', type=float, default=0.5)
    ap.add_argument('--alt', default='')
    ap.add_argument('--manifest', action='store_true')
    a = ap.parse_args()
    if a.manifest:
        done = 0
        for line in open(MANIFEST, encoding='utf-8'):
            if not line.strip() or line.startswith('#'):
                continue
            slug, source, focus, alt = line.rstrip('\n').split('\t')
            try:
                done += bool(run(slug, source, float(focus), alt))
            except SystemExit as e:
                print(e)
            except Exception as e:
                print(f'  ✗ {slug}: {e}')
        print(f'{done} photo(s) added.')
        if not done:
            sys.exit(1)
    elif a.slug and a.source:
        if not a.alt:
            ap.error('--alt is required')
        run(a.slug, a.source, a.focus, a.alt)
    else:
        ap.print_help()


if __name__ == '__main__':
    main()
