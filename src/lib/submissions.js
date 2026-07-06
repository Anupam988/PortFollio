import { SUBMISSIONS_KEY } from '../config'

// ============================================================
//  Submission store
//
//  Primary: a real JSON file at public/message.json, written
//  by the Vite middleware plugin (works under `npm run dev`
//  and `npm run preview`).
//
//  Fallback: browser localStorage, used automatically when the
//  file API isn't reachable (e.g. a purely static deploy).
// ============================================================

// ---- localStorage fallback helpers ----
function lsGet() {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function lsSet(list) {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list, null, 2))
  } catch {
    /* storage may be unavailable */
  }
}

function makeRecord({ name, email, message }) {
  return {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()) + Math.random().toString(16).slice(2),
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    date: new Date().toISOString(),
  }
}

/**
 * Save a submission. Tries the file API first; on failure falls
 * back to localStorage. Returns { ok, persisted } where
 * `persisted` is 'file' or 'local'.
 */
export async function saveSubmission(input) {
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Request failed')
    }
    return { ok: true, persisted: 'file' }
  } catch {
    // Fallback: keep it in the browser so nothing is lost.
    const list = lsGet()
    list.unshift(makeRecord(input))
    lsSet(list)
    return { ok: true, persisted: 'local' }
  }
}

/** Fetch all submissions (file API first, else localStorage). */
export async function fetchSubmissions() {
  try {
    const res = await fetch('/api/messages', { cache: 'no-store' })
    if (!res.ok) throw new Error('bad status')
    const list = await res.json()
    return { source: 'file', items: Array.isArray(list) ? list : [] }
  } catch {
    return { source: 'local', items: lsGet() }
  }
}

/** Delete one submission by id (file API first, else localStorage). */
export async function removeSubmission(id) {
  try {
    const res = await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) throw new Error('bad status')
  } catch {
    lsSet(lsGet().filter((s) => s.id !== id))
  }
}

/** Remove every submission (file API first, else localStorage). */
export async function clearAll() {
  try {
    const res = await fetch('/api/clear', { method: 'POST' })
    if (!res.ok) throw new Error('bad status')
  } catch {
    localStorage.removeItem(SUBMISSIONS_KEY)
  }
}

/** Download the given items as a message.json file. */
export function downloadJSON(items) {
  const blob = new Blob([JSON.stringify(items, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'message.json'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
