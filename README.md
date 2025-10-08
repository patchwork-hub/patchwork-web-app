## 🌟 What is Patchwork?
 
Patchwork is a revolutionary social media app that puts control back in the hands of communities and organizations. Built around your content and community, Patchwork connects you with a global movement of activists and pioneers working for social change.
 
### 🎯 Key Philosophy
- **No toxic algorithms** - Healthy, human-led content curation
- **Community-controlled** - By the people, for the people
- **Open source** - Transparent and customizable
- **Interoperable** - Connect with Mastodon, Pixelfed, Bluesky, and beyond
 
---
 
## ✨ Major Features
 
### 👥 **Social Features**
- **Posts & Interactions**: Create, share, like, and boost content
- **Direct Messaging**: Private conversations and group chats
- **Follow System**: Connect with users across the Fediverse
- **Hashtag Support**: Discover and organize content with hashtags
- **Poll Creation**: Engage communities with interactive polls
 
### 🔍 **Discovery & Search**
- **Explore Communities**: Discover new channels and collections
- **User Search**: Find and connect with like-minded individuals
- **Hashtag Exploration**: Browse trending topics and discussions
- **Content Filtering**: Customize your feed experience
 
### 📱 **Rich Media Support**
- **Image Sharing**: Upload and share photos with your community
- **Video Content**: Share video content with your followers
- **Link Previews**: Rich previews for shared links
- **Custom Emojis**: Express yourself with community-specific emojis
 
### 🌐 **Multi-Platform Integration**
- **Social Media Links**: Connect your X, Instagram, LinkedIn, YouTube, Facebook, Reddit, TikTok, Twitch, and Patreon profiles
- **Cross-Platform Sharing**: Share content across different social networks
 
### 🔒 **Security & Privacy**
- **Secure Authentication**: OAuth-based login system
- **Privacy Controls**: Granular privacy settings for posts and profiles
- **Content Filtering**: Block unwanted content and users

---
 
## 🌍 Internationalization
 
- **Multi-language support** with i18next
- **8 supported languages**: English, Spanish, French, German, Italian, Japanese, Portuguese (BR), Burmese
- **RTL support** for right-to-left languages
- **Dynamic language switching**
 
---
 
**Join us in building the future of social media - one that's controlled by the people, for the people! 🌟**
 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# 🚀 Setup Instructions

---

## 1. Mastodon OAuth Setup

1. Go to your **Mastodon instance** → **Preferences** → **Development**.
2. Click "**New Application**."
3. Set the **Application Name** and **Redirect URI** to match your `NEXT_PUBLIC_REDIRECT_URI`.
4. Copy the generated **Client ID** and **Client Secret**. (You will typically store these in your environment variables).

---

## 2. Firebase Setup (Optional)

1. Create a project at the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication**, **Firestore**, and **Cloud Messaging**.
3. Copy the configuration details from **Project Settings** → **General** → **Your apps**.

---

## 3. Tenor API Setup (Optional)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Tenor API** for your project.
3. Create an **API key** and restrict it to the **Tenor API** service for security.

```bash
# API Configuration
NEXT_PUBLIC_API_URL=your_domain
NEXT_PUBLIC_DASHBOARD_API_URL=your_dashboard_domain

# OAuth (get from your Mastodon instance)
NEXT_PUBLIC_CLIENT_ID=your_mastodon_client_id
NEXT_PUBLIC_CLIENT_SECRET=your_mastodon_client_secret

# Firebase (optional for push notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key

# Development
NEXT_PUBLIC_GIFV_TENOR_GOOGLE_API_KEY=your_gifv_tenor_google_api_key
NEXT_PUBLIC_REDIRECT_URI=your_domain/auth/sign-in
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# 🎉 Patchwork Web App v1.0.0 - Initial Release
 
**Release Date:** October 8, 2025  
**Repository:** [patchwork-hub/patchwork-web-app](https://github.com/patchwork-hub/patchwork-web-app)
 
We're excited to announce the initial release of **Patchwork Web App** - a powerful, white-label social media platform built on Mastodon's open-source foundation, designed to empower organizations with their own branded social media experience.
 
---
 
## 🌟 What is Patchwork?
 
Patchwork is a revolutionary social media app that puts control back in the hands of communities and organizations. Built around your content and community, Patchwork connects you with a global movement of activists and pioneers working for social change.
 
### 🎯 Key Philosophy
- **No toxic algorithms** - Healthy, human-led content curation
- **Community-controlled** - By the people, for the people
- **Open source** - Transparent and customizable
- **Interoperable** - Connect with Mastodon, Pixelfed, Bluesky, and beyond
 
---
 
## ✨ Major Features
 
### 👥 **Social Features**
- **Posts & Interactions**: Create, share, like, and boost content
- **Direct Messaging**: Private conversations and group chats
- **Follow System**: Connect with users across the Fediverse
- **Hashtag Support**: Discover and organize content with hashtags
- **Poll Creation**: Engage communities with interactive polls
 
### 🔍 **Discovery & Search**
- **Explore Communities**: Discover new channels and collections
- **User Search**: Find and connect with like-minded individuals
- **Hashtag Exploration**: Browse trending topics and discussions
- **Content Filtering**: Customize your feed experience
 
### 📱 **Rich Media Support**
- **Image Sharing**: Upload and share photos with your community
- **Video Content**: Share video content with your followers
- **Link Previews**: Rich previews for shared links
- **Custom Emojis**: Express yourself with community-specific emojis
 
### 🌐 **Multi-Platform Integration**
- **Social Media Links**: Connect your X, Instagram, LinkedIn, YouTube, Facebook, Reddit, TikTok, Twitch, and Patreon profiles
- **Cross-Platform Sharing**: Share content across different social networks
 
### 🔒 **Security & Privacy**
- **Secure Authentication**: OAuth-based login system
- **Privacy Controls**: Granular privacy settings for posts and profiles
- **Content Filtering**: Block unwanted content and users

---
 
## 🌍 Internationalization
 
- **Multi-language support** with i18next
- **8 supported languages**: English, Spanish, French, German, Italian, Japanese, Portuguese (BR), Burmese
- **RTL support** for right-to-left languages
- **Dynamic language switching**
 
---
 
**Join us in building the future of social media - one that's controlled by the people, for the people! 🌟**
 