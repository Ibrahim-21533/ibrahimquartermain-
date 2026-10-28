SKY ARCH LAB — installable PWA starter

WHAT THIS VERSION DOES
- Responsive architecture-studio workspace for Android/mobile.
- Add, edit, search, filter, and delete project records.
- Saves project records locally in the browser on this device.
- Caches the app shell for offline use after its first successful online load.
- Includes an installable PWA manifest and simple architectural app icon.
- Does not yet include cloud sync, account login, file uploads, or multi-user collaboration.

IMPORTANT DATA NOTE
Project records are stored only in this browser/device. Clearing site data or changing browser/device can remove or hide them. Export/backup and cloud sync are future features. Do not store passwords or sensitive personal data.

DEPLOY TO EXISTING GITHUB PAGES
1. Download and unzip this package.
2. Open your existing SKY ARCH LAB GitHub repository in a browser.
3. To preserve your current website, create a folder named app inside the repository (if it does not exist).
4. Upload the contents of this package INTO that app folder (not the outer zip/folder).
   Files: app/index.html, app/styles.css, app/app.js, app/manifest.webmanifest, app/sw.js, and app/icons/.
5. Do not replace your existing homepage index.html. This starter should live separately under /app/.
6. Commit the changes and wait for GitHub Pages to deploy.
7. Open your existing GitHub Pages URL followed by /app/ (for example, https://YOUR-USERNAME.github.io/YOUR-REPO/app/).
8. While online, open it once and wait a few seconds. Then use the browser menu → Install app or Add to Home screen.
9. Test offline by enabling Airplane mode, then reopen the installed app.

PHONE INSTALL NOTES
Chrome on Android generally offers Install app or Add to Home screen for eligible sites. Browser wording can vary. The install option appears only after deployment over HTTPS and a successful load. Do not try to open index.html directly from Downloads; service-worker offline features require HTTPS or localhost.

CURRENT LIMITATIONS
- The Google Fonts import needs internet for the custom fonts; system fallback fonts remain available offline.
- Project entries are local to one browser installation; no cloud backup/sync yet.
- This PWA is not an APK. We can package it into an Android APK later if needed.
