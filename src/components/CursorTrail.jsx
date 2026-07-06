import { useEffect, useRef } from 'react'

// A shooting-star / comet cursor tracker rendered on a full-screen
// canvas. Pointer-events are disabled so it never blocks clicks.
export default function CursorTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = 0
    let h = 0
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const trail = [] // recent cursor points -> comet tail
    const sparks = [] // drifting star particles
    let mx = -100
    let my = -100
    let px = -100
    let py = -100

    const onMove = (e) => {
      px = mx
      py = my
      mx = e.clientX
      my = e.clientY

      trail.push({ x: mx, y: my })
      if (trail.length > 20) trail.shift()

      const dx = mx - px
      const dy = my - py
      const speed = Math.hypot(dx, dy)
      const count = Math.min(4, 1 + (speed / 12) | 0)
      for (let i = 0; i < count; i++) {
        sparks.push({
          x: mx,
          y: my,
          vx: -dx * 0.03 + (Math.random() - 0.5) * 1.4,
          vy: -dy * 0.03 + (Math.random() - 0.5) * 1.4,
          life: 1,
          size: 1 + Math.random() * 2.2,
          hue: Math.random() < 0.5 ? 190 : 225,
        })
      }
    }
    window.addEventListener('mousemove', onMove)

    let raf = 0
    const loop = () => {
      ctx.clearRect(0, 0, w, h)

      // Comet tail through recent points
      if (trail.length > 1) {
        ctx.lineCap = 'round'
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1]
          const p1 = trail[i]
          const t = i / trail.length
          ctx.strokeStyle = `rgba(0, 224, 255, ${t * 0.5})`
          ctx.lineWidth = t * 4
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.stroke()
        }
        const head = trail[trail.length - 1]
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 16)
        g.addColorStop(0, 'rgba(190, 245, 255, 0.9)')
        g.addColorStop(1, 'rgba(0, 224, 255, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(head.x, head.y, 16, 0, Math.PI * 2)
        ctx.fill()
      }

      // Drifting sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.02
        s.life -= 0.02
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.fillStyle = `hsla(${s.hue}, 100%, 70%, ${s.life})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
}
