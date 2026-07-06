import * as THREE from 'three'

/**
 * Initializes the animated hero background:
 *  - a floating, glowing "coding cube" (nested wireframe boxes)
 *  - a drifting particle field
 *  - a few orbiting geometric shards
 *  - subtle mouse parallax
 *
 * Returns a cleanup function to dispose everything.
 */
export function initHeroScene(canvas) {
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  )
  camera.position.set(0, 0, 8)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

  const CYAN = new THREE.Color('#00e0ff')
  const BLUE = new THREE.Color('#4d7cff')
  const VIOLET = new THREE.Color('#7a5cff')

  // ---- Coding cube (group of nested wireframe boxes) ----
  const cube = new THREE.Group()

  const outer = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 2.6, 2.6)),
    new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.9 })
  )
  const inner = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 1.5, 1.5)),
    new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.7 })
  )
  inner.rotation.set(0.6, 0.4, 0)

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 0),
    new THREE.MeshBasicMaterial({
      color: CYAN,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    })
  )

  // Glowing vertices at the cube corners.
  const cornerGeo = new THREE.BufferGeometry()
  const c = 1.3
  const corners = []
  for (const x of [-c, c])
    for (const y of [-c, c]) for (const z of [-c, c]) corners.push(x, y, z)
  cornerGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(corners, 3)
  )
  const cornerPts = new THREE.Points(
    cornerGeo,
    new THREE.PointsMaterial({
      color: CYAN,
      size: 0.16,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  )

  cube.add(outer, inner, core, cornerPts)
  cube.position.x = 1.6
  scene.add(cube)

  // ---- Particle field ----
  const COUNT = 900
  const pGeo = new THREE.BufferGeometry()
  const positions = new Float32Array(COUNT * 3)
  const colors = new Float32Array(COUNT * 3)
  const palette = [CYAN, BLUE, VIOLET]
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16
    positions[i * 3 + 2] = (Math.random() - 0.5) * 16
    const col = palette[(Math.random() * palette.length) | 0]
    colors[i * 3] = col.r
    colors[i * 3 + 1] = col.g
    colors[i * 3 + 2] = col.b
  }
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  pGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  )
  scene.add(particles)

  // ---- Orbiting shards ----
  const shards = new THREE.Group()
  const shardMat = new THREE.MeshBasicMaterial({
    color: VIOLET,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  })
  const shardData = []
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.3 + Math.random() * 0.25, 0),
      shardMat
    )
    const radius = 3.6 + Math.random() * 2.5
    const angle = Math.random() * Math.PI * 2
    shardData.push({
      radius,
      angle,
      speed: 0.1 + Math.random() * 0.25,
      y: (Math.random() - 0.5) * 3,
      spin: Math.random() * 0.02 + 0.005,
    })
    m.position.set(Math.cos(angle) * radius + 1.6, 0, Math.sin(angle) * radius)
    shards.add(m)
  }
  scene.add(shards)

  // ---- Interaction ----
  const target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  function onPointerMove(e) {
    target.x = (e.clientX / window.innerWidth - 0.5) * 0.6
    target.y = (e.clientY / window.innerHeight - 0.5) * 0.6
  }
  window.addEventListener('pointermove', onPointerMove)

  function onResize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
    // On narrow screens, center the cube instead of offsetting it.
    cube.position.x = w < 760 ? 0 : 1.6
  }
  window.addEventListener('resize', onResize)
  onResize()

  // ---- Animation loop ----
  const clock = new THREE.Clock()
  let raf = 0
  function tick() {
    const t = clock.getElapsedTime()

    if (!prefersReduced) {
      cube.rotation.y = t * 0.28
      cube.rotation.x = Math.sin(t * 0.4) * 0.25
      inner.rotation.x = t * 0.5
      inner.rotation.z = t * 0.3
      core.rotation.y = -t * 0.6
      cube.position.y = Math.sin(t * 0.8) * 0.25

      particles.rotation.y = t * 0.02

      shards.children.forEach((m, i) => {
        const d = shardData[i]
        d.angle += d.speed * 0.01
        m.position.set(
          Math.cos(d.angle) * d.radius + cube.position.x,
          d.y + Math.sin(t + i) * 0.4,
          Math.sin(d.angle) * d.radius
        )
        m.rotation.x += d.spin
        m.rotation.y += d.spin
      })
    }

    // Smooth parallax
    current.x += (target.x - current.x) * 0.04
    current.y += (target.y - current.y) * 0.04
    camera.position.x = current.x * 2
    camera.position.y = -current.y * 1.4
    camera.lookAt(scene.position)

    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  tick()

  // ---- Cleanup ----
  return function dispose() {
    cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', onResize)
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
        else obj.material.dispose()
      }
    })
    renderer.dispose()
  }
}
