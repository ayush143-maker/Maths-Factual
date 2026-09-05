export type PatternId =
  | 'helix'
  | 'wave'
  | 'lissajous'
  | 'rose'
  | 'lorenz'
  | 'fibonacci'
  | 'torus'

export const patterns: { id: PatternId; label: string }[] = [
  { id: 'helix', label: 'Helix' },
  { id: 'wave', label: 'Wave' },
  { id: 'lissajous', label: 'Lissajous' },
  { id: 'rose', label: 'Rose' },
  { id: 'lorenz', label: 'Lorenz' },
  { id: 'fibonacci', label: 'Fibonacci' },
  { id: 'torus', label: 'Torus' },
]
