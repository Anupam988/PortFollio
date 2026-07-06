import { useEffect, useRef } from 'react'
import { initHeroScene } from '../three/heroScene'
import { useTypewriter } from '../hooks/useTypewriter'
import { profile, socials } from '../data/content'
import { GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon, ArrowIcon } from './Icons'

export default function Hero() {
  const canvasRef = useRef(null)
  const role = useTypewriter(profile.roles)

  useEffect(() => {
    if (!canvasRef.current) return
    const dispose = initHeroScene(canvasRef.current)
    return dispose
  }, [])

  return (
    <header className="hero" id="home">
      <div className="hero-grid" aria-hidden="true" />
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-content">
          <p className="hero-hello">&lt;hello world /&gt;</p>
          <h1>
            I'm <span className="gradient-text">{profile.name}</span>
          </h1>
          <div className="hero-role" aria-live="polite">
            {role}
            <span className="cursor" />
          </div>
          <p className="hero-desc">{profile.tagline}</p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View my work <ArrowIcon />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in touch
            </a>
          </div>

          <div className="hero-socials">
            <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GithubIcon />
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedinIcon />
            </a>
            <a href={socials.email} aria-label="Email">
              <MailIcon />
            </a>
            <a
              href={socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <WhatsappIcon />
            </a>
          </div>
        </div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to about">
        <span className="mouse" />
        Scroll
      </a>
    </header>
  )
}
