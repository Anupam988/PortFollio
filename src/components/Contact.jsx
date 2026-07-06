import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { saveSubmission } from '../lib/submissions'
import { GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon } from './Icons'

const initial = { name: '', email: '', message: '' }

export default function Contact({ personal }) {
  const ref = useReveal()
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const socials = personal.socials || {}

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

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
      // Writes to public/message.json (or localStorage as a fallback).
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

  const contactItems = [
    { icon: <MailIcon />, label: 'Email', value: personal.email, href: socials.email },
    { icon: <WhatsappIcon />, label: 'WhatsApp', value: 'Message me', href: socials.whatsapp },
    { icon: <LinkedinIcon />, label: 'LinkedIn', value: 'Connect', href: socials.linkedin },
    { icon: <GithubIcon />, label: 'GitHub', value: 'Follow', href: socials.github },
  ]

  const loading = status.state === 'loading'

  return (
    <section className="section" id="contact">
      <div className="container reveal" ref={ref}>
        <p className="section-tag">Contact</p>
        <h2 className="section-title">
          Let&apos;s <span className="gradient-text">build something</span>
        </h2>

        <div className="contact-grid">
          <div className="contact-intro">
            <p>
              Have a project in mind, a question, or just want to say hi? Drop a
              message and I&apos;ll get back to you.
            </p>
            <ul className="contact-list">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href && item.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer"
                  >
                    <span className="ico">{item.icon}</span>
                    <span>
                      <span className="c-label">{item.label}</span>
                      <br />
                      <span className="c-val">{item.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Jane Doe"
                value={form.name} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="jane@example.com"
                value={form.email} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5"
                placeholder="Tell me about your project..."
                value={form.message} onChange={handleChange} />
            </div>

            {status.state === 'success' || status.state === 'error' ? (
              <p className={`form-status ${status.state}`}>{status.message}</p>
            ) : null}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
