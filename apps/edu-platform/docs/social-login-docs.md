# Social Login Direct Authentication

## Overview

This implementation provides social login with GitHub and Google that bypasses the "magic link" step and directly authenticates users after successful OAuth flow.

## Flow

1. User clicks on a social login button (GitHub or Google)
2. User is redirected to the provider's authorization page
3. After authorization, the provider redirects back to our callback endpoint
4. Our server:
   - Verifies the OAuth response
   - Exchanges the code for an access token
   - Fetches the user's email
   - Verifies the user's email against our customer database
   - Checks for purchased courses
   - Creates a JWT token
   - Sets the token in a cookie
   - Redirects to the courses page

## Implementation Details

### Updated Files

1. `src/server/socialAuth.ts`: Helper function for social authentication
2. `src/pages/api/auth/github/callback.ts`: GitHub callback handler
3. `src/pages/api/auth/google/callback.ts`: Google callback handler
4. `src/pages/login.astro`: Additional error and success messages

### Security Considerations

- CSRF protection with state parameters
- HttpOnly cookies for tokens
- Secure and SameSite cookies
- Verification of email from OAuth providers

## Environment Variables

The implementation requires these environment variables:

```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SITE_URL=https://your-site-url.com
JWT_SECRET=your_jwt_secret
AIRTABLE_API_KEY=your_airtable_api_key
```

## Setup Instructions

1. Create OAuth apps in GitHub and Google developer consoles
2. Configure the callback URLs:
   - GitHub: `{SITE_URL}/api/auth/github/callback`
   - Google: `{SITE_URL}/api/auth/google/callback`
3. Add the required environment variables to your project

## Error Handling

The implementation includes proper error handling for:

- Invalid OAuth responses
- Missing or unverified email addresses
- Customer verification failures
- Missing purchased courses

## Testing

To test the implementation:

1. Click on GitHub or Google login button
2. Authorize the application
3. You should be redirected to the courses page if authentication is successful
4. If there's an error, you'll be redirected to the login page with an appropriate error message
