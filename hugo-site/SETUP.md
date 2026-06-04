# PsychoPharmRef Hugo Project — Setup Guide

This guide walks you through setting up and deploying the Hugo-powered PsychoPharmRef website.

## Quick Start (5 minutes)

### 1. Install Hugo

Choose your operating system:

**macOS:**
```bash
brew install hugo
```

**Windows:**
- Download the latest release from: https://github.com/gohugoio/hugo/releases
- Look for `hugo_X.X.X_Windows-64bit.zip`
- Extract to a folder and add to your PATH

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install hugo
```

**Linux (other distributions):**
Download from: https://github.com/gohugoio/hugo/releases

### 2. Navigate to the Hugo project

```bash
cd path/to/psychopharm/hugo-site
```

### 3. Start the development server

```bash
hugo server -D
```

Visit `http://localhost:1313` in your browser. The site will auto-reload when you make changes.

### 4. Build for production

```bash
hugo --minify
```

This generates the site in the `public/` directory, ready for deployment.

---

## Detailed Setup Instructions

### Prerequisites

- **Hugo**: v0.145.0 or higher (check with `hugo version`)
- **Git**: For version control and deployment
- **Text Editor**: VS Code, Sublime Text, or any Markdown editor
- **Browser**: Modern browser for local testing

### Directory Structure

```
hugo-site/
├── hugo.toml              # Site configuration
├── netlify.toml           # Netlify deployment config
├── archetypes/
│   └── blog.md            # Template for new posts
├── content/
│   └── blog/              # Blog post Markdown files
├── layouts/
│   ├── _default/
│   │   └── baseof.html    # Base template
│   ├── blog/
│   │   ├── single.html    # Individual post template
│   │   └── list.html      # Blog index template
│   └── partials/
│       ├── sidebar.html   # Navigation sidebar
│       └── scripts.html   # Common JavaScript
├── static/                # Static files (unchanged)
│   ├── css/
│   ├── js/
│   ├── index.html         # Main SPA
│   └── ref/
├── public/                # Generated site (after build)
├── README.md              # Overview
├── SETUP.md              # This file
├── migrate-blogs.py       # Blog migration script
└── migrate-blogs.sh       # Alternative bash script
```

---

## Working with Blog Posts

### Create a New Blog Post

Use the Hugo command to create a post with pre-filled front matter:

```bash
hugo new blog/my-new-post.md
```

This creates `content/blog/my-new-post.md` with the archetype template from `archetypes/blog.md`.

### Edit Front Matter

Each blog post starts with YAML front matter:

```markdown
---
title: "Article Title"
date: 2026-03-20
description: "Short summary for search results and blog index"
category: "Mood Disorders"
subtitle: "Optional longer heading"
readTime: "15 min read"
clinicalSummary: "Optional clinical summary that appears in a callout box"
related: ["post-slug-1", "post-slug-2"]
draft: false
---
```

**Field Descriptions:**
- `title`: Article headline (appears as `<h1>`)
- `date`: Publication date (YYYY-MM-DD format) — controls sort order
- `description`: Excerpt for SEO and blog index (aim for ~160 characters)
- `category`: Clinical category (e.g., "Mood Disorders", "Anxiety & Trauma")
- `subtitle`: Subheading that appears under the title
- `readTime`: Estimated read time (e.g., "18 min read")
- `clinicalSummary`: Optional summary that appears in a highlighted box
- `related`: Array of related post slugs (filenames without .md extension)
- `draft`: Set to `true` to hide the post (useful for work-in-progress)

### Write Content

Blog posts use **Markdown** with support for **raw HTML**:

```markdown
# Section Heading

This is a paragraph with **bold** and *italic* text.

## Subsection

- Bullet point 1
- Bullet point 2

> Block quote

[Link text](https://example.com)
```

**Complex Layouts (use raw HTML):**

Hugo's Goldmark renderer includes the `unsafe = true` setting in `hugo.toml`, allowing raw HTML for complex layouts:

```markdown
<div class="ba-insight-box">
  <div class="ba-insight-icon">💡</div>
  <div class="ba-insight-text">
    <div class="ba-insight-title">Clinical Insight</div>
    <p>Your content here</p>
  </div>
</div>
```

**Available CSS Classes** (from `static/css/blog.css`):

- `.ba-h2`, `.ba-h3` — Section headings with borders
- `.ba-stat-row`, `.ba-stat-card` — Stat cards (KPIs, numbers)
- `.ba-stat-card--good`, `.ba-stat-card--alert` — Stat variants
- `.ba-timeline`, `.ba-tl-item` — Timeline layout
- `.ba-insight-box` — Blue callout box (clinical insights)
- `.ba-insight-box--alert` — Red callout (warnings)
- `.ba-table-wrap`, `.ba-table` — Responsive tables
- `.ba-compare-row`, `.ba-compare-card` — Side-by-side comparison
- `.ba-related`, `.ba-related-grid` — Related post links
- `.ba-summary-box` — Key takeaways summary
- `.ba-warning-box` — Red warning box
- `.ba-lead` — Introductory paragraph with left border
- `.ba-bar-chart`, `.ba-bar-row` — Bar chart visualization
- `.ba-therapy-grid`, `.ba-pop-grid` — Multi-column card grids

### Publish a Blog Post

1. Set `draft: false` in front matter
2. Ensure the file is in `content/blog/`
3. Run `hugo server` to preview
4. Run `hugo --minify` to build for production
5. Push to Git and deploy to Netlify

---

## Migrating Existing Blog Posts

The project includes scripts to convert existing HTML blog posts to Hugo Markdown.

### Option 1: Use Python Script (Recommended)

```bash
python3 migrate-blogs.py --source ../blog --dest ./content/blog
```

**Arguments:**
- `--source`: Path to existing blog HTML files (default: `../blog`)
- `--dest`: Output directory for Markdown files (default: `./content/blog`)

**Output:**
- Converts HTML front matter to YAML front matter
- Extracts title, date, description, category from HTML
- Keeps body content as-is (HTML is supported in Markdown)
- Preserves styling classes for converted content

### Option 2: Use Bash Script

```bash
./migrate-blogs.sh ../blog
```

### Manual Migration

For individual posts or fine-tuned control:

1. Open the HTML file in a text editor
2. Extract metadata:
   - `<title>` → `title` (remove "- PsychoPharmRef" suffix)
   - `<meta name="description">` → `description`
   - `<span class="ba-category">` → `category`
   - `<p class="ba-subtitle">` → `subtitle`
   - Extract date from `<script type="application/ld+json">`
3. Extract body content from `<div class="ba-body">`
4. Create `content/blog/slug-name.md` with front matter + body
5. Copy styling (class names) as-is; they'll render correctly

---

## Customization

### Update Site Configuration

Edit `hugo.toml` to change:

```toml
baseURL = "https://example.com"          # Your domain
title = "Your Site Title"
[params]
  author = "Your Name"
  description = "Your description"
  ga4ID = "G-XXXXXXXXXX"                # Google Analytics ID
```

### Update Navigation Sidebar

Edit `layouts/partials/sidebar.html` to add/remove navigation links:

```html
<li class="nav-group" data-group="blog">
  <button class="nav-parent-btn">
    <span class="nav-icon">📝</span>
    <span class="nav-parent-label">Blog</span>
  </button>
  <ul class="nav-sub">
    <li><a href="{{ "/blog" | relURL }}" class="nav-link nav-sub-link">All Posts</a></li>
    <!-- Add new links here -->
  </ul>
</li>
```

### Add Custom CSS

Add custom styles to `static/css/blog.css`:

```css
/* Your custom styles */
.my-custom-class {
  color: var(--accent);
  font-weight: bold;
}
```

Or add inline `<style>` blocks to Markdown posts:

```html
<style>
  .my-post-class { color: red; }
</style>

<div class="my-post-class">Styled content</div>
```

### Modify Templates

Edit template files in `layouts/`:

- `layouts/_default/baseof.html` — Base template (all pages inherit)
- `layouts/blog/single.html` — Individual blog post
- `layouts/blog/list.html` — Blog index page
- `layouts/partials/sidebar.html` — Navigation sidebar
- `layouts/partials/scripts.html` — Common JavaScript

Changes take effect immediately when running `hugo server`.

---

## Local Development

### Development Server with Auto-Reload

```bash
hugo server -D
```

**Flags:**
- `-D` / `--buildDrafts` — Include draft posts
- `-w` / `--watch` — Watch for changes (enabled by default)
- `-F` / `--buildFuture` — Include posts with future dates
- `-p 8000` — Use custom port (default: 1313)
- `--disableFastRender` — Disable fast render (slower but safer)

### Build for Production

```bash
hugo --minify
```

This generates optimized HTML, CSS, and JS in `public/`.

### Clean Build

```bash
hugo --minify --cleanDestinationDir
```

Removes `public/` before rebuilding.

### Check for Issues

```bash
hugo --debug
```

Shows detailed information during build, useful for troubleshooting.

---

## Deployment

### Deploy to Netlify

1. Push the `hugo-site/` directory to GitHub (or GitLab/Bitbucket)

2. Connect to Netlify:
   - Visit https://app.netlify.com
   - Click "New site from Git"
   - Select your repository
   - Netlify auto-detects `netlify.toml` configuration

3. Netlify automatically:
   - Runs `hugo --minify` on each push
   - Deploys the `public/` directory
   - Sets up HTTPS
   - Handles caching headers

4. Your site goes live at a Netlify URL (can be customized)

### Deploy to Other Hosts

**Manual Deployment:**

```bash
hugo --minify
# Upload public/ directory to your server (FTP, rsync, etc.)
```

**GitHub Pages:**

```bash
hugo --minify -d docs
git add docs/
git commit -m "Deploy: build for GitHub Pages"
git push
```

Then enable "GitHub Pages" in repository settings.

**Vercel, Render, or Similar:**

These platforms support Hugo natively. Create a new project and point to your repository.

---

## Troubleshooting

### "command not found: hugo"

Hugo is not in your PATH.

**Solution:**
- Verify installation: `which hugo` or `hugo version`
- Reinstall Hugo following platform-specific instructions above
- On Windows, ensure Hugo executable is in a PATH directory

### Posts not appearing in blog index

**Solutions:**
- Check `draft: false` in front matter
- Ensure file is in `content/blog/` directory
- Run `hugo server -D` to include drafts
- Check browser cache (Ctrl+Shift+Delete)

### CSS/JS not loading in development

**Solutions:**
- Hard refresh browser (Ctrl+Shift+R)
- Clear Hugo cache: `rm -rf resources/`
- Restart `hugo server`
- Check that `static/css/` and `static/js/` files exist

### Build fails with "failed to render"

**Solutions:**
- Check Markdown syntax (mismatched backticks, unclosed tags)
- Check front matter YAML syntax (proper indentation, quotes)
- Run `hugo --debug` for detailed error messages
- Validate HTML in blog post templates

### Date format issues

**Solution:**
Dates must be in `YYYY-MM-DD` format in front matter:
```yaml
date: 2026-03-20  # Correct
date: 2026-3-20   # Wrong
date: Mar 20 2026 # Wrong
```

### Related posts not linking

**Solutions:**
- Check post slugs exactly match filenames (without `.md`)
- Use array format: `related: ["post-1", "post-2"]`
- Verify referenced posts exist and are not drafts

---

## Common Tasks

### Add a new sidebar nav link

Edit `layouts/partials/sidebar.html` and add a line in the appropriate `<ul class="nav-sub">`:

```html
<li><a href="{{ "/blog/new-post" | relURL }}" class="nav-link nav-sub-link">New Post Title</a></li>
```

### Change the site title or description

Edit `hugo.toml`:

```toml
title = "New Title"
[params]
  description = "New description"
```

### Hide a post (draft)

Set `draft: true` in the post's front matter. It won't appear in production builds unless using `hugo --buildDrafts`.

### Pin a post to the top

Control post order with the `date` field — newer dates appear first. To pin, set a future date or use Hugo's `weight` parameter (requires template modification).

### Add Google Analytics

Update `hugo.toml` with your GA4 ID:

```toml
[params]
  ga4ID = "G-XXXXXXXXXX"
```

The template automatically includes the GA tracking code.

### Test production build locally

```bash
hugo --minify
hugo server -s public
```

Visit `http://localhost:1313` to preview the production build.

---

## Performance Tips

1. **Optimize Images:** Use tools like ImageOptim or TinyPNG before adding images
2. **Minify Content:** `hugo --minify` is already configured
3. **Lazy Load:** Add `loading="lazy"` to image tags in Markdown
4. **Cache Static Assets:** Netlify caching is configured in `netlify.toml`
5. **Monitor Build Time:** Track slow templates with `hugo --debug`

---

## Resources

- **Hugo Documentation:** https://gohugo.io/documentation/
- **Goldmark Markdown:** https://github.com/yuin/goldmark
- **Netlify Docs:** https://docs.netlify.com/
- **Markdown Guide:** https://www.markdownguide.org/

---

## Support & Questions

For issues or questions:

1. Check the **Troubleshooting** section above
2. Review the **Hugo Documentation:** https://gohugo.io/documentation/
3. Open an issue in your repository

---

## Next Steps

1. ✅ Install Hugo
2. ✅ Run `hugo server -D` and verify the site loads
3. ✅ Create a test post with `hugo new blog/test-post.md`
4. ✅ Edit and preview in the browser
5. ✅ Migrate existing blog posts with `python3 migrate-blogs.py`
6. ✅ Customize templates and styles as needed
7. ✅ Deploy to Netlify or your preferred host

**Happy writing!**
