# PsychoPharmRef Hugo — Quick Start Card

Copy & paste commands to get started quickly.

## Installation & Setup (One-Time)

```bash
# 1. Install Hugo (macOS)
brew install hugo

# 2. Navigate to project
cd path/to/psychopharm/hugo-site

# 3. Start development server
hugo server -D

# 4. Visit http://localhost:1313
```

## Development Workflow

```bash
# Start dev server with auto-reload
hugo server -D

# Create new blog post
hugo new blog/my-post-slug.md

# Edit post in your text editor
# Changes auto-reload in browser

# Build for production
hugo --minify

# Test production build locally
hugo server -s public
```

## Blog Post Front Matter Template

```yaml
---
title: "Article Title"
date: 2026-03-20
description: "Short summary (~160 chars) for search results"
category: "Mood Disorders"
subtitle: "Optional longer subheading"
readTime: "15 min read"
clinicalSummary: "Optional clinical summary in callout box"
related: ["post-slug-1", "post-slug-2"]
draft: false
---
```

## Write Content in Markdown

```markdown
## Heading 2

### Heading 3

This is a paragraph with **bold** and *italic*.

- Bullet points
- Like this

> Block quotes

[Link text](https://example.com)

### Use Raw HTML for Complex Layouts

<div class="ba-insight-box">
  <div class="ba-insight-icon">💡</div>
  <div class="ba-insight-text">
    <div class="ba-insight-title">Clinical Insight</div>
    <p>Content here</p>
  </div>
</div>
```

## Migration

```bash
# Convert all HTML blogs to Markdown
python3 migrate-blogs.py --source ../blog --dest ./content/blog

# Review generated files
ls content/blog/

# Edit any files that need manual tweaks
# Then rebuild
```

## Deployment

```bash
# Option 1: Git Push to Netlify (auto-deploys)
git add .
git commit -m "Update blog posts"
git push origin main

# Option 2: Manual Build
hugo --minify
# Upload public/ to your server

# Option 3: GitHub Pages
hugo --minify -d docs
git add docs/
git commit -m "Deploy"
git push
```

## Common Tasks

### Publish Draft Post
```yaml
draft: false  # In front matter
```

### Add Stat Cards
```html
<div class="ba-stat-row">
  <div class="ba-stat-card">
    <div class="ba-stat-num">2-4%</div>
    <div class="ba-stat-label">Prevalence</div>
  </div>
  <div class="ba-stat-card ba-stat-card--good">
    <div class="ba-stat-num">70-85%</div>
    <div class="ba-stat-label">Response Rate</div>
  </div>
</div>
```

### Add Timeline
```html
<div class="ba-timeline">
  <div class="ba-tl-item">
    <div class="ba-tl-time">Phase 1</div>
    <div class="ba-tl-text">Description here</div>
  </div>
</div>
```

### Add Clinical Warning
```html
<div class="ba-warning-box">
  <strong>Warning:</strong> Important safety information
</div>
```

### Add Related Posts Table
```html
<div class="ba-related">
  <h4>Related Articles</h4>
  <div class="ba-related-grid">
    <a href="/blog/post-1/" class="ba-related-link">Post Title 1</a>
    <a href="/blog/post-2/" class="ba-related-link">Post Title 2</a>
  </div>
</div>
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "hugo: command not found" | Install Hugo: `brew install hugo` |
| Posts not appearing | Set `draft: false` in front matter |
| CSS not updating | Hard refresh: Ctrl+Shift+R |
| Build errors | Run `hugo --debug` for details |
| Broken links | Check spelling of post slugs |

## File Locations

| Item | Location |
|------|----------|
| Blog posts | `content/blog/` |
| Site config | `hugo.toml` |
| Blog templates | `layouts/blog/` |
| Sidebar nav | `layouts/partials/sidebar.html` |
| CSS | `static/css/` |
| Static files | `static/` |
| Output | `public/` (after build) |

## Useful Links

- **Hugo Docs:** https://gohugo.io/
- **Markdown Guide:** https://www.markdownguide.org/
- **Netlify Docs:** https://docs.netlify.com/
- **Site Config:** Edit `hugo.toml`

## Full Guides

- **Setup Instructions:** See `SETUP.md`
- **Deployment:** See `DEPLOYMENT.md`
- **Project Overview:** See `README.md`

---

**Questions?** Check the docs above or run `hugo help`
