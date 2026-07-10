import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'

function normalize(it) {
  return {
    name: typeof it === 'string' ? it : it.name,
    icon: (typeof it === 'object' && it.icon) || 'fa-solid fa-code',
    color: typeof it === 'object' ? it.color : null,
  }
}

function rgba(hex, a) {
  const h = String(hex || '#00e0ff').replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

// deterministic 0..1 from an index (stable per node so layout doesn't jump)
function rnd(i) {
  const x = Math.sin(i * 99.13 + i * i * 0.7 + 1.3) * 43758.5453
  return x - Math.floor(x)
}

const CYCLE = 3000

// Floating side graphics that fill the empty space left & right of the orbit.
const FLOATS = [
  { t: 'code', x: 5, y: 22, s: 22, c: '#00e0ff', d: 8, dl: 0 },
  { t: 'diamond', x: 13, y: 52, s: 30, c: '#7a5cff', d: 11, dl: 1.2 },
  { t: 'dot', x: 18, y: 34, s: 9, c: '#4d7cff', d: 7, dl: 0.5 },
  { t: 'plus', x: 8, y: 74, s: 22, c: '#00e0ff', d: 9, dl: 0.8 },
  { t: 'tri', x: 3, y: 90, s: 26, c: '#4d7cff', d: 12, dl: 0.2 },
  { t: 'dot', x: 22, y: 82, s: 7, c: '#7a5cff', d: 6, dl: 1.4 },
  { t: 'code', x: 94, y: 18, s: 20, c: '#4d7cff', d: 9, dl: 0.4 },
  { t: 'diamond', x: 88, y: 46, s: 26, c: '#00e0ff', d: 10, dl: 1.0 },
  { t: 'plus', x: 96, y: 66, s: 22, c: '#7a5cff', d: 8, dl: 0.6 },
  { t: 'dot', x: 84, y: 30, s: 8, c: '#00e0ff', d: 7, dl: 1.6 },
  { t: 'tri', x: 92, y: 88, s: 28, c: '#7a5cff', d: 12, dl: 0.3 },
  { t: 'dot', x: 98, y: 82, s: 6, c: '#4d7cff', d: 6, dl: 1.1 },
]

function Float({ f }) {
  const style = {
    left: `${f.x}%`,
    top: `${f.y}%`,
    '--s': `${f.s}px`,
    '--c': f.c,
    '--d': `${f.d}s`,
    '--dl': `${f.dl}s`,
  }
  let inner = null
  if (f.t === 'code') inner = '</>'
  else if (f.t === 'plus') inner = '+'
  else if (f.t === 'tri')
    inner = (
      <svg viewBox="0 0 24 24">
        <path d="M12 3 L21 20 L3 20 Z" />
      </svg>
    )
  else if (f.t === 'diamond')
    inner = (
      <svg viewBox="0 0 24 24">
        <path d="M12 2 L21 12 L12 22 L3 12 Z" />
      </svg>
    )
  return (
    <span className={`sf sf-${f.t}`} style={style}>
      {inner}
    </span>
  )
}

// Skills as an animated constellation: a category icon in the centre with its
// technologies scattered around it at varied sizes, connected by lines. Each
// group holds briefly, fades, and the next takes over on a loop.
export default function Skills({ skills = [] }) {
  const ref = useReveal()
  const [active, setActive] = useState(0)
  const paused = useRef(false)
  const n = skills.length || 1

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % n)
    }, CYCLE)
    return () => window.clearInterval(id)
  }, [n])

  const group = skills[active] || { items: [] }
  const items = (group.items || []).map(normalize)
  const count = items.length || 1
  const curColor = group.color || '#00e0ff'

  const pos = (i) => {
    const ang = (i / count) * Math.PI * 2 - Math.PI / 2 + (rnd(i) - 0.5) * 0.5
    const r = 31 + rnd(i + 5) * 14
    const size = 46 + rnd(i + 9) * 22
    return { x: 50 + Math.cos(ang) * r, y: 50 + Math.sin(ang) * r, size }
  }

  return (
    <section className="section" id="skills">
      <div className="container reveal" ref={ref}>
        <p className="section-tag">Skills</p>
        <h2 className="section-title">
          Tools I <span className="gradient-text">work with</span>
        </h2>

        <div className="skills-wrap">
          <div className="skills-floats" aria-hidden="true">
            {FLOATS.map((f, i) => (
              <Float f={f} key={i} />
            ))}
          </div>

          <div
            className="skill-orbit"
            onMouseEnter={() => {
              paused.current = true
            }}
            onMouseLeave={() => {
              paused.current = false
            }}
          >
            <span
              className="orbit-aura"
              aria-hidden="true"
              style={{
                background: `radial-gradient(circle, ${rgba(curColor, 0.16)}, transparent 62%)`,
              }}
            />

            <div className="orbit-stage" key={active} style={{ '--cycle': `${CYCLE}ms` }}>
              <svg
                className="orbit-lines"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {items.map((it, i) => {
                  const p = pos(i)
                  return (
                    <line
                      key={it.name}
                      x1="50"
                      y1="50"
                      x2={p.x}
                      y2={p.y}
                      pathLength="1"
                      style={{ '--i': i }}
                    />
                  )
                })}
              </svg>

              <div
                className="orbit-center"
                style={group.color ? { '--gc': group.color } : undefined}
              >
                <i className={group.icon || 'fa-solid fa-layer-group'} aria-hidden="true" />
                <span>{group.title}</span>
              </div>

              {items.map((it, i) => {
                const p = pos(i)
                return (
                  <div
                    className="orbit-node"
                    key={it.name}
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      '--i': i,
                      '--sz': `${p.size}px`,
                    }}
                  >
                    <span
                      className="orbit-ic"
                      style={it.color ? { color: it.color } : undefined}
                    >
                      <i className={it.icon} aria-hidden="true" />
                    </span>
                    <span className="orbit-name">{it.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="orbit-dots">
            {skills.map((g, i) => (
              <button
                type="button"
                key={g.title}
                className={i === active ? 'on' : ''}
                onClick={() => setActive(i)}
                aria-label={g.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
