// lib/research.js — Source fetching handlers and dispatch table

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const briefsDir = path.join(__dirname, '..', 'briefs');

/**
 * fetchWithTimeout — fetch wrapper with AbortController timeout
 * @param {string} url
 * @param {object} options  — standard fetch options
 * @param {number} timeoutMs — default 15000
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * validateBrief — validates a brief object and returns a safe, fallback-corrected version.
 * Never throws to caller.
 * @param {object} brief
 * @returns {object} safe brief
 */
export function validateBrief(brief) {
  try {
    if (!brief || typeof brief !== 'object') {
      throw new Error('brief is not an object');
    }
    if (!brief.topic) {
      throw new Error('brief.topic is missing');
    }
    if (!Array.isArray(brief.sources)) {
      throw new Error('brief.sources is not an array');
    }
    // Return brief with defaults filled in. Preserve optional fallback metadata
    // (fallback, fallbackRung, fallbackDescription) used by the fallback-chain
    // wrappers added 2026-04-16.
    const out = {
      topic: brief.topic,
      sources: brief.sources,
      relevantBlogPosts: brief.relevantBlogPosts || [],
      warnings: brief.warnings || [],
    };
    if (brief.fallback !== undefined) out.fallback = brief.fallback;
    if (brief.fallbackRung !== undefined) out.fallbackRung = brief.fallbackRung;
    if (brief.fallbackDescription !== undefined) out.fallbackDescription = brief.fallbackDescription;
    return out;
  } catch (err) {
    return {
      topic: brief?.topic || 'unknown',
      sources: [],
      relevantBlogPosts: [],
      warnings: [`validation failed: ${err.message}`],
    };
  }
}

/**
 * fetchFdaRss — fetch FDA press release RSS and parse items
 */
export async function fetchFdaRss(topicKey, config) {
  try {
    const url = 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml';
    const response = await fetchWithTimeout(url, {
      headers: { 'User-Agent': 'PsychoPharmRef-Newsletter/1.0' },
    }, 15000);

    if (!response.ok) {
      throw new Error(`FDA RSS returned ${response.status}`);
    }

    const xml = await response.text();
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = (/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/.exec(itemXml) ||
                     /<title>([\s\S]*?)<\/title>/.exec(itemXml) || [])[1]?.trim() || '';
      const link = (/<link>([\s\S]*?)<\/link>/.exec(itemXml) || [])[1]?.trim() || '';
      const pubDate = (/<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemXml) || [])[1]?.trim() || '';
      const description = (/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/.exec(itemXml) ||
                           /<description>([\s\S]*?)<\/description>/.exec(itemXml) || [])[1]?.trim() || '';

      if (title && link) {
        items.push({
          title,
          url: link,
          publishedDate: pubDate,
          retrievedDate: new Date().toISOString().slice(0, 10),
          excerpt: description.slice(0, 300),
        });
      }
    }

    const sources = items.slice(0, (config?.maxBriefSources || 5));
    return validateBrief({ topic: topicKey, sources, relevantBlogPosts: [], warnings: [] });
  } catch (err) {
    if (err.name === 'AbortError') {
      return validateBrief({ topic: topicKey, sources: [], warnings: ['FDA RSS unavailable'] });
    }
    return validateBrief({ topic: topicKey, sources: [], warnings: [`FDA RSS error: ${err.message}`] });
  }
}

/**
 * fetchClinicalTrials — fetch psychiatric trials from ClinicalTrials.gov v2 API.
 * Defaults to Phase 3 for backward compatibility; passes `phase` through to filter.
 * Valid phases: 'phase3', 'phase2', 'phase1'.
 *
 * Filter syntax: prior implementation used `aggFilters=phase:phase3,studyType:int`,
 * but `aggFilters` is the parameter that drives the v2 API's facet histograms in
 * the UI — it does not filter the returned study list. The combination silently
 * returned 0 studies on every call, which dropped the s1-pipeline-drugs chain to
 * evergreen on every weekly run after 2026-04-17 (when the requireMetadata gate
 * was added; before that, an empty `studies` array also returned 0 sources but
 * the symptom was less visible).
 *
 * Correct syntax: `filter.advanced=AREA[Phase]PHASE3 AND AREA[StudyType]INTERVENTIONAL`,
 * URL-encoded. Verified against the live API on 2026-04-27 — Phase 3 returns
 * 10 psych trials (MM120/MDD, KarXT/AD-psychosis, Seltorexant/MDD, etc.).
 */
export async function fetchClinicalTrials(topicKey, config, phase = 'phase3') {
  try {
    // Normalize 'phase3' → 'PHASE3' for the AREA[Phase] enum in the advanced query.
    const phaseEnum = String(phase).toUpperCase();
    const filterAdvanced = encodeURIComponent(`AREA[Phase]${phaseEnum} AND AREA[StudyType]INTERVENTIONAL`);
    const url = [
      'https://clinicaltrials.gov/api/v2/studies',
      `?filter.advanced=${filterAdvanced}`,
      '&filter.overallStatus=RECRUITING,ACTIVE_NOT_RECRUITING',
      '&query.cond=psychiatric+OR+depression+OR+schizophrenia+OR+bipolar+OR+anxiety+OR+ADHD',
      '&pageSize=10',
    ].join('');

    const response = await fetchWithTimeout(url, {
      headers: { 'User-Agent': 'PsychoPharmRef-Newsletter/1.0' },
    }, 15000);

    if (!response.ok) {
      throw new Error(`ClinicalTrials.gov returned ${response.status}`);
    }

    const data = await response.json();
    const studies = data?.studies || [];

    if (studies.length === 0) {
      return validateBrief({
        topic: topicKey,
        sources: [],
        relevantBlogPosts: [],
        warnings: [`No ${phase} trials found`],
      });
    }

    const sources = studies.slice(0, config?.maxBriefSources || 5).map(study => {
      const proto = study?.protocolSection || {};
      const id = proto?.identificationModule?.nctId || '';
      const briefTitle = proto?.identificationModule?.briefTitle || '';
      const conditions = (proto?.conditionsModule?.conditions || []).join(', ');
      const status = proto?.statusModule?.overallStatus || '';
      const lastUpdate = proto?.statusModule?.lastUpdatePostDateStruct?.date || '';

      return {
        title: briefTitle || id,
        url: `https://clinicaltrials.gov/study/${id}`,
        publishedDate: lastUpdate,
        retrievedDate: new Date().toISOString().slice(0, 10),
        excerpt: `${id} — ${conditions} — Status: ${status}`,
      };
    });

    return validateBrief({ topic: topicKey, sources, relevantBlogPosts: [], warnings: [] });
  } catch (err) {
    if (err.name === 'AbortError') {
      return validateBrief({ topic: topicKey, sources: [], warnings: ['ClinicalTrials.gov request timed out'] });
    }
    return validateBrief({ topic: topicKey, sources: [], warnings: [`ClinicalTrials.gov error: ${err.message}`] });
  }
}

/**
 * fetchCongress — fetch mental-health bills from Congress.gov API.
 *
 * Rewritten 2026-04-17: the prior implementation used query=mental+health+OR+...
 * which Congress.gov's query parser treats as a loose keyword match, returning
 * bills like "Menstrual Equity For All Act" and "Closing the Provider Fraud
 * Gap Act" that contain none of the psychiatric keywords. New strategy:
 *
 *   1. Fetch a larger batch (50 bills) sorted by updateDate desc.
 *   2. Filter client-side with the shared PSYCH_KEYWORDS list against the
 *      bill title — anything that doesn't match is dropped before it enters
 *      the brief.
 *   3. For each surviving bill, fetch /summaries and /actions in parallel to
 *      populate a substantive excerpt. If /summaries returns nothing (common
 *      for recently introduced bills), fall back to the bill's latestAction
 *      text. This gives Claude enough context to write a one-line primer.
 *
 * If zero bills survive filtering, return an empty brief so the fallback chain
 * drops to the next rung rather than shipping unrelated legislation.
 */
export async function fetchCongress(topicKey, config) {
  try {
    const apiKey = process.env.CONGRESS_API_KEY;
    if (!apiKey) {
      return validateBrief({
        topic: topicKey,
        sources: [],
        warnings: ['CONGRESS_API_KEY not set — skipping legislation fetch'],
      });
    }

    // Step 1: list recent bills (no keyword query — broader batch for filtering).
    const listUrl = 'https://api.congress.gov/v3/bill?sort=updateDate+desc&offset=0&limit=50';
    const listResp = await fetchWithTimeout(listUrl, {
      headers: { 'X-Api-Key': apiKey, 'User-Agent': 'PsychoPharmRef-Newsletter/1.0' },
    }, 15000);

    if (listResp.status === 429) {
      return validateBrief({
        topic: topicKey,
        sources: [],
        warnings: ['Congress.gov rate limited (429) — skipping legislation source'],
      });
    }
    if (!listResp.ok) throw new Error(`Congress.gov list returned ${listResp.status}`);

    const listData = await listResp.json();
    const bills = listData?.bills || [];

    // Step 2: client-side psych-keyword filter on the title.
    const psychBills = bills.filter(b => isPsychRelevant({ title: b.title || '', excerpt: '' }));

    if (psychBills.length === 0) {
      return validateBrief({
        topic: topicKey,
        sources: [],
        warnings: [`Congress.gov returned ${bills.length} recent bills; none matched psych keywords`],
      });
    }

    // Step 3: for the top maxBriefSources, fetch per-bill summary + latest action.
    const max = config?.maxBriefSources || 5;
    const picks = psychBills.slice(0, max);

    const enrichedResults = await Promise.allSettled(picks.map(async bill => {
      const congress = bill.congress || '';
      const type = (bill.type || '').toLowerCase();
      const number = bill.number || '';
      const permalink = bill.url || `https://www.congress.gov/bill/${congress}th-congress/${type}-bill/${number}`;

      // Summary fetch (best effort — many new bills have no summary yet).
      let summaryText = '';
      try {
        const sumUrl = `https://api.congress.gov/v3/bill/${congress}/${type}/${number}/summaries`;
        const sumResp = await fetchWithTimeout(sumUrl, {
          headers: { 'X-Api-Key': apiKey, 'User-Agent': 'PsychoPharmRef-Newsletter/1.0' },
        }, 10000);
        if (sumResp.ok) {
          const sumData = await sumResp.json();
          const summaries = sumData?.summaries || [];
          // Prefer most recent summary
          const latest = summaries[summaries.length - 1];
          if (latest?.text) {
            // Strip HTML tags from the Congress.gov summary text.
            summaryText = latest.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          }
        }
      } catch { /* continue — excerpt will fall back */ }

      // Latest action as fallback excerpt source.
      const latestAction = bill.latestAction?.text || '';

      let excerpt = summaryText || latestAction || bill.title || '';
      if (excerpt.length > 600) excerpt = excerpt.slice(0, 600) + '…';

      return {
        title: bill.title || `${bill.type || ''} ${number}`,
        url: permalink,
        publishedDate: bill.updateDate || '',
        retrievedDate: new Date().toISOString().slice(0, 10),
        excerpt,
      };
    }));

    const sources = enrichedResults
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    return validateBrief({
      topic: topicKey,
      sources,
      relevantBlogPosts: [],
      warnings: [],
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      return validateBrief({ topic: topicKey, sources: [], warnings: ['Congress.gov request timed out'] });
    }
    return validateBrief({ topic: topicKey, sources: [], warnings: [`Congress.gov error: ${err.message}`] });
  }
}

// Perplexity transient-failure handling (hardened 2026-05-15, model fallback added same day).
//
// Prior behaviour: 20s timeout, single retry only on 503, all other non-2xx
// codes thrown immediately. A 2026-05-15 run with degraded Perplexity service
// produced "Perplexity unavailable" on 5 of 6 rungs across two sections —
// retries were exhausting too fast. This implementation:
//   - bumps the per-attempt timeout to 45s (sonar-pro routinely takes 15-30s
//     under load),
//   - increases the primary retry budget from 1 → 3 (4 attempts total),
//   - applies exponential backoff between attempts (5s, 15s, 30s),
//   - retries on the full set of transient HTTP codes {429, 502, 503, 504},
//     not just 503. 429 was previously fatal on the first hit even though
//     rate-limit waits are exactly what backoff is for.
//   - falls back to the lighter 'sonar' model after the primary model (sonar-pro)
//     exhausts its budget. Tier-1 accounts get deprioritised first on sonar-pro
//     during Perplexity degradation; 'sonar' is cheaper and usually less
//     queue-contended, so a final-pass attempt often succeeds when sonar-pro
//     keeps timing out. Set config.perplexityFallbackModel to '' or equal to
//     perplexityModel to disable.
// Non-transient codes (401, 400, 404, etc.) still fail fast — those won't fix
// themselves by retrying.
const PERPLEXITY_TIMEOUT_MS = 45000;
const PERPLEXITY_MAX_ATTEMPTS = 4;
const PERPLEXITY_BACKOFF_MS = [5000, 15000, 30000]; // between attempt N and N+1
const PERPLEXITY_TRANSIENT_HTTP = new Set([429, 502, 503, 504]);
const PERPLEXITY_FALLBACK_MAX_ATTEMPTS = 2;
const PERPLEXITY_FALLBACK_BACKOFF_MS = [10000];
const PERPLEXITY_DEFAULT_FALLBACK_MODEL = 'sonar';

/**
 * tryPerplexityCall — execute one model's retry sequence against the
 * Perplexity API. Returns one of:
 *   { ok: true,    brief,             attempts }  — a usable brief was produced
 *   { failFast: true, brief,          attempts }  — non-retryable error; caller should return brief immediately
 *   { exhausted: true,                attempts }  — retry budget exhausted; caller may try the next model
 *
 * Each attempts[] entry is tagged with .model so the debug dump shows which
 * model produced which outcome.
 */
async function tryPerplexityCall(topicKey, config, ctx, model, maxAttempts, backoffMs) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  const body = {
    model,
    messages: [{ role: 'user', content: ctx.query }],
  };
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'PsychoPharmRef-Newsletter/1.0',
    },
    body: JSON.stringify(body),
  };

  const attempts = [];

  for (let i = 0; i < maxAttempts; i++) {
    const attemptNo = i + 1;
    try {
      const response = await fetchWithTimeout(
        'https://api.perplexity.ai/chat/completions',
        requestOptions,
        PERPLEXITY_TIMEOUT_MS
      );

      if (response.ok) {
        const data = await response.json();
        const brief = parsePerplexityResponse(topicKey, data, config, { ...ctx, model });
        return { ok: true, brief, attempts };
      }

      // Non-2xx. Decide whether to retry.
      attempts.push({ attempt: attemptNo, model, kind: 'http', status: response.status });
      if (!PERPLEXITY_TRANSIENT_HTTP.has(response.status)) {
        // Non-transient — fail fast.
        return {
          failFast: true,
          brief: validateBrief({
            topic: topicKey,
            sources: [],
            warnings: [`Perplexity error: HTTP ${response.status} (${model})`],
          }),
          attempts,
        };
      }
      // Else fall through to backoff/retry.
    } catch (err) {
      if (err.name === 'AbortError') {
        attempts.push({ attempt: attemptNo, model, kind: 'timeout', timeoutMs: PERPLEXITY_TIMEOUT_MS });
        // Retryable — fall through to backoff/retry.
      } else {
        // Unexpected error (DNS, JSON parse on a 2xx, etc.). Don't retry.
        attempts.push({ attempt: attemptNo, model, kind: 'error', message: err.message });
        return {
          failFast: true,
          brief: validateBrief({
            topic: topicKey,
            sources: [],
            warnings: [`Perplexity error: ${err.message} (${model})`],
          }),
          attempts,
        };
      }
    }

    // Backoff before the next attempt, if there is one.
    if (i < maxAttempts - 1) {
      const wait = backoffMs[i] || backoffMs[backoffMs.length - 1];
      await new Promise(r => setTimeout(r, wait));
    }
  }

  return { exhausted: true, attempts };
}

/**
 * fetchPerplexity — query Perplexity for sources on a topic.
 *
 * Two-pass strategy:
 *   Pass 1: primary model (default 'sonar-pro') — full retry budget.
 *   Pass 2: fallback model (default 'sonar')    — 2 attempts, lighter / cheaper.
 *
 * If both passes are exhausted, returns a brief with "Perplexity unavailable"
 * warning and writes a debug file capturing every attempt's outcome (HTTP
 * status, timeout, or error message — tagged with the model that produced it).
 */
export async function fetchPerplexity(topicKey, config) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return validateBrief({
      topic: topicKey,
      sources: [],
      warnings: ['PERPLEXITY_API_KEY not set'],
    });
  }

  const topicConf = config?.topics?.[topicKey];
  const focusArea = topicConf?.focusArea || topicKey;
  const cutoffDays = config?.recencyCutoff?.[topicKey];

  // Two query templates: a recency-anchored one for time-sensitive rungs (S1
  // pipeline / approvals / shortages, S2 rung 1 "recent evidence" framings)
  // and an evergreen one for rungs that explicitly opt out of the cutoff
  // (S2 rung 2 history fallbacks, all S3 deep dives). Prior to 2026-05-08 a
  // single template asked for "recent ... news items" regardless of cutoff,
  // which caused the no-cutoff rungs to come back empty for genuinely
  // historical topics (e.g. history of HAM-D, origin of schizophrenia
  // diagnosis) — Perplexity correctly found nothing "recent" matching the
  // ask. Branching the template restores the intended evergreen behaviour.
  let query;
  if (cutoffDays) {
    const cutoffDate = new Date(Date.now() - cutoffDays * 24 * 60 * 60 * 1000)
      .toISOString().slice(0, 10);
    query = `${focusArea}. Retrieve recent peer-reviewed sources, clinical guidelines, or news items with publication dates. Focus on sources published after ${cutoffDate}. Include URLs and publication dates where available.`;
  } else {
    query = `${focusArea}. Retrieve authoritative sources: peer-reviewed reviews, textbook chapters, historical accounts, primary sources, or canonical references. Original publication date is more important than recency. Include URLs and publication dates where available.`;
  }

  const ctx = { focusArea, query };
  const primaryModel = config?.perplexityModel || 'sonar-pro';
  // config.perplexityFallbackModel can be set to '' or equal to primary to disable.
  const fallbackModel = config?.perplexityFallbackModel === undefined
    ? PERPLEXITY_DEFAULT_FALLBACK_MODEL
    : config.perplexityFallbackModel;

  // Pass 1: primary model with full retry budget.
  const primary = await tryPerplexityCall(
    topicKey, config, ctx,
    primaryModel, PERPLEXITY_MAX_ATTEMPTS, PERPLEXITY_BACKOFF_MS
  );
  if (primary.ok) return primary.brief;
  if (primary.failFast) {
    writePerplexityUnavailableDebug(topicKey, { ...ctx, attempts: primary.attempts });
    return primary.brief;
  }

  const allAttempts = [...primary.attempts];

  // Pass 2: fallback model (lighter, often more available during Perplexity
  // service degradation). Skipped if disabled or equal to primary.
  if (fallbackModel && fallbackModel !== primaryModel) {
    const fallback = await tryPerplexityCall(
      topicKey, config, ctx,
      fallbackModel, PERPLEXITY_FALLBACK_MAX_ATTEMPTS, PERPLEXITY_FALLBACK_BACKOFF_MS
    );
    allAttempts.push(...fallback.attempts);
    if (fallback.ok) return fallback.brief;
    if (fallback.failFast) {
      writePerplexityUnavailableDebug(topicKey, { ...ctx, attempts: allAttempts });
      return fallback.brief;
    }
  }

  // Both passes exhausted (or fallback disabled).
  writePerplexityUnavailableDebug(topicKey, { ...ctx, attempts: allAttempts });
  return validateBrief({
    topic: topicKey,
    sources: [],
    warnings: ['Perplexity unavailable — sources not fetched. Review manually before drafting.'],
  });
}

/**
 * writePerplexityUnavailableDebug — write a debug file when fetchPerplexity
 * exhausts its retry budget (or hits a non-retryable error). Captures the
 * per-attempt outcomes so the operator can see at a glance whether they were
 * 503s, timeouts, a 429 rate limit, or something else. Best-effort write —
 * never breaks the pipeline.
 */
function writePerplexityUnavailableDebug(topicKey, ctx) {
  try {
    if (!fs.existsSync(briefsDir)) return;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const file = path.join(briefsDir, `perplexity-unavailable-${stamp}-${topicKey}.json`);
    const attempts = Array.isArray(ctx?.attempts) ? ctx.attempts : [];

    // Summarise outcomes per model so it's easy to tell at a glance which
    // model performed how. Useful when checking whether the sonar fallback
    // is rescuing runs in practice.
    const byModel = {};
    for (const a of attempts) {
      const m = a.model || 'unknown';
      if (!byModel[m]) byModel[m] = { attempts: 0, timeouts: 0, httpStatuses: {}, errors: 0 };
      byModel[m].attempts += 1;
      if (a.kind === 'timeout') byModel[m].timeouts += 1;
      else if (a.kind === 'http') {
        byModel[m].httpStatuses[a.status] = (byModel[m].httpStatuses[a.status] || 0) + 1;
      }
      else if (a.kind === 'error') byModel[m].errors += 1;
    }

    const payload = {
      topic: topicKey,
      capturedAt: new Date().toISOString(),
      focusArea: ctx?.focusArea || '',
      query: ctx?.query || '',
      reason: 'Perplexity call did not yield a brief — retry budget exhausted or non-retryable error',
      timeoutMs: PERPLEXITY_TIMEOUT_MS,
      primaryMaxAttempts: PERPLEXITY_MAX_ATTEMPTS,
      fallbackMaxAttempts: PERPLEXITY_FALLBACK_MAX_ATTEMPTS,
      transientHttpCodes: Array.from(PERPLEXITY_TRANSIENT_HTTP),
      summaryByModel: byModel,
      attempts,
    };
    fs.writeFileSync(file, JSON.stringify(payload, null, 2));
  } catch { /* best-effort; never break the pipeline on a debug write */ }
}

/**
 * writePerplexityDebug — write raw Perplexity API response to disk when a
 * call returns zero parseable sources. Filename includes ISO timestamp so
 * sequential rungs in the same topic don't collide. Best-effort: failures to
 * write are swallowed (debug artifacts must never break the pipeline).
 */
function writePerplexityDebug(topicKey, data, ctx) {
  try {
    if (!fs.existsSync(briefsDir)) return;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const file = path.join(briefsDir, `perplexity-debug-${stamp}-${topicKey}.json`);
    const payload = {
      topic: topicKey,
      capturedAt: new Date().toISOString(),
      focusArea: ctx?.focusArea || '',
      query: ctx?.query || '',
      model: ctx?.model || '',
      reason: 'Perplexity returned response but parser found 0 usable sources',
      hasSearchResults: Array.isArray(data?.search_results) ? data.search_results.length : null,
      hasCitations: Array.isArray(data?.citations) ? data.citations.length : null,
      contentLength: data?.choices?.[0]?.message?.content?.length || 0,
      rawResponse: data,
    };
    fs.writeFileSync(file, JSON.stringify(payload, null, 2));
  } catch { /* best-effort; never break the pipeline on a debug write */ }
}

/**
 * parsePerplexityResponse — extract sources from Perplexity API response.
 *
 * Sonar / sonar-pro responses include TWO source-related fields:
 *   - data.citations:     array of bare URL strings (the legacy field)
 *   - data.search_results: array of { title, url, date, snippet, source }
 *
 * Prior implementation read only `citations`, so every Perplexity-driven brief
 * landed with empty title/publishedDate/excerpt for every source. Before the
 * 2026-04-17 metadata gate, those skeleton sources still satisfied a count
 * check and the brief moved on; after the gate, every Perplexity rung failed
 * `requireMetadata` and fell to evergreen. Verified against the live API:
 * `search_results` is populated for sonar-pro as of 2026-04-27.
 *
 * Strategy: prefer `search_results` (rich metadata). Fall back to `citations`
 * (URL-only) when search_results is missing — defensive for older responses
 * or any future API shape change. As a last resort, synthesize a single
 * source from the assistant's content so the brief is never empty when the
 * model actually said something useful.
 */
function parsePerplexityResponse(topicKey, data, config, ctx) {
  const content = data?.choices?.[0]?.message?.content || '';
  const retrievedDate = new Date().toISOString().slice(0, 10);
  const maxSources = config?.maxBriefSources || 5;
  const searchResults = Array.isArray(data?.search_results) ? data.search_results : [];
  const citations = Array.isArray(data?.citations) ? data.citations : [];

  let sources;
  if (searchResults.length > 0) {
    // Preferred path — rich metadata available.
    sources = searchResults.slice(0, maxSources).map((sr, i) => ({
      title: sr.title || `Source ${i + 1}`,
      url: sr.url || '',
      publishedDate: sr.date || '',
      retrievedDate,
      excerpt: sr.snippet || '',
    }));
  } else if (citations.length > 0) {
    // Legacy fallback — citations may be strings or objects.
    sources = citations.slice(0, maxSources).map((citation, i) => {
      if (typeof citation === 'string') {
        return {
          title: `Source ${i + 1}`,
          url: citation,
          publishedDate: '',
          retrievedDate,
          excerpt: '',
        };
      }
      return {
        title: citation.title || `Source ${i + 1}`,
        url: citation.url || '',
        publishedDate: citation.date || '',
        retrievedDate,
        excerpt: citation.snippet || '',
      };
    });
  } else {
    sources = [];
  }

  // If neither source array is populated, fall back to a single content-based
  // source so the brief isn't empty when the model returned a useful synthesis.
  if (sources.length === 0 && content) {
    sources.push({
      title: `Perplexity research: ${topicKey}`,
      url: '',
      publishedDate: '',
      retrievedDate,
      excerpt: content.slice(0, 500),
    });
  }

  const warnings = sources.length === 0 ? ['Perplexity returned no citations'] : [];

  // When the parser yields nothing, dump the raw API response for postmortem.
  // This is the single most valuable diagnostic artifact: it lets us see
  // whether Perplexity actually returned 0 hits, returned a content synthesis
  // with no citations, or returned an unexpected envelope shape.
  if (sources.length === 0) {
    writePerplexityDebug(topicKey, data, ctx);
  }

  return validateBrief({ topic: topicKey, sources, relevantBlogPosts: [], warnings });
}

/* ──────────────────────────────────────────────────────────────────────────
   Fallback-chain wrappers (added 2026-04-16; quality gate tightened 2026-04-17)

   Each merged/new S1 or S2 topic dispatches through an ordered chain of
   sub-handlers. The wrapper returns the first brief whose sources PASS the
   rung's quality gate, tagged with fallbackRung and fallbackDescription. If
   every rung fails its gate, the wrapper emits a brief with
   fallback='evergreen' so the draft step routes to the evergreen prompt.

   Quality gates (see hasUsableSources):
     - requirePsychRelevance: at least one source's title or excerpt contains a
       psychiatric keyword. Protects against Congress.gov / FDA RSS returning
       non-psych items that trivially satisfy a count check.
     - requireMetadata: at least one source has a publishedDate OR a
       substantive excerpt (>20 chars). Protects against Perplexity returning
       bare URLs with no extractable content.

   Cross-topic substitution is NOT done here — that would break the 16-letter
   rotation balance. The evergreen prompt is the safety net.
   ────────────────────────────────────────────────────────────────────────── */

// Psych-relevance keyword list. Used by filterPsychRelevant and hasUsableSources.
//
// Matched at word boundaries (see PSYCH_KEYWORD_RE below) so 'ocd' won't fire
// on arbitrary substrings, but suffix matching is preserved — 'psychiatr' still
// matches 'psychiatry/psychiatric/psychiatrist', 'depressi' matches both
// 'depression' and 'depressive'. Keywords are lowercase; matching is
// case-insensitive.
//
// Design notes:
//   - Brand names are essential. Most psychiatric news headlines lead with the
//     brand (Spravato, Cobenfy, Auvelity, Caplyta, Vraylar, Rexulti) and may
//     never mention the generic. The pre-2026-04-27 list had zero brand names
//     and was filtering out exactly the headlines the newsletter most wants
//     to surface.
//   - Recent generics matter even more than brands for FDA RSS / FDA approvals
//     pages, which sometimes use only the generic in titles.
//   - Off-label psych workhorses (prazosin for PTSD nightmares, propranolol
//     for performance anxiety, gabapentin/pregabalin for anxiety) are included
//     because FDA labeling actions on them are still relevant content.
//   - Known limitations: 'bipolar', 'depression' will match non-psychiatric
//     contexts ('bipolar interlocking' in orthopedics, 'ST-segment depression'
//     in cardiology). Addressing these requires negative-context filtering,
//     which is deferred — current false-positive rate is acceptable.
const PSYCH_KEYWORDS = [
  // Disciplines / settings
  'psychiatr', 'mental health', 'behavioral health', 'psychopharm', 'neuropsychiatr',
  // Diagnoses (prefix forms cover noun + adjective)
  'depressi', 'major depressive', 'mdd', 'treatment-resistant depression', 'trd',
  'bipolar', 'mania', 'manic', 'hypomania', 'hypomanic', 'mixed episode',
  'schizophren', 'schizoaffective', 'psychosis', 'psychotic',
  'anxiety', 'generalized anxiety', 'gad', 'panic disorder', 'social anxiety',
  'ptsd', 'post-traumatic stress', 'acute stress',
  'ocd', 'obsessive-compulsive', 'obsessive compulsive',
  'adhd', 'attention deficit', 'attention-deficit',
  'autism', 'autistic', 'asperger',
  'eating disorder', 'anorexia', 'bulimia', 'binge eating', 'bed',
  'substance use', 'addiction', 'opioid use', 'alcohol use', 'cannabis use',
  'opioid dependence', 'alcohol dependence', 'tobacco use', 'nicotine',
  'suicid', 'self-harm', 'self harm', 'non-suicidal self-injury', 'nssi',
  'dementia', 'alzheimer', 'parkinson', 'lewy body',
  'tic disorder', 'tourette', 'huntington',
  'insomnia', 'sleep disorder', 'narcolepsy', 'cataplexy',
  'tardive', 'neuroleptic malignant', 'serotonin syndrome',
  'akathisia', 'dystonia', 'extrapyramidal', 'eps',
  'agitation', 'aggression', 'irritability', 'anhedonia',
  'catatonia', 'catatonic', 'delirium',
  'postpartum depression', 'perinatal depression', 'premenstrual dysphoric', 'pmdd',
  // Drug classes / mechanisms
  'antipsychotic', 'antidepressant', 'anxiolytic', 'mood stabilizer',
  'ssri', 'snri', 'ndri', 'maoi', 'tricyclic', 'tca',
  'benzodiazepine', 'z-drug', 'hypnotic', 'sedative',
  'stimulant', 'non-stimulant', 'wake-promoting',
  'neuroleptic', 'psychotropic', 'psychedelic', 'serotonergic psychedelic',
  'ketamine', 'esketamine', 'nmda antagonist', 'nmda receptor',
  'orexin antagonist', 'dual orexin', 'dora',
  'gaba modulator', 'gaba-a', 'gaba-b',
  'm1 muscarinic', 'm4 muscarinic', 'muscarinic agonist',
  'd2 partial agonist', 'd2 antagonist', 'serotonin-dopamine',
  'long-acting injectable', 'lai', 'depot antipsychotic',
  'vmat2 inhibitor',
  // Antidepressants — generics
  'fluoxetine', 'sertraline', 'escitalopram', 'paroxetine', 'citalopram',
  'fluvoxamine', 'bupropion', 'venlafaxine', 'desvenlafaxine', 'duloxetine',
  'levomilnacipran', 'milnacipran', 'mirtazapine', 'trazodone', 'nefazodone',
  'vortioxetine', 'vilazodone', 'tianeptine', 'agomelatine',
  'amitriptyline', 'nortriptyline', 'imipramine', 'desipramine', 'doxepin', 'clomipramine',
  'phenelzine', 'tranylcypromine', 'selegiline', 'isocarboxazid',
  'zuranolone', 'brexanolone', 'dextromethorphan-bupropion',
  // Antidepressants — brands
  'prozac', 'zoloft', 'lexapro', 'paxil', 'celexa', 'cipralex', 'cipramil',
  'luvox', 'wellbutrin', 'effexor', 'pristiq', 'fetzima', 'cymbalta',
  'remeron', 'desyrel', 'trintellix', 'viibryd', 'auvelity', 'spravato',
  'zurzuvae', 'zulresso',
  // Antipsychotics — generics
  'aripiprazole', 'brexpiprazole', 'cariprazine', 'lumateperone',
  'quetiapine', 'olanzapine', 'risperidone', 'paliperidone', 'clozapine',
  'ziprasidone', 'lurasidone', 'asenapine', 'iloperidone', 'pimavanserin',
  'haloperidol', 'chlorpromazine', 'fluphenazine', 'perphenazine',
  'thioridazine', 'thiothixene', 'loxapine', 'molindone',
  'xanomeline', 'xanomeline-trospium', 'trospium', 'karxt',
  'olanzapine-samidorphan', 'samidorphan',
  // Antipsychotics — brands
  'abilify', 'aristada', 'rexulti', 'vraylar', 'caplyta',
  'seroquel', 'zyprexa', 'risperdal', 'invega', 'clozaril', 'versacloz', 'fazaclo',
  'geodon', 'latuda', 'saphris', 'fanapt', 'nuplazid', 'lybalvi',
  'haldol', 'thorazine', 'cobenfy',
  // Mood stabilizers
  'lithium', 'lithobid', 'eskalith',
  'valproate', 'divalproex', 'depakote', 'depakene',
  'lamotrigine', 'lamictal', 'carbamazepine', 'tegretol', 'equetro',
  'oxcarbazepine', 'trileptal', 'topiramate', 'topamax',
  // Anxiolytics / benzodiazepines / hypnotics
  'alprazolam', 'xanax', 'diazepam', 'valium', 'clonazepam', 'klonopin', 'rivotril',
  'lorazepam', 'ativan', 'temazepam', 'restoril', 'oxazepam', 'serax',
  'chlordiazepoxide', 'librium', 'triazolam', 'halcion',
  'buspirone', 'buspar', 'hydroxyzine', 'vistaril', 'atarax',
  'zolpidem', 'ambien', 'edluar', 'eszopiclone', 'lunesta',
  'zaleplon', 'sonata', 'suvorexant', 'belsomra',
  'lemborexant', 'dayvigo', 'daridorexant', 'quviviq',
  'ramelteon', 'rozerem', 'tasimelteon', 'hetlioz',
  'prazosin', 'minipress', 'propranolol', 'inderal',
  'gabapentin', 'neurontin', 'pregabalin', 'lyrica',
  // ADHD
  'methylphenidate', 'ritalin', 'concerta', 'daytrana', 'metadate', 'methylin',
  'dexmethylphenidate', 'focalin',
  'amphetamine', 'adderall', 'mydayis', 'evekeo',
  'lisdexamfetamine', 'vyvanse',
  'atomoxetine', 'strattera', 'viloxazine', 'qelbree',
  'guanfacine', 'intuniv', 'tenex', 'clonidine', 'kapvay',
  'modafinil', 'provigil', 'armodafinil', 'nuvigil',
  'pitolisant', 'wakix', 'solriamfetol', 'sunosi',
  // Substance use
  'buprenorphine', 'suboxone', 'subutex', 'sublocade', 'probuphine', 'brixadi',
  'methadone', 'methadose', 'dolophine',
  'naltrexone', 'vivitrol', 'revia',
  'naloxone', 'narcan', 'kloxxado',
  'disulfiram', 'antabuse', 'acamprosate', 'campral',
  'varenicline', 'chantix', 'nicotine replacement',
  // VMAT2 / movement disorder
  'tetrabenazine', 'xenazine', 'deutetrabenazine', 'austedo',
  'valbenazine', 'ingrezza',
  // Psychedelics / pipeline
  'psilocybin', 'mdma', 'lsd', 'lysergide', 'mescaline', 'dmt', 'ibogaine',
  'mm120', 'cyb003', 'rl-007', 'navacaprant',
  // Endpoints / regulatory
  'rems', 'risk evaluation and mitigation', 'boxed warning', 'black box',
];

// Precompiled word-boundary regex over the keyword list. Word boundary at the
// start avoids matching arbitrary substrings ('ocd' inside 'tocopherol' etc.);
// no boundary at the end so prefix forms still match suffixed words
// ('psychiatr' → psychiatry/psychiatric/psychiatrist).
const PSYCH_KEYWORD_RE = new RegExp(
  '\\b(?:' + PSYCH_KEYWORDS
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|') + ')',
  'i'
);

function isPsychRelevant(source) {
  if (!source) return false;
  const text = `${source.title || ''} ${source.excerpt || ''}`;
  return PSYCH_KEYWORD_RE.test(text);
}

function filterPsychRelevant(sources) {
  return (sources || []).filter(isPsychRelevant);
}

// A source has usable metadata if it has a publishedDate OR a substantive excerpt.
function hasMetadata(source) {
  if (!source) return false;
  if (source.publishedDate) return true;
  if (source.excerpt && source.excerpt.trim().length > 20) return true;
  return false;
}

// Quality-aware replacement for the previous hasSources() check.
function hasUsableSources(brief, options = {}) {
  const sources = (brief && brief.sources) || [];
  if (sources.length === 0) return false;

  if (options.requirePsychRelevance) {
    const relevant = filterPsychRelevant(sources);
    if (relevant.length < (options.minRelevant || 1)) return false;
  }

  if (options.requireMetadata) {
    const withMeta = sources.filter(hasMetadata);
    if (withMeta.length === 0) return false;
  }

  return true;
}

// Attach rung metadata without mutating the original brief.
function tagWithRung(brief, rungNumber, description) {
  const tagged = validateBrief(brief);
  tagged.fallbackRung = rungNumber;
  tagged.fallbackDescription = description;
  tagged.warnings = tagged.warnings.concat(
    rungNumber > 1 ? [`Fallback chain dropped to rung ${rungNumber}: ${description}`] : []
  );
  return tagged;
}

// Build the evergreen brief when every rung in a chain has returned empty.
// rungDetails (added 2026-05-08) carries the underlying per-rung warnings so
// the evergreen brief preserves the actual failure cause instead of just the
// generic "returned no sources" summary.
function escalateToEvergreen(topicKey, attempts, rungDetails = []) {
  const warnings = attempts.map(
    (a, i) => `Rung ${i + 1} "${a}" returned no sources`
  );
  if (rungDetails.length > 0) {
    warnings.push(...rungDetails);
  }
  warnings.push('All fallback rungs exhausted; drafting from evergreen prompt.');
  return validateBrief({
    topic: topicKey,
    sources: [],
    relevantBlogPosts: [],
    warnings,
    fallback: 'evergreen',
    fallbackRung: 0,
    fallbackDescription: 'evergreen safety net',
  });
}

// Run an ordered list of rungs. Each rung: { description, fn, gate }.
// gate is the options object passed to hasUsableSources. Returns the first
// brief that passes its gate, tagged with rung number. If all fail, returns
// an evergreen-escalated brief.
async function runFallbackChain(topicKey, rungs) {
  const attempts = [];
  const rungDetails = []; // Per-rung underlying warnings from the brief itself.
  for (let i = 0; i < rungs.length; i++) {
    const rung = rungs[i];
    attempts.push(rung.description);
    let brief;
    try {
      brief = await rung.fn();
    } catch (err) {
      brief = validateBrief({
        topic: topicKey,
        sources: [],
        warnings: [`Rung ${i + 1} handler threw: ${err.message}`],
      });
    }
    if (hasUsableSources(brief, rung.gate || {})) {
      return tagWithRung(brief, i + 1, rung.description);
    }
    // Rung failed its gate. Capture its underlying warnings so the final
    // evergreen brief surfaces the actual cause (e.g. "Perplexity returned no
    // citations", "Perplexity error: 401 Unauthorized") rather than the
    // generic "returned no sources" line we used to emit.
    if (Array.isArray(brief?.warnings)) {
      brief.warnings.forEach(w => rungDetails.push(`Rung ${i + 1} detail: ${w}`));
    }
  }
  return escalateToEvergreen(topicKey, attempts, rungDetails);
}

// ── s1-new-approvals: 90-day FDA RSS → 3-year retrospective via Perplexity ──
export async function fetchNewApprovals(topicKey, config) {
  return runFallbackChain(topicKey, [
    {
      description: 'FDA approvals in the last 90 days (FDA RSS)',
      fn: () => fetchFdaRss(topicKey, config),
      gate: { requirePsychRelevance: true, requireMetadata: true },
    },
    {
      description: 'Most recent FDA psychiatric approval in the last 3 years (Perplexity retrospective)',
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'most recent FDA approval of a psychiatric medication in the last 3 years; retrospective on indication, mechanism, pivotal trial, and uptake',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: 365 * 3 },
      }),
      gate: { requirePsychRelevance: true, requireMetadata: true },
    },
  ]);
}

// ── s1-pipeline-drugs: Phase 3 → Phase 2 → Phase 1 ──
// ClinicalTrials.gov already scopes to psychiatric conditions via the query,
// so only requireMetadata (NCT id/status are always present if the call succeeds).
export async function fetchPipelineDrugs(topicKey, config) {
  const gate = { requireMetadata: true };
  return runFallbackChain(topicKey, [
    { description: 'Phase 3 psychiatric trials (ClinicalTrials.gov)', fn: () => fetchClinicalTrials(topicKey, config, 'phase3'), gate },
    { description: 'Phase 2 psychiatric trials (ClinicalTrials.gov)', fn: () => fetchClinicalTrials(topicKey, config, 'phase2'), gate },
    { description: 'Phase 1 psychiatric trials (ClinicalTrials.gov)', fn: () => fetchClinicalTrials(topicKey, config, 'phase1'), gate },
  ]);
}

// ── s1-supply-generics: active shortage → new generic → historical essay ──
export async function fetchSupplyGenerics(topicKey, config) {
  const psychGate = { requirePsychRelevance: true, requireMetadata: true };
  const loose = { requireMetadata: true };  // historical rung: any substantive source OK
  return runFallbackChain(topicKey, [
    {
      description: 'Active psychiatric-drug shortages (FDA RSS / ASHP via Perplexity)',
      gate: psychGate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'currently active psychiatric-drug supply shortages per FDA Drug Shortages database and ASHP',
          },
        },
      }),
    },
    {
      description: 'New generic psychiatric-drug approvals in the last 12 months (Perplexity)',
      gate: psychGate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'FDA ANDA approvals of generic psychiatric medications in the last 12 months; Orange Book therapeutic-equivalence rating where known',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: 365 },
      }),
    },
    {
      description: 'Historical psychiatric-drug shortage essay (Perplexity, no recency cutoff)',
      gate: loose,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'a notable historical psychiatric-drug shortage (e.g., Adderall 2022, SSRIs in specific markets, clozapine availability), with timeline and downstream lessons',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: undefined },
      }),
    },
  ]);
}

// ── s1-policy-fda-watch: federal legislation → FDA labeling/REMS → CMS/state/guideline ──
export async function fetchPolicyFdaWatch(topicKey, config) {
  const gate = { requirePsychRelevance: true, requireMetadata: true };
  return runFallbackChain(topicKey, [
    {
      description: 'US federal mental-health legislation with recent activity (Congress.gov)',
      gate,
      fn: () => fetchCongress(topicKey, config),
    },
    {
      description: 'Recent FDA labeling / REMS / advisory committee action (FDA RSS)',
      gate,
      fn: () => fetchFdaRss(topicKey, config),
    },
    {
      description: 'CMS, state scope-of-practice, or major guideline update (Perplexity)',
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'recent CMS rulings, state scope-of-practice changes, or guideline updates (APA, AACAP, VA/DoD, NICE, RANZCP, CANMAT) affecting psychiatric practice',
          },
        },
      }),
    },
  ]);
}

// ── s2 handlers: single-rung Perplexity wrappers with landmark fallback for comparison ──
// Each passes through to fetchPerplexity with the per-topic focusArea already in config.
// Rung 2 (when applicable) swaps the focusArea for the landmark/receptor/history fallback.

export async function fetchMedComparison(topicKey, config) {
  const gate = { requireMetadata: true };
  return runFallbackChain(topicKey, [
    {
      description: 'Current medication comparison (Perplexity)',
      gate,
      fn: () => fetchPerplexity(topicKey, config),
    },
    {
      description: 'Landmark psychopharmacology trial revisit (Perplexity, no recency cutoff)',
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'a landmark psychopharmacology trial (STAR*D, CATIE, CUtLASS, EUFEST, RAISE, TADS, TMAP, CATIE-AD, TURNS, or comparable trial in OCD/PTSD/ADHD/autism/dementia): design, primary finding, what it settled, what it did not',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: undefined },
      }),
    },
  ]);
}

export async function fetchHowThingsWork(topicKey, config) {
  const gate = { requireMetadata: true };
  return runFallbackChain(topicKey, [
    {
      description: 'Mechanism of a specific clinically relevant drug (Perplexity)',
      gate,
      fn: () => fetchPerplexity(topicKey, config),
    },
    {
      description: 'Receptor-level deep dive (Perplexity, evergreen scope)',
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'a single receptor (5-HT2A, D2, α2, mGluR5, orexin, NMDA, or GABA-A): structure, function in health, dysfunction in disease, and drugs that act on it',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: undefined },
      }),
    },
  ]);
}

export async function fetchSurveyReview(topicKey, config) {
  const gate = { requireMetadata: true };
  return runFallbackChain(topicKey, [
    {
      description: 'Rating-scale review tied to a recent evidence or implementation story (Perplexity)',
      gate,
      fn: () => fetchPerplexity(topicKey, config),
    },
    {
      description: 'History of a rating scale (Perplexity, no recency cutoff)',
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'history of a major psychiatric rating scale (HAM-D, MADRS, YBOCS, Y-MRS, PANSS, MMSE, MoCA, C-SSRS, AIMS): inventor, year, where developed, validation over time, and successors',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: undefined },
      }),
    },
  ]);
}

export async function fetchAdverseEffects(topicKey, config) {
  const gate = { requireMetadata: true };
  return runFallbackChain(topicKey, [
    {
      description: 'Adverse effect tied to a recent label change or case series (Perplexity)',
      gate,
      fn: () => fetchPerplexity(topicKey, config),
    },
    {
      description: 'Evergreen adverse-effect deep dive (Perplexity, no recency cutoff)',
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'a clinically meaningful adverse effect of a psychiatric medication (e.g., SSRI-associated bleeding, metabolic syndrome on atypicals, lithium nephrotoxicity, QTc on citalopram, serotonin syndrome, NMS, clozapine myocarditis, valproate hyperammonemia, SIADH, tardive dyskinesia), with incidence, risk factors, monitoring, and management',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: undefined },
      }),
    },
  ]);
}

// ── S3 deep dives: previously dispatched directly to fetchPerplexity, which
// meant a single transient Perplexity 503 or timeout would blank an entire
// section (no rungs, no fallback). Wrapped in runFallbackChain as of
// 2026-05-08. Rung 1 is the configured focusArea verbatim (broad framing of
// the topic). Rung 2 is a narrower, more concrete framing — anchoring the
// query to a specific named example often produces results when the broad
// version returned nothing. Both rungs are evergreen (no recency cutoff) per
// config.js; the no-cutoff query template (added simultaneously) handles the
// time-insensitive phrasing.
const S3_RUNG2_FOCUS = {
  's3-diagnosis-history':
    'a single named psychiatric diagnostic category (e.g., schizophrenia, bipolar disorder, PTSD, autism, ADHD, borderline personality, OCD): when first named, who named it, how DSM/ICD criteria evolved across editions, and current debates over its boundaries',
  's3-drug-discovery':
    'the discovery story of a single landmark psychiatric medication (chlorpromazine, lithium, imipramine, fluoxetine, clozapine, ketamine, brexanolone, psilocybin, lecanemab): serendipity vs rational design, key figures, pivotal trial, and downstream impact on the field',
  's3-scientific-process':
    'a methodological landmark in psychiatric research (the placebo response problem, RCT design in psychiatry, NIMH RDoC, network meta-analysis, registry-based trials, biomarker validation efforts): why it matters and how it changed practice',
  's3-historical-legal':
    'a landmark legal or ethical event in psychiatric history (deinstitutionalization, Tarasoff, Olmstead, ECT regulation, the Rosenhan experiment, asylum reform, mental-health parity laws): facts of the case, downstream policy, and contemporary relevance',
};

export async function fetchS3WithFallback(topicKey, config) {
  const gate = { requireMetadata: true };
  const topicConf = config?.topics?.[topicKey] || {};
  return runFallbackChain(topicKey, [
    {
      description: `${topicConf.label || topicKey} — primary framing (Perplexity)`,
      gate,
      fn: () => fetchPerplexity(topicKey, config),
    },
    {
      description: `${topicConf.label || topicKey} — concrete-example fallback (Perplexity)`,
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...topicConf,
            focusArea: S3_RUNG2_FOCUS[topicKey] || topicConf.focusArea,
          },
        },
      }),
    },
  ]);
}

/**
 * dispatch — maps topic keys to fetch handler functions.
 * All sections now use fallback-chain wrappers (S3 added 2026-05-08).
 */
export const dispatch = {
  's1-new-approvals': fetchNewApprovals,
  's1-pipeline-drugs': fetchPipelineDrugs,
  's1-supply-generics': fetchSupplyGenerics,
  's1-policy-fda-watch': fetchPolicyFdaWatch,
  's2-med-comparison': fetchMedComparison,
  's2-how-things-work': fetchHowThingsWork,
  's2-survey-review': fetchSurveyReview,
  's2-adverse-effects': fetchAdverseEffects,
  's3-diagnosis-history': fetchS3WithFallback,
  's3-drug-discovery': fetchS3WithFallback,
  's3-scientific-process': fetchS3WithFallback,
  's3-historical-legal': fetchS3WithFallback,
};
