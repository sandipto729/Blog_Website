# Profile Picture Update for Social Login

## What was implemented:

### 1. **NextAuth Configuration Updates** (`app/api/auth/[...nextauth]/route.js`)

- **signIn callback**: Now automatically updates user's profile picture when they login with Google/GitHub
- **JWT callback**: Includes profile picture in the JWT token
- **Session callback**: Adds profile picture to the session object

### 2. **Dashboard Updates** (`app/dashboard/page.jsx`)

- **Profile picture display**: Shows user's profile picture from database
- **Fallback handling**: Falls back to NextAuth's image if profilePicture is not set
- **Error handling**: Hides broken images gracefully
- **Debug section**: Shows current session data for testing

## How it works:

1. **New User**: When a user logs in with Google/GitHub for the first time:
   - A new user record is created with the profile picture from the social provider
   
2. **Existing User**: When an existing user logs in with Google/GitHub:
   - If their `profilePicture` field is empty or null, it gets updated with the image from the social provider
   - If they already have a profile picture, it remains unchanged

3. **Session Data**: The profile picture is now available in the session as:
   - `session.user.profilePicture` (from database)
   - `session.user.image` (fallback from NextAuth)

## Testing:

1. **Login with Google/GitHub** - Your profile picture should be automatically saved
2. **Check the Dashboard** - You should see your profile picture displayed
3. **Debug Info** - The debug card shows whether the profile picture is set

## Database Field:

The `profilePicture` field in your User model:
- Is optional (not required)
- Defaults to empty string
- Gets populated automatically from social logins

## Notes:

- Remove the debug section in production
- Profile pictures are stored as URLs from the social providers
- The implementation prioritizes database `profilePicture` over NextAuth `image`
