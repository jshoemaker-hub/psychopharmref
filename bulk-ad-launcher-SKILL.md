---
name: bulk-ad-launcher
description: "Bulk Ad Campaign Launcher: Use this skill whenever the user wants to create, generate, or launch ad campaigns at scale across platforms like Facebook, Instagram, Google, or LinkedIn. Triggers include: mentions of 'Facebook ads', 'ad campaign', 'bulk ads', 'ad creatives', 'ad variations', 'GTM engineering', 'growth marketing', 'launch ads', 'ad generator', 'ad copy', 'ad creative generator', 'Facebook Ads API', or requests to produce multiple ad variations, test ad copy, or automate ad deployment. Also use when the user wants to research audience pain points for ad targeting, generate ad headlines/body copy in bulk, build dashboards to monitor ad performance, or deploy any kind of automated advertising pipeline. Even if the user just says 'help me run ads' or 'I need to market this', use this skill."
---

# Bulk Ad Campaign Launcher

## What This Skill Does

This skill turns one person + AI agents into an enterprise-scale advertising operation. It orchestrates a multi-agent pipeline that handles audience research, creative generation, copy variation, ad deployment via platform APIs, and live performance monitoring — replacing what traditionally requires an entire marketing team.

The core workflow: research your audience automatically, generate 100+ ad variations (copy + creatives), push them to ad platforms as drafts, and deploy a monitoring dashboard — all in under 30 minutes.

This approach is based on the "GTM engineering" methodology popularized by growth engineers like Cody Schneider, where AI agents handle the repetitive scaling work while the human provides strategic direction and final approval.

## When to Use This Skill

- User wants to launch ad campaigns on Facebook, Instagram, Google, LinkedIn, or other platforms
- User wants to generate bulk ad copy or creative variations
- User wants to automate audience research for ad targeting
- User wants to build an end-to-end ad pipeline (research → create → deploy → monitor)
- User mentions "GTM engineering" or wants to scale marketing output with AI

## Prerequisites the User Will Need

Before running this workflow, the user needs API access to the platforms they'll use. Walk them through gathering these credentials and storing them in a `.env` file:

| Credential | What It's For | Where to Get It |
|---|---|---|
| Platform Ad API token | Uploading ads (Facebook, Google, etc.) | Platform's developer portal |
| Ad Account ID | Targeting the right ad account | Platform's Ads Manager settings |
| Claude API key | Powering the agent pipeline | console.anthropic.com |
| Perplexity API key | Real-time audience research | perplexity.ai/settings |
| Deployment platform key (Railway, Vercel, etc.) | Hosting the monitoring dashboard | Provider's dashboard |

**Important**: Never commit `.env` files to git. Add `.env` to `.gitignore` immediately.

If the user doesn't have all of these, that's fine — the skill works in stages, and many stages (research, copy generation, creative rendering) don't require ad platform credentials. Meet the user where they are.

## The Pipeline: 7 Stages

Work through these stages in order. Each stage is an independent agent task that feeds into the next. If the user only wants part of the pipeline (e.g., "just generate ad copy"), jump to the relevant stage.

---

### Stage 1: Project Setup

Create a dedicated project folder with this structure:

```
ad-campaign/
├── .env                  # API keys (NEVER commit)
├── .gitignore            # Must include .env
├── research/             # Audience research outputs
│   └── insights.json
├── copy/                 # Generated ad copy variations
│   └── variations.json
├── creatives/            # Rendered ad images (PNG/JPG)
├── deployment/           # API upload scripts
├── dashboard/            # Monitoring dashboard app
└── reports/              # Performance reports
```

Generate a `.env.example` (with placeholder values, no real keys) so the user knows what's needed. Initialize git if they want version control.

---

### Stage 2: Audience Research (Agent Task)

**Goal**: Gather real, current language your target audience uses — their pain points, desired outcomes, and the exact words they say.

Use the Perplexity API (or web search if unavailable) to pull insights from:
- Reddit threads and comments (last 7-30 days)
- YouTube comments on relevant videos
- Forum discussions, review sites, social media

**Output format** — save to `research/insights.json`:

```json
{
  "audience": "description of target audience",
  "research_date": "2026-03-24",
  "sources": ["reddit.com/r/...", "youtube.com/..."],
  "pain_points": [
    {"point": "exact quote or paraphrase", "frequency": "high/medium/low", "source": "where found"}
  ],
  "desired_outcomes": [
    {"outcome": "what they want", "emotional_driver": "why they want it"}
  ],
  "language_patterns": [
    "exact phrases and slang the audience uses"
  ],
  "competitor_mentions": [
    {"name": "competitor", "sentiment": "positive/negative/mixed", "context": "what they said"}
  ]
}
```

This research replaces weeks of manual audience analysis. The key insight: use the audience's own language in ad copy — it feels native and resonates because it literally comes from them.

---

### Stage 3: Bulk Copy Generation (Agent Task)

**Goal**: Generate 50-100+ unique ad copy variations using the research insights.

Take the `insights.json` from Stage 2 and generate variations across these dimensions:

**Tone mix** (diversify intentionally):
- 40% benefit-driven ("Get X without Y")
- 30% pain-point-focused ("Tired of X?")
- 20% social proof ("Join 10,000+ who...")
- 10% curiosity/pattern-interrupt ("The X your Y isn't telling you")

**For each variation, generate**:
- `headline`: max 40 characters
- `primary_text`: max 125 characters
- `description`: max 30 characters
- `cta`: call-to-action text
- `tone`: which category it falls in
- `target_pain_point`: which insight it addresses

**Output format** — save to `copy/variations.json`:

```json
{
  "campaign_name": "descriptive name",
  "generated_date": "2026-03-24",
  "total_variations": 100,
  "variations": [
    {
      "id": 1,
      "headline": "Sleep Through the Night Again",
      "primary_text": "3 evidence-based techniques that helped 10,000+ patients reclaim restful sleep",
      "description": "Free guide inside",
      "cta": "Learn More",
      "tone": "benefit-driven",
      "target_pain_point": "insomnia and sleep disruption"
    }
  ]
}
```

**Quality check**: After generating, review the batch for:
- No duplicates or near-duplicates
- Character limits respected
- Good diversity across tone categories
- Compliance with platform ad policies (no misleading claims, required disclaimers for regulated industries like healthcare)

---

### Stage 4: Creative Generation (Agent Task)

**Goal**: Turn ad copy into visual ad creatives ready for upload.

**Approach A — React + HTML-to-Canvas** (recommended for scale):

Build a React component library that renders ad previews in multiple layouts:
1. Single image with text overlay
2. Carousel card
3. Story/Reels format (9:16)
4. Square post (1:1)
5. Landscape (16:9)

The component takes JSON input (headline, body, CTA, colors, image prompt) and renders pixel-perfect ad previews. Use `html-to-canvas` or similar to export as PNG.

**Approach B — AI image generation**:

If the user has access to image generation APIs (DALL-E, Midjourney, etc.), generate custom images for each variation. This costs more but produces unique visuals.

**Approach C — Template-based**:

For users who just need copy variations on a consistent brand template, create a simple HTML template with CSS variables for colors/fonts, and batch-render variations.

Save all creatives to `creatives/` with filenames matching the variation IDs (e.g., `ad-001.png`).

---

### Stage 5: Platform Deployment (Agent Task)

**Goal**: Push all variations to the ad platform as drafts for human review.

This stage is platform-specific. Support these platforms (use whichever the user specifies):

**Facebook/Instagram (Meta Ads API)**:
1. Authenticate using the access token from `.env`
2. Create a campaign (or use an existing campaign ID)
3. Create ad sets with the user's targeting specs
4. Upload creatives and copy as draft ads
5. Enable Dynamic Creative Optimization (DCO) so Meta tests combinations automatically

**Google Ads API**:
1. Authenticate via OAuth
2. Create responsive search ads or display ads
3. Upload as paused/draft

**LinkedIn Ads API**:
1. Authenticate via OAuth
2. Create sponsored content variations
3. Upload as draft

**Critical**: Always deploy as DRAFTS. The human reviews and publishes manually. Never auto-publish without explicit user confirmation.

Save a deployment log to `deployment/log.json` with ad IDs, platform references, and status.

---

### Stage 6: Monitoring Dashboard (Agent Task)

**Goal**: Build a live dashboard that tracks ad performance and auto-flags winners and losers.

Build a simple Next.js (or plain HTML + JS) dashboard that:
- Pulls live data from the platform's reporting API
- Displays key metrics: CTR, CPA, ROAS, impressions, conversions
- Auto-flags top performers (green) and underperformers (red) based on thresholds
- Refreshes on a configurable interval

Deploy to Railway, Vercel, or Netlify for 24/7 access.

If the user doesn't need a deployed dashboard, a local HTML file with a "refresh" button that pulls current data is perfectly fine.

---

### Stage 7: Orchestration & Iteration

**Goal**: Run the full pipeline end-to-end and set up for ongoing use.

For the first run:
1. Start with 10-20 ads to validate the pipeline works
2. Review drafts, publish the best ones
3. Let them run for 24-48 hours
4. Pull performance data
5. Use winners to inform the next batch (feed winning copy patterns back into Stage 3)

For ongoing use:
- Re-run Stage 2 weekly to catch shifting audience sentiment
- Generate fresh batches monthly or when launching new offers
- The dashboard from Stage 6 runs continuously

---

## Platform Ad Policy Compliance

This is important and easy to overlook in the excitement of bulk generation. Every ad must comply with the target platform's policies:

- **Healthcare/pharma**: Disclaimers required, no guaranteed outcomes, no before/after that implies guaranteed results
- **Financial services**: Required disclosures vary by jurisdiction
- **General**: No misleading claims, no deceptive imagery, landing pages must match ad promises

Build a compliance review step into Stage 3 — have the agent flag any copy that might violate policies and suggest compliant alternatives.

## Scaling Tips

- **Cost**: API calls for 100 ad variations cost roughly $0.01-$0.10. The creatives are the expensive part if using AI image generation.
- **Domain expertise multiplier**: The better your initial brief (industry vocabulary, past winners, brand voice examples), the higher quality the output. Feed the agent your best-performing past ads as examples.
- **Start small**: First campaign = 10 ads. Validate, then scale to 100+.
- **Measure time saved**: Track not just ad performance but hours saved vs. doing this manually. This is the core ROI argument for the approach.

## Toolkit Reference

These are tools that work well with this pipeline. Not all are required — use what the user has access to:

| Category | Tools |
|---|---|
| AI/Agents | Claude API, Perplexity API, OpenAI |
| Research | Perplexity, Apollo API, PhantomBuster |
| Creative | React + html-to-canvas, AI image generators |
| Deployment | Facebook/Google/LinkedIn Ads APIs |
| Hosting | Railway, Vercel, Netlify |
| Analytics | Platform APIs + GA4 |
| Email verification | Million Verifier (if doing email outreach too) |
