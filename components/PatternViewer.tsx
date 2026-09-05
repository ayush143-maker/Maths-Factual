'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { patterns, type PatternId } from '@/lib/patterns'

const ZOOM_IN_SECONDS = 50
const ZOOM_PERIOD = ZOOM_IN_SECONDS * 2

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uCenter;
  uniform float uScale;
  uniform float uIter;
  uniform float uMode;
  uniform float uJulia;
  uniform float uAnimJulia;
  uniform float uConj;
  uniform float uPower;
  uniform vec2 uC;
  uniform float uRot;
  uniform float uFade;
  uniform vec3 uPalA;
  uniform vec3 uPalB;
  uniform vec3 uPalC;
  uniform vec3 uPalD;

  vec3 pal(float t) {
    return uPalA + uPalB * cos(6.28318 * (uPalC * t + uPalD));
  }

  vec2 cmul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }

  vec2 cdiv(vec2 a, vec2 b) {
    float d = dot(b, b);
    return cmul(a, vec2(b.x, -b.y)) / d;
  }

  void main() {
    vec2 uv = (vUv - 0.5) * vec2(uAspect, 1.0);
    float cr = cos(uRot);
    float sr = sin(uRot);
    uv = mat2(cr, -sr, sr, cr) * uv;
    vec2 coord = uCenter + uv * uScale;

    vec3 col = vec3(0.0);

    if (uMode < 0.5) {
      vec2 jc = uC;
      if (uAnimJulia > 0.5) {
        float a = uTime * 0.15;
        jc = 0.7885 * vec2(cos(a), sin(a));
      }

      vec2 z = uJulia > 0.5 ? coord : vec2(0.0);
      vec2 c = uJulia > 0.5 ? jc : coord;

      float sm = -1.0;

      for (int k = 0; k < 900; k++) {
        if (k >= int(uIter)) break;
        if (uConj > 0.5) z.y = -z.y;
        if (uPower > 2.5) {
          z = cmul(cmul(z, z), z) + c;
        } else {
          z = cmul(z, z) + c;
        }
        float r2 = dot(z, z);
        if (r2 > 16.0) {
          sm = float(k) + 1.0 - log2(max(1.0, log2(r2) * 0.5));
          break;
        }
      }

      if (sm >= 0.0) {
        float t = sm * 0.015 + uTime * 0.03;
        col = pal(t);
        col *= 0.85 + 0.15 * sin(sm * 0.35);
      }
    } else {
      vec2 z = coord;
      float sm = 0.0;
      float root = 0.0;

      for (int k = 0; k < 64; k++) {
        vec2 z2 = cmul(z, z);
        vec2 z3 = cmul(z2, z);
        vec2 f = z3 - vec2(1.0, 0.0);
        vec2 df = 3.0 * z2;
        if (dot(df, df) < 1e-9) break;
        z = z - cdiv(f, df);
        sm = float(k);
        if (distance(z, vec2(1.0, 0.0)) < 0.001) { root = 0.0; break; }
        if (distance(z, vec2(-0.5, 0.8660254)) < 0.001) { root = 1.0; break; }
        if (distance(z, vec2(-0.5, -0.8660254)) < 0.001) { root = 2.0; break; }
      }

      float t = root * 0.33 + sm * 0.03 + uTime * 0.02;
      col = pal(t);
      col *= 0.35 + 0.65 * clamp(sm / 24.0, 0.0, 1.0);
    }

    gl_FragColor = vec4(col * uFade, 1.0);
  }
`

export default function PatternViewer({
  pattern,
}: {
  pattern: PatternId
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const cfg = patterns.find((p) => p.id === pattern) ?? patterns[0]

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor('#000000')
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const uniforms = {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uCenter: { value: new THREE.Vector2(...cfg.center) },
      uScale: { value: cfg.scale },
      uIter: { value: cfg.iter },
      uMode: { value: cfg.mode },
      uJulia: { value: cfg.julia },
      uAnimJulia: { value: cfg.animJulia },
      uConj: { value: cfg.conj },
      uPower: { value: cfg.power },
      uC: { value: new THREE.Vector2(...cfg.c) },
      uRot: { value: 0 },
      uFade: { value: 0 },
      uPalA: { value: new THREE.Vector3(...cfg.pal[0]) },
      uPalB: { value: new THREE.Vector3(...cfg.pal[1]) },
      uPalC: { value: new THREE.Vector3(...cfg.pal[2]) },
      uPalD: { value: new THREE.Vector3(...cfg.pal[3]) },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const setSize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      renderer.setSize(width, height, false)
      uniforms.uAspect.value = width / height
    }

    setSize()
    window.addEventListener('resize', setSize)

    let frame = 0
    let time = 0

    const animate = () => {
      frame = requestAnimationFrame(animate)
      time += 0.016

      const phase =
        (1 - Math.cos((2 * Math.PI * time) / ZOOM_PERIOD)) / 2
      const zoom = Math.pow(cfg.zoomMax, phase)

      uniforms.uTime.value = time
      uniforms.uScale.value = cfg.scale / zoom
      uniforms.uIter.value = cfg.iter + phase * cfg.extra
      uniforms.uRot.value = time * cfg.rot
      uniforms.uFade.value = Math.min(1, time * 1.2)

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
