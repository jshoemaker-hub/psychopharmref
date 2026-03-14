# Add Clinical Tool

Adds a new clinical assessment tool section to the PsychoPharmRef SPA.

## Steps

1. **Choose a CSS prefix** — 2-3 letter abbreviation (check CLAUDE.md prefix registry to avoid conflicts)
2. **Build the tool section** as a standalone HTML file in the project root:
   - Section wrapper: `<section id="TOOLNAME-tool" class="section">`
   - Section header with `<div class="section-header">`, `<h2>`, and clinical description `<p>`
   - Warning box: `<div class="PREFIX-warning mt-warning">`
   - Inline `<style>` with ALL classes prefixed (e.g., `PREFIX-item`, `PREFIX-score`)
   - Form with scoring inputs (radio buttons for scales, checkboxes for presence/absence)
   - Real-time score display area
   - Generate Report button (copies to clipboard with "Copied!" feedback, NO alerts)
   - Reset button with `confirm()` dialog
   - Inline `<script>` wrapped in IIFE: `(function(){ ... })()`
   - Closing: `</section><!-- end TOOLNAME-tool -->`
3. **Validate HTML** with the Python tag checker before insertion
4. **Insert into index.html** using Python — find the correct insertion marker (typically after the last tool section)
5. **Add to sidebar nav** in index.html under Clinical Tools
6. **Update all blog files** — add nav link to all 42+ blog HTML files using Python batch script
7. **Update CLAUDE.md** — add the new CSS prefix to the registry
8. **Validate full index.html** with tag checker

## Report / Clipboard Pattern
```javascript
navigator.clipboard.writeText(report).then(() => {
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 2000);
});
```

No attribution lines in reports. Include date stamp. Plain text for EMR pasting.

## Blog Nav Link Pattern
```html
<li><a href="../index.html#TOOLNAME-tool" class="nav-link nav-sub-link">Tool Label</a></li>
```

## Python Batch Update Pattern
```python
import glob, os
marker = '<li><a href="../index.html#PREVIOUS-tool" ...>Previous</a></li>'
new_link = '<li><a href="../index.html#NEW-tool" ...>New Tool</a></li>'
for fp in sorted(glob.glob('blog/*.html')):
    with open(fp, 'r') as f: content = f.read()
    if marker in content and new_link not in content:
        content = content.replace(marker, marker + '\n          ' + new_link)
        with open(fp, 'w') as f: f.write(content)
```
