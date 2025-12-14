# Pulse - App Store Submission Checklist

## ✅ Backend Setup

- [x] Vercel API functions created (`api/spotify/`)
- [x] Environment variables configured
- [x] spotifyService.ts updated to use backend
- [x] No hardcoded credentials in app code
- [ ] Deploy to Vercel (pending - need Spotify credentials)
- [ ] Test API endpoints

## ✅ App Configuration

- [x] app.json updated with:
  - [x] App name: "Pulse"
  - [x] Bundle ID (iOS): com.pulse.app
  - [x] Package name (Android): com.pulse.app
  - [x] Version: 1.0.0
  - [x] Build numbers configured
  - [x] Description added
  - [x] Permissions configured
  - [x] Privacy policy reference

- [x] package.json updated with @vercel/node dependency

## ✅ Documentation

- [x] PRIVACY_POLICY.md created
- [x] DEPLOYMENT_GUIDE.md created
- [x] SETUP_INSTRUCTIONS.md created
- [x] .env.example created
- [x] .env.local created (local only)

## 📋 Before Submission

### Spotify Setup
- [ ] Create Spotify Developer account (if not done)
- [ ] Create app in Spotify Dashboard
- [ ] Get Client ID
- [ ] Get Client Secret
- [ ] Update .env.local with credentials

### Vercel Deployment
- [ ] Push code to GitHub
- [ ] Create Vercel project
- [ ] Add environment variables (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
- [ ] Deploy successfully
- [ ] Get Vercel domain URL
- [ ] Update .env.local with EXPO_PUBLIC_API_URL
- [ ] Test API endpoints

### Local Testing
- [ ] Run `npm start`
- [ ] Test mood creation
- [ ] Test song search (Spotify integration)
- [ ] Test mood viewing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator

### App Store Specific (iOS)

**Account & Setup**
- [ ] Apple Developer Account ($99/year)
- [ ] Create App ID in Apple Developer Portal
- [ ] Create provisioning profiles
- [ ] Create signing certificates

**App Information**
- [ ] App name: "Pulse"
- [ ] Subtitle: "Track your mood with music"
- [ ] Category: Music or Lifestyle
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL: https://your-domain.com/privacy-policy
- [ ] Support URL: https://your-domain.com/support
- [ ] Marketing URL (optional)

**Metadata**
- [ ] App icon (1024x1024 PNG)
- [ ] Screenshots (at least 2, up to 5)
  - [ ] iPhone 6.7" (1284x2778)
  - [ ] iPad Pro 12.9" (2048x2732) - if supporting tablets
- [ ] Preview video (optional)
- [ ] Keywords (up to 100 characters)
- [ ] Description (up to 4000 characters)
- [ ] Release notes for version 1.0.0

**Build & Upload**
- [ ] Run `eas build --platform ios`
- [ ] Wait for build completion
- [ ] Run `eas submit --platform ios`
- [ ] Review submission in App Store Connect
- [ ] Submit for review

### Google Play Store (Android)

**Account & Setup**
- [ ] Google Play Developer Account ($25 one-time)
- [ ] Create app in Google Play Console
- [ ] Generate signing key

**App Information**
- [ ] App name: "Pulse"
- [ ] Short description (80 characters max)
- [ ] Full description (4000 characters max)
- [ ] Category: Music & Audio
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL: https://your-domain.com/privacy-policy
- [ ] Support email

**Metadata**
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (at least 2, up to 8)
  - [ ] Phone (1080x1920 or 1440x2560)
  - [ ] Tablet (1280x1920 or 1600x2560) - if supporting tablets
- [ ] Video preview (optional)
- [ ] Release notes

**Build & Upload**
- [ ] Run `eas build --platform android`
- [ ] Wait for build completion
- [ ] Run `eas submit --platform android`
- [ ] Review submission in Google Play Console
- [ ] Submit for review

## 📊 Current Status

### Completed ✅
- Backend API structure
- App configuration
- Privacy policy
- Deployment guides
- Environment setup
- Dependencies installed

### Pending ⏳
- Spotify credentials (need from user)
- Vercel deployment
- Local testing
- App Store submissions

### Next Immediate Steps
1. Get Spotify credentials
2. Update `.env.local`
3. Push to GitHub
4. Deploy to Vercel
5. Test locally
6. Build for stores

## 🚀 Timeline Estimate

- **Setup**: 15 minutes (get credentials, deploy to Vercel)
- **Local Testing**: 30 minutes
- **Build for iOS**: 10-15 minutes (EAS build)
- **Build for Android**: 10-15 minutes (EAS build)
- **App Store Review**: 24-48 hours (Apple)
- **Google Play Review**: 2-4 hours (Google)

**Total Time to Launch**: ~1-2 days (excluding review times)

## 📞 Support Resources

- Expo Documentation: https://docs.expo.dev
- Spotify API Docs: https://developer.spotify.com/documentation
- Vercel Docs: https://vercel.com/docs
- App Store Connect Help: https://help.apple.com/app-store-connect
- Google Play Console Help: https://support.google.com/googleplay/android-developer

## Notes

- All user data stays on device (AsyncStorage)
- Spotify credentials are secure in Vercel
- No tracking or analytics
- Privacy-first approach
- Ready for production

Good luck! 🎵
