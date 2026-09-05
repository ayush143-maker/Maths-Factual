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

    renderer.setClearColor('#000000')
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2('#000000', 0.004)

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 300)
    camera.position.set(0, 0, 28)

    const group = new THREE.Group()
    scene.add(group)

    let frame = 0
    let time = 0
    let update: ((t: number) => void) | undefined
    let createAnimation: ((t: number) => void) | undefined

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

    const addParticles = (
      positions: number[],
      colors: number[],
      alphas: number[],
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
      geometry.setAttribute(
        'alpha',
        new THREE.Float32BufferAttribute(alphas, 1)
      )

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: size * 100 },
        },
        vertexShader: `
          attribute float alpha;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float uTime;
          uniform float uSize;
          
          void main() {
            vColor = color;
            vAlpha = alpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = uSize * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
            gl_FragColor = vec4(vColor * 1.5, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
      })

      const points = new THREE.Points(geometry, material)
      group.add(points)

      return { geometry, material }
    }

    switch (pattern) {
      case 'mobius': {
        camera.position.set(0, 0, 22)

        const count = 15000
        const positions: number[] = new Array(count * 3).fill(0)
        const colors: number[] = new Array(count * 3).fill(0)
        const alphas: number[] = new Array(count).fill(0)

        const { geometry, material } = addParticles(
          positions,
          colors,
          alphas,
          0.035
        )

        const pos = geometry.attributes.position as THREE.BufferAttribute
        const col = geometry.attributes.color as THREE.BufferAttribute
        const alp = geometry.attributes.alpha as THREE.BufferAttribute

        createAnimation = (t) => {
          const progress = Math.min(t * 0.4, 1)
          const activeCount = Math.floor(count * progress)

          for (let i = 0; i < count; i++) {
            const idx = i * 3

            if (i < activeCount) {
              const u = (i / count) * Math.PI * 2
              const v = (Math.random() - 0.5) * 1.2

              const radius = 6
              const x = (radius + v * Math.cos(u / 2)) * Math.cos(u)
              const y = (radius + v * Math.cos(u / 2)) * Math.sin(u)
              const z = v * Math.sin(u / 2)

              pos.setXYZ(i, x, y, z)

              const hue = normalizeHue(u / (Math.PI * 2) + t * 0.05)
              color.setHSL(hue, 0.9, 0.55)
              col.setXYZ(i, color.r, color.g, color.b)

              alp.setX(i, 1)
            } else {
              pos.setXYZ(i, 0, 0, 0)
              alp.setX(i, 0)
            }
          }

          pos.needsUpdate = true
          col.needsUpdate = true
          alp.needsUpdate = true
        }

        update = (t) => {
          group.rotation.y = t * 0.15
          group.rotation.x = Math.sin(t * 0.08) * 0.3
          group.rotation.z = Math.cos(t * 0.06) * 0.2

          const posAttr = geometry.attributes.position as THREE.BufferAttribute
          const colAttr = geometry.attributes.color as THREE.BufferAttribute

          for (let i = 0; i < count; i++) {
            const x = posAttr.getX(i)
            const y = posAttr.getY(i)
            const z = posAttr.getZ(i)

            const u = Math.atan2(y, x)
            const hue = normalizeHue(u / (Math.PI * 2) + t * 0.05)
            const saturation = 0.85 + Math.sin(t * 2 + i * 0.001) * 0.15
            const lightness = 0.5 + Math.sin(t * 1.5 + i * 0.002) * 0.15

            color.setHSL(hue, saturation, lightness)
            colAttr.setXYZ(i, color.r, color.g, color.b)
          }

          colAttr.needsUpdate = true
        }

        break
      }

      case 'hopf': {
        camera.position.set(0, 0, 30)

        const count = 18000
        const positions: number[] = new Array(count * 3).fill(0)
        const colors: number[] = new Array(count * 3).fill(0)
        const alphas: number[] = new Array(count).fill(0)

        const { geometry, material } = addParticles(
          positions,
          colors,
          alphas,
          0.032
        )

        const pos = geometry.attributes.position as THREE.BufferAttribute
        const col = geometry.attributes.color as THREE.BufferAttribute
        const alp = geometry.attributes.alpha as THREE.BufferAttribute

        createAnimation = (t) => {
          const progress = Math.min(t * 0.35, 1)
          const activeCount = Math.floor(count * progress)

          for (let i = 0; i < count; i++) {
            const idx = i * 3

            if (i < activeCount) {
              const phi = (i / count) * Math.PI * 2
              const theta = Math.random() * Math.PI * 2
              const psi = Math.random() * Math.PI * 2

              const r = 5

              const x = r * (Math.cos(theta) + Math.cos(phi)) * Math.cos(psi)
              const y = r * (Math.cos(theta) + Math.cos(phi)) * Math.sin(psi)
              const z = r * Math.sin(theta) * Math.cos(phi + psi)

              pos.setXYZ(i, x * 0.4, y * 0.4, z * 0.4)

              const hue = normalizeHue(phi / (Math.PI * 2) + theta / (Math.PI * 4))
              color.setHSL(hue, 0.95, 0.6)
              col.setXYZ(i, color.r, color.g, color.b)

              alp.setX(i, 1)
            } else {
              pos.setXYZ(i, 0, 0, 0)
              alp.setX(i, 0)
            }
          }

          pos.needsUpdate = true
          col.needsUpdate = true
          alp.needsUpdate = true
        }

        update = (t) => {
          group.rotation.y = t * 0.12
          group.rotation.x = t * 0.08
          group.rotation.z = Math.sin(t * 0.05) * 0.3

          const posAttr = geometry.attributes.position as THREE.BufferAttribute
          const colAttr = geometry.attributes.color as THREE.BufferAttribute

          for (let i = 0; i < count; i++) {
            const phi = (i / count) * Math.PI * 2
            const hue = normalizeHue(phi / (Math.PI * 2) + t * 0.08)
            const saturation = 0.9 + Math.sin(t * 2.5 + i * 0.0008) * 0.1
            const lightness = 0.55 + Math.sin(t * 1.8 + i * 0.0012) * 0.15

            color.setHSL(hue, saturation, lightness)
            colAttr.setXYZ(i, color.r, color.g, color.b)
          }

          colAttr.needsUpdate = true
        }

        break
      }

      case 'attractor': {
        camera.position.set(0, 0, 40)

        const count = 20000
        const positions: number[] = new Array(count * 3).fill(0)
        const colors: number[] = new Array(count * 3).fill(0)
        const alphas: number[] = new Array(count).fill(0)

        const { geometry, material } = addParticles(
          positions,
          colors,
          alphas,
          0.03
        )

        const pos = geometry.attributes.position as THREE.BufferAttribute
        const col = geometry.attributes.color as THREE.BufferAttribute
        const alp = geometry.attributes.alpha as THREE.BufferAttribute

        let x = 1, y = 1, z = 1
        const dt = 0.018

        createAnimation = (t) => {
          const progress = Math.min(t * 0.5, 1)
          const activeCount = Math.floor(count * progress)

          for (let i = 0; i < count; i++) {
            if (i < activeCount) {
              const dx = Math.sin(y) - x * Math.cos(z)
              const dy = Math.sin(z) - y * Math.cos(x)
              const dz = Math.sin(x) - z * Math.cos(y)

              x += dx * dt
              y += dy * dt
              z += dz * dt

              pos.setXYZ(i, x * 2, y * 2, z * 2)

              const velocity = Math.sqrt(dx * dx + dy * dy + dz * dz)
              const hue = normalizeHue(0.55 + velocity * 0.8)
              color.setHSL(hue, 0.95, 0.6)
              col.setXYZ(i, color.r, color.g, color.b)

              alp.setX(i, 1)
            } else {
              pos.setXYZ(i, 0, 0, 0)
              alp.setX(i, 0)
            }
          }

          pos.needsUpdate = true
          col.needsUpdate = true
          alp.needsUpdate = true
        }

        update = (t) => {
          group.rotation.y = t * 0.1
          group.rotation.x = Math.sin(t * 0.04) * 0.2

          const posAttr = geometry.attributes.position as THREE.BufferAttribute
          const colAttr = geometry.attributes.color as THREE.BufferAttribute

          for (let i = 0; i < count; i++) {
            const px = posAttr.getX(i)
            const py = posAttr.getY(i)
            const pz = posAttr.getZ(i)

            const distance = Math.sqrt(px * px + py * py + pz * pz)
            const hue = normalizeHue(0.55 + distance * 0.03 + t * 0.06)
            const saturation = 0.9 + Math.sin(t * 2 + i * 0.0005) * 0.1
            const lightness = 0.5 + Math.sin(t * 1.5 + distance * 0.1) * 0.2

            color.setHSL(hue, saturation, lightness)
            colAttr.setXYZ(i, color.r, color.g, color.b)
          }

          colAttr.needsUpdate = true
        }

        break
      }

      case 'rose': {
        camera.position.set(0, 0, 24)

        const positions: number[] = []
        const colors: number[] = []
        const alphas: number[] = []
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
          alphas.push(1)
        }

        const { geometry } = addParticles(positions, colors, alphas, 0.026)

        update = (t) => {
          group.rotation.z = t * 0.07
          group.rotation.x = Math.sin(t * 0.03) * 0.05

          const posAttr = geometry.attributes.position as THREE.BufferAttribute
          const colAttr = geometry.attributes.color as THREE.BufferAttribute

          for (let i = 0; i < count; i++) {
            const theta = (i / count) * maxTheta
            const hue = normalizeHue(theta / maxTheta + 0.5 + t * 0.08)
            const saturation = 0.9 + Math.sin(t * 2 + i * 0.001) * 0.1
            const lightness = 0.55 + Math.sin(t * 1.8 + i * 0.0015) * 0.15

            color.setHSL(hue, saturation, lightness)
            colAttr.setXYZ(i, color.r, color.g, color.b)
          }

          colAttr.needsUpdate = true
        }

        break
      }

      case 'lorenz': {
        camera.position.set(0, 0, 34)

        const positions: number[] = []
        const colors: number[] = []
        const alphas: number[] = []

        let lx = 0.1, ly = 0, lz = 0

        const dt = 0.0032
        const count = 12000

        for (let i = 0; i < count; i++) {
          const dx = 10 * (ly - lx)
          const dy = lx * (28 - lz) - ly
          const dz = lx * ly - (8 / 3) * lz

          lx += dx * dt
          ly += dy * dt
          lz += dz * dt

          positions.push(lx * 0.22, (lz - 25) * 0.22, ly * 0.22)

          color.setHSL(normalizeHue(0.52 + (i / count) * 0.45), 1, 0.58)
          colors.push(color.r, color.g, color.b)
          alphas.push(1)
        }

        const { geometry } = addParticles(positions, colors, alphas, 0.03)

        update = (t) => {
          group.rotation.y = t * 0.1
          group.rotation.x = Math.sin(t * 0.04) * 0.08

          const posAttr = geometry.attributes.position as THREE.BufferAttribute
          const colAttr = geometry.attributes.color as THREE.BufferAttribute

          for (let i = 0; i < count; i++) {
            const px = posAttr.getX(i)
            const pz = posAttr.getZ(i)
            const hue = normalizeHue(0.52 + (i / count) * 0.45 + t * 0.05)
            const saturation = 0.85 + Math.sin(t * 2.2 + i * 0.0008) * 0.15
            const lightness = 0.5 + Math.sin(t * 1.7 + Math.abs(px + pz) * 0.1) * 0.2

            color.setHSL(hue, saturation, lightness)
            colAttr.setXYZ(i, color.r, color.g, color.b)
          }

          colAttr.needsUpdate = true
        }

        break
      }

      case 'fibonacci': {
        camera.position.set(0, 0, 26)

        const positions: number[] = []
        const colors: number[] = []
        const alphas: number[] = []
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
          alphas.push(1)
        }

        const { geometry } = addParticles(positions, colors, alphas, 0.026)

        update = (t) => {
          group.rotation.z = t * 0.06
          group.rotation.x = Math.sin(t * 0.02) * 0.04

          const posAttr = geometry.attributes.position as THREE.BufferAttribute
          const colAttr = geometry.attributes.color as THREE.BufferAttribute

          for (let i = 0; i < count; i++) {
            const hue = normalizeHue(0.7 + (i / count) * 0.55 + t * 0.04)
            const saturation = 0.9 + Math.sin(t * 2.5 + i * 0.0009) * 0.1
            const lightness = 0.55 + Math.sin(t * 1.9 + i * 0.0013) * 0.15

            color.setHSL(hue, saturation, lightness)
            colAttr.setXYZ(i, color.r, color.g, color.b)
          }

          colAttr.needsUpdate = true
        }

        break
      }

      case 'torus': {
        camera.position.set(0, 0, 26)

        const positions: number[] = []
        const colors: number[] = []
        const alphas: number[] = []
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
          alphas.push(1)
        }

        const { geometry } = addParticles(positions, colors, alphas, 0.032)

        update = (t) => {
          group.rotation.y = t * 0.14
          group.rotation.z = Math.sin(t * 0.05) * 0.1

          const posAttr = geometry.attributes.position as THREE.BufferAttribute
          const colAttr = geometry.attributes.color as THREE.BufferAttribute

          for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2
            const hue = normalizeHue(t / (Math.PI * 2) + 0.08 + t * 0.07)
            const saturation = 0.95 + Math.sin(t * 2.3 + i * 0.0007) * 0.05
            const lightness = 0.6 + Math.sin(t * 1.6 + i * 0.0011) * 0.15

            color.setHSL(hue, saturation, lightness)
            colAttr.setXYZ(i, color.r, color.g, color.b)
          }

          colAttr.needsUpdate = true
        }

        break
      }
    }

    camera.lookAt(0, 0, 0)

    const startTime = performance.now()

    const animate = () => {
      frame = requestAnimationFrame(animate)
      time += 0.016

      if (createAnimation && time < 3) {
        createAnimation(time)
      }

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
