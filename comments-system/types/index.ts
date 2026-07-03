// types/index.ts
// Shared type definitions for the comments system.

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  body: string;
  created_at: string;
}

export interface CommentValidationResult {
  valid: boolean;
  error?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
  newsletterSubscribed?: boolean;
}
