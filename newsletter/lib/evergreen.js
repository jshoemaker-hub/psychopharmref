// lib/evergreen.js - Yearly rotation guard for evergreen safety-net content.

import fs from 'fs';
import path from 'path';

export const EVERGREEN_REPEAT_WINDOW_DAYS = 365;

export const EVERGREEN_CATALOG = {
  s1: [
    {
      id: 's1-fda-approval-pathway',
      title: 'How the FDA drug approval pathway works',
      instructions: 'Cover IND, Phase 1/2/3, NDA/BLA, advisory committees, PDUFA dates, and post-marketing commitments. Emphasize what prescribers see versus what happens behind the scenes.',
    },
    {
      id: 's1-boxed-warnings',
      title: 'How to read a boxed warning without overreacting',
      instructions: 'Explain what boxed warnings legally are, where they sit in labeling, and how to counsel patients when one is added to a drug they already take.',
    },
    {
      id: 's1-rems-program',
      title: 'The REMS program in psychiatric prescribing',
      instructions: 'Explain why REMS exists, how it changes prescribing and dispensing workflows, and which obligations fall on prescribers versus pharmacies or certified sites.',
    },
    {
      id: 's1-drug-shortage-chain',
      title: 'How a drug shortage propagates',
      instructions: 'Trace the path from manufacturer to wholesaler to pharmacy to patient, then give practical prescriber steps for shortages, equivalents, cross-titration, and documentation.',
    },
    {
      id: 's1-generic-substitution',
      title: 'Generic drug substitution and therapeutic equivalence',
      instructions: 'Explain A-rated versus B-rated products in the FDA Orange Book, when generics substitute one-for-one, and when narrow-therapeutic-index drugs deserve extra attention.',
    },
    {
      id: 's1-expedited-designations',
      title: 'FDA expedited and special approval designations',
      instructions: 'Distinguish orphan-drug, breakthrough-therapy, fast-track, and accelerated-approval designations, and explain what each does and does not say about the evidence base.',
    },
    {
      id: 's1-international-regulators',
      title: 'International regulatory counterparts',
      instructions: 'Compare how EMA, MHRA, TGA, Health Canada, and PMDA decisions map onto FDA decisions, and why a drug approved in one jurisdiction may be unavailable in another.',
    },
  ],
  s2: [
    {
      id: 's2-serotonin-syndrome',
      title: 'The serotonin syndrome spectrum',
      instructions: 'Cover Hunter versus Sternbach criteria, high-risk drugs, and how serotonin syndrome differs from neuroleptic malignant syndrome.',
    },
    {
      id: 's2-qtc-prolongation',
      title: 'QTc prolongation in psychiatric prescribing',
      instructions: 'Explain which psychotropics reliably prolong QTc, how to interpret Bazett versus Fridericia correction, clinically used thresholds, and when to act.',
    },
    {
      id: 's2-metabolic-monitoring',
      title: 'Metabolic monitoring on second-generation antipsychotics',
      instructions: 'Cover what to check, how often, and what to do with abnormal results, grounded in the ADA/APA monitoring framework and current clinical use.',
    },
    {
      id: 's2-lithium-window',
      title: 'Lithium therapeutic window and monitoring',
      instructions: 'Explain how to monitor lithium, how to interpret a 12-hour trough, toxicity patterns, and key drug-drug interactions such as NSAIDs, ACE inhibitors, and thiazides.',
    },
    {
      id: 's2-clozapine-essentials',
      title: 'Clozapine essentials',
      instructions: 'Cover hematologic monitoring, major non-hematologic risks such as myocarditis, ileus, seizures, and hypersalivation, and why clozapine remains uniquely important in treatment-resistant schizophrenia.',
    },
    {
      id: 's2-pharmacogenomics',
      title: 'Pharmacogenomics in psychiatry',
      instructions: 'Explain what CYP2D6 and CYP2C19 testing can and cannot tell prescribers, how to read FDA pharmacogenetic associations, and where evidence for panel-guided prescribing is strong or weak.',
    },
    {
      id: 's2-placebo-response',
      title: 'Placebo response in psychiatric trials',
      instructions: 'Explain why placebo response has grown over time, what designs try to manage it, and how clinicians should read trials with high placebo-arm improvement.',
    },
    {
      id: 's2-measurement-based-care',
      title: 'Measurement-based care',
      instructions: 'Explain the clinical case for tracking PHQ-9, GAD-7, PCL-5, or similar scales at visits, where it improves outcomes, and where implementation fails.',
    },
  ],
  s3: [
    {
      id: 's3-chlorpromazine-discovery',
      title: 'The discovery of chlorpromazine',
      instructions: 'Tell the story of Laborit, the artificial hibernation cocktail, Delay and Deniker at Sainte-Anne, and the first antipsychotic era.',
    },
    {
      id: 's3-imipramine-kuhn',
      title: 'Kuhn and imipramine at Muensterlingen',
      instructions: 'Tell how a failed antihistamine became the first tricyclic antidepressant and how Kuhn identified the signal in under 40 patients.',
    },
    {
      id: 's3-cade-lithium',
      title: 'Cade and lithium',
      instructions: 'Tell the story of the urate experiments, Trundle Asylum, Schou validating the finding, and why lithium remained unavailable in the US until 1970.',
    },
    {
      id: 's3-rosenhan-dsm',
      title: 'The Rosenhan study and diagnostic reliability',
      instructions: 'Cover what the pseudopatients did, how psychiatry responded with DSM-III, and which criticisms have held up or been contested.',
    },
    {
      id: 's3-ect-long-arc',
      title: 'The long arc of ECT',
      instructions: 'Tell the story from Cerletti and Bini through mid-century overuse, the anesthesia era, and modern clinical practice.',
    },
    {
      id: 's3-clozapine-story',
      title: 'The clozapine story',
      instructions: 'Cover the 1975 withdrawal after Finnish agranulocytosis deaths, the Kane study that brought it back, and the monitoring legacy.',
    },
    {
      id: 's3-decade-of-the-brain',
      title: 'The Decade of the Brain and what it did not deliver',
      instructions: 'Explain the 1990s neuroscience pivot, why psychiatric drug discovery slowed instead of accelerated, and how the field recalibrated in the 2010s.',
    },
    {
      id: 's3-dsm-iii-emergence',
      title: 'The emergence of DSM-III',
      instructions: 'Tell the story of Spitzer, the Task Force, operationalized criteria, the break from psychoanalytic nosology, and the costs of that gain.',
    },
    {
      id: 's3-oconnor-donaldson',
      title: "O'Connor v. Donaldson and civil commitment",
      instructions: 'Tell the case, Justice Stewart opinion, and lasting effect on civil commitment and inpatient psychiatry.',
    },
    {
      id: 's3-phenelzine-cheese',
      title: 'Phenelzine and the cheese reaction',
      instructions: 'Tell how the MAOI tyramine interaction was pieced together and why the episode still governs MAOI prescribing practice.',
    },
  ],
};

function parseDateUtc(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr))) {
    throw new Error(`Invalid date: ${dateStr}`);
  }
  return new Date(`${dateStr}T00:00:00Z`);
}

function formatDateUtc(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(dateStr, days) {
  const date = parseDateUtc(dateStr);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateUtc(date);
}

export function daysBetween(startDate, endDate) {
  const start = parseDateUtc(startDate).getTime();
  const end = parseDateUtc(endDate).getTime();
  return Math.round((end - start) / 86400000);
}

export function readEvergreenLog(logPath) {
  if (!fs.existsSync(logPath)) return [];
  const parsed = JSON.parse(fs.readFileSync(logPath, 'utf8'));
  return Array.isArray(parsed) ? parsed : [];
}

export function writeEvergreenLog(logPath, entries) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  const sorted = [...entries].sort((a, b) => {
    const dateCompare = String(a.date || '').localeCompare(String(b.date || ''));
    if (dateCompare !== 0) return dateCompare;
    return String(a.section || '').localeCompare(String(b.section || ''));
  });
  fs.writeFileSync(logPath, `${JSON.stringify(sorted, null, 2)}\n`);
}

function catalogForSection(section, catalog = EVERGREEN_CATALOG) {
  const key = String(section || '').toLowerCase();
  const angles = catalog[key];
  if (!Array.isArray(angles) || angles.length === 0) {
    throw new Error(`No evergreen catalog entries configured for section "${section}"`);
  }
  return angles;
}

function angleMap(catalog = EVERGREEN_CATALOG) {
  const map = new Map();
  Object.values(catalog).flat().forEach(angle => map.set(angle.id, angle));
  return map;
}

function matchingEntries(entries, angleId, date, windowDays) {
  return entries
    .filter(entry => entry && entry.angleId === angleId && entry.date && entry.date !== date)
    .map(entry => ({ entry, distance: Math.abs(daysBetween(entry.date, date)) }))
    .filter(item => item.distance < windowDays)
    .sort((a, b) => a.distance - b.distance);
}

function latestUsageDate(entries, angleId) {
  const dates = entries
    .filter(entry => entry && entry.angleId === angleId && entry.date)
    .map(entry => entry.date)
    .sort();
  return dates.length > 0 ? dates[dates.length - 1] : null;
}

export function selectEvergreenAngle({
  section,
  date,
  entries = [],
  catalog = EVERGREEN_CATALOG,
  windowDays = EVERGREEN_REPEAT_WINDOW_DAYS,
} = {}) {
  parseDateUtc(date);
  const angles = catalogForSection(section, catalog);
  const blockedAngles = angles
    .map(angle => {
      const recent = matchingEntries(entries, angle.id, date, windowDays);
      if (recent.length === 0) return null;
      const nearest = recent[0].entry;
      return {
        angle,
        lastDate: nearest.date,
        eligibleDate: addDays(nearest.date, windowDays),
        daysAway: recent[0].distance,
      };
    })
    .filter(Boolean);

  const blockedIds = new Set(blockedAngles.map(item => item.angle.id));
  const eligible = angles.filter(angle => !blockedIds.has(angle.id));
  if (eligible.length === 0) {
    const detail = blockedAngles
      .map(item => `${item.angle.id} last used ${item.lastDate}; eligible ${item.eligibleDate}`)
      .join('\n  ');
    throw new Error(`No eligible evergreen angles for ${section} on ${date}. Every angle has been used within ${windowDays} days.\n  ${detail}`);
  }

  const ranked = eligible.map((angle, index) => ({
    angle,
    index,
    lastDate: latestUsageDate(entries, angle.id),
  })).sort((a, b) => {
    if (!a.lastDate && b.lastDate) return -1;
    if (a.lastDate && !b.lastDate) return 1;
    if (a.lastDate && b.lastDate && a.lastDate !== b.lastDate) {
      return a.lastDate.localeCompare(b.lastDate);
    }
    return a.index - b.index;
  });

  return {
    section,
    date,
    angle: ranked[0].angle,
    blockedAngles,
    windowDays,
  };
}

export function planEvergreenUsage({
  date,
  section,
  topicKey,
  entries = [],
  catalog = EVERGREEN_CATALOG,
  windowDays = EVERGREEN_REPEAT_WINDOW_DAYS,
  selectedAt = new Date().toISOString(),
} = {}) {
  parseDateUtc(date);
  const normalizedSection = String(section || '').toLowerCase();
  const existing = entries.find(entry =>
    entry &&
    entry.date === date &&
    entry.section === normalizedSection &&
    entry.angleId
  );
  const anglesById = angleMap(catalog);
  if (existing) {
    const angle = anglesById.get(existing.angleId);
    if (!angle) {
      throw new Error(`Evergreen log entry for ${date} ${normalizedSection} references unknown angleId "${existing.angleId}"`);
    }
    return {
      created: false,
      entry: existing,
      entries,
      section: normalizedSection,
      date,
      angle,
      blockedAngles: [],
      windowDays,
    };
  }

  const selection = selectEvergreenAngle({
    section: normalizedSection,
    date,
    entries,
    catalog,
    windowDays,
  });
  const entry = {
    date,
    section: normalizedSection,
    topicKey,
    angleId: selection.angle.id,
    angleTitle: selection.angle.title,
    repeatWindowDays: windowDays,
    selectedAt,
    enforced: true,
  };

  return {
    ...selection,
    created: true,
    entry,
    entries: [...entries, entry],
  };
}

export function buildEvergreenRotationContext(plan) {
  if (!plan?.angle) return '';
  const blocked = Array.isArray(plan.blockedAngles) && plan.blockedAngles.length > 0
    ? plan.blockedAngles.map(item => `- ${item.angle.title} (${item.angle.id}) was used ${item.lastDate}; eligible again ${item.eligibleDate}.`).join('\n')
    : '- None.';

  return [
    '---EVERGREEN ROTATION GUARD---',
    `This section escalated to the evergreen safety net. The yearly repeat rule is mandatory: do not repeat an evergreen angle within ${plan.windowDays || EVERGREEN_REPEAT_WINDOW_DAYS} days.`,
    '',
    'Use exactly this evergreen angle this week:',
    `${plan.angle.title} (${plan.angle.id})`,
    plan.angle.instructions,
    '',
    'Do not choose a different evergreen angle and do not blend in another evergreen angle. Do not mention this guard, the log, or the word "evergreen" to readers.',
    '',
    'Blocked recently used evergreen angles:',
    blocked,
    '---END EVERGREEN ROTATION GUARD---',
  ].join('\n');
}

export function findEvergreenRepeatViolations(entries = [], windowDays = EVERGREEN_REPEAT_WINDOW_DAYS) {
  const byAngle = new Map();
  entries.forEach(entry => {
    if (!entry?.angleId || !entry.date) return;
    if (!byAngle.has(entry.angleId)) byAngle.set(entry.angleId, []);
    byAngle.get(entry.angleId).push(entry);
  });

  const violations = [];
  for (const [angleId, angleEntries] of byAngle.entries()) {
    const sorted = [...angleEntries].sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 1; i < sorted.length; i++) {
      const gapDays = daysBetween(sorted[i - 1].date, sorted[i].date);
      if (gapDays < windowDays && sorted[i].enforced !== false) {
        violations.push({
          angleId,
          previous: sorted[i - 1],
          current: sorted[i],
          gapDays,
          windowDays,
        });
      }
    }
  }
  return violations;
}

export function buildEvergreenStatusRows({
  entries = [],
  asOfDate,
  catalog = EVERGREEN_CATALOG,
  windowDays = EVERGREEN_REPEAT_WINDOW_DAYS,
} = {}) {
  parseDateUtc(asOfDate);
  const rows = [];
  for (const [section, angles] of Object.entries(catalog)) {
    for (const angle of angles) {
      const uses = entries
        .filter(entry => entry?.angleId === angle.id && entry.date)
        .sort((a, b) => a.date.localeCompare(b.date));
      const last = uses.length > 0 ? uses[uses.length - 1] : null;
      const gapDays = last ? daysBetween(last.date, asOfDate) : null;
      const blocked = last ? Math.abs(gapDays) < windowDays : false;
      rows.push({
        section,
        angleId: angle.id,
        title: angle.title,
        lastDate: last?.date || null,
        eligibleDate: last ? addDays(last.date, windowDays) : asOfDate,
        status: blocked ? 'blocked' : 'eligible',
      });
    }
  }
  return rows;
}
