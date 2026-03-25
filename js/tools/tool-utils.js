/**
 * tool-utils.js — Shared utilities for PsychoPharmRef clinical tools.
 *
 * Loaded before any individual tool script. Provides common operations
 * so each tool doesn't have to reimplement them:
 *   - Copy-to-clipboard with button feedback
 *   - Copy-to-clipboard with message element feedback
 *   - Form reset with confirmation prompt
 *   - Date stamp formatting (consistent across all reports)
 *
 * Usage inside a tool IIFE:
 *   ToolUtils.copyWithButton(text, btn);
 *   ToolUtils.copyWithMessage(text, msgEl);
 *   ToolUtils.confirmReset('Reset all responses?', function() { ... });
 *   var dateStr = ToolUtils.dateStamp();
 */
var ToolUtils = (function() {
  'use strict';

  /**
   * Copy text to clipboard, then briefly change a button's label to "Copied!"
   * This is the most common pattern across tools (PANSS, Y-BOCS, YMRS, etc.)
   *
   * @param {string} text - The text to copy
   * @param {HTMLElement} btn - The button whose text changes to "Copied!"
   * @param {number} [ms=2000] - How long to show "Copied!" (ms)
   */
  function copyWithButton(text, btn, ms) {
    if (!ms) ms = 2000;
    navigator.clipboard.writeText(text).then(function() {
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = orig; }, ms);
    });
  }

  /**
   * Copy text to clipboard, then briefly show a separate message element.
   * Used by CDR, SLUMS, and a few others that display a "Copied to clipboard" div.
   *
   * @param {string} text - The text to copy
   * @param {HTMLElement} msgEl - The element to show/hide
   * @param {number} [ms=2000] - How long to show the message (ms)
   */
  function copyWithMessage(text, msgEl, ms) {
    if (!ms) ms = 2000;
    navigator.clipboard.writeText(text).then(function() {
      msgEl.style.display = 'block';
      setTimeout(function() { msgEl.style.display = 'none'; }, ms);
    });
  }

  /**
   * Prompt the user to confirm a reset, then run the callback if they agree.
   *
   * @param {string} message - The confirmation message (e.g., "Reset all PANSS scores?")
   * @param {Function} callback - Runs if user clicks OK
   */
  function confirmReset(message, callback) {
    if (confirm(message)) {
      callback();
    }
  }

  /**
   * Format today's date for report headers.
   * All tools use the same format: "March 24, 2026"
   *
   * @returns {string} Formatted date string
   */
  function dateStamp() {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Public API
  return {
    copyWithButton: copyWithButton,
    copyWithMessage: copyWithMessage,
    confirmReset: confirmReset,
    dateStamp: dateStamp
  };
})();
