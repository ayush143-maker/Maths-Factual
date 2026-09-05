export type PatternId =
  | 'seahorse'
  | 'julia-spiral'
  | 'julia-morph'
  | 'newton'

export type FractalConfig = {
  id: PatternId
  label: string
  mode: number
  julia: number
  animJulia: number
  abs: number
  conj: number
  power: number
  center: [number, number]
  c: [number, number]
  scale: number
  zoomMax: number
  rot: number
  iter: number
  extra: number
  pal: [number[], number[], number[], number[]]
}

export const patterns: FractalConfig[] = [
  {
    id: 'seahorse',
    label: 'Seahorse Valley',
    mode: 0, julia: 0, animJulia: 0, abs: 0, conj: 0, power: 2,
    center: [-0.743643887, 0.1318259042],
    c: [0, 0],
    scale: 1.2, zoomMax: 4000, rot: 0.02,
    iter: 260, extra: 640,
    pal: [
      [0.5, 0.5, 0.5], [0.5, 0.5, 0.5],
      [1, 1, 1], [0, 0.33, 0.67],
    ],
  },
  {
    id: 'julia-spiral',
    label: 'Julia Spiral',
    mode: 0, julia: 1, animJulia: 0, abs: 0, conj: 0, power: 2,
    center: [0, 0],
    c: [-0.7269, 0.1889],
    scale: 3.2, zoomMax: 2000, rot: 0.02,
    iter: 280, extra: 420,
    pal: [
      [0.1, 0.3, 0.55], [0.35, 0.35, 0.35],
      [1, 1, 1], [0, 0.1, 0.2],
    ],
  },
  {
    id: 'julia-morph',
    label: 'Morphing Julia',
    mode: 0, julia: 1, animJulia: 1, abs: 0, conj: 0, power: 2,
    center: [0, 0],
    c: [0.7885, 0],
    scale: 3.0, zoomMax: 6, rot: 0.02,
    iter: 220, extra: 60,
    pal: [
      [0.55, 0.45, 0.55], [0.45, 0.4, 0.5],
      [1, 0.8, 0.6], [0, 0.2, 0.4],
    ],
  },
  {
    id: 'newton',
    label: 'Newton Flow',
    mode: 1, julia: 0, animJulia: 0, abs: 0, conj: 0, power: 2,
    center: [0, 0],
    c: [0, 0],
    scale: 3.6, zoomMax: 5, rot: 0.08,
    iter: 64, extra: 0,
    pal: [
      [0.5, 0.5, 0.5], [0.5, 0.5, 0.5],
      [1, 1, 1], [0, 0.33, 0.67],
    ],
  },
]
