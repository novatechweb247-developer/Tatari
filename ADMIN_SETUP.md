# Tatari Admin Center setup

## Environment variables

Configure these in the local `.env.local` file and in the production deployment environment:

```env
VITE_SUPABASE_URL=https://efdtxbbhggdcohigelmw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-sb_publishable-key
```

The publishable key is intended for browser applications. Never add a Supabase secret/service-role key to a `VITE_` variable, frontend source, or GitHub commit.

## Authorize an administrator

1. Create the administrator account in Supabase Authentication using the dashboard.
2. Copy that user's UUID from Authentication > Users.
3. Run this statement in the Supabase SQL editor, replacing the UUID with the actual user ID:

```sql
insert into public.admin_users (user_id)
values ('REPLACE-WITH-AUTH-USER-UUID')
on conflict (user_id) do nothing;
```

Only users in `public.admin_users` can manage content or read customer enquiries. Keep Row Level Security enabled.

## Content workflow

- **Save draft** stores the editable draft in the row's `draft_data` JSONB column and does not overwrite currently published fields.
- **Publish** copies the draft into the published columns and marks the record as published.
- Public pages query only rows with `is_published = true`; the original static website data remains a fallback if the database has no published content yet.
- Hero slide numbers are constrained by the database to exactly 1, 2, and 3.
- Image uploads go to the persistent `site-media` Storage bucket. Public URLs are saved in the content draft and become public website content only when published.

## Customer enquiries

The public contact form inserts inquiries into `public.enquiries`. The public role can submit but cannot read them. Only authorized administrators can read and update enquiry statuses.

## Production checklist

- Set both environment variables in the production deployment.
- Confirm the admin user UUID is in `public.admin_users`.
- Confirm the `site-media` bucket exists and its admin upload policies are active.
- Test draft save, publish, upload, public rendering, and contact-form submission on the deployed site.
- Rotate any secret/service-role key that has ever been pasted into a chat, committed, or exposed in browser code.
