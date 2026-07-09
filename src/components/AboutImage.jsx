import { useEffect, useRef } from 'react'

// The about photo box: a particle + geometry network behind the photo,
// and a mouse-tracking parallax tilt on the photo itself.
export default function AboutImage({ src, alt }) {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  const photoRef = useRef(null)

  // --- Particle network + rotating geometry inside the box ---
  useEffect(() => {
    const canvas = canvasRef.current
    const box = boxRef.current
    if (!canvas || !box) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')

    let w = 0
    let h = 0
    let raf = 0
    let angle = 0
    const particles = []
    const mouse = { x: -999, y: -999 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = box.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (particles.length === 0 && w > 0) {
        const count = Math.round(Math.min(46, (w * h) / 5200))
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.6,
          })
        }
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(box)

    const onMove = (e) => {
      const r = box.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.x = -999
      mouse.y = -999
    }
    box.addEventListener('mousemove', onMove)
    box.addEventListener('mouseleave', onLeave)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      const R = Math.min(w, h) * 0.3

      // rotating geometry (hexagon + inner triangle)
      if (!reduce) angle += 0.0035
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(0, 224, 255, 0.16)'
      for (const [sides, scale, dir] of [
        [6, 1, 1],
        [3, 0.58, -1],
      ]) {
        ctx.beginPath()
        for (let i = 0; i <= sides; i++) {
          const a = angle * dir + (Math.PI * 2 * i) / sides
          const x = cx + Math.cos(a) * R * scale
          const y = cy + Math.sin(a) * R * scale
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // move particles
      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
        }
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        if (dx * dx + dy * dy < 11000) {
          p.x -= dx * 0.0025
          p.y -= dy * 0.0025
        }
      }

      // connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 92) {
            ctx.strokeStyle = `rgba(0, 224, 255, ${(1 - dist / 92) * 0.26})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // dots
      for (const p of particles) {
        ctx.fillStyle = 'rgba(130, 220, 255, 0.7)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      box.removeEventListener('mousemove', onMove)
      box.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // --- Mouse-tracking parallax tilt on the photo ---
  useEffect(() => {
    const box = boxRef.current
    const photo = photoRef.current
    if (!box || !photo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e) => {
      const r = box.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      photo.style.transform =
        `translate(${px * 24}px, ${py * 18}px) rotateX(${-py * 9}deg) rotateY(${px * 11}deg) scale(1.04)`
    }
    const onLeave = () => {
      photo.style.transform = ''
    }
    box.addEventListener('mousemove', onMove)
    box.addEventListener('mouseleave', onLeave)
    return () => {
      box.removeEventListener('mousemove', onMove)
      box.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="about-image" ref={boxRef}>
      <canvas ref={canvasRef} className="about-particles" aria-hidden="true" />
      <img
        ref={photoRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
