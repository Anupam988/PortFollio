import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon, WhatsappIcon } from './Icons'

const strip = (u = '') =>
  String(u)
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/^mailto:/, '')
    .replace(/\/$/, '')

const pages = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#/skills' },
  { label: 'Experience', href: '#/experience' },
  { label: 'Projects', href: '#/projects' },
  { label: 'Blog', href: '#/blog' },
]

export default function Footer({ personal }) {
  const year = new Date().getFullYear()
  const s = personal.socials || {}

  const items = [
    { icon: <MailIcon />, label: 'Email', value: personal.email, href: s.email },
    personal.phone && {
      icon: <PhoneIcon />,
      label: 'Phone',
      value: personal.phone,
      href: `tel:${String(personal.phone).replace(/[^\d+]/g, '')}`,
    },
    { icon: <LinkedinIcon />, label: 'LinkedIn', value: strip(s.linkedin), href: s.linkedin },
    { icon: <GithubIcon />, label: 'GitHub', value: strip(s.github), href: s.github },
    { icon: <WhatsappIcon />, label: 'WhatsApp', value: strip(s.whatsapp), href: s.whatsapp },
  ].filter(Boolean)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">{personal.name}</div>
            <p>{personal.tagline}</p>
          </div>

          <nav className="footer-explore">
            <h4>Explore</h4>
            <ul>
              {pages.map((p) => (
                <li key={p.label}>
                  <a href={p.href}>{p.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="footer-links">
            {items.map((it) => (
              <li key={it.label}>
                <a
                  href={it.href}
                  target={it.href && it.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                >
                  <span className="fl-ico">{it.icon}</span>
                  <span>
                    <span className="fl-label">{it.label}</span>
                    <br />
                    <span className="fl-val">{it.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-bottom">
          <p>
            © {year} {personal.name}. Built with React &amp; Three.js.
          </p>
        </div>
      </div>
    </footer>
  )
}
