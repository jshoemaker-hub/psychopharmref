# PsychoPharmRef

A single-page psychopharmacology reference application for clinicians, built as a static HTML/CSS/JS site with standalone blog posts.

## Project Structure

```
psychopharm/
├── index.html          # → symlink to hugo-site/static/index.html (main SPA shell)
├── css/                # → symlink to hugo-site/static/css
├── js/                 # → symlink to hugo-site/static/js (app.js, data.js, tools/…)
├── fragments/          # → symlink to hugo-site/static/fragments (section body markup, loaded on first visit)
├── handouts/, privacy.html, legal-disclaimer.html  # → symlinks into hugo-site/static
├── hugo-site/          # WHAT ACTUALLY DEPLOYS (Netlify builds from here)
│   ├── hugo.toml       # Hugo config
│   ├── netlify.toml    # Build/publish config + security headers (the one Netlify uses)
│   └── static/         # The real files. Root paths above are symlinks into here — no mirroring.
├── blog/               # 80+ standalone HTML blog posts (each fetches blog/sidebar.html)
├── build-blog-index.py # Rebuilds js/blog-index.json (search bar data) — run after every new post
├── sync-lastmod.py     # Sets `lastmod:` on Hugo content pages from git (body changes only) — run before committing content
├── build-course-worksheets.py # Regenerates blank Therapy-Courses worksheet PDFs → hugo-site/static/worksheets/ (needs reportlab)
├── ref/                # Reference PDFs, source documents, research papers
│   ├── scales/         # Clinical rating scale PDFs (PANSS, BFCRS, C-SSRS, CDR, SLUMS, etc.)
│   └── literature/     # Research papers, textbook excerpts, guidelines
├── notes/              # Working notes, blog drafts, feature ideas
├── CLAUDE.md           # This file — project context for Claude
├── netlify.toml        # Top-level Netlify config (base="hugo-site")
└── .claude/            # Claude Code configuration
    ├── settings.json
    └── skills/         # Reusable task-specific skills
```

## Architecture & Conventions

### Single-Page Application
- `index.html` is the entire app — sections are shown/hidden via `switchSection('section-id')`
- Each section: `<section id="name" class="section">` with a `<div class="section-header">`
- Only one section is visible at a time (class `active`)

### CSS Variables (defined in styles.css)
```
--accent: #4a7c35    (green — primary buttons, highlights)
--text: #231e14      (dark brown — body text)
--bg2: #ece6db       (warm beige — card/form backgrounds)
--border: #cfc8ba    (light tan — borders)
--accent2: #8b6914   (gold — secondary accent)
```

### Clinical Tool Pattern
Each clinical tool follows this exact pattern:
1. Section wrapper: `<section id="toolname-tool" data-lazy-tool="toolname-tool" class="section">`
2. Section header with `<h2>` and `<p>` description
3. Warning box: `<div class="mt-warning">`
4. HTML form with radio buttons / checkboxes for scoring
5. Score display area with real-time updates
6. Generate Report button → copies to clipboard (button text changes to "Copied!" for 2s)
7. Reset button with confirmation
8. Closing: `</section><!-- end toolname-tool -->`

**Tool markup lives in a fragment.** `index.html` keeps only the section shell (wrapper, `section-header`, any `psy-tabs`) plus a placeholder:
`<div class="tool-fragment" data-fragment="<section-id>" aria-busy="true"><p class="tool-fragment-msg">Loading…</p></div>`.
Everything else (warning box, form, results) goes in `fragments/<section-id>.html`. On first visit `switchSection()` fetches the fragment, inserts it, *then* loads the tool CSS/JS, so tool JS can bind to its markup at load as before. Edit a tool's form in its fragment file, not in `index.html`. Static sections without tool JS (e.g. `cog-domains`, `blog-index`) can use the same placeholder. Don't move markup that code outside the tool's own JS reads at page load (check with grep first). Fragments are served with revalidation, so no `?v=` bump is needed for them.

**Every form control needs a label**: `<label for="id">`, a wrapping `<label>`, or `aria-label` (for radio grids in tables use `aria-label="<item>: <column header>"`).

**Tool files are external** (lazy-loaded on first visit):
- CSS: `css/tools/toolname-tool.css` — prefixed classes (e.g., `ps-` for PANSS)
- JS: `js/tools/toolname-tool.js` — wrapped in IIFE: `(function(){ ... })()`
- Shared utils: `js/tools/tool-utils.js` — loaded automatically before any tool JS

### Shared Tool Utilities (`js/tools/tool-utils.js`)
New tools should use `ToolUtils` instead of reimplementing common patterns:
```javascript
// Copy to clipboard with button feedback
ToolUtils.copyWithButton(reportText, buttonElement);

// Copy to clipboard with message element feedback
ToolUtils.copyWithMessage(reportText, messageElement);

// Reset with confirmation
ToolUtils.confirmReset('Reset all scores?', function() { form.reset(); });

// Consistent date stamp for reports ("March 24, 2026")
var dateStr = ToolUtils.dateStamp();
```

**CSS prefix registry** (to avoid conflicts):
- `sl-` → SLUMS Examination
- `sr-` → Suicide Risk Assessment Tools
- `ps-` → PANSS (Psychosis)
- `bf-` → BFCRS (Catatonia)
- `ct-` → Contact form
- `ci-` → CIDI Bipolar Screening
- `pc-` → PCL-5 (PTSD)
- `ym-` → YMRS (Mania)
- `yb-` → Y-BOCS (OCD)
- `ai-` → AIMS (Dyskinesia)
- `mda-` → Movement Disorder Assessment (bedside phenomenology exam / MotorSign)
- `bp-` → BPRS (Brief Psychiatric Rating Scale)
- `adl-` → ADL / IADL
- `aq-` → Autism Screening (AQ)
- `asrs-` → ASRS (ADHD)
- `bat-` → BAT (Brief Anxiety)
- `es-` → Epworth Sleepiness Scale
- `isi-` → Insomnia Severity Index (7-item, 0–28)
- `msibpd-` → MSI-BPD
- `sud-` → DSM-5-TR Substance Use Disorder Tool
- `sm-` → Find Similar Medications
- `cm-` → Find Complementary Medications
- `cs-` → Chem Structure (side-by-side structural comparison)
- `caf-` → Caffeine Intake Calculator (24 h)
- `thc-` → THC Intake Calculator (24 h)
- `alc-` → Alcohol Intake Calculator (24 h)
- `acb-` → Anticholinergic Burden (ACB + ARS scales)
- `dv-` → DV / IPV Assessment (HITS screen + evidence-based lethality/danger review)
- `ba-` → Behavioral Activation for Depression (flagship therapy-course module)
- `ex-` → Exposure-Based CBT for Anxiety / ERP for OCD (course module 4)
- `aba-` → ABA & Naturalistic Approaches for Autism Spectrum Disorder (course module 2)
- `cbp-` → CBT for Psychosis (CBTp) & related approaches for schizophrenia (course module 6)
- `fnd-` → Foundational Principles of Behavioral & Cognitive-Behavioral Therapy (course module 1)
- `ang-` → CBT for Anger Management & Parent Management Training (course module 5)
- `int-` → Integration, Advanced Topics & Implementation (course module 7)
- `mct-` → Marriage & Couples Therapy (course module 10)
- `sa-` → OTC / Non-Prescription Sleep Aid Comparison
- `fw-` → Fatigue / Low Energy Workup (tiered symptom → labs + differential)
- `nw-` → Newsroom (home-page front page, `/news/` archive and article pages)

### Copy-to-Clipboard Pattern
Never use `alert()`. Always use `ToolUtils.copyWithButton()` for new tools:
```javascript
ToolUtils.copyWithButton(text, btn);  // shows "Copied!" for 2s
```

### Report Summaries
- No "Generated by PsychoPharmRef" attribution in any copy-to-clipboard report
- Include date stamp
- Plain text format for easy pasting into EMR

### Blog Posts
- Located in `blog/` directory as standalone `.html` files
- **Sidebar is shared**: all blog posts load `blog/sidebar.html` dynamically via `fetch()`
- When adding a new sidebar nav item, update **only `blog/sidebar.html`** (and `index.html` for the main site)
- Blog sidebar link format: `<li><a href="../index.html#section-id" class="nav-link nav-sub-link">Label</a></li>`
- Blog links within sidebar: `<li><a href="filename.html" class="nav-link nav-sub-link">Title</a></li>`

### Adding a New Blog Post — REQUIRED checklist
Every new chapter must touch all six places below, or it will be invisible somewhere on the site (sidebar missing, deploy missing, or search bar can't find it). This is the canonical sequence:

1. **Create the standalone post** at `blog/<slug>.html` using an existing chapter (e.g., `blog/healthcare-legislation.html`) as the structural template — same `<head>`, action bar, `<header class="ba-header">`, `<div class="ba-body">`, related links, footer, and bottom scripts.
2. **Update `blog/sidebar.html`** — add the new entry under the appropriate divider. This sidebar is shared across all chapters; one edit updates them all.
3. **Update root `index.html`** — add the same entry to the in-page sidebar (use `/blog/<slug>/` URL form, not `.html`). Bump the article-count number in the three places it appears (`section-sub`, `Browse All N Articles`, and the `All Posts (N articles)` button).
4. **(No mirror step.)** Root `index.html` is a symlink to `hugo-site/static/index.html`, so step 3 already edited the deployed file.
5. **Add the Hugo content file** at `hugo-site/content/blog/<slug>.html`. Format: YAML front matter (`title`, `date`, `description`, `category`, `subtitle`, `readTime`, `clinicalSummary`, `related`, `draft: false`) between `---` delimiters, followed by the body content (everything inside `<div class="ba-body">` from step 1, without the wrapper). Title must NOT include `| PsychoPharmRef` here. Match the style of `hugo-site/content/blog/healthcare-legislation.html`.
6. **Update Hugo template sidebar** at `hugo-site/layouts/partials/sidebar.html` — same divider/entry as step 2, but using `{{ "/blog/<slug>" | relURL }}` for the href.
7. **Rebuild the search index** — `python3 build-blog-index.py` (writes `js/blog-index.json`, which is the deployed file via the `js` symlink). Then `python3 sync-lastmod.py` to date the new page. Skipping this step is the single most common cause of "the search bar can't find my new post." The script auto-extracts title, description, top 80 keywords, and a snippet from the new HTML.
8. **Validate HTML** — run the Python HTMLParser tag checker on the new file before committing.
9. **Commit everything in one commit**, then push:
   ```bash
   git add blog/<slug>.html blog/sidebar.html \
           hugo-site/static/index.html hugo-site/static/js/blog-index.json \
           hugo-site/layouts/partials/sidebar.html \
           hugo-site/content/blog/<slug>.html
   git -c user.name="Jerad Shoemaker" -c user.email="jshoemakerhwc@gmail.com" commit -m "Add <Title> chapter"
   git push
   ```

Do NOT run `migrate-blogs.py` — it produces `.md` files that duplicate the `.html` content files Hugo actually deploys, and they clutter the working tree.

### Adding a Slide Overview to a chapter
Each chapter can show a NotebookLM-generated slide deck inline at the top of the page (collapsible image carousel + "Download PDF" button). The block is generic in the markup — it self-hides if no manifest exists for the slug, so a chapter can ship the snippet before the deck is ready.

Workflow per chapter (uses `pdftoppm` from poppler-utils — `brew install poppler` on macOS):

1. **Generate** the slide deck in NotebookLM, then **Download PDF Document (.pdf)** from the deck's three-dot menu.
2. **Drop the PDF** at `blog/slides/<slug>.pdf` (where `<slug>` matches the chapter filename, e.g. `schizophrenia.pdf` for `blog/schizophrenia.html`). Note: `blog/slides/` is a symlink to `hugo-site/static/blog/slides/` — there is only one physical copy of each slide asset, so dropping a PDF at `blog/slides/<slug>.pdf` actually writes it under `hugo-site/static/blog/slides/<slug>.pdf`. This is intentional; it halves repo size and eliminates the prior mirror step.
3. **Run** `python3 build-slides.py <slug>`. This produces, all under `hugo-site/static/blog/slides/<slug>/`:
   - `page-001.png` … `page-NNN.png` (web-sized, 1100–1400px wide)
   - `manifest.json` (read at runtime by `blog/slides.js`)
   - The paste-in HTML snippet, printed to stdout
   The same files are reachable from `blog/slides/<slug>/` via the symlink, so root-served local previews continue to resolve `/blog/slides/...` paths.
4. **For static blog posts (`blog/<slug>.html`)** only: paste the printed snippet between `</header>` and `<div class="ba-body">`, and add `<link rel="stylesheet" href="slides.css">` near the other stylesheets and `<script src="slides.js" defer></script>` somewhere near the snippet. The Hugo template (`hugo-site/layouts/blog/single.html`) already renders the slide block + loads `css/slides.css` and `js/slides.js` for every post, so no Hugo edits are needed.
5. **Rebuild** when content changes: re-run `python3 build-slides.py <slug> --force` after replacing the PDF; the manifest's mtime check prevents unnecessary rebuilds otherwise.
6. **Commit** the new PDF, the generated images directory, the manifest, and the (possibly modified) static HTML. There is no separate Hugo mirror to commit any more — outputs already live under `hugo-site/static/`.

To rebuild every chapter at once: `python3 build-slides.py --all`.

**Push size warning:** the home/office Wi-Fi on this Mac drops sustained pushes >~90 MiB; cellular tether is reliable. If a single commit's pack exceeds that ceiling, split it into multiple commits and push them one at a time, or push from a hotspot.

The 16 medical-student chapters (see `blog/recommended-chapters-medical-students.html`) are the priority targets: `learning-tools-medical-students`, `psychiatric-interview`, `major-depressive-disorder`, `bipolar-disorder`, `schizophrenia`, `antidepressant-review`, `antipsychotic-review`, `suicide-risk-assessments`, `serotonin-syndrome-nms`, `delirium`, `alcohol-use-disorder`, `panic-attacks-gad`, `capacity-evaluation`, `ptsd-cptsd`, `adult-adhd`, `emergency-psychiatry`.

### Newsroom (home-page front page)
The home page opens with a news-style front page ("Today in Psychopharmacology") rendered by `js/newsroom.js` from `/news/index.json`, which Hugo builds (`layouts/news/list.json`) from:
- `hugo-site/content/news/<slug>.html`: one file per piece. Front matter includes `date` (= publish day), `desk`, `dek`, `cover`, `sources`, `related`. Bylines come from the desk, not the file.
- `hugo-site/static/news/covers/<slug>.svg`: original 16:9 cover art. An optional `photo`/`photoAlt`/`photoCredit`/`photoCreditUrl`/`photoLicense` shows a free-licence photo instead (aim for a mix: historic/archival photos for history, profile, policy and FDA pieces; illustrations for mechanisms). Add photos only via `python3 scripts/fetch-news-photo.py --manifest` (rows in `scripts/news-photos.tsv`): it checks the licence, crops to 16:9, saves to `static/news/photos/` and writes the credit.
- `hugo-site/data/desks.yaml`: desks and their house pen names (disclosed on every page).
- `hugo-site/data/around_the_web.yaml`: pool of outside newsletters and podcasts. Six rotate onto the front page each week (Mon–Sun), plus a daily pick.

**Scheduling:** `buildFuture = true`, so pieces are built ahead of time and shown from their `date` in the reader's time zone. The front page shows the last 7 days (backfilled from the archive if fewer than 5), so one piece per day gives daily news and a full weekly turnover. Preview any day with `/?nwdate=YYYY-MM-DD`. Write a week's slate with the `newsroom-week` skill. News desks (FDA, policy) must be web-researched on the day of writing and cite primary sources.

### Sidebar Navigation (index.html)
- Psychopharmacology group includes: Drug Database, P450 Interactions, Receptor Binding, Receptor Glossary, PK Curves, Med Comparison
- Clinical Tools group includes: QT Risk Tool, Refill Calendar, Taper/Start, CDR Staging, ASD Severity, Suicide Risk, SLUMS Exam, PANSS, Catatonia (BFCRS), CIDI Bipolar Screen, PCL-5 (PTSD), YMRS (Mania), Y-BOCS (OCD), AIMS (Dyskinesia), DSM-5-TR SUD
- When adding a tool, also add to sidebar nav under the appropriate group

## Deployment Pipeline (CRITICAL)

The site deploys via **Netlify + Hugo** from the `hugo-site/` directory. Since October 2026 the root `index.html`, `js/`, `css/`, `fragments/`, `handouts/`, `privacy.html` and `legal-disclaimer.html` are **symlinks into `hugo-site/static/`**, so there is one copy of each file and nothing to mirror. Edit through either path; commit the `hugo-site/static/...` path.

Netlify config: because `base = "hugo-site"`, Netlify reads **`hugo-site/netlify.toml`** (build command, cache headers, security headers). Keep the root `netlify.toml` in step with it.

### Security headers (CSP)
`hugo-site/netlify.toml` sends a Content-Security-Policy and Permissions-Policy on every page. Any new third-party host must be added to the matching CSP directive or the browser will block it: scripts → `script-src`, fetch/XHR/websocket → `connect-src`, iframes → `frame-src`, form posts → `form-action`. Pin third-party scripts to an exact version and add `integrity="sha384-…" crossorigin="anonymous"`.

### Page dates and search titles
- `python3 sync-lastmod.py` sets each Hugo page's `lastmod:` to the date its body last changed in git. Chapters show it as "Updated …" and the sitemap uses it. Run it before committing content changes.
- Titles over ~60 characters get cut off in search results. A chapter with a long `title` gets a `seoTitle:` (≤ 60 chars) in front matter; the `<title>` tag uses it and the on-page heading keeps `title`.

### Search index rebuild (REQUIRED for new blog posts)
The unified search bar at the top of every page reads from `js/blog-index.json`. This file is **not** generated automatically — it must be rebuilt whenever a blog post is added or its title/content meaningfully changes. Symptom of forgetting this: the article works but typing its title into the search bar returns nothing.

```bash
python3 build-blog-index.py                              # writes js/blog-index.json (= hugo-site/static/js/blog-index.json)
```

The script reads every `blog/*.html`, strips tags, extracts the top 80 most-frequent meaningful words as keywords, and saves title/description/keywords/snippet for each post. It runs in seconds. Commit `hugo-site/static/js/blog-index.json`.

### Cache-bust version string (CRITICAL)
`index.html` loads JS/CSS with `?v=YYYYMMDDx` query strings. **Every time you edit `js/app.js` or `css/styles.css`, bump the corresponding version string** — otherwise browsers AND the Netlify CDN will keep serving the cached old file even though your push succeeded.

Find them with:
```bash
grep -n '?v=' index.html
```
(Root `index.html` is the same file as `hugo-site/static/index.html`.) Symptom of forgetting this: live HTML shows new tabs/markup but JS behavior is unchanged. Diagnose by `fetch('/js/app.js?v=<currentversion>')` in DevTools and confirming the file size/content matches the new code.

## Git Workflow
```bash
git -c user.name="Jerad Shoemaker" -c user.email="jshoemakerhwc@gmail.com" commit -m "message"
```

## Key Reminders
- Domain scoring in tools: each question maps to ONE primary domain to avoid double-counting
- Binary items in rating scales (e.g., BFCRS items 12, 17-21) are scored 0 or 3 only
- Validate HTML after every insertion using the Python HTMLParser tag checker
- Blog sidebar is shared (`blog/sidebar.html`) — edit once, not 80 files
- After ANY new blog post: run `python3 build-blog-index.py` (and `python3 sync-lastmod.py`). Skipping this is the #1 reason a new post "isn't searchable."
- Use Python scripts for batch modifications across blog files when needed
- Large tool sections (~1000+ lines) should be built via Agent tool, then inserted via Python
