# Blog Comments System

## 1. Overview

A complete, production-ready comments system built with Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Supabase. Users authenticate via email/password or Google OAuth, then post flat, plain-text comments that appear in real time via Supabase Realtime. Every comment is validated client- and server-side against links, images, and profanity. Registration includes a mandatory community-guidelines checkbox and an optional newsletter-subscribe checkbox (default checked), with the newsletter preference stored in Supabase `auth.users.raw_user_meta_data`. Comments are rate-limited to one per 30 seconds per user.

---

## 2. Supabase Setup Instructions

### Step 1 — Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon (public) key** from Settings → API.

### Step 2 — Enable Auth Providers
1. In the Supabase dashboard go to **Authentication → Providers**.
2. Enable **Email** (confirm-email can be toggled on/off per your preference).
3. Enable **Google** — paste your Google OAuth Client ID and Client Secret (from Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID). Set the authorized redirect URI to:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

### Step 3 — Run the Database SQL
Execute the full SQL from section 4 below in **SQL Editor** (Supabase dashboard → SQL Editor → New Query).

### Step 4 — Enable Realtime
1. Go to **Database → Replication**.
2. Under "Realtime", enable the `comments` table for `INSERT` events.

---

## 3. Environment Variables

Create `.env.local` at your Next.js project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google OAuth (configured in Supabase dashboard, not needed in .env
# unless you're using a custom auth flow)
```

---

## 4. Database Schema

```sql
-- ============================================================
-- COMMENTS TABLE
-- ============================================================
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     text not null,
  user_id     uuid not null references auth.users(id) on delete cascade,
  username    text not null,
  avatar_url  text,
  body        text not null check (char_length(body) between 1 and 2000),
  created_at  timestamptz not null default now()
);

-- Index for fast lookups by post
create index if not exists idx_comments_post_id on public.comments(post_id);

-- Index for rate-limiting check
create index if not exists idx_comments_user_created
  on public.comments(user_id, created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY — COMMENTS
-- ============================================================
alter table public.comments enable row level security;

-- Anyone can read comments (including guests)
create policy "Comments are publicly readable"
  on public.comments for select
  using (true);

-- Authenticated users can insert their own comments only
create policy "Users can insert own comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

-- Users can delete their own comments
create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS TABLE (optional, for admin queries)
-- ============================================================
create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  email         text not null,
  subscribed_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.newsletter_subscribers enable row level security;

-- Users can insert their own subscription
create policy "Users can subscribe themselves"
  on public.newsletter_subscribers for insert
  with check (auth.uid() = user_id);

-- Users can read their own subscription
create policy "Users can read own subscription"
  on public.newsletter_subscribers for select
  using (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE NEWSLETTER ROW ON SIGNUP (trigger)
-- ============================================================
create or replace function public.handle_newsletter_on_signup()
returns trigger as $$
begin
  if (new.raw_user_meta_data ->> 'newsletter_subscribed')::boolean = true then
    insert into public.newsletter_subscribers (user_id, email)
    values (new.id, new.email)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_newsletter_on_signup();
```

---

## 6. Integration Guide

### Drop into any blog post page

```tsx
// app/blog/[slug]/page.tsx
import { CommentSection } from "@/components/comments/CommentSection";

export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <article>
      {/* ... your blog content ... */}

      {/* Comments — place at the very bottom */}
      <CommentSection postId={params.slug} />
    </article>
  );
}
```

The `<CommentSection>` component is entirely self-contained: it renders the comment list, the auth modal (triggered when a guest tries to comment), and the comment form for logged-in users. No additional wiring is needed.

### Required shadcn/ui components
Install these via the shadcn CLI:
```bash
npx shadcn-ui@latest add button input textarea card avatar checkbox label badge dialog tabs
```

### Required packages
```bash
npm install sonner @supabase/supabase-js @supabase/ssr date-fns
```

---

## 7. Styling & UX Details

- **Premium minimalist design** — clean card-based layout with subtle borders and warm neutral tones that match your blog's `--bg2` / `--border` palette.
- **Light/dark mode** — works with `next-themes` and shadcn's built-in theming.
- **Comment count badge** — shows total count next to the "Comments" heading.
- **Avatars** — uses Google profile picture if available, otherwise renders colored initials.
- **Relative timestamps** — "2h ago", "3 days ago" via `date-fns/formatDistanceToNow`.
- **Character counter** — live count below the textarea, turns red at 1900+, hard max 2000.
- **Realtime** — new comments from other users appear instantly via Supabase Realtime subscription.
- **Toasts** — success/error notifications via `sonner`.
- **Smooth entry** — new comments fade in with CSS transitions.

---

## 8. Security & Best Practices

- **Full sanitization** — all comment text is plain-text only. No HTML, no markdown rendering. Content is escaped before display.
- **Triple-layer content filtering:**
  1. Client-side validation before submit (instant feedback).
  2. Server action validation (authoritative).
  3. Database `CHECK` constraint on length.
- **Rate limiting** — server action checks for existing comment from same user within last 30 seconds. If found, rejects with clear error message.
- **RLS enforcement** — even if server action is bypassed, Supabase RLS prevents users from inserting comments with a different `user_id`.
- **Prepared statements** — all Supabase queries use parameterized `.insert()` / `.select()` — no raw SQL from user input.
- **No raw HTML** — comments are rendered in `<p>` tags with `whitespace-pre-wrap`. React's default escaping prevents XSS.
- **CSRF protection** — Next.js server actions have built-in CSRF tokens.
- **Auth validation** — server action verifies `supabase.auth.getUser()` (server-side, non-spoofable) before every insert.
