---
name: newsroom-week
description: Write and schedule next week's PsychoPharmRef Newsroom slate (home-page front page) — FDA, policy, mechanism, history-of-tools and profile pieces with cover art.
---
# Newsroom: write next week's slate

The home page front page (`#nw-front`, rendered by `js/newsroom.js`) shows every newsroom piece whose
`date` falls in the last 7 days, newest first; older pieces live on at `/news/`. Pieces are built ahead of
time (`buildFuture = true` in `hugo.toml`) and appear on their publish date with no redeploy.
So the job each week is: **schedule at least one piece for every day of the coming week (Mon–Sun), spread across desks.**
If a week is missed the front page backfills from the archive, so it never goes blank — but it stops being new.

## Weekly plan (default mix, 7–9 pieces)
- FDA Watch: 1–2 (approvals, label/boxed-warning changes, advisory committees, DEA scheduling of new drugs)
- Capitol & Clinic: 1–2 (DEA, CMS fee schedule, parity, telehealth, Medicaid, 988, SAMHSA)
- How It Works: 1–2 (mechanism of a new or newly relevant drug)
- Instruments & Origins: 1 (history of a scale, treatment, device or diagnostic system)
- Minds That Shaped Psychiatry: 1 (profile)
- Around the Web needs nothing weekly: it rotates 6 links/week from `hugo-site/data/around_the_web.yaml`
  automatically. Add a few vetted entries every month or two so the rotation doesn't repeat too soon.

Before writing, list `hugo-site/content/news/` so you don't repeat a topic, and check what is already scheduled.
News desks (FDA, policy) must be researched with web search on the day of writing — never from memory.

## After writing
1. Validate each body with Python's html.parser (balanced tags).
2. Build: `cd hugo-site && hugo --minify` (Hugo 0.140 extended) and open `/news/index.json` — every new piece should be listed.
3. Preview a future day on the home page with `?nwdate=YYYY-MM-DD`.
4. Commit `hugo-site/content/news/` and `hugo-site/static/news/covers/` together.

## Desks and pen names (bylines are added by the template from `desk` — do NOT put author names in files)
| desk key     | Desk name                       | Pen name        |
|--------------|---------------------------------|-----------------|
| fda          | FDA Watch                       | Marion Hale     |
| policy       | Capitol & Clinic                | Theo Whitcombe  |
| mechanism    | How It Works                    | Iris Calder     |
| instruments  | Instruments & Origins           | Edith Marrow    |
| profiles     | Minds That Shaped Psychiatry    | Julian Ashby    |

## Accuracy rules (most important)
- This is a real clinical site run by a psychiatrist. **Never invent facts, quotes, trial numbers, dates, doses or URLs.**
- For anything after mid-2026 (approvals, policy) you MUST verify with WebSearch/WebFetch and cite it.
  If you cannot verify a detail, leave it out or say plainly it is not yet public.
- No fabricated direct quotes from anyone. Paraphrase with attribution ("the agency said…") only when a source says it.
- Every article ends with real sources in front matter `sources` (2–6). Prefer primary sources
  (FDA.gov, Federal Register, CMS, congress.gov, company press release, journal article, PubMed).
  Only list URLs you actually saw in search results or fetched.
- Clinical content: include dosing only if from the label; add appropriate caution. No patient advice.

## File 1: article — `hugo-site/content/news/<slug>.html`
Slug: lowercase-hyphenated, descriptive, ≤ 60 chars. Format exactly:

```
---
title: "Headline in sentence case, ≤ 90 chars"
seoTitle: "≤ 60 char version (only if title > 60 chars)"
date: 2026-10-29
desk: fda
dek: "One- or two-sentence standfirst shown under the headline on cards (≤ 220 chars)."
description: "SEO description ≤ 155 chars."
cover: "/news/covers/<slug>.svg"
coverAlt: "Describe the illustration for screen readers."
readTime: "5 min read"
keywords: ["olanzapine", "long-acting injectable", "schizophrenia"]
related:
  - title: "Schizophrenia"
    url: "/blog/schizophrenia/"
sources:
  - title: "FDA approves …"
    publisher: "U.S. Food and Drug Administration"
    url: "https://…"
draft: false
---
<div class="nw-takeaways">
  <h2>Key points</h2>
  <ul>
    <li>…</li>
    <li>…</li>
    <li>…</li>
  </ul>
</div>

<p>Lede paragraph…</p>
<h2>Subhead</h2>
<p>…</p>
```

Body rules:
- 550–900 words. Use `<p>`, `<h2>`, `<h3>`, `<ul>/<ol>`, `<strong>`, `<em>`, `<blockquote>` (only for documented historical quotes with a source), and optionally one
  `<table class="nw-table">` with `<thead>`/`<tbody>`. Optionally one `<aside class="nw-callout"><h3>Clinical angle</h3><p>…</p></aside>`.
- Inline links allowed (`<a href="…">`). Internal links: chapters live at `/blog/<slug>/` — check `ls /home/user/psychopharmref/blog/` for real slugs
  (e.g. schizophrenia, bipolar-disorder, major-depressive-disorder, antipsychotic-review, antidepressant-review, adult-adhd). Only link slugs that exist.
  `related` (2–4 items) must also be real chapter URLs from that folder.
- No `<h1>`, no inline styles, no scripts, no images in the body. Valid, balanced HTML.
- `date` is the PUBLISH date (the day it should go live on the front page) (articles are scheduled; the site reveals them on that date).
  Write so the piece reads correctly on that date ("this month", "last week" relative to it — or just use absolute dates).

## File 2: cover illustration — `hugo-site/static/news/covers/<slug>.svg`
Original flat editorial illustration (we cannot use photos in this environment). Requirements:
- `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="…">` — 16:9.
- Self-contained: no external refs, no `<image>`, no fonts/web fonts, no scripts. Keep under ~15 KB.
- **No headline text** in the art (cards print the headline). Small labels allowed only if they are part of the picture
  (e.g. an element tile "Li", a receptor label "M1"), using font-family="Georgia, serif" or "Helvetica, Arial, sans-serif".
- Must stay legible when cropped to the centre 4:3 or shown at 320 px wide — keep the subject centred and bold.
- No realistic faces or portraits of real people. For people, use symbolic motifs (their discovery, an era object, a silhouette of a building/desk/notebook).
- Palette: warm paper backgrounds (#f4efe6, #ece6db, #e2d9c8), ink #231e14, plus your desk accent and 1–2 supporting tones:
  fda #2f6f8f · policy #8a3b2e · mechanism #4a7c35 · instruments #8b6914 · profiles #5b4a7a. Supporting: #c9a24a, #6b6050, #9fb88f, #d98b5f.
- Style: geometric, confident shapes, subtle texture via a few low-opacity shapes or dot grids; gradients sparingly (linearGradient OK).

## Report back
List the slugs scheduled with their dates and desks, a one-line summary each, and any fact you could not verify
and therefore left out, so the editor (Jerad Shoemaker, MD) can review before merging.
