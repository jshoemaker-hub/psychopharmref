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
    // Return brief with defaults filled in
    return {
      topic: brief.topic,
      sources: brief.sources,
      relevantBlogPosts: brief.relevantBlogPosts || [],
      warnings: brief.warnings || [],
    };
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
 * fetchClinicalTrials — fetch Phase 3 psychiatric trials from ClinicalTrials.gov v2 API
 */
export async function fetchClinicalTrials(topicKey, config) {
  try {
    const url = [
      'https://clinicaltrials.gov/api/v2/studies',
      '?aggFilters=phase:phase3,studyType:int',
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
        warnings: ['No Phase 3 trials found'],
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
 * fetchCongress — fetch mental health bills from Congress.gov API
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

    const url = [
      'https://api.congress.gov/v3/bill',
      '?query=mental+health+OR+psychiatry+OR+psychopharmacology+OR+behavioral+health',
      '&sort=updateDate+desc',
      '&offset=0',
      '&limit=10',
    ].join('');

    const response = await fetchWithTimeout(url, {
      headers: {
        'X-Api-Key': apiKey,
        'User-Agent': 'PsychoPharmRef-Newsletter/1.0',
      },
    }, 15000);

    if (response.status === 429) {
      return validateBrief({
        topic: topicKey,
        sources: [],
        warnings: ['Congress.gov rate limited (429) — skipping legislation source'],
      });
    }

    if (!response.ok) {
      throw new Error(`Congress.gov returned ${response.status}`);
    }

    const data = await response.json();
    const bills = data?.bills || [];

    const sources = bills.slice(0, config?.maxBriefSources || 5).map(bill => {
      const congress = bill.congress || '';
      const type = bill.type || '';
      const number = bill.number || '';
      const url = bill.url || `https://www.congress.gov/bill/${congress}th-congress/${type.toLowerCase()}-bill/${number}`;
      return {
        title: bill.title || `${type} ${number}`,
        url,
        publishedDate: bill.updateDate || '',
        retrievedDate: new Date().toISOString().slice(0, 10),
        excerpt: bill.title || '',
      };
    });

    return validateBrief({ topic: topicKey, sources, relevantBlogPosts: [], warnings: [] });
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
 * parsePerplexityResponse — extract sources from Perplexity API response
 */
function parsePerplexityResponse(topicKey, data, config) {
  const content = data?.choices?.[0]?.message?.content || '';
  const citations = data?.citations || [];
  const retrievedDate = new Date().toISOString().slice(0, 10);

  const sources = citations.slice(0, config?.maxBriefSources || 5).map((citation, i) => {
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
      url: citation.url || citation,
      publishedDate: citation.date || '',
      retrievedDate,
      excerpt: citation.snippet || '',
    };
  });

  // If no structured citations, include content as a single source excerpt
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

/**
 * dispatch — maps topic keys to fetch handler functions
 */
export const dispatch = {
  's1-new-approvals': fetchFdaRss,
  's1-pipeline-drugs': fetchClinicalTrials,
  's1-generics': fetchPerplexity,
  's1-shortages': fetchFdaRss,
  's1-legislation': fetchCongress,
  's1-psychiatry-news': fetchPerplexity,
  's2-med-comparison': fetchPerplexity,
  's2-how-things-work': fetchPerplexity,
  's2-survey-review': fetchPerplexity,
  's3-diagnosis-history': fetchPerplexity,
  's3-drug-discovery': fetchPerplexity,
  's3-scientific-process': fetchPerplexity,
  's3-historical-legal': fetchPerplexity,
};
