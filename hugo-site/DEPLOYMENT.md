# Deployment Guide — PsychoPharmRef Hugo Site

This guide explains how to deploy the Hugo site to Netlify (recommended) or other hosting platforms.

## Quick Deploy to Netlify (Recommended)

### Prerequisites

- GitHub, GitLab, or Bitbucket account with the repository
- Netlify account (free tier available at https://app.netlify.com)

### Steps

1. **Push to Git:**
   ```bash
   cd /path/to/psychopharm/hugo-site
   git init
   git add .
   git commit -m "Initial Hugo site commit"
   git remote add origin https://github.com/your-username/repo-name.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider (GitHub, GitLab, Bitbucket)
   - Authorize Netlify to access your repositories
   - Select the repository

3. **Configure Build Settings:**
   - Netlify auto-detects `netlify.toml`
   - Verify settings match:
     - **Build command:** `hugo --minify`
     - **Publish directory:** `public`
     - **Hugo version:** `0.145.0` (or higher)

4. **Deploy:**
   - Click "Deploy site"
   - Netlify builds and deploys automatically
   - You receive a temporary Netlify URL (e.g., `https://xyz123.netlify.app`)

5. **Connect Custom Domain (Optional):**
   - In Netlify dashboard, go to "Domain settings"
   - Click "Add custom domain"
   - Follow DNS setup instructions

### What Happens on Each Push

Once deployed to Netlify:

1. You push to your Git repository
2. Netlify automatically detects the push
3. Netlify runs `hugo --minify` (defined in `netlify.toml`)
4. Output (`public/` directory) is deployed live
5. HTTPS certificate auto-renewed
6. Build logs available in Netlify dashboard

### Setting Build Environment Variables

To add environment variables (e.g., for future integrations):

1. In Netlify dashboard, go to **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add key-value pairs
4. Netlify re-deploys automatically

Example (not currently needed):
```
HUGO_VERSION = 0.145.0
HUGO_ENV = production
```

---

## Manual Deployment

### Deploy to Your Own Server

#### Using Git (Recommended)

1. **On your server, set up a Git hook:**
   ```bash
   mkdir -p /var/www/psychopharmref.com
   cd /var/www/psychopharmref.com
   git init --bare psychopharmref.git
   ```

2. **Create post-receive hook:**
   ```bash
   cat > psychopharmref.git/hooks/post-receive << 'EOF'
   #!/bin/bash
   WORK_TREE=/var/www/psychopharmref.com/site
   export GIT_WORK_TREE=$WORK_TREE
   git checkout -f
   cd $WORK_TREE
   hugo --minify
   # Copy public to web root
   rsync -av public/ /var/www/html/
   EOF

   chmod +x psychopharmref.git/hooks/post-receive
   ```

3. **On your local machine:**
   ```bash
   git remote add production user@your-server:/var/www/psychopharmref.com/psychopharmref.git
   git push production main
   ```

#### Using FTP/SFTP

1. **Build locally:**
   ```bash
   hugo --minify
   ```

2. **Upload `public/` directory:**
   - Use FileZilla, WinSCP, or `sftp` command-line
   - Upload to your web root (usually `/public_html/` or `/var/www/html/`)

3. **Verify:**
   - Visit your domain
   - Check that all assets load correctly

### Deploy to GitHub Pages

1. **Enable GitHub Pages in repository settings:**
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose branch: `main` (or create `gh-pages` branch)
   - Select folder: `/(root)` or `/docs` depending on configuration

2. **Configure Hugo output:**
   ```bash
   hugo --minify -d docs
   git add docs/
   git commit -m "Deploy: build for GitHub Pages"
   git push
   ```

3. **Visit your site:**
   - GitHub Pages URL: `https://username.github.io/repo-name/`
   - Custom domain: Configure DNS CNAME or A records

### Deploy to Vercel

1. **Visit https://vercel.com and sign up**

2. **Import your Git repository:**
   - Click "New Project"
   - Select your Git repository
   - Vercel auto-detects Hugo

3. **Configure build settings:**
   - **Build Command:** `hugo --minify`
   - **Output Directory:** `public`

4. **Deploy:**
   - Click "Deploy"
   - Vercel deploys your site automatically

### Deploy to Render

1. **Visit https://render.com and sign up**

2. **Create new Static Site:**
   - Click "New +" → "Static Site"
   - Connect Git repository
   - Set **Build Command:** `hugo --minify`
   - Set **Publish Directory:** `public`

3. **Deploy:**
   - Click "Create Static Site"
   - Render deploys automatically

---

## Pre-Deployment Checklist

Before going live, verify:

- [ ] All blog posts have `draft: false`
- [ ] Links are working (test locally: `hugo server`)
- [ ] Images load correctly
- [ ] Mobile responsive design (test on phone)
- [ ] Sidebar navigation is up-to-date
- [ ] Google Analytics ID is configured (if applicable)
- [ ] Open Graph meta tags are correct
- [ ] Favicon and social image are present in `static/`
- [ ] No broken internal links
- [ ] SEO metadata (title, description) looks good
- [ ] Build completes without errors: `hugo --minify`

### Run Final Tests

```bash
# Build production site
hugo --minify

# Check for broken links (requires brew install linkchecker)
linkchecker public/

# Validate HTML (requires npm install -g html-validate)
html-validate public/**/*.html

# Preview production build locally
hugo server -s public
```

---

## Post-Deployment

### Monitor Your Site

**Netlify Analytics:**
1. Dashboard shows deployment history and build logs
2. Auto-scaling and CDN included
3. Performance metrics available

**GitHub Pages:**
- Visit repository Settings → Pages to see deployment status
- Build logs available in Actions tab

**Custom Server:**
- Monitor server resources (disk, memory, CPU)
- Check web server logs for errors
- Set up automated backups

### Set Up SSL/HTTPS

**Netlify:**
- SSL/TLS certificate auto-generated and auto-renewed ✓

**GitHub Pages:**
- Automatically included ✓

**Custom Server:**
- Use Let's Encrypt with Certbot:
  ```bash
  sudo apt-get install certbot python3-certbot-nginx
  sudo certbot certonly --nginx -d example.com
  ```
- Configure renewal cron job

**Other Platforms:**
- Vercel: Auto ✓
- Render: Auto ✓

### Set Up DNS

**For custom domain:**

1. **Get nameservers from your host** (Netlify, Vercel, etc.)

2. **Update DNS at your registrar** (GoDaddy, Namecheap, etc.):
   - Point domain to provider's nameservers
   - Or create CNAME/A records pointing to provider

3. **Verify:**
   ```bash
   nslookup example.com
   dig example.com
   ```

### Configure Email (Optional)

**If using domain for email:**

1. Add MX records to DNS
2. Configure mail server or use email forwarding service
3. Test with: `dig MX example.com`

---

## Continuous Deployment Workflow

### Recommended Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-blog-post

# Make changes
# (create new blog post, update templates, etc.)

# Test locally
hugo server -D

# Commit changes
git add .
git commit -m "Add: New blog post about X"

# Push to feature branch
git push origin feature/new-blog-post

# Create Pull Request on GitHub
# (review changes)

# Merge to main
git merge feature/new-blog-post

# Automatic deployment to production!
git push origin main
```

### Automatic Deployments

- **Netlify:** Every push to main branch → automatic deploy
- **GitHub Pages:** Every push to configured branch → automatic deploy
- **Vercel:** Every push to main → automatic deploy
- **Custom Server:** Configure post-receive hook (see above)

---

## Rollback & Recovery

### If Something Goes Wrong

**Netlify:**
1. Dashboard → Deploys
2. Find the last successful deploy
3. Click "Publish deploy" to rollback

**GitHub Pages:**
1. Repository → Actions
2. Find the last successful build
3. Rerun workflow to redeploy

**Custom Server with Git:**
```bash
# Revert last commit
git revert HEAD
git push

# Or reset to specific commit
git reset --hard abc123def
git push --force
```

---

## Performance Optimization

### Netlify Edge Functions (Optional)

Add smart caching and redirects:

```toml
# netlify.toml
[[edge_functions]]
path = "/*"
function = "cache-handler"
```

### Enable HTTP/2 Push

Netlify handles this automatically.

### Monitor Performance

- **Netlify Analytics Dashboard**
- **Google PageSpeed Insights:** https://pagespeed.web.dev
- **WebPageTest:** https://www.webpagetest.org

### Improve Build Speed

1. **Reduce content:** Remove unnecessary posts (archived ones)
2. **Optimize images:** Pre-compress with ImageOptim
3. **Clean resources:** Run `hugo mod clean` periodically

---

## Troubleshooting Deployment

### Build Fails: "hugo: command not found"

**Solution (Netlify):**
1. Dashboard → Site settings → Build & deploy → Build environment
2. Ensure `HUGO_VERSION` is set (e.g., `0.145.0`)

### Build Fails: "TOML syntax error"

**Solution:**
- Validate `hugo.toml` syntax
- Use TOML validator: https://www.toml-lint.com
- Check for special characters that need escaping

### Build Fails: "post YYYY-MM-DD not found"

**Solution:**
- Check `hugo.toml` `baseURL` is correct
- Verify post front matter YAML syntax
- Ensure date format is `YYYY-MM-DD`

### Site Shows Old Version After Deploy

**Solution:**
1. Hard refresh browser: Ctrl+Shift+R (or Cmd+Shift+R)
2. Clear browser cache
3. Wait up to 24 hours for CDN cache to clear

### 404 Errors on Static Assets

**Solution:**
1. Verify `baseURL` in `hugo.toml` is correct
2. Check that `static/` files were deployed
3. Verify file permissions on server

---

## Security Best Practices

1. **Keep Hugo Updated:**
   ```bash
   brew upgrade hugo  # macOS
   ```

2. **Use Environment Variables:**
   - Never commit API keys or secrets
   - Store in platform environment variables

3. **Enable HTTPS:**
   - Redirects all HTTP to HTTPS
   - Use security headers (configured in `netlify.toml`)

4. **Regular Backups:**
   - Backup Git repository
   - Backup content/blog/ directory

5. **Monitor Dependencies:**
   - Keep themes and plugins updated
   - Review build logs for warnings

---

## Support & Help

- **Hugo Deployment:** https://gohugo.io/hosting-and-deployment/
- **Netlify Docs:** https://docs.netlify.com/
- **GitHub Pages:** https://pages.github.com/
- **Vercel Docs:** https://vercel.com/docs

---

## Quick Reference

| Task | Command |
|------|---------|
| Local dev server | `hugo server -D` |
| Build for production | `hugo --minify` |
| Create new post | `hugo new blog/slug.md` |
| Deploy to Netlify | Push to Git, auto-deploys |
| Rollback (Netlify) | Dashboard → Deploys → Publish deploy |
| View build logs | Netlify Dashboard or GitHub Actions |
| Test production build | `hugo --minify && hugo server -s public` |

---

## Next Steps

1. ✅ Choose hosting platform (Netlify recommended)
2. ✅ Push code to Git
3. ✅ Configure deployment
4. ✅ Run pre-deployment checklist
5. ✅ Deploy
6. ✅ Monitor and maintain

**Your site is now live!**
