// ============================================================
//  Vite middleware plugin — persists contact-form submissions
//  to a real JSON file (public/message.json).
//
//  Runs inside the Vite dev server (npm run dev) and the
//  preview server (npm run preview), so a Node process is
//  present to write the file. No separate server to start.
// ============================================================
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const FILE = path.resolve(process.cwd(), 'public', 'message.json')

function readAll() {
  try {
    const raw = fs.readFileSync(FILE, 'utf8')
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function writeAll(list) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2))
}

function send(res, code, data) {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (c) => {
      body += c
      if (body.length > 1e5) req.destroy() // 100kb guard
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function attach(server) {
  if (!fs.existsSync(FILE)) writeAll([])

  server.middlewares.use(async (req, res, next) => {
    const url = (req.url || '').split('?')[0]
    if (!url.startsWith('/api/')) return next()

    try {
      // --- List all submissions ---
      if (url === '/api/messages' && req.method === 'GET') {
        return send(res, 200, readAll())
      }

      // --- Append a submission ---
      if (url === '/api/submit' && req.method === 'POST') {
        const { name, email, message } = await readBody(req)
        const n = String(name || '').trim()
        const e = String(email || '').trim()
        const m = String(message || '').trim()

        if (!n || !e || !m) {
          return send(res, 400, { error: 'All fields are required.' })
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
          return send(res, 400, { error: 'Invalid email address.' })
        }

        const record = {
          id: crypto.randomUUID(),
          name: n,
          email: e,
          message: m,
          date: new Date().toISOString(),
        }
        const list = readAll()
        list.unshift(record) // newest first
        writeAll(list)
        return send(res, 201, { success: true, record })
      }

      // --- Delete one submission ---
      if (url === '/api/delete' && req.method === 'POST') {
        const { id } = await readBody(req)
        writeAll(readAll().filter((s) => s.id !== id))
        return send(res, 200, { success: true })
      }

      // --- Clear all submissions ---
      if (url === '/api/clear' && req.method === 'POST') {
        writeAll([])
        return send(res, 200, { success: true })
      }

      return send(res, 404, { error: 'Not found' })
    } catch (err) {
      return send(res, 500, { error: err.message || 'Server error' })
    }
  })
}

export function submissionsApi() {
  return {
    name: 'submissions-api',
    configureServer(server) {
      attach(server)
    },
    configurePreviewServer(server) {
      attach(server)
    },
  }
}
