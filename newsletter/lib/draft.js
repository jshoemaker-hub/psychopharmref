// lib/draft.js — Claude API calls, prompt loading, and HTML assembly

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.join(__dirname, '..', 'prompts');
const sharedDir = path.join(promptsDir, '_shared');

// Cache shared rule files on first read. Any *.md file in prompts/_shared/ is
// concatenated and appended to every prompt template. This keeps house-style
// rules (primer rule, structure rule, etc.) in one reusable place.
let _sharedRulesCache = null;
function readSharedRules() {
  if (_sharedRulesCache !== null) return _sharedRulesCache;
  try {
    if (!fs.existsSync(sharedDir)) { _sharedRulesCache = ''; return ''; }
    const files = fs.readdirSync(sharedDir).filter(f => f.endsWith('.md')).sort();
    const parts = files.map(f => {
      const raw = fs.readFileSync(path.join(sharedDir, f), 'utf8');
      // Strip leading HTML comment header (file-level comment, not content).
      return raw.replace(/^<!--[\s\S]*?-->/, '').trim();
    }).filter(Boolean);
    _sharedRulesCache = parts.join('\n\n---\n\n');
  } catch {
    _sharedRulesCache = '';
  }
  return _sharedRulesCache;
}

// Generic fallback prompt template used when a topic-specific file doesn't exist
const GENERIC_TEMPLATE = `You are a clinical newsletter writer for psychiatrists and medical students. Write a concise, well-sourced section for the PsychoPharmRef weekly newsletter.

Write approximately 250-400 words covering the research brief below.
Tone: clinical. No self-referential content. Promote external sources and their creators.
Use inline citations: (Source Name, YYYY).

{BRIEF_INJECTION}

Output format:
Plain paragraphs only. No markdown headers in output. No bullet lists.
End with a single sentence that transitions to the PsychoPharmRef further reading link (if any).
`;

/**
 * loadPromptTemplate — load a prompt template for a topic key.
 * Falls back to generic template if topic-specific file not found.
 * Strips <!-- PERPLEXITY_QUERY ... --> comment blocks.
 * Strips [RECENCY_GUARD...] comment lines.
 *
 * If options.evergreen is true, loads prompts/evergreen/{section}-evergreen.md
 * instead of the topic-specific file. The section is derived from the topic key's
 * prefix (s1, s2, s3).
 *
 * @param {string} topicKey — e.g. 's1-new-approvals'
 * @param {{ evergreen?: boolean }} [options]
 * @returns {string} template text
 */
export function loadPromptTemplate(topicKey, options = {}) {
  let filePath;
  if (options.evergreen) {
    const section = (topicKey || '').slice(0, 2);
    filePath = path.join(promptsDir, 'evergreen', `${section}-evergreen.md`);
  } else {
    filePath = path.join(promptsDir, `${topicKey}.md`);
  }

  let text;
  if (fs.existsSync(filePath)) {
    text = fs.readFileSync(filePath, 'utf8');
  } else {
    // No topic-specific file — use generic template
    return GENERIC_TEMPLATE;
  }

  // Strip <!-- PERPLEXITY_QUERY ... --> comment block (may span multiple lines)
  text = text.replace(/<!--\s*PERPLEXITY_QUERY[\s\S]*?-->/g, '');

  // Strip <!-- EVERGREEN ... --> and similar header comments that aren't meant for Claude
  text = text.replace(/<!--\s*EVERGREEN[\s\S]*?-->/g, '');

  // Strip lines containing [RECENCY_GUARD...] marker comments
  text = text.replace(/^.*\[RECENCY_GUARD[^\]]*\][^\n]*\n?/gm, '');

  // Inline all shared house-style rule files (primer rule, structure rule, etc.)
  // into the template. Prompts previously referenced these by path only, and
  // Claude never saw the rule text itself.
  const sharedRules = readSharedRules();
  if (sharedRules && !text.includes('# Primer rule for unfamiliar named entities')) {
    text = `${text.trim()}\n\n---\n\n${sharedRules}`;
  }

  return text.trim();
}

/**
 * buildFallbackContext — renders the FALLBACK_CONTEXT block that describes
 * which rung of the fallback chain produced the brief. Empty string if the
 * brief has no fallback metadata (e.g., S3 topics, unmodified handlers).
 *
 * @param {object} brief
 * @returns {string}
 */
export function buildFallbackContext(brief) {
  if (!brief || brief.fallbackRung === undefined) return '';
  if (brief.fallback === 'evergreen') {
    return `FALLBACK CONTEXT: every rung of this topic's fallback chain returned no sources. You are drafting from the evergreen safety-net prompt — pick one of the listed angles and write without citing external sources this week. Do not reveal the fallback to the reader.`;
  }
  const rung = brief.fallbackRung;
  const desc = brief.fallbackDescription || 'unspecified';
  if (rung === 1) {
    return `FALLBACK CONTEXT: primary rung (rung 1) fired. Source: ${desc}. Proceed with present-tense framing.`;
  }
  return `FALLBACK CONTEXT: rung ${rung} fired — ${desc}. The primary rung(s) returned no sources this cycle. Open the piece accordingly (retrospective, historical, or evergreen framing as instructed in this prompt) rather than present-tense.`;
}

/**
 * buildRecencyGuard — returns a recency guard paragraph for topics with a cutoff.
 * Returns empty string for S3 topics (no cutoff key in config).
 *
 * @param {string} topicKey
 * @param {object} config
 * @returns {string}
 */
export function buildRecencyGuard(topicKey, config) {
  const cutoffDays = config?.recencyCutoff?.[topicKey];
  if (cutoffDays === undefined || cutoffDays === null) {
    return '';
  }

  const today = new Date();
  const cutoffDate = new Date(today.getTime() - cutoffDays * 24 * 60 * 60 * 1000);
  const todayStr = today.toISOString().slice(0, 10);
  const cutoffStr = cutoffDate.toISOString().slice(0, 10);

  return `Today is ${todayStr}. All sources in the research brief below were retrieved on ${todayStr}. ONLY treat information published or updated after ${cutoffStr} as "new", "recent", or "emerging". If a source's publication date is before ${cutoffStr}, describe it as "previously reported" or cite the date explicitly. Never imply recency without a publication date in the brief.`;
}

/**
 * injectBrief — appends recency guard and formatted brief block to a template.
 * Also replaces the {FALLBACK_CONTEXT} placeholder if present.
 *
 * @param {string} templateText
 * @param {object} brief
 * @param {string} recencyGuard
 * @returns {string}
 */
export function injectBrief(templateText, brief, recencyGuard) {
  // Resolve {FALLBACK_CONTEXT} placeholder in the template (if present).
  const fallbackContext = buildFallbackContext(brief);
  templateText = templateText.includes('{FALLBACK_CONTEXT}')
    ? templateText.replace('{FALLBACK_CONTEXT}', fallbackContext)
    : templateText;

  const lines = [];

  if (recencyGuard) {
    lines.push(recencyGuard);
    lines.push('');
  }

  lines.push('---RESEARCH BRIEF---');
  lines.push(`Topic: ${brief.topic}`);
  lines.push('Sources:');

  const sources = brief.sources || [];
  if (sources.length === 0) {
    lines.push('(No sources retrieved — see warnings below)');
  } else {
    sources.forEach((src, i) => {
      lines.push(`${i + 1}. ${src.title} | ${src.url} | Published: ${src.publishedDate} | Retrieved: ${src.retrievedDate}`);
      if (src.excerpt) {
        lines.push(`   Excerpt: ${src.excerpt}`);
      }
    });
  }

  const blogPosts = brief.relevantBlogPosts || [];
  if (blogPosts.length > 0) {
    lines.push('');
    lines.push('Relevant PsychoPharmRef posts (include as "Further reading"):');
    blogPosts.forEach(post => {
      lines.push(`- ${post.title} | ${post.url}`);
    });
  }

  const warnings = brief.warnings || [];
  if (warnings.length > 0) {
    lines.push('');
    lines.push('Warnings (address these in your draft if applicable):');
    warnings.forEach(w => lines.push(`- ${w}`));
  }

  lines.push('---END BRIEF---');

  const injectionBlock = lines.join('\n');

  // Replace {BRIEF_INJECTION} placeholder if present, otherwise append
  if (templateText.includes('{BRIEF_INJECTION}')) {
    return templateText.replace('{BRIEF_INJECTION}', injectionBlock);
  }

  return templateText + '\n\n' + injectionBlock;
}

/**
 * extractTitleAndBody — split a Claude response into { title, body }.
 * Looks for a leading "TITLE: …" line. If absent, returns { title: '', body }
 * and the caller can fall back to the topic label.
 *
 * @param {string} text — raw model output
 * @returns {{ title: string, body: string }}
 */
export function extractTitleAndBody(text) {
  const trimmed = (text || '').trim();
  const match = trimmed.match(/^TITLE:\s*(.+?)\s*(?:\n|$)/i);
  if (!match) return { title: '', body: trimmed };
  const title = match[1].trim();
  // Strip the title line + any blank line(s) following it.
  const body = trimmed.slice(match[0].length).replace(/^\s*\n+/, '');
  return { title, body };
}

/**
 * renderSectionHtml — assemble the final HTML for one section, including the
 * topic header, essay title, attribution/date metadata, and body paragraphs.
 *
 * @param {string} topicLabel — e.g. 'Supply & Generics'
 * @param {string} essayTitle — Claude-emitted title; may be empty
 * @param {string} sendDate — YYYY-MM-DD scheduled send date (kept for signature
 *   stability; the visible body line below uses the draft-creation date instead
 *   so the date the reader sees matches the day the draft was actually written).
 * @param {string} bodyText — raw body after TITLE: removed, or direct HTML
 * @returns {string}
 */
export function renderSectionHtml(topicLabel, essayTitle, sendDate, bodyText) {
  // Convert body to HTML paragraphs if it isn't already HTML.
  let bodyHtml;
  if (bodyText.trim().startsWith('<')) {
    bodyHtml = bodyText.trim();
  } else {
    const paragraphs = bodyText.trim().split(/\n\n+/);
    bodyHtml = paragraphs.map(p => `<p>${p.replace(/\n/g, ' ').trim()}</p>`).join('\n');
  }

  // Visible date stamp = the day the draft is rendered (not the rotation send
  // date). Filenames, briefs, and the Beehiiv copy-paste header still use the
  // scheduled send date — only the reader-facing "psychopharmref.com · DATE"
  // line is anchored to "today" per Jerad's request on 2026-04-26.
  const draftDate = new Date().toISOString().slice(0, 10);

  const lines = [];
  if (topicLabel) lines.push(`<h2>${topicLabel}</h2>`);
  if (essayTitle) lines.push(`<h3>${essayTitle}</h3>`);
  lines.push(`<p class="newsletter-meta"><em>psychopharmref.com · ${draftDate}</em></p>`);
  lines.push(bodyHtml);
  return lines.join('\n');
}

/**
 * draftSection — calls Claude to draft one newsletter section, then renders
 * the full section HTML including topic header, essay title, and attribution.
 *
 * @param {string} topicKey
 * @param {object} brief
 * @param {object} config
 * @param {{ sendDate?: string }} [options]
 * @returns {string} HTML string
 */
export async function draftSection(topicKey, brief, config, options = {}) {
  const topicConf = config?.topics?.[topicKey] || {};
  const section = topicConf.section || 's1';
  const topicLabel = topicConf.label || topicKey;
  const sendDate = options.sendDate || new Date().toISOString().slice(0, 10);

  try {
    // Select model: S3 topics get claude-opus-4-6, others get claude-sonnet-4-6
    const model = section === 's3'
      ? (config?.claudeModels?.s3 || 'claude-opus-4-6')
      : (config?.claudeModels?.default || 'claude-sonnet-4-6');

    // If the fallback chain escalated to evergreen, load the evergreen prompt
    // for this section instead of the topic-specific one, and skip the recency
    // guard (evergreen pieces are not time-bound).
    const useEvergreen = brief?.fallback === 'evergreen';
    const templateText = loadPromptTemplate(topicKey, { evergreen: useEvergreen });
    const recencyGuard = useEvergreen ? '' : buildRecencyGuard(topicKey, config);
    const fullPrompt = injectBrief(templateText, brief, recencyGuard);

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: fullPrompt }],
    });

    const text = message.content?.[0]?.text || '';
    const { title, body } = extractTitleAndBody(text);
    return renderSectionHtml(topicLabel, title, sendDate, body);
  } catch (err) {
    const status = err?.status ? ` [HTTP ${err.status}]` : '';
    const causeCode = err?.cause?.code ? ` [cause: ${err.cause.code}]` : '';
    const detail = `${err?.name || 'Error'}: ${err?.message || err}${status}${causeCode}`;
    console.error(`[draftSection:${topicKey}] ${detail}`);
    const failBody = `<!-- DRAFT FAILED: ${detail} — fill manually -->`;
    return renderSectionHtml(topicLabel, '', sendDate, failBody);
  }
}

/**
 * generateNewsletterMeta — short Claude call to generate all four newsletter
 * metadata fields: post title, subtitle, email subject line, and inbox
 * preview text. Beehiiv exposes these as four separate compose fields.
 *
 * @param {string} s1Label
 * @param {string} s2Label
 * @param {string} s3Label
 * @param {object} config
 * @returns {{ title: string, subtitle: string, subject: string, previewText: string }}
 */
export async function generateNewsletterMeta(s1Label, s2Label, s3Label, config) {
  const fallback = {
    title: `${s1Label}, ${s2Label}, and ${s3Label}`,
    subtitle: `This week's letter covers ${s1Label.toLowerCase()}, ${s2Label.toLowerCase()}, and ${s3Label.toLowerCase()}.`,
    subject: `${s1Label}, ${s2Label}, and ${s3Label}`,
    previewText: `This week: ${s1Label}, ${s2Label}, and ${s3Label}.`,
  };

  try {
    const promptPath = path.join(promptsDir, 'subject-line.md');
    let systemPrompt = '';
    if (fs.existsSync(promptPath)) {
      systemPrompt = fs.readFileSync(promptPath, 'utf8').trim();
    } else {
      systemPrompt = 'Generate newsletter metadata as JSON with keys title, subtitle, subject, previewText.';
    }

    const userMessage = `Section 1: ${s1Label}\nSection 2: ${s2Label}\nSection 3: ${s3Label}`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: config?.claudeModels?.default || 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [
        { role: 'user', content: `${systemPrompt}\n\n${userMessage}` },
      ],
    });

    const text = message.content?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: (parsed.title || fallback.title).trim(),
        subtitle: (parsed.subtitle || fallback.subtitle).trim(),
        subject: (parsed.subject || fallback.subject).trim(),
        previewText: (parsed.previewText || fallback.previewText).trim(),
      };
    }
    return fallback;
  } catch (err) {
    console.error(`[newsletter-meta] Claude call failed: ${err?.name || 'Error'} — ${err?.message || err}`);
    if (err?.cause) {
      console.error(`[newsletter-meta] cause: ${err.cause?.code || ''} ${err.cause?.message || ''}`);
    }
    if (err?.status) {
      console.error(`[newsletter-meta] HTTP status: ${err.status}`);
    }
    return fallback;
  }
}

/**
 * generateSubjectAndPreview — legacy alias retained for backward compatibility.
 * New callers should use generateNewsletterMeta directly.
 *
 * @deprecated Use generateNewsletterMeta instead.
 */
export async function generateSubjectAndPreview(s1Label, s2Label, s3Label, config) {
  const meta = await generateNewsletterMeta(s1Label, s2Label, s3Label, config);
  return { subject: meta.subject, previewText: meta.previewText };
}

/**
 * assembleHtml — assembles final newsletter HTML from 3 section strings.
 *
 * @param {string[]} sections — array of 3 HTML strings
 * @param {Array<Array>} blogPosts — array of 3 arrays of { title, url } objects
 * @param {object} cta — { commentsUrl, upgradeUrl }
 * @returns {string}
 */
/**
 * escapeHtml — conservative escape for text inserted into the copy-paste block.
 */
function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Marker comments used by runPost to extract body-only HTML for clipboard copy.
export const BODY_START_MARKER = '<!-- BEEHIIV_BODY_START -->';
export const BODY_END_MARKER = '<!-- BEEHIIV_BODY_END -->';

// REVIEW_ONLY markers fence content that should appear in the saved HTML for
// in-browser review (e.g., the xAI conflict banners) but MUST be stripped
// before the body is copied to Beehiiv. extractBodyOnly() removes anything
// between these markers, inclusive.
export const REVIEW_ONLY_START = '<!-- REVIEW_ONLY_START -->';
export const REVIEW_ONLY_END = '<!-- REVIEW_ONLY_END -->';

/**
 * renderCopyPasteBlock — builds the styled block of Beehiiv compose fields
 * that appears at the top of the saved HTML file. When the HTML file is opened
 * in a browser, this block is prominently visible so the user can copy each
 * field into Beehiiv. The --post step copies ONLY the body (between markers)
 * to the clipboard, so this block is not pasted into Beehiiv's HTML editor.
 */
export function renderCopyPasteBlock(meta, sendDate) {
  const m = meta || {};
  const title = escapeHtml(m.title || '');
  const subtitle = escapeHtml(m.subtitle || '');
  const subject = escapeHtml(m.subject || '');
  const preview = escapeHtml(m.previewText || '');
  const date = escapeHtml(sendDate || '');

  return [
    `<!--`,
    `  BEEHIIV COPY-PASTE FIELDS (send date ${date || 'N/A'})`,
    `  TITLE:         ${m.title || ''}`,
    `  SUBTITLE:      ${m.subtitle || ''}`,
    `  EMAIL SUBJECT: ${m.subject || ''}`,
    `  PREVIEW TEXT:  ${m.previewText || ''}`,
    `-->`,
    `<div style="background:#fff8dc;padding:1em 1.25em;margin-bottom:2em;border:2px dashed #999;font-family:'SF Mono',Menlo,monospace;font-size:0.9em;line-height:1.4;">`,
    `  <p style="margin:0 0 0.5em 0;font-weight:bold;font-size:1.05em;">Beehiiv compose fields — copy each into the matching Beehiiv field</p>`,
    `  <p style="margin:0.3em 0;"><strong>Title:</strong> ${title}</p>`,
    `  <p style="margin:0.3em 0;"><strong>Subtitle:</strong> ${subtitle}</p>`,
    `  <p style="margin:0.3em 0;"><strong>Email subject:</strong> ${subject}</p>`,
    `  <p style="margin:0.3em 0;"><strong>Preview text:</strong> ${preview}</p>`,
    `  <p style="margin:0.75em 0 0 0;font-size:0.85em;color:#666;">The HTML body below these fields goes into Beehiiv's HTML editor. The <code>--post</code> command copies only the body to your clipboard.</p>`,
    `</div>`,
  ].join('\n');
}

/**
 * renderConflictBanner — render a per-section "xAI flagged" review banner
 * surfacing this section's xaiConflicts entries. The banner is fenced with
 * REVIEW_ONLY markers so extractBodyOnly() strips it from the Beehiiv clipboard.
 *
 * Visual treatment: red border + "REVIEW ONLY — NOT FOR PUBLICATION" header,
 * deliberately ugly so it's impossible to mistake for newsletter content.
 *
 * Returns '' if the brief is missing or has no conflicts (banner suppressed).
 *
 * @param {object} brief — must have .xaiConflicts array; may have .xaiSummary
 * @param {string} sectionLabel — e.g. "Section 1: Newly Approved Medications"
 * @returns {string} HTML
 */
export function renderConflictBanner(brief, sectionLabel) {
  const conflicts = (brief && brief.xaiConflicts) || [];
  if (conflicts.length === 0) return '';

  const items = conflicts.map(c => {
    const sevColor = c.severity === 'high' ? '#b91c1c'
                   : c.severity === 'medium' ? '#c2410c'
                   : '#a16207';
    const title = escapeHtml(c.sourceTitle || `(source ${c.sourceIndex})`);
    const reason = escapeHtml(c.reasoning || '');
    const url = c.sourceUrl ? `<a href="${escapeHtml(c.sourceUrl)}" style="color:#1e3a8a;">link</a>` : '';
    return [
      `    <li style="margin:0.5em 0;">`,
      `      <span style="display:inline-block;padding:0.1em 0.5em;background:${sevColor};color:#fff;border-radius:3px;font-size:0.8em;font-weight:bold;text-transform:uppercase;margin-right:0.5em;">${escapeHtml(c.severity || 'low')}</span>`,
      `      <strong>Source ${c.sourceIndex}:</strong> ${title} ${url}`,
      `      <div style="margin-top:0.25em;color:#333;">${reason}</div>`,
      `    </li>`,
    ].join('\n');
  }).join('\n');

  const summary = brief.xaiSummary
    ? `<p style="margin:0 0 0.5em 0;color:#444;font-style:italic;">Grok summary: ${escapeHtml(brief.xaiSummary)}</p>`
    : '';

  return [
    REVIEW_ONLY_START,
    `<div style="border:3px solid #b91c1c;background:#fef2f2;padding:0.75em 1em;margin:1.5em 0 0.5em 0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">`,
    `  <p style="margin:0 0 0.4em 0;font-size:0.85em;font-weight:bold;color:#b91c1c;letter-spacing:0.05em;">⚠ REVIEW ONLY — xAI flagged ${conflicts.length} source${conflicts.length === 1 ? '' : 's'} in ${escapeHtml(sectionLabel)}</p>`,
    `  ${summary}`,
    `  <ul style="margin:0;padding-left:1.5em;font-size:0.95em;line-height:1.5;">`,
    items,
    `  </ul>`,
    `  <p style="margin:0.6em 0 0 0;font-size:0.8em;color:#666;">This banner is stripped automatically when --post copies the body to Beehiiv. To suppress, edit the brief JSON and re-run --draft.</p>`,
    `</div>`,
    REVIEW_ONLY_END,
  ].join('\n');
}

/**
 * assembleHtml — assembles the final newsletter HTML, with an optional
 * copy-paste metadata block prepended and body markers around the content.
 *
 * @param {string[]} sections — array of 3 section HTML strings
 * @param {Array<Array>} blogPosts — array of 3 arrays of { title, url } objects
 * @param {object} cta — { commentsUrl, upgradeUrl }
 * @param {{ title, subtitle, subject, previewText }} [meta] — optional meta
 * @param {string} [sendDate] — optional YYYY-MM-DD for the meta header
 * @param {object[]} [briefs] — optional array of 3 briefs; if a brief has
 *   .xaiConflicts entries a review-only banner is inserted above its section
 * @returns {string}
 */
export function assembleHtml(sections, blogPosts, cta, meta, sendDate, briefs) {
  const sectionLabels = ['Section 1', 'Section 2', 'Section 3'];
  const parts = [];

  // Optional copy-paste header block for manual Beehiiv handoff.
  if (meta) {
    parts.push(renderCopyPasteBlock(meta, sendDate));
  }

  // Body start marker — runPost uses this to extract body-only HTML.
  parts.push(BODY_START_MARKER);

  sections.forEach((sectionHtml, i) => {
    const label = sectionLabels[i];
    parts.push(`<!-- ${label} -->`);

    // Pre-section xAI conflict banner (review-only; stripped by extractBodyOnly).
    const brief = briefs && briefs[i];
    if (brief) {
      const banner = renderConflictBanner(brief, label);
      if (banner) parts.push(banner);
    }

    parts.push(sectionHtml);

    const posts = blogPosts[i] || [];
    if (posts.length > 0) {
      const links = posts.map(p => `<a href="${p.url}">${p.title}</a>`).join(', ');
      parts.push(`<p><strong>Further reading on PsychoPharmRef:</strong> ${links}</p>`);
    }

    parts.push('<hr />');
  });

  // CTA block
  const commentsUrl = cta?.commentsUrl || 'https://psychopharmref.com';
  const upgradeUrl = cta?.upgradeUrl || 'https://psychopharmref.com';
  parts.push(`<!-- CTA -->`);
  parts.push(`<p>Found this useful? <a href="${commentsUrl}">Reply to this email with your thoughts</a>, or <a href="${upgradeUrl}">become a paid supporter</a> to keep this going.</p>`);

  // Body end marker.
  parts.push(BODY_END_MARKER);

  return parts.join('\n');
}

/**
 * extractBodyOnly — returns the HTML between BODY_START and BODY_END markers,
 * suitable for pasting into Beehiiv's HTML editor without the copy-paste header.
 * Falls back to the full input if markers are not found (older drafts).
 *
 * Also strips any REVIEW_ONLY blocks (e.g. xAI conflict banners) — these are
 * meant for in-browser review of the saved draft, NOT for Beehiiv. The strip
 * is defense in depth: even if a banner accidentally lands inside the body
 * markers, this regex removes it before clipboard copy.
 */
export function extractBodyOnly(fullHtml) {
  const s = fullHtml.indexOf(BODY_START_MARKER);
  const e = fullHtml.indexOf(BODY_END_MARKER);
  let body = (s === -1 || e === -1 || e < s)
    ? fullHtml
    : fullHtml.slice(s + BODY_START_MARKER.length, e);
  // Strip REVIEW_ONLY blocks (multi-line, non-greedy).
  body = body.replace(
    /<!-- REVIEW_ONLY_START -->[\s\S]*?<!-- REVIEW_ONLY_END -->/g,
    ''
  );
  return body.trim();
}
