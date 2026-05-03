/**
 * ace-tool.js — Aid to Capacity Evaluation (ACE)
 *
 * Etchells E, et al. Joint Centre for Bioethics, University of Toronto.
 * Seven-domain capacity assessment for a specific medical decision:
 *   1. Understanding the medical problem
 *   2. Understanding the proposed treatment
 *   3. Understanding alternatives to the proposed treatment
 *   4. Understanding the option of refusing/withdrawing treatment
 *   5. Appreciating reasonably foreseeable consequences of accepting
 *   6. Appreciating reasonably foreseeable consequences of refusing
 *   7a. Decision affected by depression
 *   7b. Decision affected by delusions/psychosis
 *
 * For domains 1-6: YES = appropriate response to open-ended questions;
 * UNSURE = needs prompting with closed-ended questions; NO = cannot
 * respond appropriately despite repeated prompting.
 *
 * For domain 7: YES = decision IS affected by depression/psychosis.
 * (Note: this is the only place where a YES is unfavourable.)
 *
 * Overall impression: Definitely Capable / Probably Capable /
 * Probably Incapable / Definitely Incapable. Presumption is capacity;
 * if uncertain, err on the side of capable.
 */
(function () {
  'use strict';

  // ===== Domain definitions =====
  var domains = [
    {
      id: '1',
      title: 'Able to understand medical problem',
      prompts: [
        'What problems are you having right now?',
        'What problem is bothering you most?',
        'Why are you in the hospital?',
        'Do you have [name problem here]?'
      ],
      type: 'understanding'
    },
    {
      id: '2',
      title: 'Able to understand proposed treatment',
      prompts: [
        'What is the treatment for [your problem]?',
        'What else can we do to help you?',
        'Can you have [proposed treatment]?'
      ],
      type: 'understanding'
    },
    {
      id: '3',
      title: 'Able to understand alternative to proposed treatment (if any)',
      prompts: [
        'Are there any other [treatments]?',
        'What other options do you have?',
        'Can you have [alternative treatment]?'
      ],
      type: 'understanding'
    },
    {
      id: '4',
      title: 'Able to understand option of refusing proposed treatment',
      prompts: [
        'Can you refuse [proposed treatment]?',
        'Can we stop [proposed treatment]?'
      ],
      type: 'understanding',
      note: 'Includes withholding or withdrawing the proposed treatment.'
    },
    {
      id: '5',
      title: 'Able to appreciate reasonably foreseeable consequences of accepting',
      prompts: [
        'What could happen to you if you have [proposed treatment]?',
        'Can [proposed treatment] cause problems/side effects?',
        'Can [proposed treatment] help you live longer?'
      ],
      type: 'appreciation'
    },
    {
      id: '6',
      title: 'Able to appreciate reasonably foreseeable consequences of refusing',
      prompts: [
        'What could happen to you if you don’t have [proposed treatment]?',
        'Could you get sicker/die if you don’t have [proposed treatment]?',
        'What could happen if you have [alternative treatment]? (if alternatives are available)'
      ],
      type: 'appreciation'
    },
    {
      id: '7a',
      title: 'Decision affected by depression',
      prompts: [
        'Can you help me understand why you’ve decided to accept/refuse treatment?',
        'Do you feel that you’re being punished?',
        'Do you think you’re a bad person?',
        'Do you have any hope for the future?',
        'Do you deserve to be treated?'
      ],
      type: 'affect',
      note: 'YES = decision IS affected by depression. Look for hopelessness, worthlessness, guilt, or punishment themes.'
    },
    {
      id: '7b',
      title: 'Decision affected by delusions/psychosis',
      prompts: [
        'Can you help me understand why you’ve decided to accept/refuse treatment?',
        'Do you think anyone is trying to hurt/harm you?',
        'Do you trust your doctor/nurse?'
      ],
      type: 'affect',
      note: 'YES = decision IS affected by psychosis or delusion.'
    }
  ];

  // ===== Build domain UI =====
  function buildDomains() {
    var container = document.getElementById('ace-domains');
    if (!container) return;
    container.innerHTML = '';

    domains.forEach(function (d) {
      var isAffect = d.type === 'affect';
      var promptHtml = '<strong>Sample questions:</strong> ' +
        d.prompts.map(function (p) { return escapeHtml(p); }).join(' &middot; ');
      var noteHtml = d.note
        ? '<div class="ace-warning-pill">' + escapeHtml(d.note) + '</div>'
        : '';

      var wrap = document.createElement('div');
      wrap.className = 'ace-domain' + (isAffect ? ' ace-domain-7' : '');
      wrap.innerHTML =
        '<div class="ace-domain-header">' +
          '<span class="ace-domain-num' + (isAffect ? ' ace-num-7' : '') + '">' + escapeHtml(d.id) + '</span>' +
          '<span class="ace-domain-title">' + escapeHtml(d.title) + '</span>' +
        '</div>' +
        '<div class="ace-domain-prompts">' + promptHtml + '</div>' +
        noteHtml +
        '<div class="ace-score-row" role="radiogroup" aria-label="Score for domain ' + escapeHtml(d.id) + '">' +
          radio(d.id, 'yes',    'YES') +
          radio(d.id, 'unsure', 'UNSURE') +
          radio(d.id, 'no',     'NO') +
        '</div>' +
        '<label class="ace-field-label" for="ace-obs-' + d.id + '">Observations / patient’s words</label>' +
        '<textarea id="ace-obs-' + d.id + '" class="ace-textarea" rows="2" placeholder="Record exact responses or observations supporting the score"></textarea>';

      container.appendChild(wrap);
    });
  }

  function radio(domainId, value, label) {
    var name = 'ace-d' + domainId;
    return '<label><input type="radio" name="' + name + '" value="' + value + '"><span>' + label + '</span></label>';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ===== Read selected score for a domain =====
  function getScore(domainId) {
    var checked = document.querySelector('input[name="ace-d' + domainId + '"]:checked');
    return checked ? checked.value : '';
  }

  function scoreLabel(v) {
    if (v === 'yes')    return 'YES';
    if (v === 'unsure') return 'UNSURE';
    if (v === 'no')     return 'NO';
    return '(not scored)';
  }

  function impressionLabel() {
    var checked = document.querySelector('input[name="ace-impression"]:checked');
    if (!checked) return '';
    var map = {
      'def-cap':   'Definitely Capable',
      'prob-cap':  'Probably Capable',
      'prob-inc':  'Probably Incapable',
      'def-inc':   'Definitely Incapable'
    };
    return map[checked.value] || '';
  }

  // ===== Generate report =====
  function generate() {
    var dateStr   = document.getElementById('ace-date-display').textContent;
    var patient   = (document.getElementById('ace-patient').value || '').trim();
    var assessor  = (document.getElementById('ace-assessor').value || '').trim();
    var minutes   = (document.getElementById('ace-minutes').value || '').trim();
    var condition = (document.getElementById('ace-condition').value || '').trim();
    var treatment = (document.getElementById('ace-treatment').value || '').trim();
    var alts      = (document.getElementById('ace-alternatives').value || '').trim();
    var comments  = (document.getElementById('ace-comments').value || '').trim();
    var impression = impressionLabel();

    var lines = [];
    lines.push('AID TO CAPACITY EVALUATION (ACE)');
    lines.push('Date: ' + dateStr);
    if (patient)  lines.push('Patient: ' + patient);
    if (assessor) lines.push('Assessor: ' + assessor);
    if (minutes)  lines.push('Time to administer: ' + minutes + ' minutes');
    lines.push('');

    lines.push('DECISION CONTEXT');
    lines.push('Medical condition: ' + (condition || '(not specified)'));
    lines.push('Proposed treatment: ' + (treatment || '(not specified)'));
    lines.push('Alternatives discussed: ' + (alts || '(none / not specified)'));
    lines.push('');

    lines.push('DOMAIN SCORES');
    domains.forEach(function (d) {
      var v = getScore(d.id);
      var obs = (document.getElementById('ace-obs-' + d.id).value || '').trim();
      lines.push('  ' + d.id + '. ' + d.title);
      lines.push('     Score: ' + scoreLabel(v));
      if (obs) {
        obs.split(/\r?\n/).forEach(function (line) {
          lines.push('     Obs: ' + line);
        });
      }
    });
    lines.push('');

    lines.push('OVERALL IMPRESSION: ' + (impression || '(not selected)'));

    if (comments) {
      lines.push('');
      lines.push('COMMENTS');
      comments.split(/\r?\n/).forEach(function (line) { lines.push('  ' + line); });
    }

    lines.push('');
    lines.push('NOTES');
    lines.push('  - Capacity is decision-specific. This assessment applies only to the decision listed above.');
    lines.push('  - People are presumed capable; if uncertain, err on the side of calling the person capable.');
    lines.push('  - A finding of incapacity should not rest solely on domains 7a/7b; obtain an independent assessment when depression or psychosis appears to drive the decision.');
    lines.push('  - If incapacity is suspected, address treatable/reversible causes (e.g., delirium, drug toxicity, pain, communication barriers) and re-assess.');

    var text = lines.join('\n');
    var pre = document.getElementById('ace-output-text');
    pre.textContent = text;
    document.getElementById('ace-output').classList.remove('ace-hidden');
    document.getElementById('ace-output').scrollIntoView({ behavior: 'smooth', block: 'start' });

    var btn = document.getElementById('ace-generate-btn');
    ToolUtils.copyWithButton(text, btn);
  }

  function copy() {
    var text = document.getElementById('ace-output-text').textContent;
    var status = document.getElementById('ace-copy-status');
    navigator.clipboard.writeText(text).then(function () {
      status.classList.add('visible');
      setTimeout(function () { status.classList.remove('visible'); }, 1800);
    });
  }

  function reset() {
    ToolUtils.confirmReset('Reset the entire ACE form?', function () {
      ['ace-patient', 'ace-assessor', 'ace-minutes',
       'ace-condition', 'ace-treatment', 'ace-alternatives',
       'ace-comments'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
      });
      domains.forEach(function (d) {
        var obs = document.getElementById('ace-obs-' + d.id);
        if (obs) obs.value = '';
      });
      document.querySelectorAll('#ace-tool input[type="radio"]').forEach(function (r) { r.checked = false; });
      document.getElementById('ace-output').classList.add('ace-hidden');
      var content = document.getElementById('content');
      if (content) content.scrollTop = 0;
    });
  }

  function printForm() {
    if (typeof window.printBlankForm === 'function') {
      window.printBlankForm('ace');
    } else {
      // Lazy-load the print-forms script if it has not been pulled in yet
      var s = document.createElement('script');
      s.src = 'js/tools/print-forms.js?v=20260503a';
      s.onload = function () {
        if (typeof window.printBlankForm === 'function') window.printBlankForm('ace');
      };
      document.body.appendChild(s);
    }
  }

  // ===== Init =====
  buildDomains();
  var dateDisplay = document.getElementById('ace-date-display');
  if (dateDisplay) dateDisplay.textContent = ToolUtils.dateStamp();

  // Wire up
  document.getElementById('ace-generate-btn').addEventListener('click', generate);
  document.getElementById('ace-copy-btn').addEventListener('click', copy);
  document.getElementById('ace-reset-btn').addEventListener('click', reset);
  var printBtn = document.getElementById('ace-print-btn');
  if (printBtn) printBtn.addEventListener('click', printForm);
})();
