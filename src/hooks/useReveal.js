import { useEffect, useRef } from 'react'

/**
 * Adds the `is-visible` class to an element the first time it
 * scrolls into view. Pair with the `.reveal` CSS class.
 */
export function useReveal({ threshold = 0.15 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return ref
}
