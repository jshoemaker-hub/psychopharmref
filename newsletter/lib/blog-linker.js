// lib/blog-linker.js — TF-IDF blog post similarity scoring

import fs from 'fs';
import natural from 'natural';

const { TfIdf } = natural;

/**
 * buildCorpus — reads blog-index.json and builds a TF-IDF corpus.
 *
 * @param {string} blogIndexPath — absolute path to blog-index.json
 * @returns {{ tfidf: TfIdf, index: Array }} corpus object
 */
export function buildCorpus(blogIndexPath) {
  const raw = fs.readFileSync(blogIndexPath, 'utf8');
  const blogIndex = JSON.parse(raw);

  const tfidf = new TfIdf();

  blogIndex.forEach(post => {
    const docText = [
      post.title || '',
      post.description || '',
      post.firstParagraph || '',
    ].join(' ').toLowerCase();

    tfidf.addDocument(docText);
  });

  return { tfidf, index: blogIndex };
}

/**
 * findRelevantPosts — find blog posts relevant to a query using TF-IDF similarity.
 *
 * Returns top posts above threshold, max 2, sorted by similarity descending.
 * Returns [] if no posts exceed the threshold.
 *
 * @param {string} query — topic key + source excerpts joined
 * @param {{ tfidf: TfIdf, index: Array }} corpus
 * @param {Array} blogIndex — array of blog post metadata objects
 * @param {number} threshold — minimum similarity score (default 0.15)
 * @returns {Array<{ title, url, similarity }>}
 */
export function findRelevantPosts(query, corpus, blogIndex, threshold = 0.15) {
  const { tfidf, index } = corpus;

  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2);

  if (queryTokens.length === 0) return [];

  const scores = [];

  index.forEach((post, docIndex) => {
    let score = 0;

    // Score each query token against this document using TF-IDF
    queryTokens.forEach(token => {
      const tfIdfMeasures = tfidf.tfidf(token, docIndex);
      score += tfIdfMeasures;
    });

    // Normalize by query length to get a comparable score
    const normalizedScore = queryTokens.length > 0 ? score / queryTokens.length : 0;

    if (normalizedScore >= threshold) {
      scores.push({
        title: post.title || '',
        url: post.url || '',
        similarity: normalizedScore,
      });
    }
  });

  // Sort by similarity descending, return top 2
  scores.sort((a, b) => b.similarity - a.similarity);
  return scores.slice(0, 2);
}
