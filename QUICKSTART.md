# 🚀 Quick Start Guide - Lumina Authentication

Get your Lumina app up and running with authentication in 5 minutes!

## ✅ What You'll Need

- [ ] Supabase account (free)
- [ ] Google Gemini API key
- [ ] 5 minutes of your time

## 📋 Step-by-Step Setup

### 1️⃣ Get Your Supabase Credentials (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - Name: `lumina-auth`
   - Password: (create a strong one)
   - Region: (closest to you)
4. Click **"Create new project"** and wait ~2 minutes
5. Go to **Settings** → **API**
6. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

### 2️⃣ Update Your Environment Variables (30 seconds)

Open `.env.local` and paste your credentials:

```bash
GEMINI_API_KEY=AIzaSyBw3xsCV7moeoA_KOijYQZEUPlQW_X5jcQ

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3️⃣ Enable Email Auth in Supabase (30 seconds)

1. In Supabase dashboard: **Authentication** → **Providers**
2. Make sure **Email** is enabled (green toggle)
3. Done!

### 4️⃣ Start the App (1 minute)

```bash
npm run dev
```

Navigate to: `http://localhost:3001`

## 🎉 You're Done!

### Test Your Setup

1. **Create an account**:
   - Click "Create an Account"
   - Enter email: `test@example.com`
   - Password: `password123`
   - Click "Create Account"

2. **Verify in Supabase**:
   - Go to **Authentication** → **Users**
   - You should see your new user!

3. **Test Login**:
   - Click "Logout"
   - Sign in with the same credentials
   - You're back in the dashboard!

## 🎨 What You Get

### Login Page
- Clean, accessible design
- Email/password authentication
- Error handling
- Loading states
- Link to signup

### Signup Page
- Password confirmation
- Validation (min 6 characters)
- Success messages
- Auto-redirect after signup

### Protected Dashboard
- Only accessible when logged in
- Shows user email
- Logout button
- Full audio-to-text functionality

## 🔒 Security Features

✅ Passwords are hashed by Supabase  
✅ Sessions stored securely  
✅ Protected routes (can't access dashboard without login)  
✅ Auto-redirect to login when session expires  

## 🐛 Troubleshooting

**"Missing Supabase environment variables"**
→ Check `.env.local` has correct values and restart dev server

**Can't create account**
→ Make sure Email provider is enabled in Supabase

**Not redirecting after login**
→ Check browser console for errors

## 📚 Next Steps

- [ ] Customize the UI colors
- [ ] Add password reset functionality
- [ ] Add social login (Google, GitHub)
- [ ] Deploy to production

## 🆘 Need Help?

Check out:
- `SUPABASE_SETUP.md` - Detailed Supabase guide
- `README.md` - Full documentation
- [Supabase Docs](https://supabase.com/docs)

---

**Happy coding! 🎤✨**
