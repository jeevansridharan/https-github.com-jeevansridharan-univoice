# 📦 Project Structure

Complete overview of the Lumina authentication implementation.

## 📁 Directory Structure

```
univoice/
├── 📄 .env.local                    # Environment variables (Supabase + Gemini)
├── 📄 .gitignore                    # Git ignore rules
├── 📄 package.json                  # Dependencies and scripts
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 vite.config.ts                # Vite build configuration
├── 📄 index.html                    # HTML entry point
├── 📄 index.tsx                     # React entry point with routing
├── 📄 App.tsx                       # Main audio-to-text component
├── 📄 types.ts                      # TypeScript type definitions
│
├── 📁 lib/
│   └── 📄 supabase.ts              # Supabase client configuration
│
├── 📁 contexts/
│   └── 📄 AuthContext.tsx          # Authentication state management
│
├── 📁 components/
│   ├── 📄 ProtectedRoute.tsx       # Route guard for auth
│   └── 📄 TranscriptDisplay.tsx    # Audio transcript display
│
├── 📁 pages/
│   ├── 📄 Login.tsx                # Login page
│   ├── 📄 SignUp.tsx               # Sign up page
│   └── 📄 Dashboard.tsx            # Protected dashboard wrapper
│
├── 📁 utils/
│   └── 📄 audio.ts                 # Audio processing utilities
│
└── 📁 Documentation/
    ├── 📄 README.md                # Main documentation
    ├── 📄 QUICKSTART.md            # Quick setup guide
    ├── 📄 SUPABASE_SETUP.md        # Detailed Supabase guide
    └── 📄 AUTH_FLOW.md             # Authentication flow docs
```

## 🔑 Key Files Explained

### Core Application Files

#### `index.tsx` - Application Entry Point
- Sets up React Router
- Wraps app with AuthProvider
- Defines all routes (login, signup, dashboard)
- Handles redirects

#### `App.tsx` - Audio-to-Text Component
- Original Lumina functionality
- Real-time audio transcription
- Gemini API integration
- Font size controls
- Transcript display

### Authentication Files

#### `lib/supabase.ts` - Supabase Client
```typescript
// Initializes Supabase client with environment variables
export const supabase = createClient(url, key);
```

#### `contexts/AuthContext.tsx` - Auth State Manager
```typescript
// Provides:
- user: User | null
- session: Session | null
- signUp(email, password)
- signIn(email, password)
- signOut()
```

#### `components/ProtectedRoute.tsx` - Route Guard
```typescript
// Protects routes from unauthenticated access
// Shows loading → Checks auth → Redirects or renders
```

### Page Components

#### `pages/Login.tsx`
- Email/password form
- Error handling
- Loading states
- Navigation to signup

#### `pages/SignUp.tsx`
- Registration form
- Password confirmation
- Validation
- Success messages

#### `pages/Dashboard.tsx`
- Wraps App component
- Shows user info
- Logout button
- Protected by ProtectedRoute

## 📊 Dependencies

### Production Dependencies
```json
{
  "@google/genai": "^1.39.0",        // Gemini API
  "@supabase/supabase-js": "latest", // Supabase client
  "react": "^19.0.0",                // React library
  "react-dom": "^19.0.0",            // React DOM
  "react-router-dom": "latest"       // Routing
}
```

### Dev Dependencies
```json
{
  "@types/node": "^22.14.0",
  "@types/react-router-dom": "latest",
  "@vitejs/plugin-react": "^5.0.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

## 🔄 Application Flow

### 1. App Initialization
```
index.tsx
  ├─ BrowserRouter
  │   └─ AuthProvider
  │       ├─ Check existing session
  │       └─ Set up auth listener
  └─ Routes
      ├─ / → /login
      ├─ /login (public)
      ├─ /signup (public)
      └─ /dashboard (protected)
```

### 2. Authentication Flow
```
Login/Signup
  ↓
AuthContext.signIn/signUp
  ↓
Supabase Auth API
  ↓
Session Created
  ↓
User State Updated
  ↓
Redirect to Dashboard
```

### 3. Protected Access
```
Navigate to /dashboard
  ↓
ProtectedRoute checks auth
  ↓
├─ Authenticated → Render Dashboard
└─ Not authenticated → Redirect to /login
```

## 🎨 UI Components Breakdown

### Login Page Components
- Logo/Header section
- Email input field
- Password input field
- Sign in button (with loading state)
- Error message display
- Create account link
- Footer text

### Signup Page Components
- Logo/Header section
- Email input field
- Password input field
- Confirm password field
- Create account button (with loading state)
- Success/Error message display
- Sign in link
- Footer text

### Dashboard Components
- User info badge (top-right)
- Logout button
- Original App component:
  - Header with logo
  - Font size controls
  - Transcript display
  - Microphone button
  - Clear button
  - Status indicators

## 🔐 Environment Variables

Required in `.env.local`:

```bash
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3001)

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📝 TypeScript Types

### Custom Types (`types.ts`)
```typescript
export enum AppStatus {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  LISTENING = 'listening'
}

export type FontSize = 'text-xl' | 'text-2xl' | 'text-4xl' | 'text-6xl';

export interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
}
```

### Supabase Types
```typescript
import { User, Session, AuthError } from '@supabase/supabase-js';
```

## 🎯 Feature Checklist

### ✅ Implemented
- [x] Email/password authentication
- [x] User registration
- [x] User login
- [x] User logout
- [x] Protected routes
- [x] Session persistence
- [x] Error handling
- [x] Loading states
- [x] Responsive design
- [x] Accessible UI

### 🔮 Future Enhancements
- [ ] Password reset
- [ ] Email verification
- [ ] Social login (Google, GitHub)
- [ ] Profile management
- [ ] Remember me option
- [ ] Two-factor authentication

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation |
| `QUICKSTART.md` | 5-minute setup guide |
| `SUPABASE_SETUP.md` | Detailed Supabase configuration |
| `AUTH_FLOW.md` | Authentication architecture |
| `PROJECT_STRUCTURE.md` | This file |

## 🔧 Configuration Files

### `vite.config.ts`
- React plugin configuration
- Build settings
- Dev server settings

### `tsconfig.json`
- TypeScript compiler options
- Module resolution
- Path aliases

### `.gitignore`
- Excludes node_modules
- Excludes .env.local
- Excludes build output

## 🌐 Routing Configuration

```typescript
<Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<SignUp />} />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
  <Route path="*" element={<Navigate to="/login" />} />
</Routes>
```

## 📊 File Sizes (Approximate)

```
Total Project Size: ~150 MB (with node_modules)
Source Code: ~50 KB
Documentation: ~25 KB
Dependencies: ~150 MB
```

## 🎨 Styling Approach

- **Inline Tailwind-style classes** for all styling
- **Dark theme** throughout
- **Gradient backgrounds** for visual appeal
- **Glassmorphism effects** on cards
- **Smooth animations** for interactions
- **Responsive design** for all screen sizes

## 🔍 Code Quality

- ✅ TypeScript for type safety
- ✅ React hooks for state management
- ✅ Functional components
- ✅ Proper error handling
- ✅ Loading states
- ✅ Accessible HTML
- ✅ Clean code structure

---

**Project Version**: 1.0.0  
**Last Updated**: February 2026  
**Framework**: React 19 + Vite  
**Authentication**: Supabase Auth
