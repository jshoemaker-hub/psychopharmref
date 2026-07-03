"use server";

// actions/comments.ts
// Server action for posting a comment with full server-side validation.

import { createServerSupabase } from "@/lib/supabase";
import { validateCommentContent } from "@/lib/utils";

interface PostCommentResult {
  success: boolean;
  error?: string;
}

/**
 * Post a new comment.
 * Validates auth, rate limit, and content rules server-side.
 */
export async function postComment(
  postId: string,
  body: string
): Promise<PostCommentResult> {
  const supabase = await createServerSupabase();

  // ── 1. Authenticate ──────────────────────────────────────────────────
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be signed in to comment." };
  }

  // ── 2. Validate content ──────────────────────────────────────────────
  const validation = validateCommentContent(body);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // ── 3. Rate limit: 1 comment per 30 seconds ─────────────────────────
  const thirtySecondsAgo = new Date(Date.now() - 30_000).toISOString();

  const { data: recentComments } = await supabase
    .from("comments")
    .select("id")
    .eq("user_id", user.id)
    .gte("created_at", thirtySecondsAgo)
    .limit(1);

  if (recentComments && recentComments.length > 0) {
    return {
      success: false,
      error: "You're commenting too fast. Please wait 30 seconds between comments.",
    };
  }

  // ── 4. Derive username & avatar ──────────────────────────────────────
  const meta = user.user_metadata || {};
  const username =
    meta.username ||
    meta.full_name ||
    meta.name ||
    user.email?.split("@")[0] ||
    "Anonymous";
  const avatarUrl = meta.avatar_url || meta.picture || null;

  // ── 5. Insert comment ────────────────────────────────────────────────
  const { error: insertError } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    username: username.slice(0, 50),
    avatar_url: avatarUrl,
    body: body.trim(),
  });

  if (insertError) {
    console.error("Comment insert error:", insertError);
    return { success: false, error: "Failed to post comment. Please try again." };
  }

  return { success: true };
}
