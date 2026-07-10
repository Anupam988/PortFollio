import { Suspense, useEffect, useRef, useState } from 'react'

export default function LazySection({
  id,
  children,
  minHeight = 420,
  rootMargin = '420px 0px',
}) {
  const shellRef = useRef(null)
  const contentRef = useRef(null)
  const [active, setActive] = useState(false)
  const [height, setHeight] = useState(minHeight)

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin, threshold: 0.01 }
    )

    observer.observe(shell)
    return () => observer.disconnect()
  }, [rootMargin])

  useEffect(() => {
    if (!active || !contentRef.current) return

    const content = contentRef.current
    const updateHeight = () => {
      setHeight(Math.max(minHeight, content.offsetHeight))
    }

    updateHeight()
    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(content)
    return () => resizeObserver.disconnect()
  }, [active, minHeight])

  return (
    <div
      id={id}
      ref={shellRef}
      className={`lazy-section-shell${active ? ' is-active' : ''}`}
      style={{ minHeight: height }}
    >
      {active ? (
        <div ref={contentRef} className="lazy-section-content">
          <Suspense fallback={<div className="lazy-section-loader" />}>
            {children}
          </Suspense>
        </div>
      ) : (
        <div className="lazy-section-spacer" aria-hidden="true" />
      )}
    </div>
  )
}
