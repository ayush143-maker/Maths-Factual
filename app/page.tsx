'use client'

import { useState } from 'react'
import PatternViewer from '@/components/PatternViewer'
import { patterns, type PatternId } from '@/lib/patterns'

export default function Home() {
  const [pattern, setPattern] = useState<PatternId>('mobius')

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white">
      <PatternViewer pattern={pattern} />

      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-6">
        <div>
          <h1 className="text-sm font-semibold uppercase tracking-[0.4em] text-white/90 md:text-base">
            Mathematical Patterns
          </h1>
          <p className="mt-1 text-xs text-white/40">Infinite loops in motion</p>
        </div>

        <div className="pointer-events-auto flex flex-wrap gap-2">
          {patterns.map((item) => (
            <button
              key={item.id}
              onClick={() => setPattern(item.id)}
              className={`rounded-full border px-4 py-2 text-xs transition ${
                pattern === item.id
                  ? 'border-white bg-white text-black'
                  : 'border-white/20 bg-black/30 text-white/70 hover:border-white/60 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
