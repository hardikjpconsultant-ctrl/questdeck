/* =====================================================================
   QuestDeck configuration — the only file most people need to edit.
   See README.md for step-by-step setup.
   ===================================================================== */
window.QD_CONFIG = {
  /* Name shown in the header and on the sign-in screen. */
  siteName: "QuestDeck",
  tagline: "Turn any product deck into a learning game.",

  /* Admin sign-in. The default password is ChangeMe@123 — CHANGE IT.
     Open tools/make-admin-hash.html in a browser to generate a new hash. */
  admin: {
    id: "admin",
    salt: "qd-admin-v1",
    hash: "574d10910d4625a2c4876620a440e11cc500fae954a4806ad189fd5b6dc7f3ff",
    /* Only used when Firebase is on: the admin's Firebase Auth address.
       It must match isAdmin() in firestore.rules. */
    firebaseEmail: "admin@questdeck.local"
  },

  /* Optional: only allow learners whose email ends with this domain,
     e.g. "@yourcompany.com". Leave "" to allow any email. */
  allowedEmailDomain: "",

  /* Show the weekly / all-time leaderboard to learners (admins always see it). */
  showLeaderboardToLearners: true,

  /* Optional shared storage. Leave null to keep everything in each visitor's
     browser (good for trying it out). Paste your Firebase web-app config to
     share courses and track every learner centrally. */
  firebase: null
  /* firebase: {
       apiKey: "…", authDomain: "…", projectId: "…",
       storageBucket: "…", messagingSenderId: "…", appId: "…"
     } */
};
