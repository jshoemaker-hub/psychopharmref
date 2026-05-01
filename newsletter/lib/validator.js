// lib/validator.js — xAI/Grok cross-check for research briefs
//
// Sends each brief's sources to Grok with a strict fact-check prompt and asks
// for a per-source verdict: agree | disagree | unverified. Returns a structured
// report. The caller (generate.js --research) decides what to do with the
// result — current policy is "block on any disagreement".
//
// Why xAI specifically: independent corpus from Perplexity (which fetches our
// sources). Using Grok to grade Perplexity's outputs gives us a cross-vendor
// sanity check rather than asking the same model to grade itself.
//
// Why grok-4-fast: this is a fact-check pass, not a reasoning task. Cost is
// ~pennies per weekly run. Override via XAI_MODEL env var if you want grok-4
// for higher-stakes content.

import { fetchWithTimeout } from './research.js';

const XAI_ENDPOINT = 'https://api.x.ai/v1/chat/completions';
const XAI_RESPONSES_ENDPOINT = 'https://api.x.ai/v1/responses';
const DEFAULT_MODEL = 'grok-4-fast';

/**
 * extractFirstJsonObject — pull the first balanced JSON object out of a
 * string, tolerating leading prose, trailing prose, and ```json fences.
 * The Responses API + web_search path doesn't always honor JSON output
 * formatting, so we have to recover the JSON ourselves.
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
 * extractResponsesApiText — pull the assistant's final text out of a
 * Responses API payload. The output array can contain web_search_call
 * items, reasoning items, and one or more message items; we want the
 * text from the last message.
 */
function extractResponsesApiText(data) {
  if (!data) return '';
  // Some implementations expose a top-level convenience field.
  if (typeof data.output_text === 'string' && data.output_text) return data.output_text;
  const output = Array.isArray(data.output) ? data.output : [];
  const messages = output.filter(o => o?.type === 'message' || o?.role === 'assistant');
  const last = messages[messages.length - 1];
  if (!last) return '';
  const content = Array.isArray(last.content) ? last.content : [];
  const texts = content
    .map(c => (typeof c?.text === 'string' ? c.text : (c?.type === 'output_text' && c?.text) || ''))
    .filter(Boolean);
  return texts.join('\n');
}

/**
 * factCheckBrief — send a research brief to Grok and get per-source verdicts.
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
 * Grok routinely doesn't know about a brand-new approval or trial result, and
 * treating ignorance as disagreement would halt every weekly run.
 */
export async function factCheckBrief(brief, options = {}) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return {
      ok: true,                 // fail-open: missing key shouldn't block the pipeline
      verdicts: [],
      summary: 'XAI_API_KEY not set — validator skipped.',
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

  const model = options.model || process.env.XAI_MODEL || DEFAULT_MODEL;
  const timeoutMs = options.timeoutMs || 45000;
  const sectionLabel = options.sectionLabel || brief.topic || 'unknown section';
  const focusArea = options.focusArea || '';

  const systemPrompt = [
    'You are a senior psychiatrist fact-checking sources for a clinical newsletter aimed at practicing physicians.',
    'For each numbered source, decide whether the title and excerpt make accurate factual claims about psychiatry, psychopharmacology, regulation, or trials.',
    '',
    'Use exactly one of these verdicts per source:',
    '  - "agree":      The factual claims are correct as far as you can tell.',
    '  - "disagree":   At least one factual claim is wrong (e.g., wrong drug class, wrong mechanism, wrong dose, wrong trial result, wrong year, wrong agency action). DO NOT use this verdict for stylistic issues, vague phrasing, missing context, or things you simply have not heard of.',
    '  - "unverified": You cannot confirm or refute the claims with your training data (e.g., a brand-new approval, a recently posted trial, a niche bill). This is the correct verdict for anything outside your knowledge — do NOT mark it "disagree" just because you have no record of it.',
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

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0,
  };

  let response;
  try {
    response = await fetchWithTimeout(XAI_ENDPOINT, {
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
      summary: `xAI request failed: ${err.message}`,
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
      summary: `xAI returned HTTP ${response.status}: ${errBody}`,
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
      summary: `xAI returned non-JSON: ${err.message}`,
      model,
      error: 'bad_response',
    };
  }

  const content = data?.choices?.[0]?.message?.content || '';
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    return {
      ok: false,
      verdicts: [],
      summary: `xAI verdict was not valid JSON: ${err.message}. Raw: ${content.slice(0, 300)}`,
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
  };
}

/**
 * factCheckDraft — send a drafted section's prose to Grok for claim-level
 * fact-checking. Sibling of factCheckBrief() but operates on the rendered
 * prose, not on brief sources. Use when a section was drafted from an
 * evergreen / source-less brief (no source-level validator coverage), or as
 * a belt-and-suspenders pass after drafting.
 *
 * Annotate-only: returns structured verdicts; the caller decides what to do.
 *
 * @param {string} sectionLabel — e.g. 'S2 — clozapine essentials (2026-05-08)'
 * @param {string} prose        — the drafted section text. HTML is accepted;
 *                                tags are stripped before grading.
 * @param {object} [options]    — { model, focusArea, timeoutMs }
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
 */
export async function factCheckDraft(sectionLabel, prose, options = {}) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return {
      ok: true,
      verdicts: [],
      summary: 'XAI_API_KEY not set — draft validator skipped.',
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

  const model = options.model || process.env.XAI_MODEL || DEFAULT_MODEL;
  const timeoutMs = options.timeoutMs || 60000;
  const focusArea = options.focusArea || '';

  const systemPrompt = [
    'You are a senior psychiatrist fact-checking a drafted newsletter section aimed at practicing physicians.',
    'Identify the section\'s discrete factual claims (dosages, monitoring thresholds, regulatory programs, trial results, dates, mechanisms, indications) and grade each one.',
    '',
    'Use exactly one of these verdicts per claim:',
    '  - "agree":      The claim is correct.',
    '  - "disagree":   The claim is wrong (e.g., describes a regulatory program as active when it has been discontinued; wrong dose; wrong drug class; wrong trial result; wrong year; misstated mechanism). DO NOT use this for stylistic issues, vague phrasing, or things you simply have not heard of.',
    '  - "unverified": You cannot confirm or refute the claim with your training data (e.g., a brand-new approval). This is the correct verdict for anything outside your knowledge — do NOT mark it "disagree" just because you have no record of it.',
    '',
    'For "disagree" verdicts, also assign a severity:',
    '  - "high":   Wrong drug, wrong mechanism, wrong dose, wrong indication, dangerous misstatement, OR a regulatory/safety program described as live when it has been discontinued or vice versa.',
    '  - "medium": Wrong year, wrong agency, wrong trial phase, wrong endpoint name.',
    '  - "low":    Minor factual slip unlikely to mislead a physician.',
    'For "agree" and "unverified", set severity to "low".',
    '',
    'Pay special attention to claims of currency: phrases like "operates under," "is required," "must enroll," "monitoring is mandated by" — verify whether the cited program/requirement is still in force as of your knowledge cutoff. Flag obsolete-as-current claims as "disagree" with severity "high".',
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

  // Web search opt-in. When on, call the Responses API at /v1/responses with
  // tools=[{type:'web_search'}] so Grok can ground currency claims (REMS
  // status, label changes, withdrawn approvals) against current web results
  // rather than relying on its training cutoff. Off by default to keep weekly
  // run cost low and to match factCheckBrief's behavior.
  const webSearch = options.webSearch === true
    || (options.webSearch !== false && process.env.XAI_WEB_SEARCH === '1');

  let endpoint;
  let body;
  if (webSearch) {
    endpoint = XAI_RESPONSES_ENDPOINT;
    // Responses API uses `input` (not `messages`) and accepts a `tools` array.
    // We prepend a hint that the model should use the search tool whenever a
    // claim's currency is in question — that's the whole point of this path.
    const augmentedSystem = systemPrompt
      + '\n\nWhen a claim asserts that a regulatory program, label, requirement, or approval is currently in force ("operates under", "is required", "must enroll", "is mandated", "carries a"), you MUST call the web_search tool to verify the claim against current sources before grading. Do not rely on training data alone for currency judgments. If web search reveals the cited program/requirement has been discontinued, modified, or withdrawn, return verdict "disagree" with severity "high".';
    body = {
      model,
      input: [
        { role: 'system', content: augmentedSystem },
        { role: 'user', content: userPrompt },
      ],
      tools: [{ type: 'web_search' }],
      // No response_format here — Responses API + tools combo doesn't reliably
      // honor json_object format, so we extract JSON ourselves below.
    };
  } else {
    endpoint = XAI_ENDPOINT;
    body = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    };
  }

  let response;
  try {
    response = await fetchWithTimeout(endpoint, {
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
      summary: `xAI request failed: ${err.message}`,
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
      summary: `xAI returned HTTP ${response.status}: ${errBody}`,
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
      summary: `xAI returned non-JSON: ${err.message}`,
      model,
      error: 'bad_response',
    };
  }

  // Extract the assistant text. Chat Completions: data.choices[0].message.content.
  // Responses API: walk data.output[] for the last assistant message.
  const content = webSearch
    ? extractResponsesApiText(data)
    : (data?.choices?.[0]?.message?.content || '');

  let parsed = null;
  try {
    parsed = JSON.parse(content);
  } catch {
    // Web search responses sometimes wrap JSON in fences or add a preamble;
    // fall back to a tolerant extractor.
    parsed = extractFirstJsonObject(content);
  }
  if (!parsed) {
    return {
      ok: false,
      verdicts: [],
      summary: `xAI verdict was not valid JSON. Raw: ${(content || '').slice(0, 300)}`,
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

  // Citations from the web_search tool — only present on the Responses API path.
  const citations = (() => {
    if (!webSearch) return [];
    const out = Array.isArray(data?.output) ? data.output : [];
    const urls = new Set();
    for (const item of out) {
      // Citations may surface either as annotations on message content or as
      // dedicated web_search_call result items. Collect any url-shaped fields.
      const walk = (node) => {
        if (!node || typeof node !== 'object') return;
        if (typeof node.url === 'string') urls.add(node.url);
        if (Array.isArray(node)) node.forEach(walk);
        else for (const k of Object.keys(node)) walk(node[k]);
      };
      walk(item);
    }
    return Array.from(urls);
  })();

  const disagreements = verdicts.filter(v => v.verdict === 'disagree');
  return {
    ok: disagreements.length === 0,
    verdicts,
    summary: parsed?.summary || '',
    model,
    usage: data?.usage || null,
    disagreementCount: disagreements.length,
    webSearch,
    citations,
  };
}

/**
 * formatDraftReport — render a factCheckDraft() result as a human-readable text block.
 */
export function formatDraftReport(sectionLabel, result) {
  const lines = [];
  lines.push(`## Draft fact-check — ${sectionLabel}`);
  lines.push(`Model: ${result.model || '(none)'}${result.webSearch ? ' + web_search' : ''}`);
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
    lines.push('Citations from web_search:');
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
    lines.push(`Tokens: ${result.usage.prompt_tokens} in / ${result.usage.completion_tokens} out`);
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
  return lines.join('\n');
}

/**
 * surveyRecency — annotate-only recency probe.
 *
 * Asks Grok-with-web_search what major psychiatric pharmacology / regulatory
 * developments occurred in a date window. Distinct from factCheckBrief and
 * factCheckDraft: those grade claims that ARE made; this surfaces topics the
 * brief / draft might be missing entirely. The output is meant to be reviewed
 * before --draft, so the human can decide whether to fold an item into the
 * relevant section topic or leave it for next week.
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
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return {
      ok: true,
      items: [],
      citations: [],
      summary: 'XAI_API_KEY not set — recency probe skipped.',
      model: null,
      error: 'no_api_key',
    };
  }

  const until = options.until || new Date().toISOString().slice(0, 10);
  const model = options.model || process.env.XAI_MODEL || DEFAULT_MODEL;
  const timeoutMs = options.timeoutMs || 90000;
  const maxItems = options.maxItems || 10;

  const systemPrompt = [
    'You are a senior psychiatrist scanning the most recent psychiatric pharmacology / regulatory landscape on behalf of a weekly clinical newsletter.',
    'Your job is to surface developments a practicing psychiatrist would want to know about — NOT to grade existing copy.',
    '',
    'Use the web_search tool. You MUST search the web; do not rely on training data. Search broadly: FDA drug safety communications, FDA approvals page, Federal Register, ClinicalTrials.gov, NEJM / JAMA Psychiatry / AJP, Psychiatric Times, Pharmacy Times, medical news outlets.',
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
    'Surface major psychiatric pharmacology / regulatory developments in this window. Use the web_search tool. Strict JSON output.',
  ].join('\n');

  const body = {
    model,
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    tools: [{ type: 'web_search' }],
  };

  let response;
  try {
    response = await fetchWithTimeout(XAI_RESPONSES_ENDPOINT, {
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
      summary: `xAI request failed: ${err.message}`,
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
      summary: `xAI returned HTTP ${response.status}: ${errBody}`,
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
      summary: `xAI returned non-JSON: ${err.message}`,
      model,
      error: 'bad_response',
    };
  }

  const content = extractResponsesApiText(data);
  let parsed = null;
  try { parsed = JSON.parse(content); } catch { parsed = extractFirstJsonObject(content); }
  if (!parsed) {
    return {
      ok: false,
      items: [],
      citations: [],
      summary: `xAI recency output was not valid JSON. Raw: ${(content || '').slice(0, 300)}`,
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

  // Pull citations from the Responses API output array.
  const out = Array.isArray(data?.output) ? data.output : [];
  const urls = new Set();
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (typeof node.url === 'string') urls.add(node.url);
    if (Array.isArray(node)) node.forEach(walk);
    else for (const k of Object.keys(node)) walk(node[k]);
  };
  out.forEach(walk);
  const citations = Array.from(urls);

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
  lines.push(`Model: ${result.model || '(none)'} + web_search`);
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
