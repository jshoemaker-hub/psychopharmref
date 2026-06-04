# Update Sidebar Navigation

Updates the sidebar navigation across index.html and all 42+ blog HTML files.

## When to Use
- Adding a new clinical tool
- Adding a new section to the sidebar
- Renaming or reordering sidebar items

## Steps

1. **Update index.html sidebar** — find the nav group (Clinical Tools, Clinical Insights, etc.) and add/modify the link:
   ```html
   <li><a href="#" class="nav-link nav-sub-link" data-section="section-id">Label</a></li>
   ```

2. **Update all blog files** — blog files use relative paths:
   ```html
   <li><a href="../index.html#section-id" class="nav-link nav-sub-link">Label</a></li>
   ```

3. **Use Python batch script** for blog updates:
   ```python
   import glob, os
   blog_dir = 'blog'
   files = glob.glob(os.path.join(blog_dir, '*.html'))

   # Find a reliable marker (the nav item just before where the new one goes)
   marker = '<li><a href="../index.html#existing-tool" class="nav-link nav-sub-link">Existing</a></li>'
   new_link = '<li><a href="../index.html#new-tool" class="nav-link nav-sub-link">New Tool</a></li>'

   count = 0
   for fp in sorted(files):
       with open(fp, 'r') as f:
           content = f.read()
       if marker in content and new_link not in content:
           content = content.replace(marker, marker + '\n          ' + new_link)
           with open(fp, 'w') as f:
               f.write(content)
           count += 1
   print(f'Updated {count} blog files')
   ```

4. **Verify count** — should update exactly 42 files (or however many blog posts exist)

## Current Sidebar Structure (Clinical Tools)
1. QT Risk Tool
2. Refill Calendar
3. Med Comparison
4. Taper/Start
5. CDR Staging
6. ASD Severity
7. Suicide Risk
8. SLUMS Exam
9. PANSS
10. Catatonia (BFCRS)
11. CIDI Bipolar Screen
12. PCL-5 (PTSD)
13. YMRS (Mania)
14. Y-BOCS (OCD)

## Important
- Always use a reliable marker (the previous nav item) for insertion
- Check that `new_link not in content` to avoid duplicate insertions
- Verify the update count matches the expected number of blog files
