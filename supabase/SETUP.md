# Supabase Setup: Question Comments

Three steps to get the comment feature fully working.

---

## Step 1: Create the Database Table

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (`rqvulyfzyyvzxekuxgyu`)
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Paste the contents of `create_question_comments.sql`
6. Click **Run**

You should see "Success. No rows returned." — the table is created.

You can verify by going to **Table Editor** and looking for `question_comments`.

---

## Step 2: Deploy the Edge Function (for email notifications)

This step requires the Supabase CLI. If you don't have it:

```bash
npm install -g supabase
```

Then link your project and deploy:

```bash
# From the psychopharm/ directory
cd supabase

# Link to your project (you'll need your project ref and database password)
supabase link --project-ref rqvulyfzyyvzxekuxgyu

# Deploy the function
supabase functions deploy send-comment-email
```

---

## Step 3: Set Up Email (Resend — free tier)

The Edge Function uses [Resend](https://resend.com) to send emails. Resend's free tier gives you 100 emails/day with no credit card.

1. Sign up at https://resend.com
2. Get your API key from the dashboard
3. Add it as a Supabase secret:

```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

**Note on "from" address:** By default, the function sends from `notifications@psychopharmref.com`. For this to work, you'll need to verify your domain in Resend. Alternatively, you can use Resend's default sender (`onboarding@resend.dev`) while testing — just edit the `from` field in `index.ts`.

---

## How It Works

1. User clicks "Comment on Question" after reviewing an answer
2. Modal appears with question preview + textarea
3. On submit:
   - Comment is inserted into `question_comments` table via Supabase client
   - Edge Function `send-comment-email` fires, sending email to jshoemakercb@yahoo.com
4. Even if the email fails, the comment is saved in the database

## Viewing Comments

To see all comments, go to **Table Editor → question_comments** in your Supabase dashboard. You can sort by `created_at` to see the latest, or filter by `question_id` to see comments on a specific question.
