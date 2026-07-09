import { useEffect, useState } from 'react'

// Counts up from 0 to the numeric part of `value` on mount.
// Non-numeric values (e.g. "∞") are shown as-is.
export default function CountUp({ value, duration = 1500 }) {
  const match = String(value).match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : null
  const suffix = match ? match[2] : ''
  const [n, setN] = useState(target === null ? null : 0)

  useEffect(() => {
    if (target === null) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  if (target === null) return value
  return (
    <>
      {n}
      {suffix}
    </>
  )
}
