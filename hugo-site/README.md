# PsychoPharmRef Hugo Site

This is a Hugo-based static site generator for the PsychoPharmRef blog and reference platform.

## Project Structure

```
hugo-site/
├── hugo.toml           # Hugo configuration
├── netlify.toml        # Netlify deployment configuration
├── archetypes/
│   └── blog.md         # Default front matter for new blog posts
├── content/
│   └── blog/           # Blog post Markdown files
├── layouts/
│   ├── _default/
│   │   └── baseof.html # Base template (all pages inherit)
│   ├── blog/
│   │   ├── single.html # Single blog post template
│   │   └── list.html   # Blog index template
│   └── partials/
│       ├── sidebar.html    # Navigation sidebar
│       └── scripts.html    # Common JavaScript
├── static/             # Static assets (unchanged by Hugo)
│   ├── css/            # Stylesheets (styles.css, blog.css)
│   ├── js/             # JavaScript (app.js, data.js)
│   ├── index.html      # Main SPA (served as-is)
│   ├── favicon.svg
│   ├── favicon-32.png
│   ├── og-image.svg
│   ├── robots.txt
│   └── ref/            # Reference PDFs and literature
└── public/             # Generated output (created by `hugo`)
```

## Installation

1. Download and install Hugo (v0.145.0 or higher):
   - **macOS**: `brew install hugo`
   - **Windows**: Download from https://github.com/gohugoio/hugo/releases
   - **Linux**: `sudo apt-get install hugo` or download from releases

2. Clone or navigate to this project directory:
   ```bash
   cd hugo-site
   ```

## Development

### Start the local server
```bash
hugo server -D
```
This starts a development server at `http://localhost:1313` with live reloading.

**Flags:**
- `-D` or `--buildDrafts` - include draft posts
- `-w` or `--watch` - watch file changes (default: enabled)
- `-F` or `--buildFuture` - include posts with future dates

### Create a new blog post
```bash
hugo new blog/your-post-slug.md
```
This creates a new Markdown file with pre-filled front matter from the archetype.

Edit the file to add:
- `title`: Article title
- `description`: Short summary (appears in blog index)
- `category`: Clinical category (e.g., "Mood Disorders")
- `subtitle`: Longer subheading
- `readTime`: Estimated read time (e.g., "15 min read")
- `clinicalSummary`: Optional clinical summary box content
- `related`: List of related post slugs (e.g., `["post-1", "post-2"]`)
- `tags`: Optional tags for categorization

## Building

### Build for production
```bash
hugo --minify
```
This generates the static site in the `public/` directory with minified HTML, CSS, and JS.

### Clean build
```bash
hugo --minify --cleanDestinationDir
```
Removes the `public/` directory before rebuilding.

## Content Format

Blog posts are written in Markdown with raw HTML support for complex layouts:

```markdown
---
title: "ADHD Treatment Strategies"
date: 2026-03-20
description: "Comprehensive clinical overview of ADHD management"
category: "Neurodevelopmental"
subtitle: "From diagnosis to integrated treatment"
readTime: "18 min read"
clinicalSummary: "..."
related: ["neuroscience-foundations", "antidepressant-review"]
draft: false
---

# Main Content

Your Markdown content here. Hugo's Goldmark renderer supports:
- Standard Markdown syntax
- Raw HTML (enabled in hugo.toml)
- SVG diagrams and complex layouts

## Inline HTML Examples

<div class="ba-insight-box">
  <div class="ba-insight-icon">💡</div>
  <div class="ba-insight-text">
    <div class="ba-insight-title">Clinical Insight</div>
    <p>Content goes here</p>
  </div>
</div>
```

## Styling

### Blog-specific CSS Classes

Blog post templates use a consistent set of CSS classes (all prefixed with `ba-` for "blog article"):

- `.ba-h2`, `.ba-h3` - Section headings
- `.ba-stat-row`, `.ba-stat-card` - Stat cards
- `.ba-timeline`, `.ba-tl-item` - Timeline layouts
- `.ba-insight-box` - Clinical insight callouts
- `.ba-table`, `.ba-table-wrap` - Tables
- `.ba-compare-row`, `.ba-compare-card` - Comparison layouts
- `.ba-related`, `.ba-related-grid` - Related post sections
- `.ba-summary-box` - Summary/takeaway boxes
- `.ba-warning-box` - Warning callouts

Refer to `/static/css/blog.css` for complete documentation.

## Static Assets

The `static/` directory contains files served unchanged by Hugo:

- **css/styles.css** - Main site stylesheet (from parent project)
- **css/blog.css** - Blog-specific styles
- **js/app.js** - Main SPA app (from parent project)
- **js/data.js** - Medication data (from parent project)
- **index.html** - Main SPA (served as `/index.html`)
- **favicon.svg** - SVG favicon
- **favicon-32.png** - PNG favicon
- **og-image.svg** - Social media preview image
- **robots.txt** - SEO robots rules
- **ref/** - Reference PDFs and literature

## Deployment

### Deploy to Netlify

1. Push this directory to GitHub (or GitLab, Bitbucket)
2. Connect your repository to Netlify
3. Netlify automatically reads `netlify.toml` and runs:
   ```
   hugo --minify
   ```
4. The `public/` directory is deployed to production

### Manual Deployment

```bash
hugo --minify
# Upload the `public/` directory to your server
```

## Migration from Static HTML

To convert existing blog HTML files to Hugo Markdown:

1. Use the `migrate-blogs.sh` script (see next section)
2. Or manually:
   - Extract front matter from `<title>`, meta tags, and `<article>` element
   - Convert HTML content to Markdown (or keep as raw HTML)
   - Create `content/blog/{slug}.md`

## Common Tasks

### Add a new sidebar nav link

Edit `layouts/partials/sidebar.html`:
```html
<li><a href="{{ "/blog/new-post-slug" | relURL }}" class="nav-link nav-sub-link">New Post Label</a></li>
```

### Update Open Graph meta tags

Edit `layouts/_default/baseof.html` in the `<head>` section.

### Change the blog post layout

Edit `layouts/blog/single.html` to modify the template for all blog posts.

### Add custom CSS for a specific post

Add a `<style>` block in the post's Markdown:
```html
<style>
  /* Custom styles */
</style>
```

Or define a custom class and add it to `static/css/blog.css`.

## Troubleshooting

### Posts not appearing in blog index
- Ensure front matter has `draft: false` (or omit the `draft` key)
- Check that the file is in `content/blog/` directory
- Run `hugo server -D` to include drafts in development

### Images not loading
- Place images in `static/img/` and reference as `{{ "img/filename.png" | absURL }}`
- Or use relative paths from the Markdown file

### CSS/JS not updating
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Hugo automatically rebuilds on file changes when using `hugo server`

### Hugo command not found
- Ensure Hugo is installed and in your system PATH
- Try `which hugo` to verify installation
- Reinstall Hugo if needed

## Questions & Support

For Hugo documentation: https://gohugo.io/documentation/
