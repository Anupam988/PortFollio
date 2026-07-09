import { useState } from 'react'
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

const ICONS = {
  email: <MailIcon />,
  phone: <PhoneIcon />,
  whatsapp: <WhatsappIcon />,
  linkedin: <LinkedinIcon />,
  github: <GithubIcon />,
  link: <ExternalIcon />,
}

const strip = (u = '') =>
  String(u)
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/^mailto:/, '')
    .replace(/^tel:/, '')
    .replace(/\/$/, '')

// Fixed vertical social rail on the right, driven by the same contact items.
// A link item is clickable; a value-only item copies on click. Both expose a
// hover tooltip with the value and a copy button.
export default function SocialSidebar({ items = [] }) {
  const [copied, setCopied] = useState(null)

  const rail = items.map((it) => ({
    key: it.type + (it.label || ''),
    icon: ICONS[it.type] || <ExternalIcon />,
    label: it.label,
    link: it.link || '',
    value: it.value || (it.link ? strip(it.link) : ''),
  }))

  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      /* clipboard unavailable */
    }
    setCopied(key)
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400)
  }

  return (
    <div className="social-sidebar" aria-label="Social links">
      {rail.map((it) => (
        <div className="social-item" key={it.key}>
          {it.link ? (
            <a href={it.link} target="_blank" rel="noreferrer" aria-label={it.label}>
              {it.icon}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => copy(it.key, it.value)}
              aria-label={`Copy ${it.label}`}
            >
              {it.icon}
            </button>
          )}
          <div className="social-hint" role="tooltip">
            <span className="social-hint-text">
              <span className="social-hint-label">{it.label}</span>
              <span className="social-hint-value">{it.value}</span>
            </span>
            <button
              type="button"
              className="social-copy"
              onClick={() => copy(it.key, it.value)}
              aria-label={`Copy ${it.label}`}
              title="Copy"
            >
              {copied === it.key ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>
      ))}
      <span className="social-line" />
    </div>
  )
}
