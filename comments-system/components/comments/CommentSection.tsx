"use client";

// components/comments/CommentSection.tsx
// Self-contained comment section: list + form + auth modal + realtime.
// Usage: <CommentSection postId="my-post-slug" />

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { AuthModal } from "@/components/auth/AuthModal";
import { validateCommentContent, getInitials, getAvatarColor } from "@/lib/utils";
import { postComment } from "@/actions/comments";
import { signOut } from "@/actions/auth";
import type { Comment } from "@/types";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

// ── Constants ───────────────────────────────────────────────────────────
const MAX_CHARS = 2000;
const RATE_LIMIT_MS = 30_000;

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user, loading: authLoading } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // ── Fetch comments on mount ───────────────────────────────────────
  const fetchComments = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load comments:", error);
      toast.error("Failed to load comments.");
    } else {
      setComments(data || []);
    }
    setLoadingComments(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // ── Realtime subscription ─────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          const newComment = payload.new as Comment;
          setComments((prev) => {
            // Deduplicate (we may have already added it optimistically)
            if (prev.some((c) => c.id === newComment.id)) return prev;
            return [...prev, newComment];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          const deletedId = payload.old.id as string;
          setComments((prev) => prev.filter((c) => c.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  // ── Handle sign out ───────────────────────────────────────────────
  async function handleSignOut() {
    const result = await signOut();
    if (result.success) {
      toast.success("Signed out.");
    }
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <section className="mt-16 mb-8 max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Comments</h2>
        <Badge variant="secondary" className="text-xs">
          {comments.length}
        </Badge>
      </div>

      {/* User status bar */}
      {!authLoading && (
        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
          {user ? (
            <div className="flex items-center gap-2">
              <span>
                Commenting as{" "}
                <span className="font-medium text-foreground">
                  {user.user_metadata?.username ||
                    user.user_metadata?.full_name ||
                    user.email?.split("@")[0]}
                </span>
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs h-7">
                Sign out
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-primary hover:underline cursor-pointer font-medium"
            >
              Sign in to join the conversation
            </button>
          )}
        </div>
      )}

      {/* Comment form */}
      {user ? (
        <CommentForm postId={postId} userId={user.id} />
      ) : (
        <Card className="mb-8 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Sign in or create a free account to leave a comment.
            </p>
            <Button onClick={() => setAuthModalOpen(true)}>Sign In to Comment</Button>
          </CardContent>
        </Card>
      )}

      {/* Comments list */}
      {loadingComments ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-3/4 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-1">
          {comments.map((comment, idx) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              isOwn={user?.id === comment.user_id}
              isNew={idx === comments.length - 1}
            />
          ))}
        </div>
      )}

      {/* Auth modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// COMMENT FORM
// ═══════════════════════════════════════════════════════════════════════
function CommentForm({ postId, userId }: { postId: string; userId: string }) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = body.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > MAX_CHARS - 100;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = body.trim();
    if (!trimmed) {
      toast.error("Comment cannot be empty.");
      return;
    }

    // Client-side content validation (instant feedback)
    const validation = validateCommentContent(trimmed);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    // Client-side rate limit check
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const remaining = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
      toast.error(`Please wait ${remaining} seconds before commenting again.`);
      return;
    }

    setSubmitting(true);
    const result = await postComment(postId, trimmed);
    setSubmitting(false);

    if (result.success) {
      setBody("");
      setLastSubmitTime(Date.now());
      toast.success("Comment posted!");
      textareaRef.current?.focus();
    } else {
      toast.error(result.error || "Failed to post comment.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts…"
          className="min-h-[100px] resize-y pr-4 pb-8"
          maxLength={MAX_CHARS + 50} // Allow slight over-type so they see the red counter
          disabled={submitting}
        />
        {/* Character counter */}
        <span
          className={`absolute bottom-2 right-3 text-xs tabular-nums ${
            isOverLimit
              ? "text-red-500 font-semibold"
              : isNearLimit
              ? "text-amber-500"
              : "text-muted-foreground"
          }`}
        >
          {charCount}/{MAX_CHARS}
        </span>
      </div>

      <div className="flex justify-end mt-3">
        <Button type="submit" disabled={submitting || isOverLimit || !body.trim()} size="sm">
          {submitting ? "Posting…" : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SINGLE COMMENT CARD
// ═══════════════════════════════════════════════════════════════════════
function CommentCard({
  comment,
  isOwn,
  isNew,
}: {
  comment: Comment;
  isOwn: boolean;
  isNew: boolean;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;
    setDeleting(true);

    const supabase = createClient();
    const { error } = await supabase.from("comments").delete().eq("id", comment.id);

    if (error) {
      toast.error("Failed to delete comment.");
      setDeleting(false);
    } else {
      toast.success("Comment deleted.");
    }
  }

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

  return (
    <div
      className={`group flex gap-3 py-4 border-b border-border/50 last:border-b-0 transition-opacity duration-300 ${
        isNew ? "animate-in fade-in slide-in-from-bottom-2 duration-500" : ""
      } ${deleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Avatar */}
      <Avatar className="h-9 w-9 shrink-0">
        {comment.avatar_url && <AvatarImage src={comment.avatar_url} alt={comment.username} />}
        <AvatarFallback
          className="text-xs font-medium text-white"
          style={{ backgroundColor: getAvatarColor(comment.user_id) }}
        >
          {getInitials(comment.username)}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium truncate">{comment.username}</span>
          <span className="text-xs text-muted-foreground shrink-0">{timeAgo}</span>
          {isOwn && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
              You
            </Badge>
          )}
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground/90">
          {comment.body}
        </p>

        {/* Delete button (own comments only) */}
        {isOwn && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-1 text-xs text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
