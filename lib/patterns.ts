export type PatternId =
  | 'mobius'
  | 'hopf'
  | 'butterfly'
  | 'rose'
  | 'lorenz'
  | 'fibonacci'
  | 'torus'

export const patterns: { id: PatternId; label: string }[] = [
  { id: 'mobius', label: 'Möbius' },
  { id: 'hopf', label: 'Hopf Fibration' },
  { id: 'butterfly', label: 'Butterfly' },
  { id: 'rose', label: 'Rose' },
  { id: 'lorenz', label: 'Lorenz' },
  { id: 'fibonacci', label: 'Fibonacci' },
  { id: 'torus', label: 'Torus' },
]
