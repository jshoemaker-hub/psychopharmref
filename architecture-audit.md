# PsychoPharmRef Architecture Audit

**Date:** March 24, 2026
**Purpose:** Assess the structural health of the site before scaling with new features and ad-driven traffic.

---

## Overall Verdict

The site is well-built for its current scope. You've made several smart architectural decisions — lazy-loading tool JS/CSS, using CSS prefix namespacing to avoid conflicts, IIFE-wrapping tool scripts, and keeping data separate from logic. The foundations are solid enough to keep building on.

That said, there are a few areas that will become painful as you scale, and one that's already a maintenance burden. Here's the breakdown, ordered by impact.

---

## What's Working Well

**Lazy-loading tools** — Your `data-lazy-tool` pattern in `switchSection()` (app.js line 287) dynamically injects each tool's CSS and JS only when the user first navigates to it. This is a genuinely good architecture decision. It means your 17 tool files (5,483 lines of JS, 4,908 lines of CSS) don't slow down the initial page load at all.

**CSS prefix namespacing** — Every tool uses a unique prefix (`sl-` for SLUMS, `ps-` for PANSS, `bf-` for BFCRS, etc.) preventing style collisions across 18 independent tools. This is the right pattern for a single-page app with many independent UI modules.

**IIFE-wrapped tool scripts** — Each tool JS file wraps its logic in `(function(){ ... })()`, keeping variables out of the global scope. This avoids the name collision risks you'd expect from loading 18 independent scripts into one page.

**Data separation** — `data.js` (4,243 lines) is pure data with no logic, and `app.js` (2,682 lines) handles all rendering and interaction. Clean separation.

**SEO fundamentals** — Strong meta tags, Open Graph, structured JSON-LD data, canonical URLs, and Google Analytics are all in place on the main page. This matters a lot when you start running ads — the landing page signals are already good.

**Accessibility basics** — Skip link, ARIA labels on key landmarks, keyboard-navigable search results, and good color contrast.

---

## The Big Three Issues

### 1. Blog Sidebar Duplication (High Impact, High Effort)

**The problem:** You have 77 blog posts. Every single one contains an identical copy of the full sidebar navigation — roughly 280 lines of HTML per file. That's ~21,500 lines of duplicated markup. When you add a new blog post or tool to the nav, you have to update all 77 files.

**Why it matters now:** You're at 77 posts and growing. Every new post or nav change requires a batch edit across all files. The CLAUDE.md mentions using Python scripts for this, which works, but it's fragile — one missed file or bad regex and a post has a broken nav.

**What to do about it:** The simplest fix that doesn't require a full site rebuild: extract the sidebar into a standalone `blog/sidebar.html` fragment and use a tiny JS snippet to load it at runtime. Something like:

```html
<nav id="sidebar"></nav>
<script>
  fetch('sidebar.html').then(r => r.text()).then(html => {
    document.getElementById('sidebar').innerHTML = html;
  });
</script>
```

One file to maintain instead of 77. The trade-off is a brief flash before the nav loads, but you can minimize that with a placeholder or inline critical nav CSS.

The more robust long-term option is a static site generator (Hugo, 11ty, etc.) that builds each blog post from a template. But the JS include approach gets you 90% of the benefit with 10% of the effort.

### 2. Monolithic index.html (Medium Impact, Medium Effort)

**The problem:** `index.html` is 11,107 lines and 652 KB. It contains all 36 sections, 3 inline `<style>` blocks (~241 lines), and 3 inline `<script>` blocks — including a 367-line squarified treemap algorithm (line 642) and a 162-line unified search system (line 10943).

**Why it matters:** Large diffs make version control noisy. Finding things in the file requires knowing approximate line numbers. And while the lazy-loading pattern keeps tool JS/CSS out of the initial parse, the HTML for all 36 section shells is still parsed upfront.

**What to do about it:** Start with the easy wins — extract those inline scripts to external files:
- Treemap algorithm (lines 642-1008) → `js/treemap.js`
- P450 table logic (lines 1009-1087) → `js/p450.js`
- Contact form handler (lines 10843-10890) → `js/contact.js`
- Unified search (lines 10943-11104) → `js/search.js`

This won't change how the page works, but it'll make the HTML file ~700 lines shorter and much easier to navigate. Each extracted file gets its own version history in git too.

### 3. Tool Code Duplication (Low Impact Now, High Impact at Scale)

**The problem:** All 18 tool scripts independently implement the same patterns: clipboard copy with button feedback, form reset with confirmation, score display updates, and report generation. There's no shared utility library.

**Why it matters:** If you want to change how copy-to-clipboard works (say, adding a toast notification instead of button text change), you'd need to update it in 18 places. And every new tool you build starts by copy-pasting the same boilerplate.

**What to do about it:** Create a `js/tools/tool-utils.js` that exports shared functions:

```javascript
const ToolUtils = {
  copyToClipboard(text, btn) { /* shared implementation */ },
  confirmReset(formId, callback) { /* shared implementation */ },
  updateScoreDisplay(elementId, score, ranges) { /* shared implementation */ },
  generateDateStamp() { /* shared implementation */ }
};
```

Load it before any tool script. New tools call `ToolUtils.copyToClipboard()` instead of reimplementing it.

---

## Smaller Issues Worth Noting

**Render-blocking scripts** — `data.js` and `app.js` are loaded without `defer` or `async` (lines 10939-10940). Adding `defer` would let the browser parse HTML while downloading JS. Minor win since they're at the bottom of the file, but still worth doing.

**Blog posts lack structured data** — The main page has JSON-LD `WebApplication` schema, but blog posts don't have `BlogPosting` or `Article` schema. When you're driving ad traffic to blog posts, this structured data helps search engines understand and rank them. Each post should include author, datePublished, headline, and description in JSON-LD.

**Blog CSS is also duplicated** — Each blog post has ~400 lines of inline `<style>`. These should be consolidated into `blog/blog.css` (which already exists in the directory but may not be used by all posts).

**No service worker / PWA** — Not critical, but a service worker would let clinicians use the site offline — a meaningful feature for a clinical reference tool. Worth considering down the road.

**Chart.js CDN dependency** — You're loading Chart.js from jsdelivr. If the CDN goes down, your charts break. Consider self-hosting the file or adding a fallback.

---

## Site Statistics

| Metric | Value |
|---|---|
| Total HTML | 91,349 lines (11,107 index + 80,242 blogs) |
| Total JS | 12,408 lines (app.js + data.js + 18 tool files) |
| Total CSS | 8,822 lines (styles.css + 18 tool CSS files) |
| Blog posts | 77 |
| Clinical tools | 17 lazy-loaded + 2 inline (receptor binding, P450) |
| Medications in database | 91+ |
| External dependencies | 2 (Google Analytics, Chart.js) |
| Estimated initial page weight | ~700 KB (before any tool loads) |
| Duplicated nav HTML across blogs | ~21,500 lines |

---

## Recommended Priority Order

If you're looking to strengthen the bones before driving ad traffic, here's what I'd tackle in order:

1. **Extract blog sidebar to a shared file** — Biggest maintenance win. Do this before adding any more posts.
2. **Add JSON-LD BlogPosting schema to blog posts** — Directly helps the content you'll be advertising rank better.
3. **Extract inline scripts from index.html** — Makes the codebase cleaner and easier to work in.
4. **Create tool-utils.js** — Makes building new tools faster and more consistent.
5. **Add `defer` to data.js and app.js** — Quick performance win.
6. **Consolidate blog CSS into blog.css** — Removes another layer of duplication.

Items 1-3 are the ones I'd call foundational. The rest are improvements you can make as you go.
