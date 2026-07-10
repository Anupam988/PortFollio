import { useEffect, useState } from 'react'
import { MenuIcon, CloseIcon } from './Icons'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ personal, route = 'home' }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const initials = personal.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const suffix = (personal.logoSuffix || '.dev').replace(/^\./, '')
  const navLinks = personal.navLinks || []

  const isActive = (href) => {
    const seg = href === '/' ? 'home' : href.replace(/^\//, '').split('/')[0]
    if (seg === 'home') return route === 'home'
    if (seg === 'projects') return route === 'projects' || route.startsWith('project:')
    return route === seg
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <a href="/" className="nav-logo" onClick={() => setOpen(false)}>
        <img src="/assets/web/logo.png" alt="" aria-hidden="true" />
        <span className="nav-logo-text">
          {initials}
          <span>.</span>
          {suffix}
        </span>
      </a>

      <div className="nav-right">
        <ul className={`nav-links${open ? ' open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={isActive(link.href) ? 'active' : undefined}
                aria-current={isActive(link.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/contact"
              className="btn btn-primary nav-cta"
              onClick={() => setOpen(false)}
            >
              Hire me
            </a>
          </li>
        </ul>

        <ThemeToggle />

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </nav>
  )
}
