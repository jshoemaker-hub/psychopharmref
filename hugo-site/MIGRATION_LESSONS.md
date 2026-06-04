# Hugo Migration: Lessons Learned & Bug Reference

This document captures every issue encountered during the migration of PsychoPharmRef from a monolithic HTML site to Hugo, along with the root cause and fix for each. Use this as a checklist for future migrations or when debugging rendering issues.

---

## 1. Hugo Config: Empty Theme String Causes Fatal Error

**Symptom:** `module "" not found in "themes"` — Hugo refuses to start.

**Root cause:** Setting `theme = ""` in `hugo.toml` makes Hugo look for a theme named empty string. Hugo treats any non-null value as a theme name to resolve.

**Fix:** Remove the `theme` line entirely from `hugo.toml`. When using project-level layouts (no external theme), simply omit the `theme` key.

```toml
# BAD
theme = ""

# GOOD — just don't include the line at all
```

---

## 2. Markdown (.md) Files Render Raw HTML as Code Blocks

**Symptom:** Blog posts show raw HTML tags as visible text. `<p class="ba-paragraph">` appears literally on the page instead of rendering as a paragraph. SVG diagrams, stat cards, and custom-styled divs all break.

**Root cause:** Two compounding issues:
1. Goldmark (Hugo's Markdown renderer) treats 4+ spaces of indentation as a code block. The migration script preserved the original HTML indentation (8-12 spaces), so the HTML was rendered as `<pre><code>` blocks.
2. Even with `unsafe = true`, Goldmark's Markdown parser mangles complex HTML that's mixed with Markdown syntax (`## headers` interleaved with `<div>` tags).

**Fix:** Use `.html` content files instead of `.md`. Hugo supports HTML content files natively — the content passes through unchanged without any Markdown processing. This is the correct approach when content contains complex HTML (SVGs, custom-styled divs, inline styles, tables).

```
# BAD — Markdown processing breaks complex HTML
content/blog/my-post.md

# GOOD — HTML passes through unchanged
content/blog/my-post.html
```

The front matter (YAML between `---` fences) works identically in both `.md` and `.html` content files.

---

## 3. SVG Icons in Templates Render at Full Size

**Symptom:** Print and Share button icons render as giant images (300x300px) instead of small inline icons (12x12px).

**Root cause:** Inline SVGs without explicit `width`/`height` attributes default to the SVG's `viewBox` dimensions or the container's full width. CSS rules like `.ba-act-btn svg { width: 12px }` may not load in time or may be overridden by other stylesheets.

**Fix:** Always add explicit `width`, `height`, AND inline `style` to SVGs in templates:

```html
<!-- BAD — relies on CSS that may not load -->
<svg viewBox="0 0 24 24"><path d="..."/></svg>

<!-- GOOD — explicit sizing guaranteed -->
<svg viewBox="0 0 24 24" width="12" height="12"
     style="width:12px;height:12px;fill:currentColor;flex-shrink:0">
  <path d="..."/>
</svg>
```

Also include the CSS in the base template's `<head>` as a `<style>` block (not just in blog.css) to guarantee it loads before the SVGs render.

---

## 4. CSS Not Applied to Template Elements

**Symptom:** Action bar buttons, share dropdowns, related posts grid render without styling even though CSS classes are correct.

**Root cause:** The CSS for template-generated elements (action bar, share menu, related posts) was only in the blog-specific `<style>` block inside `single.html`'s `{{ define "head" }}` block, which some Hugo versions don't inject into `baseof.html` correctly.

**Fix:** Put critical CSS for template elements directly in `baseof.html`'s `<head>` as an inline `<style>` block. This guarantees it loads for every page regardless of template inheritance behavior:

```html
<!-- In layouts/_default/baseof.html <head> -->
<link rel="stylesheet" href="{{ "css/styles.css" | absURL }}">
<link rel="stylesheet" href="{{ "css/blog.css" | absURL }}">
<style>
  /* Critical template element styles */
  .ba-action-bar { ... }
  .ba-act-btn { ... }
  .ba-share-menu { ... }
  .ba-related { ... }
</style>
```

---

## 5. Body Content Extraction Fails for Variant HTML Structures

**Symptom:** Some blog posts (Parkinson's, FTD, Grief, PTSD, etc.) have empty or severely truncated content after migration while others work fine.

**Root cause:** The migration script searched for `<div class="ba-body">` to extract the article body. But different blog posts used different wrapper elements:
- `<div class="ba-body">` (most posts)
- `<section class="ba-body">` (Alzheimer's, ASD, PTSD)
- `<main class="ba-body">` (Parkinson's, FBP, Grief, Suicide, TBI)
- No ba-body wrapper at all (FTD — uses `<p class="ba-body">`)

**Fix:** The migration script must handle ALL variants. Use a multi-pattern approach:

```python
# Try multiple patterns in order of specificity
patterns = [
    r'<div class="ba-body">(.*?)<!-- [Ee]nd ba-body -->',
    r'<(?:section|main) class="ba-body">(.*?)</(?:section|main)>',
    r'<div class="ba-body">(.*?)</div>\s*(?:<footer|<div class="nl)',
]
for pattern in patterns:
    match = re.search(pattern, html, re.DOTALL)
    if match:
        body = match.group(1)
        break
```

**Prevention:** Before running any migration, audit the source HTML for structural variants:
```bash
grep -h 'ba-body' blog/*.html | sort -u
```

---

## 6. Internal Links Still Use .html Extensions

**Symptom:** Clicking a link to another blog post from within a post returns 404. URL shows `/blog/slug.html` but Hugo serves at `/blog/slug/`.

**Root cause:** Three sources of `.html` links that all needed updating:
1. **SPA sidebar** (`static/index.html`): `href="blog/slug.html"` — 117 links
2. **Content body HTML**: relative links like `href="other-post.html"` — hundreds across 68 posts
3. **Hugo sidebar partial** (`layouts/partials/sidebar.html`): already used clean URLs (not an issue)

**Fix:** Must update ALL three sources:

```python
# 1. SPA index.html
content = re.sub(r'href="blog/([^"]+)\.html"', r'href="/blog/\1/"', content)

# 2. Content files — relative blog links
content = re.sub(r'href="([a-z][a-z0-9-]+)\.html"', r'href="/blog/\1/"', content)

# 3. Also fix ../index.html#section references
content = re.sub(r'href="../index\.html(#[^"]*)"', r'href="/\1"', content)
```

Also create Netlify `_redirects` for any external/bookmarked `.html` URLs:
```
/blog/opioid-use-disorder.html  /blog/opioid-use-disorder/  301
```

---

## 7. Data Field Deletion During Automated Edits

**Symptom:** The entire Drug Database tab broke — all medication names, classes, categories, and brand names disappeared. Every tool that used `m.name` showed `undefined`.

**Root cause:** An AI agent was asked to add a `tmax` field to each medication in `data.js`. Instead of inserting a new line, it **replaced** the existing fields (`name`, `brandName`, `class`, `category`, `activeEnantiomer`) with just `tmax`. This happened because the agent's edit script deleted lines between `id:` and `halfLife:` and inserted `tmax` in their place.

**Fix:** Restored `data.js` from git history, then properly inserted `tmax` after `halfLife` without removing any existing fields.

**Prevention:**
- Always `git diff` after automated edits to verify only intended changes were made
- Never let an automated script delete lines around an insertion point — only add
- For data files, validate field counts before and after:
```bash
# Before edit
node -e "...; console.log(Object.keys(MEDICATIONS[0]))"
# After edit — should have same keys plus new one
node -e "...; console.log(Object.keys(MEDICATIONS[0]))"
```

---

## 8. Inline Script Runs Before Data File Loads

**Symptom:** PK Curves tool shows empty graph. Console shows `MEDICATIONS is not defined`.

**Root cause:** The PK curves `<script>` block was inline in `index.html` at line ~830, but `data.js` (which defines `MEDICATIONS`) loads at line ~18500. The script executed before the data was available.

**Fix:** Defer initialization with polling:

```javascript
function tryInit() {
  if (typeof MEDICATIONS !== 'undefined') {
    init();
  } else {
    var iv = setInterval(function() {
      if (typeof MEDICATIONS !== 'undefined') {
        clearInterval(iv);
        init();
      }
    }, 150);
    setTimeout(function() { clearInterval(iv); }, 15000);
  }
}
tryInit();
```

**Prevention:** For SPA architectures where data files load at the end of `<body>`, any inline script that depends on that data must either:
- Use `defer` and load after data.js
- Poll for the global variable
- Use `DOMContentLoaded` event (only works if data.js is in `<head>`)

---

## 9. Category Value Mismatches Between Data and UI

**Symptom:** PK Curves category dropdown shows "Sleep Aid" but no medications appear when selected.

**Root cause:** The `MEDICATIONS` array uses `category: "Sleep"` but the dropdown `<option>` had `value="Sleep Aid"`. The color palette also used `"Sleep Aid"` as the key.

**Fix:** Audit the actual data values and match exactly:
```bash
node -e "... MEDICATIONS.forEach(m => cats[m.category]++); console.log(cats)"
# Output: { Sleep: 7, ... } — NOT "Sleep Aid"
```

**Prevention:** Generate dropdown options dynamically from the data rather than hardcoding:
```javascript
const categories = [...new Set(MEDICATIONS.map(m => m.category))].sort();
select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
```

---

## 10. Hugo Section Template Lookup Requires Fallback

**Symptom:** Blog posts return 404 even though content files and templates exist.

**Root cause:** Hugo's template lookup order for `content/blog/my-post.html` tries:
1. `layouts/blog/single.html` ✓
2. `layouts/_default/single.html` (fallback)

Some Hugo versions require the fallback to exist even when the section-specific template is present.

**Fix:** Always create both:
```bash
cp layouts/blog/single.html layouts/_default/single.html
```

---

## Migration Checklist

Use this checklist for any future static-site migration:

- [ ] Audit source HTML for structural variants (`grep -h 'class="body\|class="content\|class="main"' *.html | sort -u`)
- [ ] Test migration on 5 diverse posts before running on all
- [ ] Verify content file sizes match expectations (> 25% of original)
- [ ] Check that all internal links use the target platform's URL format
- [ ] Validate CSS loads for template-generated elements
- [ ] Test SVG rendering with explicit width/height attributes
- [ ] Run `git diff --stat` after every automated edit
- [ ] Verify data integrity after any data file modifications
- [ ] Test with 3+ browsers (Chrome, Firefox, Safari)
- [ ] Check mobile rendering
- [ ] Validate redirects for old URL patterns
