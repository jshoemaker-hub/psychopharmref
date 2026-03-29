# PsychoPharmRef — TODOs

## Design / UX (from design-review 2026-03-25)

- [ ] **P450 mobile layout**: table truncates at 375px — add min-width to drug name column, verify overflow-x wraps correctly
- [ ] **QT Risk Tool mobile**: medication card grid too dense at narrow viewport — reflow to 1 column below 480px

## Features

- [ ] Add more drugs to database (currently 91 medications)
- [ ] Blog search improvements


## Newsletter Pipeline

- [ ] **Deduplication across weeks**: Drug X approved 3 weeks ago stays in RSS feed and resurfaces in every weekly brief until the feed purges it. v2 fix: maintain `newsletter/briefs/seen.json` log of surfaced source URLs with first-seen date. During `--research`, flag any source URL in seen.json as "previously surfaced on {date}" in brief warnings[]. Human can still include it; the flag just makes the choice explicit.

- [ ] **Configurable Perplexity model**: Hardcode `sonar-pro` in lib/research.js for v1. v2: add `perplexityModel: 'sonar-pro'` field to config.js so model can be updated without touching code when Perplexity's lineup changes.
