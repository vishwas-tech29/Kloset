# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Kloset E-commerce"
4. Click "Create"

## Step 2: Enable Google+ API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (for testing) or "Internal" (for organization)
3. Click "Create"

### Fill in the required information:

**App Information:**
- App name: `Kloset`
- User support email: Your email
- App logo: (Optional)

**App Domain:**
- Application home page: `http://localhost:3000`
- Application privacy policy link: `http://localhost:3000/privacy`
- Application terms of service link: `http://localhost:3000/terms`

**Authorized domains:**
- Add: `localhost` (for development)
- For production, add your domain: `yourdomain.com`

**Developer contact information:**
- Email addresses: Your email

4. Click "Save and Continue"

### Scopes:
1. Click "Add or Remove Scopes"
2. Select these scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
3. Click "Update" → "Save and Continue"

### Test Users (for External apps):
1. Click "Add Users"
2. Add your test email addresses
3. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"

### Configure the OAuth client:

**Name:** `Kloset Web Client`

**Authorized JavaScript origins:**
- `http://localhost:3000`
- For production: `https://yourdomain.com`

**Authorized redirect URIs:**
- `http://localhost:3000/api/auth/callback/google`
- For production: `https://yourdomain.com/api/auth/callback/google`

4. Click "Create"

## Step 5: Copy Credentials

You'll see a popup with:
- **Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxxxxx`

Copy both values!

## Step 6: Update Environment Variables

Open your `.env.local` file and update:

```env
GOOGLE_CLIENT_ID="your_client_id_here"
GOOGLE_CLIENT_SECRET="your_client_secret_here"
```

## Step 7: Test the Integration

1. Restart your development server:
```bash
npm run dev
```

2. Go to `http://localhost:3000/login`
3. Click "Sign in with Google"
4. You should be redirected to Google's login page
5. After signing in, you'll be redirected back to your app

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check for trailing slashes
- Ensure the protocol is correct (http vs https)

### Error: "Access blocked: This app's request is invalid"
- Complete the OAuth consent screen configuration
- Add your email as a test user (for External apps)
- Make sure all required fields are filled

### Error: "idpiframe_initialization_failed"
- Clear your browser cookies
- Try in incognito mode
- Check if third-party cookies are enabled

### Google Sign-in Button Not Working
- Check browser console for errors
- Verify GOOGLE_CLIENT_ID is set correctly
- Restart the dev server after changing .env.local

## Production Deployment

### For Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)

### Update Google Console for Production:

1. Go back to Google Cloud Console
2. Edit your OAuth client
3. Add production URLs:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`
4. Save changes

### Verify OAuth Consent Screen:

1. If using "External" type, publish your app:
   - Go to OAuth consent screen
   - Click "Publish App"
   - Submit for verification (if needed)

## Security Best Practices

1. **Never commit credentials to Git**
   - Keep `.env.local` in `.gitignore`
   - Use environment variables in production

2. **Use different OAuth clients for dev/prod**
   - Create separate OAuth clients for development and production
   - This allows better tracking and security

3. **Restrict API keys**
   - In Google Console, restrict your API keys by:
     - HTTP referrers (websites)
     - IP addresses (servers)

4. **Monitor usage**
   - Check Google Console regularly for:
     - API usage
     - Error rates
     - Suspicious activity

## Testing Checklist

- [ ] Google sign-in button appears on login page
- [ ] Clicking button redirects to Google
- [ ] Can select Google account
- [ ] Redirects back to app after authentication
- [ ] User is logged in successfully
- [ ] User data is saved to database
- [ ] Can sign out and sign in again
- [ ] Works in different browsers
- [ ] Works on mobile devices

## Common Issues

### "This app isn't verified"
This warning appears for apps in testing mode. Options:
1. Click "Advanced" → "Go to [App Name] (unsafe)" for testing
2. Submit app for verification (for production)
3. Use Internal user type (for organization apps)

### Session not persisting
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Database errors
- Ensure Prisma schema includes Account and Session models
- Run `npx prisma db push` to update database
- Check database connection string

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Adapter for NextAuth](https://authjs.dev/reference/adapter/prisma)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs
3. Verify all environment variables are set
4. Test with a fresh incognito window
5. Check Google Cloud Console for API errors
