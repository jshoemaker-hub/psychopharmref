// lib/post.js — Beehiiv API integration

/**
 * postDraft — POST a newsletter draft to Beehiiv v2 API.
 *
 * @param {string} htmlContent
 * @param {string} subject
 * @param {string} previewText
 * @param {object} config — must include beehiivPublicationId
 * @returns {{ id: string, draftUrl: string }}
 * @throws Error with Beehiiv error message on failure
 */
export async function postDraft(htmlContent, subject, previewText, config) {
  const publicationId = config?.beehiivPublicationId || process.env.BEEHIIV_PUBLICATION_ID;
  const apiKey = process.env.BEEHIIV_API_KEY;

  if (!publicationId) {
    throw new Error('BEEHIIV_PUBLICATION_ID is not set');
  }
  if (!apiKey) {
    throw new Error('BEEHIIV_API_KEY is not set');
  }

  const endpoint = `https://api.beehiiv.com/v2/publications/${publicationId}/posts`;

  const body = {
    subject,
    preview_text: previewText,
    status: 'draft',
    content_html: htmlContent,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'PsychoPharmRef-Newsletter/1.0',
    },
    body: JSON.stringify(body),
  });

  let responseData;
  try {
    responseData = await response.json();
  } catch {
    throw new Error(`Beehiiv API returned ${response.status} with non-JSON response`);
  }

  if (!response.ok) {
    const errMsg = responseData?.message || responseData?.error || `HTTP ${response.status}`;
    throw new Error(`Beehiiv API error: ${errMsg}`);
  }

  const id = responseData?.data?.id || responseData?.id;
  if (!id) {
    throw new Error('Beehiiv API response did not include a post ID');
  }

  const draftUrl = `https://app.beehiiv.com/posts/${id}/edit`;

  return { id, draftUrl };
}
