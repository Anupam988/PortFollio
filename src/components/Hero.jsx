import { useEffect, useMemo, useRef } from 'react'
import { initHeroScene } from '../three/heroScene'
import { useTypewriter } from '../hooks/useTypewriter'
import { ArrowIcon } from './Icons'
import CountUp from './CountUp'

export default function Hero({ personal, technologies = [], about }) {
  const canvasRef = useRef(null)
  const role = useTypewriter(personal.roles)
  const portrait = personal.heroImage || (about && about.image)
  const stats = (about && about.stats) || []

  useEffect(() => {
    if (!canvasRef.current) return
    const dispose = initHeroScene(canvasRef.current)
    return dispose
  }, [])

  const floating = useMemo(() => {
    const list = technologies || []
    const cols = Math.max(1, Math.ceil(Math.sqrt(list.length)))
    const rows = Math.max(1, Math.ceil(list.length / cols))
    return list.map((t, i) => {
      const row = Math.floor(i / cols)
      const col = i % cols
      const cellW = 100 / cols
      const cellH = 100 / rows
      const left = cellW * (col + 0.5) + (Math.random() - 0.5) * cellW * 0.7
      const top = cellH * (row + 0.5) + (Math.random() - 0.5) * cellH * 0.7
      const size = 24 + Math.random() * 18
      const dur = 6 + Math.random() * 7
      const delay = Math.random() * 5
      return { ...t, left, top, size, dur, delay, key: t.name + '-' + i }
    })
  }, [technologies])

  return (
    <header className="hero" id="home">
      <div className="hero-grid" aria-hidden="true" />
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      <div className="hero-icons" aria-hidden="true">
        {floating.map((t) => (
          <i
            key={t.key}
            className={`tech-float ${t.icon}`}
            title={t.name}
            style={{
              top: `${t.top}%`,
              left: `${t.left}%`,
              fontSize: `${t.size}px`,
              color: t.color,
              animationDuration: `${t.dur}s`,
              animationDelay: `${t.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-inner">
        <div className="hero-layout">
          <div className="hero-content">
            <p className="hero-hello">&lt;hello world /&gt;</p>
            <h1>
              I&apos;m <span className="gradient-text">{personal.name}</span>
            </h1>
            <div className="hero-role" aria-live="polite">
              {role}
              <span className="cursor" />
            </div>
            <p className="hero-desc">{personal.tagline}</p>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                View my work <ArrowIcon />
              </a>
              <a href="#contact" className="btn btn-ghost">
                Get in touch
              </a>
            </div>

            <div className="hero-stats">
              {stats.map((s) => (
                <div className="hero-stat" key={s.label}>
                  <div className="hero-stat-num gradient-text">
                    <CountUp value={s.num} />
                  </div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-portrait">
              {portrait ? <img src={portrait} alt={personal.name} /> : null}
            </div>
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
