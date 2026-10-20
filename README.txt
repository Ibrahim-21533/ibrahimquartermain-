IBRAHIM SKY / SKY ARCH LAB — PROJECT BUILDER PROTOTYPE

FILES
- project.html: project-builder page
- project.css: responsive styling
- project.js: local-only prototype behaviour

INSTALL
1. Upload project.html, project.css, and project.js to the same root folder in your GitHub repository as index.html and style.css.
2. In index.html, find:
   href="mailto:hello@skyarchlab.example?subject=Project%20enquiry"
   Replace only that href value with:
   href="project.html"
   Keep the link text and surrounding HTML unchanged.
3. Save/commit all files, wait for GitHub Pages to redeploy, then open the live site and tap Start a project.

IMPORTANT LIMITATION
This is a front-end prototype only. It saves projects in localStorage on the current browser/device. It does not provide accounts, cloud backup, secure multi-user access, Firebase storage, or Google Drive integration. Do not use it for confidential project information. Those features are the next milestone.
