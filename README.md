# QuestDeck

**Turn any product deck (.pptx) into a learning game.** Upload a PowerPoint in the admin panel and QuestDeck builds a playable course from it:

- **Map of stops.** Each chapter is a stop on a map. The fog clears as the learner progresses, and stops can open week by week.
- **Animated explainer.** Every slide becomes a scene: the bullets light up one at a time and the key terms are highlighted.
- **Quick tasks.** After each chapter the learner gets quiz, fact-or-myth and put-in-order tasks, with stars and points.
- **Leaderboard.** All-time and weekly rankings, with weekly champions.
- **Learner profile.** Each learner sees their progress and badges.
- **Admin dashboard.** Upload a deck, edit every scene and question, schedule chapters, publish, export learners to CSV, and view the leaderboard.

It is a plain static website: no build step, no server and no AI key. Fork it, switch on GitHub Pages, and it runs.

> A demo course (**FlowPay**, a fictional payments app) ships in `courses/demo`. Its source deck is `samples/flowpay-sample.pptx`.

---

## 1. Quick start (5 minutes)

1. **Get the code.** Fork this repo, or upload the folder to a new GitHub repo.
2. **Turn on Pages.** Go to **Settings → Pages → Source: GitHub Actions**. The included workflow (`.github/workflows/pages.yml`) deploys the site on every push to `main`.
   - If you'd rather not use Actions, choose **Deploy from a branch → main → / (root)** instead.
3. **Open the site** at `https://<you>.github.io/<repo>/`.
4. **Sign in as admin.** Open `#/admin` (the **Admin** tab) and sign in with `admin` / `ChangeMe@123`.
5. **Change the admin password.** Do this right away (see §3).

To run it on your own computer, use any static server from the repo folder (opening `index.html` as a file won't load the `courses/` folder):

```bash
python3 -m http.server 8080      # then open http://localhost:8080
```

---

## 2. Make a course from a deck

1. Go to **Admin → Courses** and drop a `.pptx` on *Upload a product deck* (or click to pick one).
2. QuestDeck reads the deck and builds a draft course:

   | From the deck | Becomes |
   |---|---|
   | Slide title, bullets, table rows | An explainer scene |
   | Largest picture on the slide | The scene image |
   | Speaker notes | The narration line under the scene |
   | PowerPoint **sections**, or *Section Header* slides | Chapters (map stops) |
   | No sections | Chapters of 3–4 slides each |
   | First slide (title layout) | Cover scene of chapter 1 |
   | Slide titled *Steps / Process / Flow / How… / Journey* | A put-in-order task |
   | Bullets and key terms across slides | Quiz and fill-the-gap questions |

3. Review the draft in **Editor**. You can:
   - rename the course, add a logo and set its brand colours
   - edit, reorder or delete scenes and highlights
   - rewrite questions, mark the right answer and write the "why"
   - add fact-or-myth cards
   - switch the explainer or the tasks off for a chapter
   - set the date a chapter opens (for a weekly rollout)
4. Click **Save & publish**. Learners can now see the course.

**Questions are generated drafts.** They are built from wording in the deck, not written by AI, so always read them before you publish. Questions the generator made are tagged *draft* until you edit them.

### Deck tips for the best result
- **One idea per slide.** Use a clear title and 3–6 short bullets.
- **Split chapters.** Use PowerPoint *Sections* (or Section Header slides) to mark where chapters start.
- **Write steps as steps.** For a process, use one slide titled "How X works" with the steps as bullets, in order.
- **Narrate in the notes.** Put a one-line explanation in the speaker notes. It becomes the narration.
- **Avoid text in pictures.** Screenshots of text can't be read. Type the text instead.
- **Note:** only `.pptx` works. Google Slides and Keynote can both export to PowerPoint.

---

## 3. Change the admin password

1. Open `tools/make-admin-hash.html` in a browser, either on your Pages site or locally. It runs offline.
2. Enter a new ID and password, then click **Generate**.
3. Paste the `admin: {…}` block it gives you into `config.js`, then commit.

The site stores only a salted PBKDF2 hash (150,000 rounds), never the password itself.

---

## 4. Where data lives: local or Firebase

| | **Local (default)** | **Firebase (optional)** |
|---|---|---|
| Setup | None | About 10 minutes, free tier |
| Courses made in the admin panel | Only in that browser | Shared with everyone |
| Learner accounts and progress | Per browser | Central, so you see every learner |
| Leaderboard | That browser only | Everyone |
| Best for | Trying it out, demos | Real rollouts |

**Courses committed to the repo** (§5) are shared in both modes.

### Turn on Firebase
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Add a **Web app** and copy its `firebaseConfig`.
3. Under **Build → Firestore Database**, choose **Create database** (production mode).
4. In **Rules**, paste the contents of [`firestore.rules`](firestore.rules) and publish.
5. Under **Build → Authentication → Get started**, enable **Email/Password**.
6. In **Authentication → Settings → Authorized domains**, add `<you>.github.io`.
7. In `config.js`, set `firebase: { apiKey: …, projectId: … }`. Then commit.
8. Sign in to the admin panel once. That creates the Firebase admin user (`admin.firebaseEmail`) with your admin password.

Firebase web config values are not secrets. Access is controlled by `firestore.rules`.

---

## 5. Publish a course through git (works without Firebase)

1. In the admin panel, open **Courses → Export JSON**.
2. Save the file as `courses/<course-id>/course.json`.
3. Add the id to `courses/index.json`:
   ```json
   { "courses": ["demo", "my-product"] }
   ```
4. Commit and push. The workflow checks that the JSON is valid, then deploys.

If the database (local or Firebase) has a course with the same `id`, that version is used instead of the repo copy. To change the demo, delete `courses/demo` and remove it from `index.json`.

### `course.json` format
```jsonc
{
  "id": "flowpay-demo",
  "title": "FlowPay",
  "tagline": "Learn FlowPay by playing it.",
  "brand": { "primary": "#171A47", "accent": "#FFD04D" },
  "published": true,
  "modules": [{
    "id": "m1", "title": "Getting to know FlowPay", "blurb": "…",
    "enabled": true, "explainerOn": true, "taskOn": true,
    "opensOn": "",                    // "2026-11-02" to open on that date (weekly rollout)
    "scenes": [{ "title": "…", "bullets": ["…", "– sub-point"], "notes": "…",
                 "image": "data:image/jpeg;base64,… or null", "hl": "term to highlight" }],
    "tasks": [
      { "type": "quiz", "q": "…", "options": ["right", "wrong", "wrong"], "answer": 0, "why": "…" },
      { "type": "factmyth", "statement": "…", "answer": "fact", "why": "…" },
      { "type": "order", "q": "…", "steps": ["first", "second", "third"], "decoy": "not a step", "why": "…" }
    ]
  }]
}
```
Options are shuffled when the course is played, so you can always put the right answer first.

---

## 6. Settings (`config.js`)

| Key | What it does |
|---|---|
| `siteName`, `tagline` | Branding in the header and on the sign-in page |
| `admin` | Admin ID, salt and hash (§3), plus `firebaseEmail` |
| `allowedEmailDomain` | e.g. `"@yourcompany.com"` to allow only company emails |
| `showLeaderboardToLearners` | `false` hides the leaderboard from learners |
| `firebase` | `null` for local mode, or your web config (§4) |

---

## 7. Repo layout
```
index.html                 app shell
config.js                  your settings
assets/css/app.css         theme (light + dark), all components
assets/js/store.js         storage adapter: IndexedDB or Firestore
assets/js/pptx.js          in-browser .pptx reader (JSZip)
assets/js/generator.js     deck → chapters, scenes and tasks
assets/js/app.js           learner app: map, explainer, tasks, board, profile
assets/js/admin.js         admin dashboard
assets/vendor/jszip.min.js JSZip 3.10.1 (MIT)
courses/                   courses published through git
samples/                   sample deck to try the upload
tools/make-admin-hash.html admin password tool
firestore.rules            Firebase security rules
.github/workflows/pages.yml GitHub Pages deploy
```

---

## 8. Security: please read
- **This is a static site.** The admin check runs in the browser.
  - In **local mode**, anyone who can edit their own browser storage can change their own copy. Nothing is shared, so nobody else is affected.
  - In **Firebase mode**, every course and leaderboard write is enforced by `firestore.rules` and Firebase Auth, so learners cannot change courses.
- **Learner passwords** are salted and hashed (PBKDF2) before they are stored. These accounts are meant for progress tracking, not for protecting sensitive data. Don't reuse important passwords, and don't put confidential material in a public repo or a public deck.
- **Use real sign-in for sensitive or internal content.** For example, put the site behind your company SSO, host it on internal Pages, or use Firebase Auth for learners.

## License
MIT. See [LICENSE](LICENSE). JSZip is MIT (`assets/vendor/JSZIP-LICENSE.md`).
