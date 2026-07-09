import { useEffect, useRef } from 'react'

// Floating wireframe geometry models scattered across the whole page — the
// same family of 3D shapes drifting in the hero, rendered as light SVG
// wireframes in varied shapes and colors. They drift, spin, and parallax on
// scroll so the page never feels flat.
const SHAPES = [
  { t: 'cube', top: 6, left: 84, s: 78, c: '0,224,255', sp: 0.05, d: 9, r: 26 },
  { t: 'hexa', top: 20, left: 7, s: 66, c: '77,124,255', sp: -0.06, d: 12, r: -30 },
  { t: 'code', top: 30, left: 62, s: 22, c: '122,92,255', sp: 0.09, d: 8 },
  { t: 'diamond', top: 15, left: 44, s: 40, c: '0,224,255', sp: 0.12, d: 6, r: 44 },
  { t: 'tetra', top: 40, left: 16, s: 72, c: '122,92,255', sp: -0.05, d: 11, r: -22 },
  { t: 'plus', top: 46, left: 90, s: 26, c: '0,224,255', sp: 0.08, d: 7 },
  { t: 'hexa', top: 54, left: 50, s: 96, c: '0,224,255', sp: 0.04, d: 14, r: 18 },
  { t: 'diamond', top: 62, left: 84, s: 36, c: '77,124,255', sp: 0.11, d: 6, r: -40 },
  { t: 'code', top: 66, left: 12, s: 20, c: '0,224,255', sp: -0.05, d: 9 },
  { t: 'cube', top: 76, left: 78, s: 68, c: '77,124,255', sp: 0.05, d: 10, r: 30 },
  { t: 'tetra', top: 84, left: 34, s: 56, c: '122,92,255', sp: 0.07, d: 8, r: -28 },
  { t: 'hexa', top: 90, left: 88, s: 62, c: '0,224,255', sp: -0.04, d: 12, r: 24 },
  { t: 'diamond', top: 92, left: 20, s: 32, c: '0,224,255', sp: 0.1, d: 7, r: 46 },
  { t: 'cube', top: 96, left: 58, s: 58, c: '77,124,255', sp: 0.06, d: 9, r: -20 },
]

// Wireframe path sets (viewBox 0 0 100 100).
const GEO = {
  cube: (
    <>
      <path d="M50 8 L90 30 L50 52 L10 30 Z" />
      <path d="M10 30 L10 70 L50 92 L90 70 L90 30" />
      <path d="M50 52 L50 92" />
    </>
  ),
  hexa: (
    <>
      <path d="M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z" />
      <path d="M50 6 L50 94 M12 28 L88 72 M88 28 L12 72" />
    </>
  ),
  tetra: (
    <>
      <path d="M50 8 L90 86 L10 86 Z" />
      <path d="M50 8 L50 86 M10 86 L64 42 M90 86 L36 42" />
    </>
  ),
  diamond: (
    <>
      <path d="M50 6 L84 50 L50 94 L16 50 Z" />
      <path d="M16 50 L84 50 M50 6 L50 94" />
    </>
  ),
}

export default function Decorations() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const els = Array.from(root.querySelectorAll('.decor-wrap'))
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        for (const el of els) {
          const sp = parseFloat(el.dataset.sp)
          el.style.transform = `translate3d(0, ${y * sp}px, 0)`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="decor-layer" aria-hidden="true" ref={ref}>
      {SHAPES.map((sh, i) => (
        <span
          key={i}
          className="decor-wrap"
          data-sp={sh.sp}
          style={{ top: `${sh.top}%`, left: `${sh.left}%` }}
        >
          {sh.t === 'plus' || sh.t === 'code' ? (
            <span
              className={`decor ${sh.t}`}
              style={{
                width: `${sh.s}px`,
                height: `${sh.s}px`,
                '--c': sh.c,
                '--d': `${sh.d}s`,
              }}
            >
              {sh.t === 'code' ? '</>' : '+'}
            </span>
          ) : (
            <span
              className="decor geo"
              style={{
                width: `${sh.s}px`,
                height: `${sh.s}px`,
                '--c': sh.c,
                '--d': `${sh.d}s`,
                '--r': `${sh.r || 24}deg`,
              }}
            >
              <svg viewBox="0 0 100 100" fill="none">
                {GEO[sh.t]}
              </svg>
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
