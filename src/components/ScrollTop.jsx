import { useEffect, useState } from 'react'

// Bottom-right button that reveals on scroll, shows a circular progress
// ring that fills as you reach the bottom, and scrolls to top on click.
export default function ScrollTop() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0)
      setVisible(scrollTop > 300)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const R = 26
  const C = 2 * Math.PI * R
  const offset = C * (1 - progress)

  return (
    <button
      type="button"
      className={`scroll-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
    >
      <svg viewBox="0 0 60 60" className="scroll-top-ring">
        <defs>
          <linearGradient id="scrollTopGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00e0ff" />
            <stop offset="1" stopColor="#7a5cff" />
          </linearGradient>
        </defs>
        <circle className="track" cx="30" cy="30" r={R} />
        <circle
          className="progress"
          cx="30"
          cy="30"
          r={R}
          stroke="url(#scrollTopGrad)"
          strokeDasharray={C}
          strokeDashoffset={offset}
        />
      </svg>
      <svg
        className="scroll-top-arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
