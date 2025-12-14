# Pulse - Deployment Guide

## Overview

Pulse uses a hybrid architecture:
- **Frontend**: Expo app (iOS/Android) with local data storage
- **Backend**: Vercel serverless functions for secure Spotify API integration

## Prerequisites

1. Vercel account (you have this ✓)
2. Spotify Developer account
3. Git repository (GitHub, GitLab, or Bitbucket)
4. Expo account (for building the app)

## Step 1: Set Up Spotify Developer Credentials

1. Go to https://developer.spotify.com/dashboard
2. Create a new app (or use existing one)
3. Accept the terms and create the app
4. You'll get:
   - **Client ID**
   - **Client Secret** (keep this secret!)

## Step 2: Deploy Backend to Vercel

### 2.1 Push to Git Repository

```bash
cd "c:\Users\lucas\Desktop\F5000\Proyectos Windsurf\Apps\App 1 - Diario de musica\Pulse"
git init
git add .
git commit -m "Initial commit: Pulse app with Vercel backend"
git remote add origin https://github.com/YOUR_USERNAME/pulse.git
git push -u origin main
```

### 2.2 Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the project root (the Pulse folder)
4. In **Environment Variables**, add:
   - `SPOTIFY_CLIENT_ID`: Your Client ID from Step 1
   - `SPOTIFY_CLIENT_SECRET`: Your Client Secret from Step 1
5. Click **Deploy**

Vercel will automatically detect the API routes in the `api/` folder.

### 2.3 Get Your Vercel URL

After deployment, you'll get a URL like:
```
https://pulse-app.vercel.app
```

## Step 3: Configure App for Vercel Backend

### 3.1 Create `.env.local` file

```bash
# .env.local (DO NOT COMMIT THIS FILE)
EXPO_PUBLIC_API_URL=https://pulse-app.vercel.app
```

Replace `pulse-app.vercel.app` with your actual Vercel domain.

### 3.2 Verify Configuration

The app will now use:
- Local storage for mood entries (AsyncStorage)
- Vercel backend for Spotify API calls
- No hardcoded credentials in the app

## Step 4: Build for App Store

### 4.1 iOS App Store

```bash
# Install dependencies
npm install

# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

**Requirements:**
- Apple Developer Account ($99/year)
- Bundle ID: `com.pulse.app`
- Privacy Policy URL (you have PRIVACY_POLICY.md)

### 4.2 Google Play Store

```bash
# Build for Android
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

**Requirements:**
- Google Play Developer Account ($25 one-time)
- Package name: `com.pulse.app`
- Privacy Policy URL

## Step 5: App Store Submission Checklist

### iOS (App Store)

- [ ] App name: "Pulse"
- [ ] Description: From `app.json`
- [ ] Category: Music or Lifestyle
- [ ] Privacy Policy URL: https://your-domain.com/privacy-policy
- [ ] Support URL: https://your-domain.com/support
- [ ] Screenshots (at least 2)
- [ ] App icon (1024x1024)
- [ ] Version: 1.0.0
- [ ] Build number: 1

### Android (Google Play)

- [ ] App name: "Pulse"
- [ ] Description: From `app.json`
- [ ] Category: Music & Audio
- [ ] Privacy Policy URL
- [ ] Screenshots (at least 2)
- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512)
- [ ] Version: 1.0.0

## Step 6: Monitor and Update

### Vercel Dashboard
- Monitor API usage and errors
- Check logs in the Vercel dashboard
- Set up alerts for failures

### App Updates

To update the app:

1. Make changes locally
2. Test with `npm start`
3. Commit and push to Git
4. Vercel auto-deploys the backend
5. Build new app version with `eas build`
6. Submit new version to stores

## Troubleshooting

### API Connection Issues

If the app can't connect to Vercel:

1. Check `EXPO_PUBLIC_API_URL` in `.env.local`
2. Verify Vercel deployment is successful
3. Check Vercel logs: https://vercel.com/dashboard
4. Test API manually:
   ```bash
   curl https://your-vercel-domain.vercel.app/api/spotify/token
   ```

### Spotify API Errors

1. Verify credentials in Vercel environment variables
2. Check Spotify API status: https://developer.spotify.com/status
3. Ensure Client Credentials flow is enabled in Spotify dashboard

### App Store Rejection

Common reasons:
- Missing Privacy Policy
- Incomplete app information
- Low-quality screenshots
- Misleading description

## Security Notes

✅ **What's Secure:**
- Spotify credentials are in Vercel (not in app code)
- User data stays on device (AsyncStorage)
- API calls go through Vercel backend
- No hardcoded secrets in Git

⚠️ **What to Monitor:**
- Keep Spotify credentials secret
- Rotate credentials if compromised
- Monitor Vercel API usage for abuse
- Update dependencies regularly

## File Structure

```
Pulse/
├── api/
│   └── spotify/
│       ├── token.ts      # Get Spotify token
│       ├── search.ts     # Search tracks
│       └── artist.ts     # Get artist info
├── app/                  # Expo Router pages
├── components/           # React components
├── services/
│   ├── spotifyService.ts # Updated to use backend
│   └── moodStorage.ts    # Local storage
├── app.json              # App configuration
├── .env.example          # Environment template
├── .env.local            # Your local secrets (not committed)
├── vercel.json           # Vercel configuration
├── PRIVACY_POLICY.md     # Privacy policy
└── DEPLOYMENT_GUIDE.md   # This file
```

## Next Steps

1. Create `.env.local` with your Vercel URL
2. Push to Git repository
3. Deploy to Vercel
4. Test the app locally with `npm start`
5. Build and submit to App Stores

Good luck! 🚀
