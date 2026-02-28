# Speak English Quiz

A React + TypeScript + Vite + Firebase application for practicing English speaking.

## Features
- Speech Recognition (Web Speech API)
- Text-to-Speech (TTS)
- Firebase Firestore for data & logging
- Firebase Storage for images
- Admin interface for adding cards

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Setup**
   - Create a project in [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Anonymous).
   - Enable **Firestore Database**.
   - Enable **Storage**.
   - Copy your web app configuration.

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Admin
Navigate to `/admin` to add new quiz cards.

## Deployment to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**
   ```bash
   firebase login
   ```

3. **Initialize**
   ```bash
   firebase init hosting
   ```
   - Select your project.
   - Public directory: `dist`
   - Configure as single-page app: `Yes`

4. **Build & Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## Firestore Rules
Ensure your Firestore rules allow read/write appropriately.
Example (Development):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
*Note: Secure these rules for production.*
