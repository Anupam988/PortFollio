import { GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon } from './Icons'

export default function Footer({ personal }) {
  const year = new Date().getFullYear()
  const socials = personal.socials || {}

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {year} {personal.name}. Built with React &amp; Three.js.
        </p>
        <div className="footer-socials">
          <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GithubIcon />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedinIcon />
          </a>
          <a href={socials.email} aria-label="Email">
            <MailIcon />
          </a>
          <a href={socials.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <WhatsappIcon />
          </a>
        </div>
      </div>
    </footer>
  )
}
