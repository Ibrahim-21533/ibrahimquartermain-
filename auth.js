import { auth, db, isConfigured } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";const $ = (id) => document.getElementById(id);
const showMessage = (text, type = "error") => {
  const el = $("message");
  if (!el) return;
  el.textContent = text;
  el.className = `message ${type}`;
  el.hidden = false;
};
const clearMessage = () => {
  const el = $("message");
  if (el) { el.hidden = true; el.textContent = ""; el.className = "message"; }
};
const setBusy = (button, busy, label) => {
  if (!button) return;
  button.disabled = busy;
  button.dataset.originalText ||= button.textContent.trim();
  button.textContent = busy ? label : button.dataset.originalText;
};
const friendlyError = (error) => {
  switch (error?.code) {
    case "auth/invalid-email": return "Enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "The email or password is incorrect.";
    case "auth/email-already-in-use": return "An account with this email already exists. Try signing in.";
    case "auth/weak-password": return "Choose a stronger password (at least 6 characters).";
    case "auth/popup-closed-by-user": return "Google sign-in was closed before it finished.";
    case "auth/popup-blocked": return "Your browser blocked the Google sign-in popup. Allow popups and try again.";
    case "auth/network-request-failed": return "Network problem. Check your connection and try again.";
    case "auth/operation-not-allowed": return "This sign-in method is not enabled in Firebase Console.";
    default: return "Something went wrong. Please try again.";
  }
};
const requireConfig = () => {
  if (!isConfigured) {
    showMessage("Firebase is not configured yet. Edit firebase.js and replace the configuration placeholders.", "error");
    return false;
  }
  return true;
};
const goMain = () => { window.location.href = "./main1.html"; };
const saveGoogleProfile = async (user) => {
  const profileRef = doc(db, "users", user.uid);
  const profile = await getDoc(profileRef);

  if (!profile.exists()) {
    await setDoc(profileRef, {
      fullName: user.displayName || "",
      email: user.email || "",
      mobile: "",
      createdAt: serverTimestamp()
    });
  }
};

// Process the result when Google redirects back to this website.
getRedirectResult(auth)
  .then(async (result) => {
    if (!result) return;

    await saveGoogleProfile(result.user);
    goMain();
  })
  .catch((error) => {
    console.error("Google redirect sign-in error:", error.code, error.message);
    showMessage(friendlyError(error));
  });
// Login page
const loginForm = $("login-form");
if (loginForm) {
  const currentButton = $("login-button");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); clearMessage();
    if (!requireConfig()) return;
    const email = $("email").value.trim();
    const password = $("password").value;
    if (!email || !password) return showMessage("Enter your email address and password.");
    setBusy(currentButton, true, "Signing in…");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      goMain();
    } catch (error) {
      showMessage(friendlyError(error));
    } finally { setBusy(currentButton, false); }
  });

  $("toggle-password")?.addEventListener("click", () => {
    const field = $("password");
    const reveal = field.type === "password";
    field.type = reveal ? "text" : "password";
    $("toggle-password").textContent = reveal ? "Hide" : "Show";
    $("toggle-password").setAttribute("aria-label", reveal ? "Hide password" : "Show password");
  });

  $("google-button")?.addEventListener("click", async () => {
  clearMessage();

  if (!requireConfig()) return;

  const button = $("google-button");
  setBusy(button, true, "Connecting to Google…");

  try {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Google sign-in error:", error.code, error.message);
    showMessage(friendlyError(error));
    setBusy(button, false);
  }
});
}

// Sign-up page
const signupForm = $("signup-form");
if (signupForm) {
  const button = $("signup-button");
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault(); clearMessage();
    if (!requireConfig()) return;
    const fullName = $("full-name").value.trim();
    const email = $("email").value.trim();
    const mobile = $("mobile").value.trim();
    const password = $("password").value;
    const confirmPassword = $("confirm-password").value;
    if (!fullName || !email || !mobile || !password || !confirmPassword)
      return showMessage("Complete all fields before creating your account.");
    if (password.length < 6) return showMessage("Choose a password with at least 6 characters.");
    if (password !== confirmPassword) return showMessage("The passwords do not match.");
    setBusy(button, true, "Creating account…");
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: fullName });
      // Passwords are never stored in Firestore. UID is the profile document ID.
      await setDoc(doc(db, "users", credential.user.uid), {
        fullName, email, mobile, createdAt: serverTimestamp()
      });
      showMessage("Account created successfully. Redirecting…", "success");
      window.setTimeout(goMain, 700);
    } catch (error) { showMessage(friendlyError(error)); }
    finally { setBusy(button, false); }
  });

$("google-signup-button")?.addEventListener("click", async () => {
  clearMessage();

  if (!requireConfig()) return;

  const button = $("google-signup-button");
  setBusy(button, true, "Connecting to Google…");

  try {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Google signup error:", error.code, error.message);
    showMessage(friendlyError(error));
    setBusy(button, false);
  }
});
}

// Password reset page
const resetForm = $("reset-form");
if (resetForm) {
  resetForm.addEventListener("submit", async (event) => {
    event.preventDefault(); clearMessage();
    if (!requireConfig()) return;
    const email = $("email").value.trim();
    if (!email) return showMessage("Enter your email address.");
    const button = $("reset-button"); setBusy(button, true, "Sending…");
    try {
      await sendPasswordResetEmail(auth, email);
      // Keep confirmation generic to avoid disclosing whether an account exists.
      showMessage("If an account exists for that email, a password-reset link will be sent shortly.", "success");
    } catch (error) {
      if (error?.code === "auth/invalid-email") showMessage("Enter a valid email address.");
      else showMessage("We couldn't process that request right now. Please try again.");
    } finally { setBusy(button, false); }
  });
}

// Optional guard for pages that include <body data-require-auth="true">.
// This is a navigation convenience, not a substitute for Firestore security rules.
if (document.body?.dataset.requireAuth === "true") {
  if (!isConfigured) {
    showMessage("Firebase is not configured. Protected-page check cannot run.");
  } else {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.replace(`./login.html?next=${next}`);
      }
    });
  }
}

// Optional logout button: add id="logout-button" to a button on a signed-in page.
$("logout-button")?.addEventListener("click", async () => {
  if (!isConfigured) return showMessage("Firebase is not configured.");
  try { await signOut(auth); window.location.href = "./login.html"; }
  catch { showMessage("Unable to log out. Please try again."); }
});
