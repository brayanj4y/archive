# Database Setup Guide

## Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and enter project details
4. Wait for project to be created

### 2. Get Credentials
1. Go to Settings > API in your Supabase dashboard
2. Copy the following:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key

### 3. Configure Environment
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials

### 4. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 5. Setup Database
\`\`\`bash
npm run setup-db
\`\`\`

### 6. Create Admin User
1. Go to Authentication > Users in Supabase dashboard
2. Click "Add user"
3. Email: `admin@shiptrack.com`
4. Password: `admin123` (or your choice)
5. Copy the user ID
6. Update `scripts/06-create-admin-user.sql` with the user ID
7. Run the script in Supabase SQL Editor

### 7. Verify Setup
\`\`\`bash
npm run verify-db
\`\`\`

### 8. Start Development
\`\`\`bash
npm run dev
\`\`\`

## Manual Setup

If the automated setup doesn't work, you can manually run each SQL script in the Supabase SQL Editor:

1. `scripts/01-create-tables.sql`
2. `scripts/02-create-rls-policies.sql`
3. `scripts/03-create-triggers.sql`
4. `scripts/04-seed-data.sql`
5. `scripts/05-create-functions.sql`
6. `scripts/06-create-admin-user.sql` (after creating auth user)
7. `scripts/07-verify-setup.sql`

## Troubleshooting

### Common Issues

**"Missing Supabase credentials"**
- Make sure `.env.local` exists and has correct values
- Check that environment variables are set correctly

**"Permission denied"**
- Make sure you're using the `service_role` key, not the `anon` key
- Check that RLS policies are set up correctly

**"Table already exists"**
- This is normal if you're re-running setup
- The scripts use `IF NOT EXISTS` to prevent conflicts

**"Admin login fails"**
- Make sure you created the user in Supabase Auth dashboard
- Check that the user ID in `06-create-admin-user.sql` matches
- Verify the user has `admin` role in the profiles table

### Getting Help

1. Check the Supabase dashboard for error logs
2. Run `npm run verify-db` to check setup status
3. Check browser console for client-side errors
4. Verify environment variables are loaded correctly
