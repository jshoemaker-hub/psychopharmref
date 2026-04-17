// PsychoPharmRef — send-comment-email Edge Function
// Sends an email notification to the admin when a user comments on a question.
//
// Deploy: supabase functions deploy send-comment-email
// Requires RESEND_API_KEY secret (see setup instructions)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const DEFAULT_ADMIN_EMAIL = "jshoemakercb@yahoo.com";

// Use Resend (free tier: 100 emails/day, no credit card needed)
// Sign up at https://resend.com and get an API key
const RESEND_URL = "https://api.resend.com/emails";

serve(async (req) => {
  // CORS headers for browser requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { question_id, question_text, comment, user_email, admin_email } =
      await req.json();

    const to = admin_email || DEFAULT_ADMIN_EMAIL;

    // Truncate question text for email subject
    const shortQ =
      question_text && question_text.length > 60
        ? question_text.substring(0, 60) + "..."
        : question_text || "(no text)";

    const emailBody = `
New comment on PsychoPharmRef Question Bank

Question ID: ${question_id}
Question: ${question_text}

Comment from ${user_email}:
${comment}

---
Submitted at ${new Date().toISOString()}
    `.trim();

    if (!RESEND_API_KEY) {
      // If no Resend key, log to console and return success
      // Comments are still saved in the database
      console.log("No RESEND_API_KEY set — email skipped. Comment logged:");
      console.log(emailBody);
      return new Response(
        JSON.stringify({ success: true, note: "Email skipped — no API key" }),
        { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Send via Resend
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PsychoPharmRef <notifications@psychopharmref.com>",
        to: [to],
        subject: `[QBank Comment] Q#${question_id}: ${shortQ}`,
        text: emailBody,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
