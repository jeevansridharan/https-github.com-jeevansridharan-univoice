# Lumina - Audio-to-Text Application with Authentication

A beautiful, accessible web application for hearing-impaired users that converts audio to text in real-time, now with secure user authentication.

## Features

- 🎤 **Real-time Audio Transcription** - Convert speech to text instantly
- 🔐 **Secure Authentication** - Email/password authentication via Supabase
- 👤 **User Management** - Sign up, login, and logout functionality
- 🛡️ **Protected Routes** - Dashboard accessible only to authenticated users
- ♿ **Accessible Design** - Built with accessibility in mind
- 🎨 **Beautiful UI** - Modern, gradient-rich interface with smooth animations

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Authentication**: Supabase Auth
- **Routing**: React Router v6
- **Styling**: Tailwind CSS (via inline classes)
- **AI**: Google Gemini API for audio transcription

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** (v18 or higher)
2. **A Supabase Account** - [Sign up here](https://supabase.com)
3. **A Google Gemini API Key** - [Get one here](https://aistudio.google.com/app/apikey)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd univoice
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase](https://app.supabase.com) and create a new project
2. Wait for your project to finish setting up
3. Go to **Project Settings** → **API**
4. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

Open `.env.local` and replace the placeholder values:

```bash
GEMINI_API_KEY=your_actual_gemini_api_key

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Enable Email Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if desired (optional)

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### First Time Users

1. Navigate to the app in your browser
2. Click **"Create an Account"** on the login page
3. Enter your email and password (minimum 6 characters)
4. Confirm your password
5. Click **"Create Account"**
6. You'll be automatically logged in and redirected to the dashboard

### Returning Users

1. Navigate to the app
2. Enter your email and password
3. Click **"Sign In"**
4. You'll be redirected to the dashboard

### Using the Dashboard

1. Click the microphone button to start recording
2. Speak clearly into your microphone
3. Watch as your speech is transcribed in real-time
4. Use the font size controls (T1-T4) to adjust text size
5. Click the trash icon to clear the transcript
6. Click **"Logout"** in the top-right corner when done

## Project Structure

```
univoice/
├── components/
│   ├── ProtectedRoute.tsx      # Route guard for authenticated users
│   └── TranscriptDisplay.tsx   # Displays transcribed text
├── contexts/
│   └── AuthContext.tsx         # Authentication state management
├── lib/
│   └── supabase.ts             # Supabase client configuration
├── pages/
│   ├── Dashboard.tsx           # Main app dashboard (protected)
│   ├── Login.tsx               # Login page
│   └── SignUp.tsx              # Sign up page
├── utils/
│   └── audio.ts                # Audio processing utilities
├── App.tsx                     # Main audio-to-text component
├── index.tsx                   # App entry point with routing
├── types.ts                    # TypeScript type definitions
└── .env.local                  # Environment variables
```

## Security Notes

- Never commit your `.env.local` file to version control
- The Supabase anon key is safe to use in the browser
- User passwords are securely hashed by Supabase
- Sessions are stored securely using Supabase Auth

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure you've filled in the correct values in `.env.local`
- Restart the dev server after updating environment variables

### Authentication not working
- Check that Email authentication is enabled in Supabase dashboard
- Verify your Supabase URL and anon key are correct
- Check browser console for detailed error messages

### Audio transcription not working
- Verify your Gemini API key is correct
- Make sure you've granted microphone permissions
- Check that you're using a supported browser (Chrome, Edge, etc.)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your own purposes.
