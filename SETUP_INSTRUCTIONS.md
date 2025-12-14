# Pulse - Setup Instructions

## Quick Start

### 1. Get Spotify Credentials

1. Go to https://developer.spotify.com/dashboard
2. Log in or create an account
3. Click "Create an App"
4. Accept the terms and create
5. You'll see:
   - **Client ID**
   - **Client Secret**

### 2. Update `.env.local`

Edit `.env.local` in the project root and replace:

```
SPOTIFY_CLIENT_ID=your_actual_client_id
SPOTIFY_CLIENT_SECRET=your_actual_client_secret
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 3. Test Locally

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

### 4. Deploy to Vercel

#### 4.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Pulse app ready for deployment"
```

#### 4.2 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/pulse.git
git branch -M main
git push -u origin main
```

#### 4.3 Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your GitHub URL
4. Select the project root (Pulse folder)
5. In **Environment Variables**, add:
   - `SPOTIFY_CLIENT_ID`: Your Client ID
   - `SPOTIFY_CLIENT_SECRET`: Your Client Secret
6. Click **Deploy**

#### 4.4 Update `.env.local` with Vercel URL

After deployment, Vercel will give you a URL like:
```
https://pulse-app.vercel.app
```

Update `.env.local`:
```
EXPO_PUBLIC_API_URL=https://pulse-app.vercel.app
```

### 5. Build for App Stores

#### iOS (App Store)

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas submit --platform ios
```

#### Android (Google Play)

```bash
eas build --platform android
eas submit --platform android
```

## Troubleshooting

### "Cannot find module '@vercel/node'"

This is normal - it's only needed for the backend. Run:
```bash
npm install
```

### App can't connect to Spotify

1. Check `.env.local` has correct `EXPO_PUBLIC_API_URL`
2. Verify Vercel deployment is successful
3. Test the API:
   ```bash
   curl https://your-vercel-domain.vercel.app/api/spotify/token
   ```

### Spotify API errors

1. Verify credentials in Vercel dashboard
2. Check Spotify API status: https://developer.spotify.com/status

## File Checklist

- ✅ `api/spotify/token.ts` - Backend token endpoint
- ✅ `api/spotify/search.ts` - Backend search endpoint
- ✅ `api/spotify/artist.ts` - Backend artist endpoint
- ✅ `services/spotifyService.ts` - Updated to use backend
- ✅ `app.json` - App Store configuration
- ✅ `.env.example` - Environment template
- ✅ `.env.local` - Your local secrets
- ✅ `PRIVACY_POLICY.md` - Privacy policy
- ✅ `DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- ✅ `vercel.json` - Vercel configuration

## Next Steps

1. **Get Spotify credentials** (Step 1 above)
2. **Update `.env.local`** with your credentials
3. **Test locally** with `npm start`
4. **Deploy to Vercel** (Step 4 above)
5. **Build for stores** (Step 5 above)

Questions? Check `DEPLOYMENT_GUIDE.md` for more details.
