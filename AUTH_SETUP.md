# Authentication Setup Guide

## Overview
This blog application includes a complete authentication system with the following features:

### ✅ Features Implemented

1. **Login Page** (`/login`)
   - Email/password authentication
   - Google OAuth login
   - GitHub OAuth login
   - Proper error handling and loading states
   - Responsive design
   - Forgot password link

2. **Signup Page** (`/signup`)
   - User registration with email/password
   - Password confirmation validation
   - Password hashing with bcrypt
   - Form validation and error handling
   - Responsive design

3. **Forgot Password Page** (`/forgot-password`)
   - Password reset request form
   - User-friendly messaging
   - Responsive design

4. **Dashboard Page** (`/dashboard`)
   - Protected route (requires authentication)
   - User profile display
   - Sign out functionality
   - Welcome interface for blog management

5. **Security Features**
   - Password hashing with bcryptjs (12 rounds)
   - JWT session management
   - Protected routes
   - CSRF protection via NextAuth

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the blog directory with:

```bash
# Copy from .env.example and fill in your values
MONGODB_URI=mongodb://localhost:27017/blog_website
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### 2. Database Setup
Make sure MongoDB is running and accessible at the URI specified in your environment variables.

### 3. OAuth Setup (Optional)

#### GitHub OAuth:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

#### Google OAuth:
1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set redirect URI: `http://localhost:3000/api/auth/callback/google`

### 4. Run the Application
```bash
npm run dev
```

## File Structure

```
blog/
├── app/
│   ├── (Authentication)/
│   │   ├── login/
│   │   │   ├── page.jsx              # Login page component
│   │   │   └── login.module.scss     # Login page styles
│   │   ├── signup/
│   │   │   ├── page.jsx              # Signup page component
│   │   │   └── signup.module.scss    # Signup page styles
│   │   └── forgot-password/
│   │       ├── page.jsx              # Forgot password page
│   │       └── forgot-password.module.scss
│   ├── api/auth/
│   │   ├── [...nextauth]/route.js    # NextAuth configuration
│   │   └── signup/route.js           # User registration API
│   ├── dashboard/
│   │   ├── page.jsx                  # Dashboard page
│   │   └── dashboard.module.scss     # Dashboard styles
│   └── layout.js                     # Root layout with SessionProvider
├── component/
│   └── sessionwrapper.js             # Session provider wrapper
├── lib/
│   └── mongo.js                      # MongoDB connection
├── model/
│   └── user.js                       # User model schema
└── .env.example                      # Environment variables template
```

## User Flow

1. **New User**: `/signup` → Create account → Redirect to `/login`
2. **Existing User**: `/login` → Authenticate → Redirect to `/dashboard`
3. **Forgot Password**: `/forgot-password` → Request reset link
4. **Protected Routes**: Automatic redirect to `/login` if not authenticated

## Security Considerations

- Passwords are hashed using bcrypt with 12 salt rounds
- JWT tokens are httpOnly and secure
- CSRF protection enabled
- Input validation on both client and server side
- Environment variables for sensitive data

## Styling

All pages use SCSS modules for styling with:
- Responsive design (mobile-first approach)
- Modern gradient backgrounds
- Smooth animations and transitions
- Consistent design system
- Accessible form controls

## Next Steps

1. Set up your environment variables
2. Configure OAuth providers (optional)
3. Start the development server
4. Test the authentication flow
5. Customize the dashboard for your blog features
