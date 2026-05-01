// lib/post.js — Beehiiv API integration
//
// Rewritten 2026-04-17 to match Beehiiv v2 schema for POST /publications/{id}/posts.
// Previous payload used { subject, preview_text, status, content_html } which omitted
// the required `title` field entirely, producing HTTP 400 with no useful body.
//
// Correct payload (per Beehiiv developer docs):
//   title              — required string; shown as post title on web version
//   subtitle           — optional string; shown below title on web version
//   email_subject_line — optional string; what recipients see as the email subject
//   preview_text       — optional string; inbox preview text (aka preheader)
//   body_content       — required (or `blocks`); raw HTML string for the post body
//   status             — 'draft' | 'confirmed'; omit or set 'draft' to keep as draft
//
// Full reference: https://developers.beehiiv.com/api-reference/posts/create

/**
 * postDraft — POST a newsletter draft to Beehiiv v2 API.
 *
 * @param {string} htmlContent
 * @param {string} subject — used as both post title and email subject line
 * @param {string} previewText
 * @param {object} config — must include beehiivPublicationId
 * @returns {{ id: string, draftUrl: string }}
 * @throws Error with Beehiiv error message on failure
 */
export async function postDraft(htmlContent, subject, previewText, config) {
  const rawPublicationId = config?.beehiivPublicationId || process.env.BEEHIIV_PUBLICATION_ID;
  const apiKey = process.env.BEEHIIV_API_KEY;

  if (!rawPublicationId) {
    throw new Error('BEEHIIV_PUBLICATION_ID is not set');
  }
  if (!apiKey) {
    throw new Error('BEEHIIV_API_KEY is not set');
  }

  // Beehiiv expects publication IDs in the form `pub_<uuid>`. Users often copy
  // the bare UUID from the dashboard URL and omit the prefix. Auto-prepend it
  // with a one-time warning so the run succeeds.
  let publicationId = rawPublicationId.trim();
  if (!/^pub_/.test(publicationId)) {
    console.warn(
      `[post] BEEHIIV_PUBLICATION_ID is "${publicationId}" — Beehiiv expects the "pub_" prefix.\n` +
      `       Treating it as "pub_${publicationId}" for this run. Update your .env to silence this warning.`
    );
    publicationId = `pub_${publicationId}`;
  }

  const endpoint = `https://api.beehiiv.com/v2/publications/${publicationId}/posts`;

  const body = {
    // Required: the post title (shown on the web version).
    title: subject,
    // The email subject line recipients see in their inbox. Usually same as title.
    email_subject_line: subject,
    // Inbox preview text.
    preview_text: previewText,
    // Raw HTML body. Beehiiv also accepts a `blocks` array instead, but not both.
    body_content: htmlContent,
    // 'draft' keeps the post unpublished. Omitting defaults to 'confirmed' (sends).
    status: 'draft',
  };

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'PsychoPharmRef-Newsletter/1.0',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(`Beehiiv fetch failed: ${err.message}`);
  }

  // Read body once as text so we can both parse JSON AND include it verbatim in
  // error messages when the JSON shape doesn't match our expectations.
  const rawText = await response.text();
  let responseData = null;
  if (rawText) {
    try { responseData = JSON.parse(rawText); } catch { /* keep rawText for error */ }
  }

  if (!response.ok) {
    // Beehiiv returns errors in a few different shapes depending on the failure:
    //   { errors: [{ message, field, code }] }      — validation errors
    //   { message: "..." }                          — simple errors
    //   { error: "..." }                            — legacy
    // Fall through to the raw body if none match.
    let detail;
    if (responseData) {
      if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        detail = responseData.errors.map(e => {
          const parts = [e.message || e.code || 'error'];
          if (e.field) parts.push(`(field: ${e.field})`);
          return parts.join(' ');
        }).join('; ');
      } else if (responseData.message) {
        detail = responseData.message;
      } else if (responseData.error) {
        detail = responseData.error;
      } else {
        detail = JSON.stringify(responseData);
      }
    } else {
      detail = rawText || '(empty response body)';
    }
    throw new Error(`Beehiiv API error HTTP ${response.status}: ${detail}`);
  }

  if (!responseData) {
    throw new Error(`Beehiiv API returned ${response.status} with non-JSON body: ${rawText.slice(0, 200)}`);
  }

  const id = responseData?.data?.id || responseData?.id;
  if (!id) {
    throw new Error(`Beehiiv API response did not include a post ID. Body: ${JSON.stringify(responseData).slice(0, 400)}`);
  }

  const draftUrl = `https://app.beehiiv.com/posts/${id}/edit`;

  return { id, draftUrl };
}
