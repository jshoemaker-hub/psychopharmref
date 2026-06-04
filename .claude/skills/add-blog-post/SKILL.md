# Add Blog Post

Creates a new standalone HTML blog post in the `blog/` directory.

## Steps

1. **Create the blog HTML file** in `blog/` with kebab-case filename (e.g., `topic-name.html`)
2. **Copy the full structure** from an existing blog post — each blog post is a complete standalone HTML page with:
   - Full `<head>` section with meta tags, fonts, and inline styles
   - Complete sidebar navigation (must match current index.html sidebar exactly)
   - Blog content area with article structure
   - Back-to-blog navigation link
3. **Add the blog card** to `index.html` in the blog-index section:
   - Find the correct topic section (or create a new one)
   - Add a `<a href="blog/filename.html" class="blog-post-card">` card with category, title, and excerpt
4. **Verify sidebar nav** in the new blog file matches all current nav items (including all clinical tools)

## Blog Post Template Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Post Title — PsychoPharmRef</title>
  <!-- full inline styles matching site theme -->
</head>
<body>
  <nav class="sidebar">
    <!-- Full sidebar nav matching index.html -->
  </nav>
  <main id="content">
    <section class="section active">
      <div class="section-header">
        <h2>Post Title</h2>
        <p>Subtitle/description</p>
      </div>
      <!-- Article content -->
      <div class="ba-footer">
        <button class="btn-primary" onclick="switchSection('blog-index')">← Back to Blog</button>
      </div>
    </section>
  </main>
</body>
</html>
```

## Blog Card Pattern (for index.html blog-index section)
```html
<a href="blog/filename.html" class="blog-post-card" style="text-decoration:none;color:inherit;">
  <div class="bpc-category">Category Name</div>
  <h3 class="bpc-title">Post Title</h3>
  <p class="bpc-excerpt">Brief description of the post content.</p>
</a>
```

## Important
- Blog posts are organized by topic sections in the blog-index
- Each blog file must have the complete sidebar nav — update all existing blog files when sidebar changes
- Use an existing blog post as a template to ensure consistent styling
