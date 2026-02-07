# Supabase Setup Guide

Follow these steps to set up Supabase authentication for your Lumina app.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign In"**
3. Sign up with GitHub, Google, or email

## Step 2: Create a New Project

1. Click **"New Project"**
2. Fill in the details:
   - **Name**: `lumina-auth` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Select "Free" for development
3. Click **"Create new project"**
4. Wait 2-3 minutes for your project to be set up

## Step 3: Get Your API Credentials

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see two important values:

   **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **anon/public key** (under "Project API keys")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Copy both of these values

## Step 4: Update Your .env.local File

1. Open `.env.local` in your project
2. Replace the placeholder values:

```bash
GEMINI_API_KEY=your_existing_gemini_key

# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file

## Step 5: Configure Email Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Email** in the list
3. Make sure it's **enabled** (toggle should be green)
4. (Optional) Customize email templates under **Authentication** → **Email Templates**

## Step 6: Test Your Setup

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`
3. Try creating a new account
4. Check your Supabase dashboard under **Authentication** → **Users** to see the new user

## Optional: Customize Email Settings

### Disable Email Confirmation (for development)

By default, Supabase requires users to confirm their email. For development, you can disable this:

1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. Toggle **"Enable email confirmations"** to OFF
4. Click **Save**

⚠️ **Note**: Re-enable this for production!

### Custom Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - Confirmation email
   - Password reset
   - Magic link
   - Email change

## Troubleshooting

### "Invalid API key" error
- Double-check you copied the **anon/public** key, not the service_role key
- Make sure there are no extra spaces in your .env.local file

### Users not appearing in dashboard
- Check that Email provider is enabled
- Look for error messages in browser console
- Verify your Supabase URL is correct

### Email confirmation not working
- Check your spam folder
- Verify email templates are configured
- For development, consider disabling email confirmation

## Security Best Practices

✅ **DO:**
- Use the anon/public key in your frontend
- Keep your database password secure
- Enable Row Level Security (RLS) for production
- Use environment variables for all credentials

❌ **DON'T:**
- Commit .env.local to version control
- Share your service_role key publicly
- Use the same project for dev and production

## Next Steps

Once your Supabase is set up:
1. ✅ Test user registration
2. ✅ Test login/logout
3. ✅ Verify protected routes work
4. 🚀 Deploy your app!

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
