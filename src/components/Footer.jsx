import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon, WhatsappIcon } from './Icons'

const pages = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#/skills' },
  { label: 'Experience', href: '#/experience' },
  { label: 'Projects', href: '#/projects' },
  { label: 'Contact', href: '#contact' },
]

const ICONS = {
  email: <MailIcon />,
  phone: <PhoneIcon />,
  whatsapp: <WhatsappIcon />,
  linkedin: <LinkedinIcon />,
  github: <GithubIcon />,
}

const hrefFor = (item) => {
  if (item.link) return item.link
  if (item.type === 'email' && item.value) return `mailto:${item.value}`
  if (item.type === 'phone' && item.value) {
    return `tel:${String(item.value).replace(/[^\d+]/g, '')}`
  }
  return ''
}

export default function Footer({ personal, contact = {} }) {
  const year = new Date().getFullYear()
  const items = (contact.items || []).map((item) => ({
    ...item,
    icon: ICONS[item.type] || <MailIcon />,
    href: hrefFor(item),
    showValue: item.type === 'email' || item.type === 'phone',
  }))

  return (
    <footer className="footer">
      <div className="footer-panel">
        <ul className="footer-links">
          {items.map((it) => (
            <li key={it.label}>
              <a
                href={it.href}
                target={
                  it.href && !it.href.startsWith('mailto') && !it.href.startsWith('tel')
                    ? '_blank'
                    : undefined
                }
                rel="noreferrer"
                aria-label={it.label}
                title={it.label}
              >
                <span className="fl-ico">{it.icon}</span>
              </a>
            </li>
          ))}
        </ul>

        <nav className="footer-explore" aria-label="Footer navigation">
          <ul>
            {pages.map((p) => (
              <li key={p.label}>
                <a href={p.href}>{p.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-bottom">
          <p>
            Copyright &copy;{year}; Designed by {personal.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
