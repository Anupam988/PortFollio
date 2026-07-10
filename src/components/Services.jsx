import { useCallback, useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const SERVICES = [
  {
    icon: 'fa-solid fa-code',
    title: 'Web Development',
    text: 'Modern, responsive websites and web applications built for real users, fast loading, and easy content control.',
  },
  {
    icon: 'fa-solid fa-sitemap',
    title: 'System Architecture',
    text: 'End-to-end planning for modules, flows, permissions, APIs, integrations, and scalable application structure.',
  },
  {
    icon: 'fa-solid fa-database',
    title: 'Database Schema Design',
    text: 'Clean relational schema design, normalization, indexing plans, and data models that keep systems maintainable.',
  },
  {
    icon: 'fa-solid fa-layer-group',
    title: 'Frontend Development',
    text: 'Interactive interfaces, dashboards, forms, portals, and user flows with a polished frontend experience.',
  },
  {
    icon: 'fa-solid fa-server',
    title: 'Backend Development',
    text: 'Secure backend logic, admin panels, APIs, authentication, reporting, and business workflow automation.',
  },
  {
    icon: 'fa-solid fa-cloud',
    title: 'Cloud & Deployment',
    text: 'Production setup, hosting, deployment support, environment configuration, and performance-minded delivery.',
  },
]

// Seamless wave path: period 50 across a 200-unit viewBox (4 periods),
// so translating the 200%-wide svg by -50% loops without a seam.
const WAVE = (() => {
  let d = 'M0 30 q12.5 -14 25 0'
  for (let x = 25; x < 200; x += 25) d += ' t25 0'
  return d + ' V60 H0 Z'
})()

export default function Services() {
  const ref = useReveal()
  const [active, setActive] = useState(0)
  const [introStep, setIntroStep] = useState(0)
  const [introDone, setIntroDone] = useState(false)
  const paused = useRef(false)
  const n = SERVICES.length

  const finishIntro = useCallback(() => {
    setIntroStep(3)
    setIntroDone(true)
  }, [])

  const go = useCallback(
    (dir) => {
      finishIntro()
      setActive((a) => (a + dir + n) % n)
    },
    [finishIntro, n]
  )

  // First-load layer intro: back cards, side cards, then center card.
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setIntroStep(1), 160),
      window.setTimeout(() => setIntroStep(2), 520),
      window.setTimeout(() => setIntroStep(3), 900),
      window.setTimeout(() => setIntroDone(true), 1350),
    ]

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  // Auto-advance one card at a time (paused while hovering the carousel).
  useEffect(() => {
    if (!introDone) return undefined

    const id = window.setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % n)
    }, 3200)
    return () => window.clearInterval(id)
  }, [introDone, n])

  // Left / right arrow keys move through the carousel.
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea') return
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // Nearest circular distance from the active card (so it wraps smoothly).
  const offsetOf = (i) => {
    let o = i - active
    if (o > n / 2) o -= n
    if (o < -n / 2) o += n
    return o
  }

  return (
    <section className="section services-section" id="services">
      <div className="container reveal" ref={ref}>
        <div
          className="services-stage"
          onMouseEnter={() => {
            paused.current = true
          }}
          onMouseLeave={() => {
            paused.current = false
          }}
        >
          <button
            type="button"
            className="carousel-nav prev"
            onClick={() => go(-1)}
            aria-label="Previous service"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div className="services-track">
            {SERVICES.map((s, i) => {
              const o = offsetOf(i)
              const abs = Math.abs(o)
              const hidden = abs > 2
              const scale = o === 0 ? 1 : abs === 1 ? 0.8 : 0.64
              const ready =
                introDone ||
                (introStep >= 3 && abs === 0) ||
                (introStep >= 2 && abs === 1) ||
                (introStep >= 1 && abs === 2)
              const opacity = !ready
                ? 0
                : hidden
                  ? 0
                  : o === 0
                    ? 1
                    : abs === 1
                      ? 0.68
                      : 0.34
              const y = ready ? 0 : abs === 0 ? 44 : 26
              return (
                <article
                  key={s.title}
                  className={`service-card${o === 0 ? ' active' : ''}`}
                  style={{
                    transform: `translateX(-50%) translateX(${o * 60}%) translateY(${y}px) scale(${scale}) rotateY(${o * -7}deg)`,
                    opacity,
                    zIndex: 20 - abs,
                    pointerEvents: hidden ? 'none' : 'auto',
                  }}
                  aria-hidden={hidden ? 'true' : undefined}
                  onClick={() => {
                    finishIntro()
                    setActive(i)
                  }}
                >
                  <span className="service-wave" aria-hidden="true">
                    <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="a">
                      <path d={WAVE} />
                    </svg>
                    <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="b">
                      <path d={WAVE} />
                    </svg>
                  </span>
                  <div className="service-icon">
                    <i className={s.icon} aria-hidden="true" />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              )
            })}
          </div>

          <button
            type="button"
            className="carousel-nav next"
            onClick={() => go(1)}
            aria-label="Next service"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className="carousel-dots">
          {SERVICES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={`c-dot${i === active ? ' on' : ''}`}
              onClick={() => {
                finishIntro()
                setActive(i)
              }}
              aria-label={`Show ${s.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
