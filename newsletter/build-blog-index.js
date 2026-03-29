#!/usr/bin/env node
// build-blog-index.js — Scrapes blog/*.html and writes newsletter/blog-index.json
// Run: node newsletter/build-blog-index.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.resolve(__dirname, '..', 'blog');
const outputPath = path.join(__dirname, 'blog-index.json');

/**
 * Extract text content between tags (first occurrence).
 * @param {string} html
 * @param {string} openTag — regex-safe open tag, e.g. '<title>'
 * @param {string} closeTag
 * @returns {string}
 */
function extractTag(html, openTag, closeTag) {
  const regex = new RegExp(`${openTag}([\\s\\S]*?)${closeTag}`, 'i');
  const match = regex.exec(html);
  return match ? match[1].trim() : '';
}

/**
 * Extract og:description meta content.
 */
function extractOgDescription(html) {
  const regex = /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i;
  const match = regex.exec(html);
  if (match) return match[1].trim();
  // Also try reversed attribute order
  const regex2 = /<meta\s+content=["']([^"']*)["']\s+property=["']og:description["']/i;
  const match2 = regex2.exec(html);
  return match2 ? match2[1].trim() : '';
}

/**
 * Extract first <p> tag text content inside an <article> element.
 */
function extractFirstParagraph(html) {
  // Find article section
  const articleMatch = /<article[\s\S]*?>([\s\S]*)/i.exec(html);
  const searchText = articleMatch ? articleMatch[1] : html;

  const pMatch = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(searchText);
  if (!pMatch) return '';

  // Strip inner HTML tags
  return pMatch[1].replace(/<[^>]+>/g, '').trim();
}

function processFile(filename) {
  const filePath = path.join(blogDir, filename);
  const html = fs.readFileSync(filePath, 'utf8');

  // Extract title, strip " | PsychoPharmRef" suffix
  let title = extractTag(html, '<title>', '</title>');
  title = title.replace(/\s*\|\s*PsychoPharmRef\s*$/i, '').trim();

  const description = extractOgDescription(html);
  const firstParagraph = extractFirstParagraph(html);

  const url = `${config.blogBaseUrl}/blog/${filename}`;

  return { title, url, description, firstParagraph, filename };
}

function main() {
  if (!fs.existsSync(blogDir)) {
    console.error(`Blog directory not found: ${blogDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.html') && f !== 'blog.css');

  console.log(`Found ${files.length} blog HTML files in ${blogDir}`);

  const index = [];
  const errors = [];

  for (const filename of files) {
    try {
      const entry = processFile(filename);
      index.push(entry);
    } catch (err) {
      errors.push({ filename, error: err.message });
      console.warn(`  Warning: failed to process ${filename}: ${err.message}`);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`\nWrote blog-index.json with ${index.length} entries to ${outputPath}`);

  if (errors.length > 0) {
    console.warn(`\n${errors.length} files had errors (skipped):`);
    errors.forEach(e => console.warn(`  - ${e.filename}: ${e.error}`));
  }
}

main();
