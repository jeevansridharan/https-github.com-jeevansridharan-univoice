# 🔐 Authentication Flow Documentation

This document explains how authentication works in the Lumina application.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                            │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Login Page  │  │ Signup Page  │  │  Dashboard   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                          │                                  │
│                   ┌──────▼──────┐                          │
│                   │ AuthContext │                          │
│                   └──────┬──────┘                          │
│                          │                                  │
│                   ┌──────▼──────┐                          │
│                   │   Supabase  │                          │
│                   │   Client    │                          │
│                   └──────┬──────┘                          │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ HTTPS
                           │
                    ┌──────▼──────┐
                    │  Supabase   │
                    │   Server    │
                    │             │
                    │ • Auth API  │
                    │ • Database  │
                    └─────────────┘
```

## User Flows

### 1. New User Registration

```
User visits app
    │
    ▼
Redirected to /login
    │
    ▼
Clicks "Create an Account"
    │
    ▼
Navigates to /signup
    │
    ▼
Enters email & password
    │
    ▼
Clicks "Create Account"
    │
    ▼
AuthContext.signUp() called
    │
    ▼
Supabase creates user
    │
    ├─── Success ────────┐
    │                    ▼
    │           Session created
    │                    │
    │                    ▼
    │         User state updated
    │                    │
    │                    ▼
    │       Redirect to /dashboard
    │
    └─── Error ──────────┐
                         ▼
                 Show error message
```

### 2. Existing User Login

```
User visits app
    │
    ▼
Redirected to /login
    │
    ▼
Enters email & password
    │
    ▼
Clicks "Sign In"
    │
    ▼
AuthContext.signIn() called
    │
    ▼
Supabase validates credentials
    │
    ├─── Valid ──────────┐
    │                    ▼
    │           Session created
    │                    │
    │                    ▼
    │         User state updated
    │                    │
    │                    ▼
    │       Redirect to /dashboard
    │
    └─── Invalid ────────┐
                         ▼
                 Show error message
```

### 3. Protected Route Access

```
User navigates to /dashboard
    │
    ▼
ProtectedRoute checks auth
    │
    ├─── Authenticated ──┐
    │                    ▼
    │           Render Dashboard
    │
    └─── Not Auth ───────┐
                         ▼
                Redirect to /login
```

### 4. User Logout

```
User clicks "Logout"
    │
    ▼
AuthContext.signOut() called
    │
    ▼
Supabase clears session
    │
    ▼
User state set to null
    │
    ▼
Redirect to /login
```

## Component Responsibilities

### 🎯 AuthContext (`contexts/AuthContext.tsx`)

**Purpose**: Centralized authentication state management

**Responsibilities**:
- Maintains user and session state
- Provides auth methods (signUp, signIn, signOut)
- Listens for auth state changes
- Automatically updates UI when auth state changes

**Key Methods**:
```typescript
signUp(email, password)    // Create new user
signIn(email, password)    // Login existing user
signOut()                  // Logout user
```

**State**:
```typescript
{
  user: User | null,        // Current user object
  session: Session | null,  // Current session
  loading: boolean          // Auth check in progress
}
```

### 🔒 ProtectedRoute (`components/ProtectedRoute.tsx`)

**Purpose**: Guard routes that require authentication

**Logic**:
1. Check if auth is loading → Show spinner
2. Check if user exists → Render children
3. No user → Redirect to /login

**Usage**:
```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### 📝 Login Page (`pages/Login.tsx`)

**Features**:
- Email/password form
- Error display
- Loading states
- Link to signup

**Validation**:
- Email format (HTML5)
- Required fields

### ✍️ Signup Page (`pages/SignUp.tsx`)

**Features**:
- Email/password/confirm form
- Client-side validation
- Success/error messages
- Auto-redirect on success

**Validation**:
- Password match check
- Minimum 6 characters
- Email format

### 🎤 Dashboard (`pages/Dashboard.tsx`)

**Features**:
- Wraps original App component
- Shows user info
- Logout button
- Only accessible when authenticated

## Session Management

### How Sessions Work

1. **Login/Signup**: Supabase creates a session with JWT tokens
2. **Storage**: Session stored in browser localStorage
3. **Auto-refresh**: Tokens automatically refreshed before expiry
4. **Persistence**: User stays logged in across page refreshes
5. **Expiry**: Session expires after inactivity (configurable in Supabase)

### Session Lifecycle

```
User logs in
    │
    ▼
Session created (JWT tokens)
    │
    ▼
Stored in localStorage
    │
    ▼
AuthContext monitors session
    │
    ├─── Active ─────────┐
    │                    ▼
    │           Auto-refresh tokens
    │                    │
    │                    ▼
    │           Continue session
    │
    └─── Expired ────────┐
                         ▼
                 Clear session
                         │
                         ▼
                 Redirect to login
```

## Security Considerations

### ✅ What's Secure

- **Passwords**: Never stored in plain text, hashed by Supabase
- **JWT Tokens**: Signed and verified by Supabase
- **HTTPS**: All communication encrypted (in production)
- **Row Level Security**: Can be enabled in Supabase for data access

### 🔐 Best Practices Implemented

1. **Environment Variables**: Sensitive keys in `.env.local`
2. **Protected Routes**: Dashboard only accessible when authenticated
3. **Session Validation**: Checked on every route change
4. **Auto Logout**: Session cleared on signOut
5. **Error Handling**: User-friendly error messages

### ⚠️ Important Notes

- **anon key**: Safe to expose in frontend (public key)
- **service_role key**: NEVER use in frontend (admin key)
- **.env.local**: Never commit to version control
- **Production**: Always use HTTPS

## Routing Structure

```
/                    → Redirect to /login
/login              → Login page (public)
/signup             → Signup page (public)
/dashboard          → Dashboard (protected)
/*                  → Redirect to /login
```

## State Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Application Start                  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  AuthContext Mounts   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Check Existing Session│
         └───────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
  ┌──────────┐            ┌──────────┐
  │  Session │            │    No    │
  │  Found   │            │  Session │
  └────┬─────┘            └────┬─────┘
       │                       │
       ▼                       ▼
  Set user state         Set user = null
       │                       │
       ▼                       ▼
  loading = false        loading = false
       │                       │
       ▼                       ▼
  Show Dashboard         Show Login
```

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid login credentials" | Wrong email/password | Check credentials |
| "User already registered" | Email exists | Use different email or login |
| "Password should be at least 6 characters" | Weak password | Use longer password |
| "Missing Supabase environment variables" | .env.local not configured | Add Supabase credentials |

## Testing Checklist

- [ ] Can create new account
- [ ] Can login with existing account
- [ ] Cannot access /dashboard when logged out
- [ ] Can access /dashboard when logged in
- [ ] Logout button works
- [ ] Session persists on page refresh
- [ ] Error messages display correctly
- [ ] Loading states show during auth operations

## Future Enhancements

Potential features to add:

1. **Password Reset**: Email-based password recovery
2. **Social Login**: Google, GitHub, etc.
3. **Email Verification**: Confirm email before access
4. **Profile Management**: Update email, password
5. **Remember Me**: Extended session duration
6. **Two-Factor Auth**: Extra security layer

---

**Last Updated**: February 2026  
**Version**: 1.0.0
