# Developer Portfolio

A modern developer portfolio built with **React + Vite**, featuring a **Three.js**
animated hero (a floating "coding cube" with a drifting particle field), a neon
cyan/blue theme, and a contact form whose submissions are written to a real
**`public/message.json`** file — no database, no separate server to run.

## Tech stack

- **React 19 + Vite**
- **Three.js** (vanilla, no wrapper deps) for the animated hero
- Hand-written CSS with design tokens (no CSS framework)
- A tiny **Vite middleware plugin** that persists submissions to `public/message.json`

## Project structure

```
myportfollio/
├─ index.html
├─ vite.config.js               # registers the submissions plugin
├─ vite-submissions-plugin.js   # writes/reads public/message.json (the "backend")
├─ public/
│  └─ message.json              # ← submissions are stored here (JSON array)
└─ src/
   ├─ App.jsx                   # sections + hash routing for the admin page
   ├─ config.js                 # ← the secret admin URL lives here
   ├─ data/content.js           # ← EDIT THIS: your name, socials, projects, skills
   ├─ lib/submissions.js        # talks to the file API (localStorage fallback)
   ├─ three/heroScene.js        # the animated 3D hero
   ├─ hooks/                    # useReveal, useTypewriter
   └─ components/               # Navbar, Hero, About, Skills, Projects, Contact, Footer, Admin, Icons
```

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the build (also persists to message.json)
```

## 1. Make it yours

Open **`src/data/content.js`** and replace the placeholders:

- `profile` — your name, roles (typed in the hero), tagline, email
- `socials` — your **GitHub, LinkedIn, email, WhatsApp** links (currently `PLACEHOLDER_URL`)
- `about`, `skills`, `projects` — your content

## 2. How submissions are stored

When a visitor submits the form, the app `POST`s to `/api/submit`. The Vite plugin
(`vite-submissions-plugin.js`) validates it and appends a record to
**`public/message.json`**:

```json
[
  {
    "id": "2a887ff0-27b6-4bf5-b241-0374a6672975",
    "name": "Ada Lovelace",
    "email": "ada@math.dev",
    "message": "Love the site!",
    "date": "2026-07-06T14:46:22.232Z"
  }
]
```

The file is created automatically and grows with each submission — it persists
between restarts.

### View submissions — the hidden admin page

A secret **hash URL** renders a submissions inbox (works on any static host, no
server routing needed):

```
http://localhost:5173/#/vault-9f3a7c2e8b41-d6k2p8x
```

There you can browse messages, reply by email, **Export JSON**, delete entries, or
clear all. Change the secret slug in `src/config.js` (`ADMIN_PATH`) to your own
random string.

### Important: this needs a Node process

Writing a file requires a running process, so `public/message.json` is written when
the app runs under **`npm run dev`** or **`npm run preview`** (both start a Node
server that includes the plugin).

On a **purely static deploy** (e.g. plain GitHub Pages with no serverless functions),
there's no process to write files, so the app automatically **falls back to
`localStorage`** — submissions are kept in the visitor's browser and still show up on
the admin page there. If you want file writes in production, run the app with
`npm run preview` on a Node host (Render, Railway, a VPS), or swap in a serverless
form service — only `src/lib/submissions.js` needs to change.

## Accessibility & performance

- Respects `prefers-reduced-motion` (pauses the 3D animation and scroll reveals)
- Keyboard-navigable, ARIA labels on icon links, semantic landmarks
- Three.js scene disposes cleanly on unmount (no memory leaks)
