// lib/validator.js — Perplexity cross-check for research briefs and drafts
//
// Sends each brief's sources (or each drafted section's prose) to Perplexity
// with a strict fact-check prompt and asks for a per-source / per-claim
// verdict: agree | disagree | unverified. Returns a structured report. The
// caller (generate.js --research / --draft) decides what to do with the
// result — current policy is annotate-only (never blocks).
//
// Why Perplexity specifically (changed 2026-05-21): independent corpus from
// xAI/Grok, which now does the source-finding in lib/research.js. Using
// Perplexity to grade Grok's outputs gives a cross-vendor sanity check rather
// than asking the same model to grade itself. Perplexity's built-in web
// retrieval also gives currency grounding for free — there's no separate
// web_search tool to wire up; sonar-pro searches by default.
//
// Why sonar-pro: this is a fact-check pass, not an open-ended reasoning task.
// Cost is ~pennies per weekly run. Override via PERPLEXITY_MODEL env var if
// you want to flip to a different sonar variant.

import { fetchWithTimeout } from './research.js';

const PERPLEXITY_ENDPOINT = 'https://api.perplexity.ai/chat/completions';
const DEFAULT_MODEL = 'sonar-pro';

/**
 * extractFirstJsonObject — pull the first balanced JSON object out of a
 * string, tolerating leading prose, trailing prose, and ```json fences.
 * Perplexity's response_format=json_object hint is best-effort, and the
 * sonar models occasionally wrap their output in fences or prose.
 */
function extractFirstJsonObject(text) {
  if (!text) return null;
  // Strip ```json ... ``` fences if present
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  // Find first balanced { ... }
  let depth = 0;
  let start = -1;
  for (let i = 0; i < candidate.length; i++) {
    const ch = candidate[i];
    if (ch === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && start >= 0) {
        const slice = candidate.slice(start, i + 1);
        try { return JSON.parse(slice); } catch { /* keep scanning */ }
        start = -1;
      }
    }
  }
  return null;
}

/**
 * collectPerplexityCitationUrls — Perplexity sonar responses expose web
 * citations in two shapes: a top-level `citations` array of URL strings, and
 * a `search_results` array of {title, url, date, snippet} objects. Return
 * a de-duplicated URL list so callers can surface what the reviewer actually
 * consulted, regardless of which envelope shape the API returns this run.
 */
function collectPerplexityCitationUrls(data) {
  const urls = new Set();
  const cites = Array.isArray(data?.citations) ? data.citations : [];
  for (const c of cites) {
    if (typeof c === 'string') urls.add(c);
    else if (c && typeof c.url === 'string') urls.add(c.url);
  }
  const searchResults = Array.isArray(data?.search_results) ? data.search_results : [];
  for (const sr of searchResults) {
    if (sr && typeof sr.url === 'string') urls.add(sr.url);
  }
  return Array.from(urls);
}

/**
 * factCheckBrief — send a research brief to Perplexity and get per-source verdicts.
 *
 * @param {object} brief         — the validateBrief() output from research.js
 * @param {object} options       — { model, sectionLabel, focusArea, timeoutMs }
 * @returns {Promise<object>}    — { ok, verdicts, summary, model, error? }
 *
 * Verdict shape:
 *   { sourceIndex, sourceTitle, sourceUrl, verdict, severity, reasoning }
 *   verdict:   'agree' | 'disagree' | 'unverified'
 *   severity:  'low' | 'medium' | 'high'   (only meaningful for 'disagree')
 *
 * `ok` is true iff zero verdicts are 'disagree'. 'unverified' does NOT block —
 * Perplexity may not find a confirming source for a brand-new approval or
 * a niche trial, and treating ignorance as disagreement would halt every
 * weekly run.
 */
export async function factCheckBrief(brief, options = {}) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return {
      ok: true,                 // fail-open: missing key shouldn't block the pipeline
      verdicts: [],
      summary: 'PERPLEXITY_API_KEY not set — validator skipped.',
      model: null,
      error: 'no_api_key',
    };
  }

  const sources = (brief && brief.sources) || [];
  if (sources.length === 0) {
    return {
      ok: true,
      verdicts: [],
      summary: 'Brief contains no sources to validate.',
      model: null,
    };
  }

  const model = options.model || process.env.PERPLEXITY_MODEL || DEFAULT_MODEL;
  const timeoutMs = options.timeoutMs || 60000;
  const sectionLabel = options.sectionLabel || brief.topic || 'unknown section';
  const focusArea = options.focusArea || '';

  const systemPrompt = [
    'You are a senior psychiatrist fact-checking sources for a clinical newsletter aimed at practicing physicians.',
    'For each numbered source, decide whether the title and excerpt make accurate factual claims about psychiatry, psychopharmacology, regulation, or trials. Use your web access to verify currency claims against current sources whenever possible.',
    '',
    'Use exactly one of these verdicts per source:',
    '  - "agree":      The factual claims are correct as far as you can tell.',
    '  - "disagree":   At least one factual claim is wrong (e.g., wrong drug class, wrong mechanism, wrong dose, wrong trial result, wrong year, wrong agency action). DO NOT use this verdict for stylistic issues, vague phrasing, missing context, or things you simply have not heard of.',
    '  - "unverified": You cannot confirm or refute the claims even after searching the web (e.g., a niche trial without public reporting). This is the correct verdict for anything you cannot ground — do NOT mark it "disagree" just because you have no record of it.',
    '',
    'For "disagree" verdicts, also assign a severity:',
    '  - "high":   Wrong drug, wrong mechanism, wrong dose, wrong indication, dangerous misstatement.',
    '  - "medium": Wrong year, wrong agency, wrong trial phase, wrong endpoint name.',
    '  - "low":    Minor factual slip unlikely to mislead a physician.',
    'For "agree" and "unverified", set severity to "low".',
    '',
    'Respond with STRICT JSON only (no prose, no markdown fences) matching this schema:',
    '{',
    '  "verdicts": [',
    '    {"sourceIndex": <int>, "verdict": "agree|disagree|unverified", "severity": "low|medium|high", "reasoning": "<one short sentence>"}',
    '  ],',
    '  "summary": "<one sentence covering the brief overall>"',
    '}',
  ].join('\n');

  const sourcesBlock = sources.map((s, i) => {
    const parts = [
      `Source ${i + 1}:`,
      `  title: ${s.title || '(no title)'}`,
      s.publishedDate ? `  publishedDate: ${s.publishedDate}` : null,
      s.url ? `  url: ${s.url}` : null,
      s.excerpt ? `  excerpt: ${s.excerpt}` : null,
    ].filter(Boolean);
    return parts.join('\n');
  }).join('\n\n');

  const userPrompt = [
    `Section: ${sectionLabel}`,
    focusArea ? `Focus area: ${focusArea}` : null,
    `Number of sources to check: ${sources.length}`,
    '',
    sourcesBlock,
  ].filter(Boolean).join('\n');

  // Note: Perplexity's response_format only accepts text / json_schema / regex.
  // It does NOT accept OpenAI's `{ type: 'json_object' }` — that produces an
  // HTTP 400. We rely on the strict-JSON prompt instructions plus the
  // extractFirstJsonObject fallback below instead. If sonar-pro JSON
  // reliability becomes a problem, switch to `{ type: 'json_schema', ... }`
  // with the full schema.
  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0,
  };

  let response;
  try {
    response = await fetchWithTimeout(PERPLEXITY_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'PsychoPharmRef-Newsletter/1.0',
      },
      body: JSON.stringify(body),
    }, timeoutMs);
  } catch (err) {
    return {
      ok: false,
      verdicts: [],
      summary: `Perplexity request failed: ${err.message}`,
      model,
      error: 'request_failed',
    };
  }

  if (!response.ok) {
    let errBody = '';
    try { errBody = (await response.text()).slice(0, 500); } catch { /* ignore */ }
    return {
      ok: false,
      verdicts: [],
      summary: `Perplexity returned HTTP ${response.status}: ${errBody}`,
      model,
      error: `http_${response.status}`,
    };
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    return {
      ok: false,
      verdicts: [],
      summary: `Perplexity returned non-JSON: ${err.message}`,
      model,
      error: 'bad_response',
    };
  }

  const content = data?.choices?.[0]?.message?.content || '';
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    // sonar-pro often wraps JSON in fences or a prose preamble; fall back to
    // a tolerant extractor before giving up.
    parsed = extractFirstJsonObject(content);
  }
  if (!parsed) {
    return {
      ok: false,
      verdicts: [],
      summary: `Perplexity verdict was not valid JSON. Raw: ${(content || '').slice(0, 300)}`,
      model,
      error: 'unparseable_verdict',
    };
  }

  const rawVerdicts = Array.isArray(parsed?.verdicts) ? parsed.verdicts : [];
  const verdicts = rawVerdicts.map(v => {
    const idx = Number.isInteger(v.sourceIndex) ? v.sourceIndex : 0;
    const sourceIdx = Math.max(1, Math.min(sources.length, idx)) - 1;
    const src = sources[sourceIdx] || {};
    const verdict = ['agree', 'disagree', 'unverified'].includes(v.verdict) ? v.verdict : 'unverified';
    const severity = ['low', 'medium', 'high'].includes(v.severity) ? v.severity : 'low';
    return {
      sourceIndex: sourceIdx + 1,
      sourceTitle: src.title || '',
      sourceUrl: src.url || '',
      verdict,
      severity,
      reasoning: typeof v.reasoning === 'string' ? v.reasoning : '',
    };
  });

  const disagreements = verdicts.filter(v => v.verdict === 'disagree');
  return {
    ok: disagreements.length === 0,
    verdicts,
    summary: parsed?.summary || '',
    model,
    usage: data?.usage || null,
    disagreementCount: disagreements.length,
    citations: collectPerplexityCitationUrls(data),
  };
}

/**
 * factCheckDraft — send a drafted section's prose to Perplexity for claim-level
 * fact-checking. Sibling of factCheckBrief() but operates on the rendered
 * prose, not on brief sources. Use when a section was drafted from an
 * evergreen / source-less brief (no source-level validator coverage), or as
 * a belt-and-suspenders pass after drafting.
 *
 * Perplexity sonar models retrieve from the web by default, so currency
 * claims (REMS still in force? approval still active? trial result final?)
 * are checked against current sources rather than a stale training cutoff.
 *
 * Annotate-only: returns structured verdicts; the caller decides what to do.
 *
 * @param {string} sectionLabel — e.g. 'S2 — clozapine essentials (2026-05-08)'
 * @param {string} prose        — the drafted section text. HTML is accepted;
 *                                tags are stripped before grading.
 * @param {object} [options]    — { model, focusArea, timeoutMs, webSearch }
 * @returns {Promise<object>}   — { ok, verdicts, summary, model, error? }
 *
 * Verdict shape:
 *   { claim, verdict, severity, reasoning }
 *   verdict:   'agree' | 'disagree' | 'unverified'
 *   severity:  'low' | 'medium' | 'high'
 *
 * `ok` is true iff zero verdicts are 'disagree'. Same fail-open behavior as
 * factCheckBrief: missing key, network error, or unparseable output never
 * blocks — the pipeline always continues.
 *
 * Note: the `webSearch` option is accepted for backward compatibility with the
 * Grok-era validator but is effectively a no-op here, since sonar-pro
 * retrieves from the web by default.
 */
export async function factCheckDraft(sectionLabel, prose, options = {}) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return {
      ok: true,
      verdicts: [],
      summary: 'PERPLEXITY_API_KEY not set — draft validator skipped.',
      model: null,
      error: 'no_api_key',
    };
  }

  // Strip HTML tags + collapse whitespace. Cheap; we don't need a parser here.
  const plain = String(prose || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) {
    return {
      ok: true,
      verdicts: [],
      summary: 'Draft prose was empty — nothing to validate.',
      model: null,
    };
  }

  const model = options.model || process.env.PERPLEXITY_MODEL || DEFAULT_MODEL;
  const timeoutMs = options.timeoutMs || 90000;
  const focusArea = options.focusArea || '';

  const systemPrompt = [
    'You are a senior psychiatrist fact-checking a drafted newsletter section aimed at practicing physicians.',
    'Identify the section\'s discrete factual claims (dosages, monitoring thresholds, regulatory programs, trial results, dates, mechanisms, indications) and grade each one. Use your web access to verify currency claims against current sources.',
    '',
    'Use exactly one of these verdicts per claim:',
    '  - "agree":      The claim is correct.',
    '  - "disagree":   The claim is wrong (e.g., describes a regulatory program as active when it has been discontinued; wrong dose; wrong drug class; wrong trial result; wrong year; misstated mechanism). DO NOT use this for stylistic issues, vague phrasing, or things you simply have not heard of.',
    '  - "unverified": You cannot confirm or refute the claim even after searching the web (e.g., a brand-new approval with no third-party reporting). This is the correct verdict for anything you cannot ground — do NOT mark it "disagree" just because you have no record of it.',
    '',
    'For "disagree" verdicts, also assign a severity:',
    '  - "high":   Wrong drug, wrong mechanism, wrong dose, wrong indication, dangerous misstatement, OR a regulatory/safety program described as live when it has been discontinued or vice versa.',
    '  - "medium": Wrong year, wrong agency, wrong trial phase, wrong endpoint name.',
    '  - "low":    Minor factual slip unlikely to mislead a physician.',
    'For "agree" and "unverified", set severity to "low".',
    '',
    'Pay special attention to claims of currency: phrases like "operates under," "is required," "must enroll," "monitoring is mandated by" — verify whether the cited program/requirement is still in force using current web sources. Flag obsolete-as-current claims as "disagree" with severity "high".',
    '',
    'Return at most 12 claims (the most load-bearing ones). Quote each claim verbatim or near-verbatim from the prose so the human reviewer can find it.',
    '',
    'Respond with STRICT JSON only (no prose, no markdown fences) matching this schema:',
    '{',
    '  "verdicts": [',
    '    {"claim": "<short verbatim quote>", "verdict": "agree|disagree|unverified", "severity": "low|medium|high", "reasoning": "<one short sentence>"}',
    '  ],',
    '  "summary": "<one sentence covering the section overall>"',
    '}',
  ].join('\n');

  const userPrompt = [
    `Section: ${sectionLabel}`,
    focusArea ? `Focus area: ${focusArea}` : null,
    '',
    'Drafted prose:',
    plain,
  ].filter(Boolean).join('\n');

  // See factCheckBrief for why response_format is omitted (Perplexity rejects
  // OpenAI's `json_object` shape).
  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0,
  };

  let response;
  try {
    response = await fetchWithTimeout(PERPLEXITY_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'PsychoPharmRef-Newsletter/1.0',
      },
      body: JSON.stringify(body),
    }, timeoutMs);
  } catch (err) {
    return {
      ok: false,
      verdicts: [],
      summary: `Perplexity request failed: ${err.message}`,
      model,
      error: 'request_failed',
    };
  }

  if (!response.ok) {
    let errBody = '';
    try { errBody = (await response.text()).slice(0, 500); } catch { /* ignore */ }
    return {
      ok: false,
      verdicts: [],
      summary: `Perplexity returned HTTP ${response.status}: ${errBody}`,
      model,
      error: `http_${response.status}`,
    };
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    return {
      ok: false,
      verdicts: [],
      summary: `Perplexity returned non-JSON: ${err.message}`,
      model,
      error: 'bad_response',
    };
  }

  const content = data?.choices?.[0]?.message?.content || '';
  let parsed = null;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = extractFirstJsonObject(content);
  }
  if (!parsed) {
    return {
      ok: false,
      verdicts: [],
      summary: `Perplexity verdict was not valid JSON. Raw: ${(content || '').slice(0, 300)}`,
      model,
      error: 'unparseable_verdict',
    };
  }

  const rawVerdicts = Array.isArray(parsed?.verdicts) ? parsed.verdicts : [];
  const verdicts = rawVerdicts.map(v => {
    const verdict = ['agree', 'disagree', 'unverified'].includes(v.verdict) ? v.verdict : 'unverified';
    const severity = ['low', 'medium', 'high'].includes(v.severity) ? v.severity : 'low';
    return {
      claim: typeof v.claim === 'string' ? v.claim : '',
      verdict,
      severity,
      reasoning: typeof v.reasoning === 'string' ? v.reasoning : '',
    };
  });

  const citations = collectPerplexityCitationUrls(data);
  const disagreements = verdicts.filter(v => v.verdict === 'disagree');
  return {
    ok: disagreements.length === 0,
    verdicts,
    summary: parsed?.summary || '',
    model,
    usage: data?.usage || null,
    disagreementCount: disagreements.length,
    // webSearch field preserved for backward compatibility with sidecar
    // readers; Perplexity sonar always retrieves from the web, so this is
    // always effectively true.
    webSearch: true,
    citations,
  };
}

/**
 * formatDraftReport — render a factCheckDraft() result as a human-readable text block.
 */
export function formatDraftReport(sectionLabel, result) {
  const lines = [];
  lines.push(`## Draft fact-check — ${sectionLabel}`);
  lines.push(`Model: ${result.model || '(none)'}${result.webSearch ? ' (web-retrieved)' : ''}`);
  if (result.usage) {
    const inTok = result.usage.prompt_tokens ?? result.usage.input_tokens ?? '?';
    const outTok = result.usage.completion_tokens ?? result.usage.output_tokens ?? '?';
    lines.push(`Tokens: ${inTok} in / ${outTok} out`);
  }
  lines.push(`Status: ${result.ok ? 'PASS' : 'FAIL'} — ${result.disagreementCount || 0} disagreement(s)`);
  if (result.summary) lines.push(`Summary: ${result.summary}`);
  if (result.error) lines.push(`Error: ${result.error}`);
  lines.push('');
  if (result.verdicts && result.verdicts.length > 0) {
    result.verdicts.forEach((v, i) => {
      const tag = v.verdict === 'disagree' ? `DISAGREE (${v.severity})` : v.verdict.toUpperCase();
      lines.push(`  [${i + 1}] ${tag}`);
      if (v.claim) lines.push(`      claim: "${v.claim}"`);
      if (v.reasoning) lines.push(`      reason: ${v.reasoning}`);
    });
  } else {
    lines.push('  (no per-claim verdicts)');
  }
  if (Array.isArray(result.citations) && result.citations.length > 0) {
    lines.push('');
    lines.push('Citations consulted:');
    result.citations.forEach((u, i) => lines.push(`  [${i + 1}] ${u}`));
  }
  return lines.join('\n');
}

/**
 * formatReport — render a verification result as a human-readable text block.
 * Used when writing verification.txt sidecar files and when --research halts.
 */
export function formatReport(sectionLabel, result) {
  const lines = [];
  lines.push(`## Verification report — ${sectionLabel}`);
  lines.push(`Model: ${result.model || '(none)'}`);
  if (result.usage) {
    const inTok = result.usage.prompt_tokens ?? result.usage.input_tokens ?? '?';
    const outTok = result.usage.completion_tokens ?? result.usage.output_tokens ?? '?';
    lines.push(`Tokens: ${inTok} in / ${outTok} out`);
  }
  lines.push(`Status: ${result.ok ? 'PASS' : 'FAIL'} — ${result.disagreementCount || 0} disagreement(s)`);
  if (result.summary) lines.push(`Summary: ${result.summary}`);
  if (result.error) lines.push(`Error: ${result.error}`);
  lines.push('');
  if (result.verdicts && result.verdicts.length > 0) {
    for (const v of result.verdicts) {
      const tag = v.verdict === 'disagree' ? `DISAGREE (${v.severity})` : v.verdict.toUpperCase();
      lines.push(`  [${v.sourceIndex}] ${tag} — ${v.sourceTitle}`);
      if (v.sourceUrl) lines.push(`      ${v.sourceUrl}`);
      if (v.reasoning) lines.push(`      ${v.reasoning}`);
    }
  } else {
    lines.push('  (no per-source verdicts)');
  }
  if (Array.isArray(result.citations) && result.citations.length > 0) {
    lines.push('');
    lines.push('Citations consulted:');
    result.citations.forEach((u, i) => lines.push(`  [${i + 1}] ${u}`));
  }
  return lines.join('\n');
}

/**
 * surveyRecency — annotate-only recency probe.
 *
 * Asks Perplexity (sonar-pro, web-retrieved by default) what major psychiatric
 * pharmacology / regulatory developments occurred in a date window. Distinct
 * from factCheckBrief and factCheckDraft: those grade claims that ARE made;
 * this surfaces topics the brief / draft might be missing entirely. The
 * output is meant to be reviewed before --draft, so the human can decide
 * whether to fold an item into the relevant section topic or leave it for
 * next week.
 *
 * @param {string} since         — ISO date "YYYY-MM-DD" (inclusive lower bound)
 * @param {object} [options]     — { until, model, timeoutMs, maxItems }
 * @returns {Promise<object>}    — { ok, items, summary, citations, model, usage, error? }
 *
 * Item shape:
 *   {
 *     title:       string,    // short headline
 *     category:    string,    // approval | withdrawal | label_change | rems |
 *                              // trial_readout | supply | guideline | other
 *     summary:     string,    // 1–2 sentences for the human reviewer
 *     date:        string,    // YYYY-MM-DD if known, else ''
 *     url:         string,    // primary source URL if available
 *     relevance:   string,    // 'high' | 'medium' | 'low' for psych practice
 *   }
 *
 * Fail-open: missing key, network error, or unparseable output never throws —
 * returns ok=false with an error code so the caller can log and continue.
 */
export async function surveyRecency(since, options = {}) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return {
      ok: true,
      items: [],
      citations: [],
      summary: 'PERPLEXITY_API_KEY not set — recency probe skipped.',
      model: null,
      error: 'no_api_key',
    };
  }

  const until = options.until || new Date().toISOString().slice(0, 10);
  const model = options.model || process.env.PERPLEXITY_MODEL || DEFAULT_MODEL;
  const timeoutMs = options.timeoutMs || 90000;
  const maxItems = options.maxItems || 10;

  const systemPrompt = [
    'You are a senior psychiatrist scanning the most recent psychiatric pharmacology / regulatory landscape on behalf of a weekly clinical newsletter.',
    'Your job is to surface developments a practicing psychiatrist would want to know about — NOT to grade existing copy.',
    '',
    'You have web retrieval. Search broadly: FDA drug safety communications, FDA approvals page, Federal Register, ClinicalTrials.gov, NEJM / JAMA Psychiatry / AJP, Psychiatric Times, Pharmacy Times, medical news outlets.',
    '',
    'Restrict findings to events DATED within the window provided in the user message. Do NOT include older items even if they remain relevant.',
    '',
    'Categories (use exactly one per item):',
    '  - "approval"        — FDA approval, expanded indication, new formulation',
    '  - "withdrawal"      — withdrawal, suspension, recall',
    '  - "label_change"    — boxed warning added/removed, dosing/contraindication change',
    '  - "rems"            — REMS imposed, modified, or eliminated',
    '  - "trial_readout"   — Phase 2/3 readout, registrational trial result',
    '  - "supply"          — supply disruption, shortage, allocation change',
    '  - "guideline"       — major society guideline release/update (APA, AACAP, RANZCP, NICE)',
    '  - "other"           — pertinent development that doesn\'t fit the above',
    '',
    'Relevance for psych practice:',
    '  - "high":   psychiatrists prescribe this frequently or it changes monitoring/safety practice',
    '  - "medium": narrower subspecialty impact, or important context but not immediately actionable',
    '  - "low":    pertinent but unlikely to change weekly prescribing',
    '',
    `Return at most ${maxItems} items, prioritized by relevance. Skip items you cannot date or attribute to a credible source.`,
    '',
    'Respond with STRICT JSON only (no prose, no markdown fences) matching this schema:',
    '{',
    '  "items": [',
    '    {"title": "<short headline>", "category": "approval|withdrawal|label_change|rems|trial_readout|supply|guideline|other", "summary": "<1–2 sentences>", "date": "YYYY-MM-DD", "url": "<primary source URL>", "relevance": "high|medium|low"}',
    '  ],',
    '  "summary": "<one sentence overall>"',
    '}',
  ].join('\n');

  const userPrompt = [
    `Window: ${since} through ${until} (inclusive).`,
    `Today is ${new Date().toISOString().slice(0, 10)}.`,
    'Surface major psychiatric pharmacology / regulatory developments in this window. Strict JSON output.',
  ].join('\n');

  // See factCheckBrief for why response_format is omitted (Perplexity rejects
  // OpenAI's `json_object` shape).
  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0,
  };

  let response;
  try {
    response = await fetchWithTimeout(PERPLEXITY_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'PsychoPharmRef-Newsletter/1.0',
      },
      body: JSON.stringify(body),
    }, timeoutMs);
  } catch (err) {
    return {
      ok: false,
      items: [],
      citations: [],
      summary: `Perplexity request failed: ${err.message}`,
      model,
      error: 'request_failed',
    };
  }

  if (!response.ok) {
    let errBody = '';
    try { errBody = (await response.text()).slice(0, 500); } catch { /* ignore */ }
    return {
      ok: false,
      items: [],
      citations: [],
      summary: `Perplexity returned HTTP ${response.status}: ${errBody}`,
      model,
      error: `http_${response.status}`,
    };
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    return {
      ok: false,
      items: [],
      citations: [],
      summary: `Perplexity returned non-JSON: ${err.message}`,
      model,
      error: 'bad_response',
    };
  }

  const content = data?.choices?.[0]?.message?.content || '';
  let parsed = null;
  try { parsed = JSON.parse(content); } catch { parsed = extractFirstJsonObject(content); }
  if (!parsed) {
    return {
      ok: false,
      items: [],
      citations: [],
      summary: `Perplexity recency output was not valid JSON. Raw: ${(content || '').slice(0, 300)}`,
      model,
      error: 'unparseable_output',
    };
  }

  const validCategories = ['approval', 'withdrawal', 'label_change', 'rems', 'trial_readout', 'supply', 'guideline', 'other'];
  const validRelevance = ['high', 'medium', 'low'];
  const rawItems = Array.isArray(parsed?.items) ? parsed.items : [];
  const items = rawItems.map(it => ({
    title: typeof it.title === 'string' ? it.title : '',
    category: validCategories.includes(it.category) ? it.category : 'other',
    summary: typeof it.summary === 'string' ? it.summary : '',
    date: typeof it.date === 'string' ? it.date : '',
    url: typeof it.url === 'string' ? it.url : '',
    relevance: validRelevance.includes(it.relevance) ? it.relevance : 'medium',
  }));

  const citations = collectPerplexityCitationUrls(data);

  return {
    ok: true,
    items,
    citations,
    summary: parsed?.summary || '',
    model,
    usage: data?.usage || null,
    window: { since, until },
  };
}

/**
 * formatRecencyReport — render a surveyRecency() result as a human-readable text block.
 */
export function formatRecencyReport(result) {
  const lines = [];
  lines.push(`## Recency probe — ${result?.window?.since || '?'} through ${result?.window?.until || '?'}`);
  lines.push(`Model: ${result.model || '(none)'} (web-retrieved)`);
  if (result.usage) {
    const inTok = result.usage.prompt_tokens ?? result.usage.input_tokens ?? '?';
    const outTok = result.usage.completion_tokens ?? result.usage.output_tokens ?? '?';
    lines.push(`Tokens: ${inTok} in / ${outTok} out`);
  }
  lines.push(`Items: ${result.items?.length || 0}`);
  if (result.summary) lines.push(`Summary: ${result.summary}`);
  if (result.error) lines.push(`Error: ${result.error}`);
  lines.push('');
  if (result.items && result.items.length > 0) {
    // Sort: high relevance first, then medium, then low; within each by date desc
    const order = { high: 0, medium: 1, low: 2 };
    const sorted = [...result.items].sort((a, b) => {
      const r = (order[a.relevance] ?? 9) - (order[b.relevance] ?? 9);
      if (r !== 0) return r;
      return (b.date || '').localeCompare(a.date || '');
    });
    sorted.forEach((it, i) => {
      lines.push(`  [${i + 1}] ${it.relevance.toUpperCase()} — ${it.category} — ${it.date || '(no date)'}`);
      lines.push(`      ${it.title}`);
      if (it.summary) lines.push(`      ${it.summary}`);
      if (it.url) lines.push(`      ${it.url}`);
    });
  } else {
    lines.push('  (no items returned)');
  }
  if (Array.isArray(result.citations) && result.citations.length > 0) {
    lines.push('');
    lines.push('Citations consulted:');
    result.citations.forEach((u, i) => lines.push(`  [${i + 1}] ${u}`));
  }
  return lines.join('\n');
}
