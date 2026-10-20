SKY ARCH LAB — Firebase Authentication starter files
=====================================================

Included:
- login.html          Email/password login and Google sign-in
- signup.html         Registration with full name, email, mobile, password confirmation
- reset-password.html Password-reset email request
- firebase.js        Shared Firebase Web SDK initialization (placeholder config)
- auth.js            Authentication actions and basic optional page guard/logout
- auth.css           Shared responsive navy/gold styling

IMPORTANT: These files are a starter integration, not yet integrated into the existing website or tested against your Firebase project. Existing site files have not been inspected.

1) Copy these files into the same directory as main1.html (normally the repository root).
   If main1.html is in another directory, update the relative paths in the HTML and auth.js.

2) Firebase config:
   Firebase Console > Project settings > General > Your apps > Web app.
   Copy the real web configuration into firebase.js:
   apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId.
   Replace all YOUR_* placeholders. Web config is not a service-account secret, but Firebase Security Rules and API restrictions are still important.

3) Firebase Console:
   - Authentication > Sign-in method: enable Email/Password and Google.
   - Authentication > Settings > Authorized domains: add ibrahim-21533.github.io.
   - For local testing, use localhost if testing via a local HTTP server. Do not rely on opening the HTML directly with file:// because ES modules may be blocked.
   - Google sign-in may require configuring the project's OAuth consent screen/provider settings.

4) Firestore:
   Signup and first-time Google sign-in create users/{uid} with fullName, email, mobile, createdAt.
   Google sign-in does not overwrite an existing profile. Passwords are never written to Firestore.
   Before deploying, review Firestore rules so users can access only their own document and only approved fields. Never rely on client-side redirects to protect data.

5) Redirect:
   Successful email/password login, successful Google login, and successful signup redirect to ./main1.html.
   Ensure main1.html exists at that path.

6) Protecting main1.html:
   Add data-require-auth="true" to its body tag:
     <body data-require-auth="true">
   Include the module near the end of the page:
     <script type="module" src="./auth.js"></script>
   This is only a client-side navigation guard. Enforce data access in Firestore Rules. The shared auth.js includes a logout listener if a button with id="logout-button" is present:
     <button id="logout-button" type="button">Log out</button>

7) Test checklist:
   [ ] Replace config placeholders.
   [ ] Deploy over HTTPS and open login.html.
   [ ] Correct credentials sign in and redirect to main1.html.
   [ ] Incorrect credentials show a generic error.
   [ ] Google sign-in works on the GitHub Pages domain.
   [ ] New signup creates Firebase Auth account and users/{uid} profile.
   [ ] Duplicate email is handled.
   [ ] Password mismatch is blocked before submit.
   [ ] Reset request shows a generic confirmation.
   [ ] Signed-out visit to guarded main1.html redirects to login.html.
   [ ] Logout returns to login.html.
   [ ] Check layouts on mobile and desktop.
   [ ] Test Firestore rules with the Firebase Rules Playground or Emulator.

Security note:
These static pages cannot securely implement phone-number-plus-password login by looking up a phone number in a public Firestore collection. Use email/password, or phone authentication via SMS, or design a trusted backend after assessing the infrastructure requirements.
