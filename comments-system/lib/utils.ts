// lib/utils.ts
// Content validation utilities: profanity filter, link detection, image detection.
// Used by BOTH client-side (instant feedback) and server actions (authoritative check).

import type { CommentValidationResult } from "@/types";

// ── Profanity Word List ────────────────────────────────────────────────
// A robust but non-exhaustive list. Extend as needed.
// Words are matched as whole words (word-boundary regex) to avoid false positives.
const PROFANITY_LIST: string[] = [
  // Core profanity — English
  "fuck", "fucking", "fucked", "fucker", "fucks", "fuckwit", "fuckoff",
  "shit", "shitting", "shitty", "shithead", "bullshit",
  "ass", "asshole", "asses", "arsehole", "arse",
  "bitch", "bitches", "bitching",
  "damn", "damned", "damnit", "goddamn", "goddamnit",
  "hell", "crap", "crappy",
  "dick", "dicks", "dickhead",
  "cock", "cocks", "cocksucker",
  "cunt", "cunts",
  "bastard", "bastards",
  "whore", "whores",
  "slut", "sluts",
  "piss", "pissed", "pissing",
  "tits", "titty",
  "wanker", "wankers", "wank",
  "twat", "twats",
  "retard", "retarded", "retards",
  // Slurs (abbreviated/partial to avoid printing full slurs in source)
  "nigger", "nigga", "faggot", "fag", "dyke", "spic", "chink", "kike",
  "wetback", "beaner", "gook", "tranny",
  // Leet-speak / evasion patterns
  "f u c k", "s h i t", "b i t c h", "a s s",
  "fck", "fuk", "phuck", "phuk", "sh1t", "a$$", "b1tch",
  "stfu", "gtfo", "lmfao",
];

// Build a single RegExp that matches any profanity as a whole word (case-insensitive).
const profanityPattern = new RegExp(
  "\\b(" + PROFANITY_LIST.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\b",
  "i"
);

/**
 * Check if text contains profanity.
 * Returns the matched word if found, or null if clean.
 */
export function detectProfanity(text: string): string | null {
  const match = text.match(profanityPattern);
  return match ? match[0] : null;
}

// ── Link / URL Detection ──────────────────────────────────────────────
// Catches http(s), www, ftp, and bare domain patterns like "example.com".
const LINK_PATTERN =
  /(?:https?:\/\/|ftp:\/\/|www\.)[^\s]+|[a-zA-Z0-9][-a-zA-Z0-9]*\.(com|org|net|io|co|me|info|biz|dev|app|xyz|edu|gov|mil|us|uk|ca|au)\b/i;

/**
 * Check if text contains any link or URL-like pattern.
 */
export function detectLink(text: string): boolean {
  return LINK_PATTERN.test(text);
}

// ── Image / Embed Detection ───────────────────────────────────────────
// Catches markdown images, HTML <img> tags, and common image extensions.
const IMAGE_PATTERNS = [
  /!\[.*?\]\(.*?\)/,                        // Markdown image: ![alt](url)
  /<img[\s>]/i,                             // HTML <img> tag
  /\.(jpg|jpeg|png|gif|bmp|svg|webp|ico|tiff?)\b/i,  // Image file extensions
  /data:image\//i,                          // Base64 image data URIs
  /<picture[\s>]/i,                         // HTML <picture> tag
];

/**
 * Check if text contains any image or image-embed pattern.
 */
export function detectImage(text: string): boolean {
  return IMAGE_PATTERNS.some((pattern) => pattern.test(text));
}

// ── Combined Validation ───────────────────────────────────────────────
/**
 * Validate a comment body against all content rules.
 * Returns { valid: true } or { valid: false, error: "..." }.
 */
export function validateCommentContent(body: string): CommentValidationResult {
  // Trim and check empty
  const trimmed = body.trim();
  if (!trimmed) {
    return { valid: false, error: "Comment cannot be empty." };
  }

  // Length check
  if (trimmed.length > 2000) {
    return { valid: false, error: "Comment cannot exceed 2,000 characters." };
  }

  // Link check
  if (detectLink(trimmed)) {
    return {
      valid: false,
      error: "Links and URLs are not allowed in comments. Please remove any links and try again.",
    };
  }

  // Image check
  if (detectImage(trimmed)) {
    return {
      valid: false,
      error: "Images and image embeds are not allowed in comments. Please remove any image references and try again.",
    };
  }

  // Profanity check
  const profanityMatch = detectProfanity(trimmed);
  if (profanityMatch) {
    return {
      valid: false,
      error: "Your comment contains language that violates our community guidelines. Please revise and try again.",
    };
  }

  return { valid: true };
}

// ── Utility: Generate initials from a username ────────────────────────
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ── Utility: Generate a deterministic color for an avatar ─────────────
const AVATAR_COLORS = [
  "#4a7c35", "#8b6914", "#2563eb", "#7c3aed", "#db2777",
  "#059669", "#d97706", "#dc2626", "#4f46e5", "#0891b2",
];

export function getAvatarColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
