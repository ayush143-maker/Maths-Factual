export type PatternId =
  | 'mobius'
  | 'hopf'
  | 'attractor'
  | 'rose'
  | 'lorenz'
  | 'fibonacci'
  | 'torus'

export const patterns: { id: PatternId; label: string }[] = [
  { id: 'mobius', label: 'Möbius' },
  { id: 'hopf', label: 'Hopf Fibration' },
  { id: 'attractor', label: 'Strange Attractor' },
  { id: 'rose', label: 'Rose' },
  { id: 'lorenz', label: 'Lorenz' },
  { id: 'fibonacci', label: 'Fibonacci' },
  { id: 'torus', label: 'Torus' },
]
