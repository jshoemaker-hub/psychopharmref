// lib/draft.js — Claude API calls, prompt loading, and HTML assembly

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.join(__dirname, '..', 'prompts');

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
 * @param {string} topicKey — e.g. 's1-new-approvals'
 * @returns {string} template text
 */
export function loadPromptTemplate(topicKey) {
  const filePath = path.join(promptsDir, `${topicKey}.md`);

  let text;
  if (fs.existsSync(filePath)) {
    text = fs.readFileSync(filePath, 'utf8');
  } else {
    // No topic-specific file — use generic template
    return GENERIC_TEMPLATE;
  }

  // Strip <!-- PERPLEXITY_QUERY ... --> comment block (may span multiple lines)
  text = text.replace(/<!--\s*PERPLEXITY_QUERY[\s\S]*?-->/g, '');

  // Strip lines containing [RECENCY_GUARD...] marker comments
  text = text.replace(/^.*\[RECENCY_GUARD[^\]]*\][^\n]*\n?/gm, '');

  return text.trim();
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
 *
 * @param {string} templateText
 * @param {object} brief
 * @param {string} recencyGuard
 * @returns {string}
 */
export function injectBrief(templateText, brief, recencyGuard) {
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
 * draftSection — calls Claude to draft one newsletter section.
 *
 * @param {string} topicKey
 * @param {object} brief
 * @param {object} config
 * @returns {string} HTML string
 */
export async function draftSection(topicKey, brief, config) {
  try {
    const topicConf = config?.topics?.[topicKey] || {};
    const section = topicConf.section || 's1';

    // Select model: S3 topics get claude-opus-4-6, others get claude-sonnet-4-6
    const model = section === 's3'
      ? (config?.claudeModels?.s3 || 'claude-opus-4-6')
      : (config?.claudeModels?.default || 'claude-sonnet-4-6');

    const templateText = loadPromptTemplate(topicKey);
    const recencyGuard = buildRecencyGuard(topicKey, config);
    const fullPrompt = injectBrief(templateText, brief, recencyGuard);

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: fullPrompt }],
    });

    const text = message.content?.[0]?.text || '';
    // Wrap in paragraph tags if not already HTML
    if (text.trim().startsWith('<')) {
      return text.trim();
    }
    // Convert plain text paragraphs to HTML p tags
    const paragraphs = text.trim().split(/\n\n+/);
    return paragraphs.map(p => `<p>${p.replace(/\n/g, ' ').trim()}</p>`).join('\n');
  } catch (err) {
    return `<!-- DRAFT FAILED: ${err.message} — fill manually -->`;
  }
}

/**
 * generateSubjectAndPreview — short Claude call to generate subject line and preview text.
 *
 * @param {string} s1Label
 * @param {string} s2Label
 * @param {string} s3Label
 * @param {object} config
 * @returns {{ subject: string, previewText: string }}
 */
export async function generateSubjectAndPreview(s1Label, s2Label, s3Label, config) {
  try {
    const promptPath = path.join(promptsDir, 'subject-line.md');
    let systemPrompt = '';
    if (fs.existsSync(promptPath)) {
      systemPrompt = fs.readFileSync(promptPath, 'utf8').trim();
    } else {
      systemPrompt = 'Generate a newsletter subject line and preview text as JSON: { "subject": "...", "previewText": "..." }. Subject should be ~60 chars, clinical-audience appropriate. Preview should be 1 sentence.';
    }

    const userMessage = `Section 1: ${s1Label}\nSection 2: ${s2Label}\nSection 3: ${s3Label}`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: config?.claudeModels?.default || 'claude-sonnet-4-6',
      max_tokens: 256,
      messages: [
        { role: 'user', content: `${systemPrompt}\n\n${userMessage}` },
      ],
    });

    const text = message.content?.[0]?.text || '';
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        subject: parsed.subject || `PsychoPharmRef Weekly: ${s1Label}`,
        previewText: parsed.previewText || `This week: ${s1Label}, ${s2Label}, and ${s3Label}.`,
      };
    }

    return {
      subject: `PsychoPharmRef Weekly: ${s1Label}`,
      previewText: `This week: ${s1Label}, ${s2Label}, and ${s3Label}.`,
    };
  } catch (err) {
    return {
      subject: `PsychoPharmRef Weekly: ${s1Label}`,
      previewText: `This week: ${s1Label}, ${s2Label}, and ${s3Label}.`,
    };
  }
}

/**
 * assembleHtml — assembles final newsletter HTML from 3 section strings.
 *
 * @param {string[]} sections — array of 3 HTML strings
 * @param {Array<Array>} blogPosts — array of 3 arrays of { title, url } objects
 * @param {object} cta — { commentsUrl, upgradeUrl }
 * @returns {string}
 */
export function assembleHtml(sections, blogPosts, cta) {
  const sectionLabels = ['Section 1', 'Section 2', 'Section 3'];
  const parts = [];

  sections.forEach((sectionHtml, i) => {
    const label = sectionLabels[i];
    parts.push(`<!-- ${label} -->`);
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

  return parts.join('\n');
}
