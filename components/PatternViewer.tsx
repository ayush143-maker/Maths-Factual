'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { PatternId } from '@/lib/patterns'

export default function PatternViewer({
  pattern,
}: {
  pattern: PatternId
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    renderer.setClearColor('#050505')
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2('#050505', 0.006)

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 250)
    camera.position.set(0, 0, 24)

    const group = new THREE.Group()
    scene.add(group)

    let frame = 0
    let time = 0
    let update: ((t: number) => void) | undefined

    const setSize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    setSize()
    window.addEventListener('resize', setSize)

    const color = new THREE.Color()

    const normalizeHue = (value: number) => ((value % 1) + 1) % 1

    const addPoints = (
      positions: number[],
      colors: number[],
      size = 0.05
    ) => {
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      )
      geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
      )

      const material = new THREE.PointsMaterial({
        size,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      const points = new THREE.Points(geometry, material)
      group.add(points)

      return geometry
    }

    switch (pattern) {
      case 'helix': {
        camera.position.set(0, 0, 27)

        const positions: number[] = []
        const colors: number[] = []
        const count = 6500

        for (let i = 0; i < count; i++) {
          const t = (i / count) * Math.PI * 14
          const y = (i / count - 0.5) * 18
          const radius = 4.4

          color.setHSL(normalizeHue(i / count), 1, 0.62)
          positions.push(Math.cos(t) * radius, y, Math.sin(t) * radius)
          colors.push(color.r, color.g, color.b)

          color.setHSL(normalizeHue(i / count + 0.45), 1, 0.62)
          positions.push(
            Math.cos(t + Math.PI) * radius,
            y,
            Math.sin(t + Math.PI) * radius
          )
          colors.push(color.r, color.g, color.b)
        }

        addPoints(positions, colors, 0.042)

        update = (t) => {
          group.rotation.y = t * 0.16
          group.rotation.x = Math.sin(t * 0.07) * 0.08
        }

        break
      }

      case 'wave': {
        camera.position.set(0, 12, 26)

        const side = 85
        const positions: number[] = []
        const colors: number[] = []

        for (let x = 0; x < side; x++) {
          for (let z = 0; z < side; z++) {
            const px = (x / (side - 1) - 0.5) * 24
            const pz = (z / (side - 1) - 0.5) * 24
            positions.push(px, 0, pz)
            colors.push(1, 1, 1)
          }
        }

        const geometry = addPoints(positions, colors, 0.028)

        update = (t) => {
          group.rotation.y = t * 0.03

          const pos = geometry.attributes.position as THREE.BufferAttribute
          const col = geometry.attributes.color as THREE.BufferAttribute

          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i)
            const z = pos.getZ(i)

            const y =
              Math.sin(x * 0.34 + t * 2.1) * 1.15 +
              Math.cos(z * 0.27 + t * 1.5) * 1.15 +
              Math.sin((x + z) * 0.16 + t * 0.8) * 0.7

            pos.setY(i, y)

            const hue = normalizeHue(
              0.54 + y * 0.05 + x * 0.007 + z * 0.007 + t * 0.02
            )

            color.setHSL(hue, 1, 0.62)
            col.setXYZ(i, color.r, color.g, color.b)
          }

          pos.needsUpdate = true
          col.needsUpdate = true
        }

        break
      }

      case 'lissajous': {
        camera.position.set(0, 0, 25)

        const positions: number[] = []
        const colors: number[] = []
        const count = 9000
        const loops = 6

        for (let i = 0; i < count; i++) {
          const t = (i / count) * Math.PI * 2 * loops

          positions.push(
            7.2 * Math.sin(3 * t + Math.PI / 2),
            7.2 * Math.sin(4 * t),
            2.2 * Math.sin(5 * t)
          )

          color.setHSL(normalizeHue(t / (Math.PI * 2 * loops)), 1, 0.63)
          colors.push(color.r, color.g, color.b)
        }

        addPoints(positions, colors, 0.032)

        update = (t) => {
          group.rotation.y = t * 0.12
          group.rotation.z = Math.sin(t * 0.06) * 0.08
        }

        break
      }

      case 'rose': {
        camera.position.set(0, 0, 24)

        const positions: number[] = []
        const colors: number[] = []
        const count = 12000
        const maxTheta = Math.PI * 24
        const k = 7 / 3

        for (let i = 0; i < count; i++) {
          const theta = (i / count) * maxTheta
          const r = 6.8 * Math.cos(k * theta)

          positions.push(
            r * Math.cos(theta),
            r * Math.sin(theta),
            (theta - maxTheta / 2) * 0.008
          )

          color.setHSL(normalizeHue(theta / maxTheta + 0.5), 1, 0.62)
          colors.push(color.r, color.g, color.b)
        }

        addPoints(positions, colors, 0.026)

        update = (t) => {
          group.rotation.z = t * 0.07
          group.rotation.x = Math.sin(t * 0.03) * 0.05
        }

        break
      }

      case 'lorenz': {
        camera.position.set(0, 0, 34)

        const positions: number[] = []
        const colors: number[] = []

        let x = 0.1
        let y = 0
        let z = 0

        const dt = 0.0032
        const count = 12000

        for (let i = 0; i < count; i++) {
          const dx = 10 * (y - x)
          const dy = x * (28 - z) - y
          const dz = x * y - (8 / 3) * z

          x += dx * dt
          y += dy * dt
          z += dz * dt

          positions.push(x * 0.22, (z - 25) * 0.22, y * 0.22)

          color.setHSL(normalizeHue(0.52 + (i / count) * 0.45), 1, 0.58)
          colors.push(color.r, color.g, color.b)
        }

        addPoints(positions, colors, 0.03)

        update = (t) => {
          group.rotation.y = t * 0.1
          group.rotation.x = Math.sin(t * 0.04) * 0.08
        }

        break
      }

      case 'fibonacci': {
        camera.position.set(0, 0, 26)

        const positions: number[] = []
        const colors: number[] = []
        const count = 11000
        const golden = Math.PI * (3 - Math.sqrt(5))

        for (let i = 0; i < count; i++) {
          const r = Math.sqrt(i) * 0.11
          const theta = i * golden

          positions.push(
            r * Math.cos(theta),
            r * Math.sin(theta),
            i * 0.00035 - 2.2
          )

          color.setHSL(normalizeHue(0.7 + (i / count) * 0.55), 1, 0.6)
          colors.push(color.r, color.g, color.b)
        }

        addPoints(positions, colors, 0.026)

        update = (t) => {
          group.rotation.z = t * 0.06
          group.rotation.x = Math.sin(t * 0.02) * 0.04
        }

        break
      }

      case 'torus': {
        camera.position.set(0, 0, 26)

        const positions: number[] = []
        const colors: number[] = []
        const count = 11000
        const p = 2
        const q = 5

        for (let i = 0; i < count; i++) {
          const t = (i / count) * Math.PI * 2
          const radius = 5 + 1.8 * Math.cos(q * t)

          positions.push(
            radius * Math.cos(p * t),
            radius * Math.sin(p * t),
            1.8 * Math.sin(q * t) + 0.35 * Math.sin(12 * t)
          )

          color.setHSL(normalizeHue(t / (Math.PI * 2) + 0.08), 1, 0.63)
          colors.push(color.r, color.g, color.b)
        }

        addPoints(positions, colors, 0.032)

        update = (t) => {
          group.rotation.y = t * 0.14
          group.rotation.z = Math.sin(t * 0.05) * 0.1
        }

        break
      }
    }

    camera.lookAt(0, 0, 0)

    const animate = () => {
      frame = requestAnimationFrame(animate)
      time += 0.016
      if (update) update(time)
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', setSize)

      scene.traverse((object) => {
        const resource = object as unknown as {
          geometry?: THREE.BufferGeometry
          material?: THREE.Material | THREE.Material[]
        }

        if (resource.geometry) {
          resource.geometry.dispose()
        }

        if (resource.material) {
          if (Array.isArray(resource.material)) {
            resource.material.forEach((item) => item.dispose())
          } else {
            resource.material.dispose()
          }
        }
      })

      renderer.dispose()
    }
  }, [pattern])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 block h-full w-full"
    />
  )
}
