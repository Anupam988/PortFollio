import { useEffect, useRef } from 'react'

// Custom cursor: a small dot at the pointer with a thin ring that eases
// toward it, plus a comet trail that fades out smoothly when you stop.
export default function CursorTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
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

    const trail = [] // { x, y, life } -> comet tail, fades over time
    const sparks = []
    const mouse = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    let lastX = -100
    let lastY = -100
    let inside = false
    let op = 0 // dot/ring opacity, eases toward inside ? 1 : 0

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (!inside) {
        // first appearance: snap the ring so it doesn't fly in
        ring.x = mouse.x
        ring.y = mouse.y
      }
      inside = true

      const dx = mouse.x - lastX
      const dy = mouse.y - lastY
      lastX = mouse.x
      lastY = mouse.y

      trail.push({ x: mouse.x, y: mouse.y, life: 1 })
      if (trail.length > 24) trail.shift()

      const speed = Math.hypot(dx, dy)
      const count = Math.min(3, (speed / 16) | 0)
      for (let i = 0; i < count; i++) {
        sparks.push({
          x: mouse.x,
          y: mouse.y,
          vx: -dx * 0.03 + (Math.random() - 0.5) * 1.2,
          vy: -dy * 0.03 + (Math.random() - 0.5) * 1.2,
          life: 1,
          size: 1 + Math.random() * 1.8,
          hue: Math.random() < 0.5 ? 190 : 225,
        })
      }
    }
    const onLeave = () => {
      inside = false
    }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)

    let raf = 0
    const loop = () => {
      ctx.clearRect(0, 0, w, h)

      // ease ring toward the cursor + fade dot/ring in/out
      ring.x += (mouse.x - ring.x) * 0.18
      ring.y += (mouse.y - ring.y) * 0.18
      op += ((inside ? 1 : 0) - op) * 0.1

      // fade the comet trail every frame (blends out when stopped)
      for (let i = 0; i < trail.length; i++) trail[i].life -= 0.045
      while (trail.length && trail[0].life <= 0) trail.shift()

      if (trail.length > 1) {
        ctx.lineCap = 'round'
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1]
          const p1 = trail[i]
          const t = i / trail.length
          const a = t * p1.life * 0.5
          ctx.strokeStyle = `rgba(0, 224, 255, ${a})`
          ctx.lineWidth = t * p1.life * 3.4
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.stroke()
        }
      }

      // sparks drift + fade
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

      // ring (outline) that trails slightly behind the pointer
      if (op > 0.01) {
        ctx.strokeStyle = `rgba(0, 224, 255, ${0.6 * op})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, 9, 0, Math.PI * 2)
        ctx.stroke()

        // solid dot at the exact pointer
        ctx.fillStyle = `rgba(200, 245, 255, ${0.95 * op})`
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
}
