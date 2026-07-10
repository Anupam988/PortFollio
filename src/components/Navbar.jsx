import { useEffect, useState } from 'react'
import { MenuIcon, CloseIcon } from './Icons'

export default function Navbar({ personal }) {
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

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <a href="#home" className="nav-logo" onClick={() => setOpen(false)}>
        <img src="/assets/web/logo.png" alt="" aria-hidden="true" />
        <span className="nav-logo-text">
          {initials}
          <span>.</span>
          {suffix}
        </span>
      </a>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <ul className={`nav-links${open ? ' open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#contact"
            className="btn btn-primary nav-cta"
            onClick={() => setOpen(false)}
          >
            Hire me
          </a>
        </li>
      </ul>
    </nav>
  )
}
