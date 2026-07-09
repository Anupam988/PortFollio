import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { saveSubmission } from '../lib/submissions'
import {
  CheckIcon,
  CopyIcon,
  ExternalIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  PhoneIcon,
  WhatsappIcon,
} from './Icons'

const initial = { name: '', email: '', message: '' }

const ICONS = {
  email: <MailIcon />,
  phone: <PhoneIcon />,
  whatsapp: <WhatsappIcon />,
  linkedin: <LinkedinIcon />,
  github: <GithubIcon />,
  link: <ExternalIcon />,
}

// Pretty-print a url for display (drop scheme / trailing slash).
const strip = (u = '') =>
  String(u)
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/^mailto:/, '')
    .replace(/^tel:/, '')
    .replace(/\/$/, '')

export default function Contact({ contact = {} }) {
  const ref = useReveal()
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [copied, setCopied] = useState(null)
  const f = contact.form || {}

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim()
    const message = form.message.trim()

    if (!name || !email || !message) {
      setStatus({ state: 'error', message: 'Please fill in all fields.' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ state: 'error', message: 'Please enter a valid email address.' })
      return
    }

    setStatus({ state: 'loading', message: '' })
    try {
      await saveSubmission({ name, email, message })
      setStatus({
        state: 'success',
        message: "Thanks! Your message has been saved. I'll be in touch soon.",
      })
      setForm(initial)
    } catch {
      setStatus({
        state: 'error',
        message: 'Could not save your message. Please try again.',
      })
    }
  }

  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      /* clipboard unavailable */
    }
    setCopied(key)
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400)
  }

  // Each item is either a link (clickable) or a value (copyable).
  const contactItems = (contact.items || []).map((it) => ({
    type: it.type,
    icon: ICONS[it.type] || <ExternalIcon />,
    label: it.label,
    link: it.link || '',
    value: it.value || (it.link ? strip(it.link) : ''),
  }))

  const loading = status.state === 'loading'

  return (
    <section className="section" id="contact">
      <div className="container reveal" ref={ref}>
        <p className="section-tag">{contact.tag || 'Contact'}</p>
        <h2 className="section-title">
          {contact.heading || "Let's"}{' '}
          <span className="gradient-text">
            {contact.headingAccent || 'build something'}
          </span>
        </h2>

        <div className="contact-grid">
          <div className="contact-intro">
            <p>{contact.intro}</p>
            <ul className="contact-list">
              {contactItems.map((item) =>
                item.link ? (
                  <li key={item.label}>
                    <a href={item.link} target="_blank" rel="noreferrer">
                      <span className="ico">{item.icon}</span>
                      <span>
                        <span className="c-label">{item.label}</span>
                        <br />
                        <span className="c-val">{item.value}</span>
                      </span>
                    </a>
                  </li>
                ) : (
                  <li key={item.label} className="contact-copy-row">
                    <span className="ico">{item.icon}</span>
                    <span className="c-body">
                      <span className="c-label">{item.label}</span>
                      <br />
                      <span className="c-val">{item.value}</span>
                    </span>
                    <button
                      type="button"
                      className="c-copy"
                      onClick={() => copy(item.label, item.value)}
                      aria-label={`Copy ${item.label}`}
                      title="Copy"
                    >
                      {copied === item.label ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder={f.namePlaceholder || 'Jane Doe'}
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={f.emailPlaceholder || 'jane@example.com'}
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder={f.messagePlaceholder || 'Tell me about your project...'}
                value={form.message}
                onChange={handleChange}
              />
            </div>

            {status.state === 'success' || status.state === 'error' ? (
              <p className={`form-status ${status.state}`}>{status.message}</p>
            ) : null}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? f.sending || 'Sending…' : f.button || 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
