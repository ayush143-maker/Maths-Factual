'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { PatternId } from '@/lib/patterns'

const CREATE_DURATION = 1.4
const CREATE_STAGGER = 1.2

const fract = (v: number) => v - Math.floor(v)
const rnd = (i: number, salt: number) =>
  fract(Math.sin(i * 127.1 + salt * 311.7) * 43758.5453)

type Built = {
  targets: number[]
  hues: number[]
  camera: [number, number, number]
  tilt: number
  spin: number
}

function build(pattern: PatternId): Built {
  const targets: number[] = []
  const hues: number[] = []
  let camera: [number, number, number] = [0, 0, 24]
  let tilt = 0
  let spin = 0.15

  const push = (x: number, y: number, z: number, h: number) => {
    targets.push(x, y, z)
    hues.push(h)
  }

  if (pattern === 'mobius') {
    camera = [0, 7, 17]
    tilt = 0.9
    spin = 0.25
    const count = 14000
    for (let i = 0; i < count; i++) {
      const u = (i / count) * Math.PI * 2
      const v = (rnd(i, 1) - 0.5) * 2.8
      const R = 6.5
      const w = R + v * Math.cos(u / 2)
      push(
        w * Math.cos(u),
        w * Math.sin(u),
        v * Math.sin(u / 2),
        u / (Math.PI * 2)
      )
    }
  } else if (pattern === 'hopf') {
    camera = [0, 0, 26]
    spin = 0.14
    const fibers = 52
    const per = 240
    for (let f = 0; f < fibers; f++) {
      const theta = Math.acos(1 - (2 * (f + 0.5)) / fibers)
      const phi = f * 2.399963229728653
      const c1 = Math.cos(theta / 2)
      const s1 = Math.sin(theta / 2)
      for (let j = 0; j < per; j++) {
        const eta = (j / per) * Math.PI * 2
        const x1 = c1 * Math.cos(phi + eta)
        const x2 = c1 * Math.sin(phi + eta)
        const x3 = s1 * Math.cos(eta)
        const x4 = s1 * Math.sin(eta)
        const d = 1 - x4
        if (d < 0.3) continue
        push((x1 / d) * 4.6, (x2 / d) * 4.6, (x3 / d) * 4.6, f / fibers)
      }
    }
  } else if (pattern === 'attractor') {
    camera = [0, 0, 24]
    spin = 0.18
    const count = 16000
    const b = 0.208186
    const dt = 0.03
    let x = 0.5
    let y = 0.5
    let z = 0.5
    for (let i = 0; i < 300; i++) {
      const dx = Math.sin(y) - b * x
      const dy = Math.sin(z) - b * y
      const dz = Math.sin(x) - b * z
      x += dx * dt
      y += dy * dt
      z += dz * dt
    }
    for (let i = 0; i < count; i++) {
      const dx = Math.sin(y) - b * x
      const dy = Math.sin(z) - b * y
      const dz = Math.sin(x) - b * z
      x += dx * dt
      y += dy * dt
      z += dz * dt
      const speed = Math.sqrt(dx * dx + dy * dy + dz * dz)
      push(x * 1.8, y * 1.8, z * 1.8, 0.5 + Math.min(speed, 2) * 0.16)
    }
  } else if (pattern === 'rose') {
    camera = [0, 0, 21]
    tilt = 0.35
    spin = 0.12
    const count = 11000
    const maxTheta = Math.PI * 24
    const k = 7 / 3
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * maxTheta
      const r = 7 * Math.cos(k * theta) + (rnd(i, 2) - 0.5) * 0.08
      push(
        r * Math.cos(theta),
        r * Math.sin(theta),
        (theta - maxTheta / 2) * 0.01,
        theta / maxTheta
      )
    }
  } else if (pattern === 'lorenz') {
    camera = [0, 0, 30]
    spin = 0.12
    const count = 11000
    const dt = 0.0035
    let x = 0.1
    let y = 0
    let z = 0
    for (let i = 0; i < count; i++) {
      const dx = 10 * (y - x)
      const dy = x * (28 - z) - y
      const dz = x * y - (8 / 3) * z
      x += dx * dt
      y += dy * dt
      z += dz * dt
      push(x * 0.24, (z - 25) * 0.24, y * 0.24, 0.55 + (i / count) * 0.45)
    }
  } else if (pattern === 'fibonacci') {
    camera = [0, 0, 24]
    tilt = 0.25
    spin = 0.1
    const count = 10000
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(i) * 0.115
      const theta = i * golden
      push(
        r * Math.cos(theta),
        r * Math.sin(theta),
        (rnd(i, 3) - 0.5) * 0.6,
        0.68 + (i / count) * 0.6
      )
    }
  } else {
    camera = [0, 0, 21]
    spin = 0.2
    const count = 11000
    const p = 2
    const q = 5
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2
      const radius = 5 + 1.9 * Math.cos(q * t)
      push(
        radius * Math.cos(p * t),
        radius * Math.sin(p * t),
        1.9 * Math.sin(q * t) + 0.4 * Math.sin(11 * t),
        t / (Math.PI * 2)
      )
    }
  }

  return { targets, hues, camera, tilt, spin }
}

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

    renderer.setClearColor('#020208')
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 400)

    const group = new THREE.Group()
    scene.add(group)

    const built = build(pattern)
    const count = built.targets.length / 3

    camera.position.set(...built.camera)
    camera.lookAt(0, 0, 0)
    group.rotation.x = built.tilt

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const alphas = new Float32Array(count)
    const sizes = new Float32Array(count)
    const seeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      seeds[i] = rnd(i, 7)
      sizes[i] = 0.5 + rnd(i, 9) * 1.1
    }

    const geometry = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(positions, 3)
    const colAttr = new THREE.BufferAttribute(colors, 3)
    const alphaAttr = new THREE.BufferAttribute(alphas, 1)
    const sizeAttr = new THREE.BufferAttribute(sizes, 1)

    geometry.setAttribute('position', posAttr)
    geometry.setAttribute('color', colAttr)
    geometry.setAttribute('aAlpha', alphaAttr)
    geometry.setAttribute('aSize', sizeAttr)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uIntensity: { value: 0.6 },
      },
      vertexShader: `
        attribute float aAlpha;
        attribute float aSize;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vAlpha = aAlpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (70.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float uIntensity;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float fall = smoothstep(0.5, 0.05, d);
          gl_FragColor = vec4(vColor, fall * vAlpha * uIntensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    })

    const points = new THREE.Points(geometry, material)
    group.add(points)

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

    let frame = 0
    let time = 0

    const animate = () => {
      frame = requestAnimationFrame(animate)
      time += 0.016

      group.rotation.y = time * built.spin
      group.scale.setScalar(1 + Math.sin(time * 0.6) * 0.02)

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const seed = seeds[i]
        const tx = built.targets[i3]
        const ty = built.targets[i3 + 1]
        const tz = built.targets[i3 + 2]

        const p = (time - seed * CREATE_STAGGER) / CREATE_DURATION

        if (p < 1) {
          const e = p <= 0 ? 0 : 1 - Math.pow(1 - p, 3)
          const ang = (1 - e) * 2.5
          const c = Math.cos(ang)
          const s = Math.sin(ang)
          positions[i3] = (tx * c - tz * s) * e
          positions[i3 + 1] = ty * e
          positions[i3 + 2] = (tx * s + tz * c) * e
          alphas[i] = e
        } else {
          const w = Math.sin(time * 1.4 + seed * 6.28318) * 0.05
          positions[i3] = tx + w
          positions[i3 + 1] = ty + Math.cos(time * 1.2 + seed * 6.28318) * 0.05
          positions[i3 + 2] = tz + w
          alphas[i] = 1
        }

        const hue = built.hues[i] + time * 0.03
        const light = 0.52 + Math.sin(time * 1.8 + seed * 6.28318) * 0.12
        color.setHSL(hue, 1, light)
        colors[i3] = color.r
        colors[i3 + 1] = color.g
        colors[i3 + 2] = color.b
      }

      posAttr.needsUpdate = true
      colAttr.needsUpdate = true
      alphaAttr.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', setSize)
      geometry.dispose()
      material.dispose()
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
