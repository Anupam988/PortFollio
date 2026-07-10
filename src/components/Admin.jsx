import { useEffect, useState } from 'react'
import {
  fetchSubmissions,
  removeSubmission,
  clearAll,
  downloadJSON,
} from '../lib/submissions'
import { MailIcon } from './Icons'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export default function Admin() {
  const [items, setItems] = useState([])
  const [source, setSource] = useState('file')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { items, source } = await fetchSubmissions()
    setItems(items)
    setSource(source)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    await removeSubmission(id)
    load()
  }

  const handleClear = async () => {
    if (window.confirm('Delete ALL submissions? This cannot be undone.')) {
      await clearAll()
      load()
    }
  }

  return (
    <div className="admin">
      <div className="admin-inner">
        <header className="admin-head">
          <div>
            <p className="section-tag">Inbox</p>
            <h1 className="admin-title">
              Contact <span className="gradient-text">submissions</span>
            </h1>
            <p className="admin-sub">
              {items.length} message{items.length === 1 ? '' : 's'} ·{' '}
              {source === 'file'
                ? 'stored in public/message.json'
                : 'stored in this browser (file API offline)'}
            </p>
          </div>
          <div className="admin-actions">
            <button className="btn btn-ghost" onClick={load}>
              Refresh
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => downloadJSON(items)}
              disabled={items.length === 0}
            >
              Export JSON
            </button>
            <button
              className="btn btn-danger"
              onClick={handleClear}
              disabled={items.length === 0}
            >
              Clear all
            </button>
          </div>
        </header>

        {loading ? (
          <div className="admin-empty">
            <p className="glyph">…</p>
            <h3>Loading</h3>
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <p className="glyph">{'{ }'}</p>
            <h3>No submissions yet</h3>
            <p>Messages sent through the contact form will appear here.</p>
            <a className="btn btn-primary" href="/">
              ← Back to site
            </a>
          </div>
        ) : (
          <>
            <div className="admin-list">
              {items.map((s) => (
                <article className="admin-card" key={s.id}>
                  <div className="admin-card-top">
                    <div>
                      <h3>{s.name}</h3>
                      <div className="admin-meta">
                        <a href={`mailto:${s.email}`} className="admin-email">
                          <MailIcon width={15} height={15} /> {s.email}
                        </a>
                        <span className="admin-date">{formatDate(s.date)}</span>
                      </div>
                    </div>
                    <div className="admin-card-tools">
                      <a
                        className="admin-reply"
                        href={`mailto:${s.email}?subject=Re:%20your%20message`}
                        title="Reply by email"
                      >
                        Reply
                      </a>
                      <button
                        className="admin-del"
                        onClick={() => handleDelete(s.id)}
                        title="Delete"
                        aria-label="Delete submission"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="admin-message">{s.message}</p>
                </article>
              ))}
            </div>
            <div className="admin-foot">
              <a className="btn btn-ghost" href="/">
                ← Back to site
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
