// lib/research.js — Source fetching handlers and dispatch table

/**
 * fetchWithTimeout — fetch wrapper with AbortController timeout
 * @param {string} url
 * @param {object} options  — standard fetch options
 * @param {number} timeoutMs — default 15000
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * validateBrief — validates a brief object and returns a safe, fallback-corrected version.
 * Never throws to caller.
 * @param {object} brief
 * @returns {object} safe brief
 */
export function validateBrief(brief) {
  try {
    if (!brief || typeof brief !== 'object') {
      throw new Error('brief is not an object');
    }
    if (!brief.topic) {
      throw new Error('brief.topic is missing');
    }
    if (!Array.isArray(brief.sources)) {
      throw new Error('brief.sources is not an array');
    }
    // Return brief with defaults filled in. Preserve optional fallback metadata
    // (fallback, fallbackRung, fallbackDescription) used by the fallback-chain
    // wrappers added 2026-04-16.
    const out = {
      topic: brief.topic,
      sources: brief.sources,
      relevantBlogPosts: brief.relevantBlogPosts || [],
      warnings: brief.warnings || [],
    };
    if (brief.fallback !== undefined) out.fallback = brief.fallback;
    if (brief.fallbackRung !== undefined) out.fallbackRung = brief.fallbackRung;
    if (brief.fallbackDescription !== undefined) out.fallbackDescription = brief.fallbackDescription;
    return out;
  } catch (err) {
    return {
      topic: brief?.topic || 'unknown',
      sources: [],
      relevantBlogPosts: [],
      warnings: [`validation failed: ${err.message}`],
    };
  }
}

/**
 * fetchFdaRss — fetch FDA press release RSS and parse items
 */
export async function fetchFdaRss(topicKey, config) {
  try {
    const url = 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml';
    const response = await fetchWithTimeout(url, {
      headers: { 'User-Agent': 'PsychoPharmRef-Newsletter/1.0' },
    }, 15000);

    if (!response.ok) {
      throw new Error(`FDA RSS returned ${response.status}`);
    }

    const xml = await response.text();
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = (/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/.exec(itemXml) ||
                     /<title>([\s\S]*?)<\/title>/.exec(itemXml) || [])[1]?.trim() || '';
      const link = (/<link>([\s\S]*?)<\/link>/.exec(itemXml) || [])[1]?.trim() || '';
      const pubDate = (/<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemXml) || [])[1]?.trim() || '';
      const description = (/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/.exec(itemXml) ||
                           /<description>([\s\S]*?)<\/description>/.exec(itemXml) || [])[1]?.trim() || '';

      if (title && link) {
        items.push({
          title,
          url: link,
          publishedDate: pubDate,
          retrievedDate: new Date().toISOString().slice(0, 10),
          excerpt: description.slice(0, 300),
        });
      }
    }

    const sources = items.slice(0, (config?.maxBriefSources || 5));
    return validateBrief({ topic: topicKey, sources, relevantBlogPosts: [], warnings: [] });
  } catch (err) {
    if (err.name === 'AbortError') {
      return validateBrief({ topic: topicKey, sources: [], warnings: ['FDA RSS unavailable'] });
    }
    return validateBrief({ topic: topicKey, sources: [], warnings: [`FDA RSS error: ${err.message}`] });
  }
}

/**
 * fetchClinicalTrials — fetch psychiatric trials from ClinicalTrials.gov v2 API.
 * Defaults to Phase 3 for backward compatibility; passes `phase` through to filter.
 * Valid phases: 'phase3', 'phase2', 'phase1'.
 *
 * Filter syntax: prior implementation used `aggFilters=phase:phase3,studyType:int`,
 * but `aggFilters` is the parameter that drives the v2 API's facet histograms in
 * the UI — it does not filter the returned study list. The combination silently
 * returned 0 studies on every call, which dropped the s1-pipeline-drugs chain to
 * evergreen on every weekly run after 2026-04-17 (when the requireMetadata gate
 * was added; before that, an empty `studies` array also returned 0 sources but
 * the symptom was less visible).
 *
 * Correct syntax: `filter.advanced=AREA[Phase]PHASE3 AND AREA[StudyType]INTERVENTIONAL`,
 * URL-encoded. Verified against the live API on 2026-04-27 — Phase 3 returns
 * 10 psych trials (MM120/MDD, KarXT/AD-psychosis, Seltorexant/MDD, etc.).
 */
export async function fetchClinicalTrials(topicKey, config, phase = 'phase3') {
  try {
    // Normalize 'phase3' → 'PHASE3' for the AREA[Phase] enum in the advanced query.
    const phaseEnum = String(phase).toUpperCase();
    const filterAdvanced = encodeURIComponent(`AREA[Phase]${phaseEnum} AND AREA[StudyType]INTERVENTIONAL`);
    const url = [
      'https://clinicaltrials.gov/api/v2/studies',
      `?filter.advanced=${filterAdvanced}`,
      '&filter.overallStatus=RECRUITING,ACTIVE_NOT_RECRUITING',
      '&query.cond=psychiatric+OR+depression+OR+schizophrenia+OR+bipolar+OR+anxiety+OR+ADHD',
      '&pageSize=10',
    ].join('');

    const response = await fetchWithTimeout(url, {
      headers: { 'User-Agent': 'PsychoPharmRef-Newsletter/1.0' },
    }, 15000);

    if (!response.ok) {
      throw new Error(`ClinicalTrials.gov returned ${response.status}`);
    }

    const data = await response.json();
    const studies = data?.studies || [];

    if (studies.length === 0) {
      return validateBrief({
        topic: topicKey,
        sources: [],
        relevantBlogPosts: [],
        warnings: [`No ${phase} trials found`],
      });
    }

    const sources = studies.slice(0, config?.maxBriefSources || 5).map(study => {
      const proto = study?.protocolSection || {};
      const id = proto?.identificationModule?.nctId || '';
      const briefTitle = proto?.identificationModule?.briefTitle || '';
      const conditions = (proto?.conditionsModule?.conditions || []).join(', ');
      const status = proto?.statusModule?.overallStatus || '';
      const lastUpdate = proto?.statusModule?.lastUpdatePostDateStruct?.date || '';

      return {
        title: briefTitle || id,
        url: `https://clinicaltrials.gov/study/${id}`,
        publishedDate: lastUpdate,
        retrievedDate: new Date().toISOString().slice(0, 10),
        excerpt: `${id} — ${conditions} — Status: ${status}`,
      };
    });

    return validateBrief({ topic: topicKey, sources, relevantBlogPosts: [], warnings: [] });
  } catch (err) {
    if (err.name === 'AbortError') {
      return validateBrief({ topic: topicKey, sources: [], warnings: ['ClinicalTrials.gov request timed out'] });
    }
    return validateBrief({ topic: topicKey, sources: [], warnings: [`ClinicalTrials.gov error: ${err.message}`] });
  }
}

/**
 * fetchCongress — fetch mental-health bills from Congress.gov API.
 *
 * Rewritten 2026-04-17: the prior implementation used query=mental+health+OR+...
 * which Congress.gov's query parser treats as a loose keyword match, returning
 * bills like "Menstrual Equity For All Act" and "Closing the Provider Fraud
 * Gap Act" that contain none of the psychiatric keywords. New strategy:
 *
 *   1. Fetch a larger batch (50 bills) sorted by updateDate desc.
 *   2. Filter client-side with the shared PSYCH_KEYWORDS list against the
 *      bill title — anything that doesn't match is dropped before it enters
 *      the brief.
 *   3. For each surviving bill, fetch /summaries and /actions in parallel to
 *      populate a substantive excerpt. If /summaries returns nothing (common
 *      for recently introduced bills), fall back to the bill's latestAction
 *      text. This gives Claude enough context to write a one-line primer.
 *
 * If zero bills survive filtering, return an empty brief so the fallback chain
 * drops to the next rung rather than shipping unrelated legislation.
 */
export async function fetchCongress(topicKey, config) {
  try {
    const apiKey = process.env.CONGRESS_API_KEY;
    if (!apiKey) {
      return validateBrief({
        topic: topicKey,
        sources: [],
        warnings: ['CONGRESS_API_KEY not set — skipping legislation fetch'],
      });
    }

    // Step 1: list recent bills (no keyword query — broader batch for filtering).
    const listUrl = 'https://api.congress.gov/v3/bill?sort=updateDate+desc&offset=0&limit=50';
    const listResp = await fetchWithTimeout(listUrl, {
      headers: { 'X-Api-Key': apiKey, 'User-Agent': 'PsychoPharmRef-Newsletter/1.0' },
    }, 15000);

    if (listResp.status === 429) {
      return validateBrief({
        topic: topicKey,
        sources: [],
        warnings: ['Congress.gov rate limited (429) — skipping legislation source'],
      });
    }
    if (!listResp.ok) throw new Error(`Congress.gov list returned ${listResp.status}`);

    const listData = await listResp.json();
    const bills = listData?.bills || [];

    // Step 2: client-side psych-keyword filter on the title.
    const psychBills = bills.filter(b => isPsychRelevant({ title: b.title || '', excerpt: '' }));

    if (psychBills.length === 0) {
      return validateBrief({
        topic: topicKey,
        sources: [],
        warnings: [`Congress.gov returned ${bills.length} recent bills; none matched psych keywords`],
      });
    }

    // Step 3: for the top maxBriefSources, fetch per-bill summary + latest action.
    const max = config?.maxBriefSources || 5;
    const picks = psychBills.slice(0, max);

    const enrichedResults = await Promise.allSettled(picks.map(async bill => {
      const congress = bill.congress || '';
      const type = (bill.type || '').toLowerCase();
      const number = bill.number || '';
      const permalink = bill.url || `https://www.congress.gov/bill/${congress}th-congress/${type}-bill/${number}`;

      // Summary fetch (best effort — many new bills have no summary yet).
      let summaryText = '';
      try {
        const sumUrl = `https://api.congress.gov/v3/bill/${congress}/${type}/${number}/summaries`;
        const sumResp = await fetchWithTimeout(sumUrl, {
          headers: { 'X-Api-Key': apiKey, 'User-Agent': 'PsychoPharmRef-Newsletter/1.0' },
        }, 10000);
        if (sumResp.ok) {
          const sumData = await sumResp.json();
          const summaries = sumData?.summaries || [];
          // Prefer most recent summary
          const latest = summaries[summaries.length - 1];
          if (latest?.text) {
            // Strip HTML tags from the Congress.gov summary text.
            summaryText = latest.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          }
        }
      } catch { /* continue — excerpt will fall back */ }

      // Latest action as fallback excerpt source.
      const latestAction = bill.latestAction?.text || '';

      let excerpt = summaryText || latestAction || bill.title || '';
      if (excerpt.length > 600) excerpt = excerpt.slice(0, 600) + '…';

      return {
        title: bill.title || `${bill.type || ''} ${number}`,
        url: permalink,
        publishedDate: bill.updateDate || '',
        retrievedDate: new Date().toISOString().slice(0, 10),
        excerpt,
      };
    }));

    const sources = enrichedResults
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    return validateBrief({
      topic: topicKey,
      sources,
      relevantBlogPosts: [],
      warnings: [],
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      return validateBrief({ topic: topicKey, sources: [], warnings: ['Congress.gov request timed out'] });
    }
    return validateBrief({ topic: topicKey, sources: [], warnings: [`Congress.gov error: ${err.message}`] });
  }
}

/**
 * fetchPerplexity — query Perplexity sonar-pro for recent sources on a topic
 */
export async function fetchPerplexity(topicKey, config) {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return validateBrief({
        topic: topicKey,
        sources: [],
        warnings: ['PERPLEXITY_API_KEY not set'],
      });
    }

    const topicConf = config?.topics?.[topicKey];
    const focusArea = topicConf?.focusArea || topicKey;
    const cutoffDays = config?.recencyCutoff?.[topicKey];
    let cutoffNote = '';
    if (cutoffDays) {
      const cutoffDate = new Date(Date.now() - cutoffDays * 24 * 60 * 60 * 1000)
        .toISOString().slice(0, 10);
      cutoffNote = ` Focus on sources published after ${cutoffDate}.`;
    }

    const query = `${focusArea}. Retrieve recent peer-reviewed sources, clinical guidelines, or news items with publication dates.${cutoffNote} Include URLs and publication dates where available.`;

    const body = {
      model: config?.perplexityModel || 'sonar-pro',
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
    };

    const response = await fetchWithTimeout(
      'https://api.perplexity.ai/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'PsychoPharmRef-Newsletter/1.0',
        },
        body: JSON.stringify(body),
      },
      20000
    );

    if (!response.ok) {
      // Retry once after 10s on 503
      if (response.status === 503) {
        await new Promise(r => setTimeout(r, 10000));
        const retry = await fetchWithTimeout(
          'https://api.perplexity.ai/chat/completions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
          20000
        );
        if (!retry.ok) {
          return validateBrief({
            topic: topicKey,
            sources: [],
            warnings: ['Perplexity unavailable — sources not fetched. Review manually before drafting.'],
          });
        }
        const retryData = await retry.json();
        return parsePerplexityResponse(topicKey, retryData, config);
      }
      throw new Error(`Perplexity returned ${response.status}`);
    }

    const data = await response.json();
    return parsePerplexityResponse(topicKey, data, config);
  } catch (err) {
    if (err.name === 'AbortError') {
      return validateBrief({
        topic: topicKey,
        sources: [],
        warnings: ['Perplexity unavailable — sources not fetched. Review manually before drafting.'],
      });
    }
    return validateBrief({ topic: topicKey, sources: [], warnings: [`Perplexity error: ${err.message}`] });
  }
}

/**
 * parsePerplexityResponse — extract sources from Perplexity API response.
 *
 * Sonar / sonar-pro responses include TWO source-related fields:
 *   - data.citations:     array of bare URL strings (the legacy field)
 *   - data.search_results: array of { title, url, date, snippet, source }
 *
 * Prior implementation read only `citations`, so every Perplexity-driven brief
 * landed with empty title/publishedDate/excerpt for every source. Before the
 * 2026-04-17 metadata gate, those skeleton sources still satisfied a count
 * check and the brief moved on; after the gate, every Perplexity rung failed
 * `requireMetadata` and fell to evergreen. Verified against the live API:
 * `search_results` is populated for sonar-pro as of 2026-04-27.
 *
 * Strategy: prefer `search_results` (rich metadata). Fall back to `citations`
 * (URL-only) when search_results is missing — defensive for older responses
 * or any future API shape change. As a last resort, synthesize a single
 * source from the assistant's content so the brief is never empty when the
 * model actually said something useful.
 */
function parsePerplexityResponse(topicKey, data, config) {
  const content = data?.choices?.[0]?.message?.content || '';
  const retrievedDate = new Date().toISOString().slice(0, 10);
  const maxSources = config?.maxBriefSources || 5;
  const searchResults = Array.isArray(data?.search_results) ? data.search_results : [];
  const citations = Array.isArray(data?.citations) ? data.citations : [];

  let sources;
  if (searchResults.length > 0) {
    // Preferred path — rich metadata available.
    sources = searchResults.slice(0, maxSources).map((sr, i) => ({
      title: sr.title || `Source ${i + 1}`,
      url: sr.url || '',
      publishedDate: sr.date || '',
      retrievedDate,
      excerpt: sr.snippet || '',
    }));
  } else if (citations.length > 0) {
    // Legacy fallback — citations may be strings or objects.
    sources = citations.slice(0, maxSources).map((citation, i) => {
      if (typeof citation === 'string') {
        return {
          title: `Source ${i + 1}`,
          url: citation,
          publishedDate: '',
          retrievedDate,
          excerpt: '',
        };
      }
      return {
        title: citation.title || `Source ${i + 1}`,
        url: citation.url || '',
        publishedDate: citation.date || '',
        retrievedDate,
        excerpt: citation.snippet || '',
      };
    });
  } else {
    sources = [];
  }

  // If neither source array is populated, fall back to a single content-based
  // source so the brief isn't empty when the model returned a useful synthesis.
  if (sources.length === 0 && content) {
    sources.push({
      title: `Perplexity research: ${topicKey}`,
      url: '',
      publishedDate: '',
      retrievedDate,
      excerpt: content.slice(0, 500),
    });
  }

  const warnings = sources.length === 0 ? ['Perplexity returned no citations'] : [];
  return validateBrief({ topic: topicKey, sources, relevantBlogPosts: [], warnings });
}

/* ──────────────────────────────────────────────────────────────────────────
   Fallback-chain wrappers (added 2026-04-16; quality gate tightened 2026-04-17)

   Each merged/new S1 or S2 topic dispatches through an ordered chain of
   sub-handlers. The wrapper returns the first brief whose sources PASS the
   rung's quality gate, tagged with fallbackRung and fallbackDescription. If
   every rung fails its gate, the wrapper emits a brief with
   fallback='evergreen' so the draft step routes to the evergreen prompt.

   Quality gates (see hasUsableSources):
     - requirePsychRelevance: at least one source's title or excerpt contains a
       psychiatric keyword. Protects against Congress.gov / FDA RSS returning
       non-psych items that trivially satisfy a count check.
     - requireMetadata: at least one source has a publishedDate OR a
       substantive excerpt (>20 chars). Protects against Perplexity returning
       bare URLs with no extractable content.

   Cross-topic substitution is NOT done here — that would break the 16-letter
   rotation balance. The evergreen prompt is the safety net.
   ────────────────────────────────────────────────────────────────────────── */

// Psych-relevance keyword list. Used by filterPsychRelevant and hasUsableSources.
//
// Matched at word boundaries (see PSYCH_KEYWORD_RE below) so 'ocd' won't fire
// on arbitrary substrings, but suffix matching is preserved — 'psychiatr' still
// matches 'psychiatry/psychiatric/psychiatrist', 'depressi' matches both
// 'depression' and 'depressive'. Keywords are lowercase; matching is
// case-insensitive.
//
// Design notes:
//   - Brand names are essential. Most psychiatric news headlines lead with the
//     brand (Spravato, Cobenfy, Auvelity, Caplyta, Vraylar, Rexulti) and may
//     never mention the generic. The pre-2026-04-27 list had zero brand names
//     and was filtering out exactly the headlines the newsletter most wants
//     to surface.
//   - Recent generics matter even more than brands for FDA RSS / FDA approvals
//     pages, which sometimes use only the generic in titles.
//   - Off-label psych workhorses (prazosin for PTSD nightmares, propranolol
//     for performance anxiety, gabapentin/pregabalin for anxiety) are included
//     because FDA labeling actions on them are still relevant content.
//   - Known limitations: 'bipolar', 'depression' will match non-psychiatric
//     contexts ('bipolar interlocking' in orthopedics, 'ST-segment depression'
//     in cardiology). Addressing these requires negative-context filtering,
//     which is deferred — current false-positive rate is acceptable.
const PSYCH_KEYWORDS = [
  // Disciplines / settings
  'psychiatr', 'mental health', 'behavioral health', 'psychopharm', 'neuropsychiatr',
  // Diagnoses (prefix forms cover noun + adjective)
  'depressi', 'major depressive', 'mdd', 'treatment-resistant depression', 'trd',
  'bipolar', 'mania', 'manic', 'hypomania', 'hypomanic', 'mixed episode',
  'schizophren', 'schizoaffective', 'psychosis', 'psychotic',
  'anxiety', 'generalized anxiety', 'gad', 'panic disorder', 'social anxiety',
  'ptsd', 'post-traumatic stress', 'acute stress',
  'ocd', 'obsessive-compulsive', 'obsessive compulsive',
  'adhd', 'attention deficit', 'attention-deficit',
  'autism', 'autistic', 'asperger',
  'eating disorder', 'anorexia', 'bulimia', 'binge eating', 'bed',
  'substance use', 'addiction', 'opioid use', 'alcohol use', 'cannabis use',
  'opioid dependence', 'alcohol dependence', 'tobacco use', 'nicotine',
  'suicid', 'self-harm', 'self harm', 'non-suicidal self-injury', 'nssi',
  'dementia', 'alzheimer', 'parkinson', 'lewy body',
  'tic disorder', 'tourette', 'huntington',
  'insomnia', 'sleep disorder', 'narcolepsy', 'cataplexy',
  'tardive', 'neuroleptic malignant', 'serotonin syndrome',
  'akathisia', 'dystonia', 'extrapyramidal', 'eps',
  'agitation', 'aggression', 'irritability', 'anhedonia',
  'catatonia', 'catatonic', 'delirium',
  'postpartum depression', 'perinatal depression', 'premenstrual dysphoric', 'pmdd',
  // Drug classes / mechanisms
  'antipsychotic', 'antidepressant', 'anxiolytic', 'mood stabilizer',
  'ssri', 'snri', 'ndri', 'maoi', 'tricyclic', 'tca',
  'benzodiazepine', 'z-drug', 'hypnotic', 'sedative',
  'stimulant', 'non-stimulant', 'wake-promoting',
  'neuroleptic', 'psychotropic', 'psychedelic', 'serotonergic psychedelic',
  'ketamine', 'esketamine', 'nmda antagonist', 'nmda receptor',
  'orexin antagonist', 'dual orexin', 'dora',
  'gaba modulator', 'gaba-a', 'gaba-b',
  'm1 muscarinic', 'm4 muscarinic', 'muscarinic agonist',
  'd2 partial agonist', 'd2 antagonist', 'serotonin-dopamine',
  'long-acting injectable', 'lai', 'depot antipsychotic',
  'vmat2 inhibitor',
  // Antidepressants — generics
  'fluoxetine', 'sertraline', 'escitalopram', 'paroxetine', 'citalopram',
  'fluvoxamine', 'bupropion', 'venlafaxine', 'desvenlafaxine', 'duloxetine',
  'levomilnacipran', 'milnacipran', 'mirtazapine', 'trazodone', 'nefazodone',
  'vortioxetine', 'vilazodone', 'tianeptine', 'agomelatine',
  'amitriptyline', 'nortriptyline', 'imipramine', 'desipramine', 'doxepin', 'clomipramine',
  'phenelzine', 'tranylcypromine', 'selegiline', 'isocarboxazid',
  'zuranolone', 'brexanolone', 'dextromethorphan-bupropion',
  // Antidepressants — brands
  'prozac', 'zoloft', 'lexapro', 'paxil', 'celexa', 'cipralex', 'cipramil',
  'luvox', 'wellbutrin', 'effexor', 'pristiq', 'fetzima', 'cymbalta',
  'remeron', 'desyrel', 'trintellix', 'viibryd', 'auvelity', 'spravato',
  'zurzuvae', 'zulresso',
  // Antipsychotics — generics
  'aripiprazole', 'brexpiprazole', 'cariprazine', 'lumateperone',
  'quetiapine', 'olanzapine', 'risperidone', 'paliperidone', 'clozapine',
  'ziprasidone', 'lurasidone', 'asenapine', 'iloperidone', 'pimavanserin',
  'haloperidol', 'chlorpromazine', 'fluphenazine', 'perphenazine',
  'thioridazine', 'thiothixene', 'loxapine', 'molindone',
  'xanomeline', 'xanomeline-trospium', 'trospium', 'karxt',
  'olanzapine-samidorphan', 'samidorphan',
  // Antipsychotics — brands
  'abilify', 'aristada', 'rexulti', 'vraylar', 'caplyta',
  'seroquel', 'zyprexa', 'risperdal', 'invega', 'clozaril', 'versacloz', 'fazaclo',
  'geodon', 'latuda', 'saphris', 'fanapt', 'nuplazid', 'lybalvi',
  'haldol', 'thorazine', 'cobenfy',
  // Mood stabilizers
  'lithium', 'lithobid', 'eskalith',
  'valproate', 'divalproex', 'depakote', 'depakene',
  'lamotrigine', 'lamictal', 'carbamazepine', 'tegretol', 'equetro',
  'oxcarbazepine', 'trileptal', 'topiramate', 'topamax',
  // Anxiolytics / benzodiazepines / hypnotics
  'alprazolam', 'xanax', 'diazepam', 'valium', 'clonazepam', 'klonopin', 'rivotril',
  'lorazepam', 'ativan', 'temazepam', 'restoril', 'oxazepam', 'serax',
  'chlordiazepoxide', 'librium', 'triazolam', 'halcion',
  'buspirone', 'buspar', 'hydroxyzine', 'vistaril', 'atarax',
  'zolpidem', 'ambien', 'edluar', 'eszopiclone', 'lunesta',
  'zaleplon', 'sonata', 'suvorexant', 'belsomra',
  'lemborexant', 'dayvigo', 'daridorexant', 'quviviq',
  'ramelteon', 'rozerem', 'tasimelteon', 'hetlioz',
  'prazosin', 'minipress', 'propranolol', 'inderal',
  'gabapentin', 'neurontin', 'pregabalin', 'lyrica',
  // ADHD
  'methylphenidate', 'ritalin', 'concerta', 'daytrana', 'metadate', 'methylin',
  'dexmethylphenidate', 'focalin',
  'amphetamine', 'adderall', 'mydayis', 'evekeo',
  'lisdexamfetamine', 'vyvanse',
  'atomoxetine', 'strattera', 'viloxazine', 'qelbree',
  'guanfacine', 'intuniv', 'tenex', 'clonidine', 'kapvay',
  'modafinil', 'provigil', 'armodafinil', 'nuvigil',
  'pitolisant', 'wakix', 'solriamfetol', 'sunosi',
  // Substance use
  'buprenorphine', 'suboxone', 'subutex', 'sublocade', 'probuphine', 'brixadi',
  'methadone', 'methadose', 'dolophine',
  'naltrexone', 'vivitrol', 'revia',
  'naloxone', 'narcan', 'kloxxado',
  'disulfiram', 'antabuse', 'acamprosate', 'campral',
  'varenicline', 'chantix', 'nicotine replacement',
  // VMAT2 / movement disorder
  'tetrabenazine', 'xenazine', 'deutetrabenazine', 'austedo',
  'valbenazine', 'ingrezza',
  // Psychedelics / pipeline
  'psilocybin', 'mdma', 'lsd', 'lysergide', 'mescaline', 'dmt', 'ibogaine',
  'mm120', 'cyb003', 'rl-007', 'navacaprant',
  // Endpoints / regulatory
  'rems', 'risk evaluation and mitigation', 'boxed warning', 'black box',
];

// Precompiled word-boundary regex over the keyword list. Word boundary at the
// start avoids matching arbitrary substrings ('ocd' inside 'tocopherol' etc.);
// no boundary at the end so prefix forms still match suffixed words
// ('psychiatr' → psychiatry/psychiatric/psychiatrist).
const PSYCH_KEYWORD_RE = new RegExp(
  '\\b(?:' + PSYCH_KEYWORDS
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|') + ')',
  'i'
);

function isPsychRelevant(source) {
  if (!source) return false;
  const text = `${source.title || ''} ${source.excerpt || ''}`;
  return PSYCH_KEYWORD_RE.test(text);
}

function filterPsychRelevant(sources) {
  return (sources || []).filter(isPsychRelevant);
}

// A source has usable metadata if it has a publishedDate OR a substantive excerpt.
function hasMetadata(source) {
  if (!source) return false;
  if (source.publishedDate) return true;
  if (source.excerpt && source.excerpt.trim().length > 20) return true;
  return false;
}

// Quality-aware replacement for the previous hasSources() check.
function hasUsableSources(brief, options = {}) {
  const sources = (brief && brief.sources) || [];
  if (sources.length === 0) return false;

  if (options.requirePsychRelevance) {
    const relevant = filterPsychRelevant(sources);
    if (relevant.length < (options.minRelevant || 1)) return false;
  }

  if (options.requireMetadata) {
    const withMeta = sources.filter(hasMetadata);
    if (withMeta.length === 0) return false;
  }

  return true;
}

// Attach rung metadata without mutating the original brief.
function tagWithRung(brief, rungNumber, description) {
  const tagged = validateBrief(brief);
  tagged.fallbackRung = rungNumber;
  tagged.fallbackDescription = description;
  tagged.warnings = tagged.warnings.concat(
    rungNumber > 1 ? [`Fallback chain dropped to rung ${rungNumber}: ${description}`] : []
  );
  return tagged;
}

// Build the evergreen brief when every rung in a chain has returned empty.
function escalateToEvergreen(topicKey, attempts) {
  const warnings = attempts.map(
    (a, i) => `Rung ${i + 1} "${a}" returned no sources`
  );
  warnings.push('All fallback rungs exhausted; drafting from evergreen prompt.');
  return validateBrief({
    topic: topicKey,
    sources: [],
    relevantBlogPosts: [],
    warnings,
    fallback: 'evergreen',
    fallbackRung: 0,
    fallbackDescription: 'evergreen safety net',
  });
}

// Run an ordered list of rungs. Each rung: { description, fn, gate }.
// gate is the options object passed to hasUsableSources. Returns the first
// brief that passes its gate, tagged with rung number. If all fail, returns
// an evergreen-escalated brief.
async function runFallbackChain(topicKey, rungs) {
  const attempts = [];
  for (let i = 0; i < rungs.length; i++) {
    const rung = rungs[i];
    attempts.push(rung.description);
    let brief;
    try {
      brief = await rung.fn();
    } catch (err) {
      brief = validateBrief({
        topic: topicKey,
        sources: [],
        warnings: [`Rung ${i + 1} handler threw: ${err.message}`],
      });
    }
    if (hasUsableSources(brief, rung.gate || {})) {
      return tagWithRung(brief, i + 1, rung.description);
    }
  }
  return escalateToEvergreen(topicKey, attempts);
}

// ── s1-new-approvals: 90-day FDA RSS → 3-year retrospective via Perplexity ──
export async function fetchNewApprovals(topicKey, config) {
  return runFallbackChain(topicKey, [
    {
      description: 'FDA approvals in the last 90 days (FDA RSS)',
      fn: () => fetchFdaRss(topicKey, config),
      gate: { requirePsychRelevance: true, requireMetadata: true },
    },
    {
      description: 'Most recent FDA psychiatric approval in the last 3 years (Perplexity retrospective)',
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'most recent FDA approval of a psychiatric medication in the last 3 years; retrospective on indication, mechanism, pivotal trial, and uptake',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: 365 * 3 },
      }),
      gate: { requirePsychRelevance: true, requireMetadata: true },
    },
  ]);
}

// ── s1-pipeline-drugs: Phase 3 → Phase 2 → Phase 1 ──
// ClinicalTrials.gov already scopes to psychiatric conditions via the query,
// so only requireMetadata (NCT id/status are always present if the call succeeds).
export async function fetchPipelineDrugs(topicKey, config) {
  const gate = { requireMetadata: true };
  return runFallbackChain(topicKey, [
    { description: 'Phase 3 psychiatric trials (ClinicalTrials.gov)', fn: () => fetchClinicalTrials(topicKey, config, 'phase3'), gate },
    { description: 'Phase 2 psychiatric trials (ClinicalTrials.gov)', fn: () => fetchClinicalTrials(topicKey, config, 'phase2'), gate },
    { description: 'Phase 1 psychiatric trials (ClinicalTrials.gov)', fn: () => fetchClinicalTrials(topicKey, config, 'phase1'), gate },
  ]);
}

// ── s1-supply-generics: active shortage → new generic → historical essay ──
export async function fetchSupplyGenerics(topicKey, config) {
  const psychGate = { requirePsychRelevance: true, requireMetadata: true };
  const loose = { requireMetadata: true };  // historical rung: any substantive source OK
  return runFallbackChain(topicKey, [
    {
      description: 'Active psychiatric-drug shortages (FDA RSS / ASHP via Perplexity)',
      gate: psychGate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'currently active psychiatric-drug supply shortages per FDA Drug Shortages database and ASHP',
          },
        },
      }),
    },
    {
      description: 'New generic psychiatric-drug approvals in the last 12 months (Perplexity)',
      gate: psychGate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'FDA ANDA approvals of generic psychiatric medications in the last 12 months; Orange Book therapeutic-equivalence rating where known',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: 365 },
      }),
    },
    {
      description: 'Historical psychiatric-drug shortage essay (Perplexity, no recency cutoff)',
      gate: loose,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'a notable historical psychiatric-drug shortage (e.g., Adderall 2022, SSRIs in specific markets, clozapine availability), with timeline and downstream lessons',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: undefined },
      }),
    },
  ]);
}

// ── s1-policy-fda-watch: federal legislation → FDA labeling/REMS → CMS/state/guideline ──
export async function fetchPolicyFdaWatch(topicKey, config) {
  const gate = { requirePsychRelevance: true, requireMetadata: true };
  return runFallbackChain(topicKey, [
    {
      description: 'US federal mental-health legislation with recent activity (Congress.gov)',
      gate,
      fn: () => fetchCongress(topicKey, config),
    },
    {
      description: 'Recent FDA labeling / REMS / advisory committee action (FDA RSS)',
      gate,
      fn: () => fetchFdaRss(topicKey, config),
    },
    {
      description: 'CMS, state scope-of-practice, or major guideline update (Perplexity)',
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'recent CMS rulings, state scope-of-practice changes, or guideline updates (APA, AACAP, VA/DoD, NICE, RANZCP, CANMAT) affecting psychiatric practice',
          },
        },
      }),
    },
  ]);
}

// ── s2 handlers: single-rung Perplexity wrappers with landmark fallback for comparison ──
// Each passes through to fetchPerplexity with the per-topic focusArea already in config.
// Rung 2 (when applicable) swaps the focusArea for the landmark/receptor/history fallback.

export async function fetchMedComparison(topicKey, config) {
  const gate = { requireMetadata: true };
  return runFallbackChain(topicKey, [
    {
      description: 'Current medication comparison (Perplexity)',
      gate,
      fn: () => fetchPerplexity(topicKey, config),
    },
    {
      description: 'Landmark psychopharmacology trial revisit (Perplexity, no recency cutoff)',
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'a landmark psychopharmacology trial (STAR*D, CATIE, CUtLASS, EUFEST, RAISE, TADS, TMAP, CATIE-AD, TURNS, or comparable trial in OCD/PTSD/ADHD/autism/dementia): design, primary finding, what it settled, what it did not',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: undefined },
      }),
    },
  ]);
}

export async function fetchHowThingsWork(topicKey, config) {
  const gate = { requireMetadata: true };
  return runFallbackChain(topicKey, [
    {
      description: 'Mechanism of a specific clinically relevant drug (Perplexity)',
      gate,
      fn: () => fetchPerplexity(topicKey, config),
    },
    {
      description: 'Receptor-level deep dive (Perplexity, evergreen scope)',
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'a single receptor (5-HT2A, D2, α2, mGluR5, orexin, NMDA, or GABA-A): structure, function in health, dysfunction in disease, and drugs that act on it',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: undefined },
      }),
    },
  ]);
}

export async function fetchSurveyReview(topicKey, config) {
  const gate = { requireMetadata: true };
  return runFallbackChain(topicKey, [
    {
      description: 'Rating-scale review tied to a recent evidence or implementation story (Perplexity)',
      gate,
      fn: () => fetchPerplexity(topicKey, config),
    },
    {
      description: 'History of a rating scale (Perplexity, no recency cutoff)',
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'history of a major psychiatric rating scale (HAM-D, MADRS, YBOCS, Y-MRS, PANSS, MMSE, MoCA, C-SSRS, AIMS): inventor, year, where developed, validation over time, and successors',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: undefined },
      }),
    },
  ]);
}

export async function fetchAdverseEffects(topicKey, config) {
  const gate = { requireMetadata: true };
  return runFallbackChain(topicKey, [
    {
      description: 'Adverse effect tied to a recent label change or case series (Perplexity)',
      gate,
      fn: () => fetchPerplexity(topicKey, config),
    },
    {
      description: 'Evergreen adverse-effect deep dive (Perplexity, no recency cutoff)',
      gate,
      fn: () => fetchPerplexity(topicKey, {
        ...config,
        topics: {
          ...config.topics,
          [topicKey]: {
            ...config.topics[topicKey],
            focusArea: 'a clinically meaningful adverse effect of a psychiatric medication (e.g., SSRI-associated bleeding, metabolic syndrome on atypicals, lithium nephrotoxicity, QTc on citalopram, serotonin syndrome, NMS, clozapine myocarditis, valproate hyperammonemia, SIADH, tardive dyskinesia), with incidence, risk factors, monitoring, and management',
          },
        },
        recencyCutoff: { ...config.recencyCutoff, [topicKey]: undefined },
      }),
    },
  ]);
}

/**
 * dispatch — maps topic keys to fetch handler functions.
 * S1 and S2 keys use fallback-chain wrappers; S3 keys stay on direct fetchPerplexity.
 */
export const dispatch = {
  's1-new-approvals': fetchNewApprovals,
  's1-pipeline-drugs': fetchPipelineDrugs,
  's1-supply-generics': fetchSupplyGenerics,
  's1-policy-fda-watch': fetchPolicyFdaWatch,
  's2-med-comparison': fetchMedComparison,
  's2-how-things-work': fetchHowThingsWork,
  's2-survey-review': fetchSurveyReview,
  's2-adverse-effects': fetchAdverseEffects,
  's3-diagnosis-history': fetchPerplexity,
  's3-drug-discovery': fetchPerplexity,
  's3-scientific-process': fetchPerplexity,
  's3-historical-legal': fetchPerplexity,
};
