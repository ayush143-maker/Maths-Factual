# Maths-Factual

Maths-Factual is a mathematical-pattern visualiser built with Next.js, React, and Three.js. Its initial seahorse-inspired pattern is rendered by the shared `PatternViewer` component. The configuration defines four options: Seahorse Valley, Julia Spiral, Morphing Julia, and Newton Flow.

## Run locally

From the project folder, install dependencies and start the development server:

```sh
npm install
npm run dev
```

Open the local URL printed by the server. To create a production build, run:

```sh
npm run build
```

## Project structure and rendering

- `app/` — Next.js pages and page composition.
- `components/` — reusable components, including `PatternViewer`.
- `lib/` — supporting application logic.
- `package.json` — dependencies and declared scripts.
- `next.config.mjs` and `tailwind.config.ts` — framework and styling configuration.

Start with the relevant file in `app/` to change visible text or page composition. For the seahorse-inspired rendering, inspect `PatternViewer` in `components/` and follow the supporting logic in `lib/`.

The pattern configuration supplies shader mode and visual parameters including coordinates, scale, zoom, rotation, iterations, and palette. `PatternViewer` renders a full-screen shader canvas. One shader mode implements escape-time Mandelbrot/Julia-style rendering; the other uses Newton iteration for a cubic equation. The viewer animates zoom, rotation, color time, and fade. Its time advances by a fixed `0.016` per frame, while zoom cycles over a 100-second period.

A pattern prop change rebuilds the viewer with that pattern’s configuration. An unrecognized pattern ID falls back to the first configured pattern. The effect cleans up its animation frame, resize listener, geometry, material, and renderer. The configuration contains an `abs` field, but the shown viewer does not pass or use it in its shader. The supplied files show no pattern-selection controls, persistence, or external provider calls.

## Changing the pattern

Keep the pattern configuration and rendered scene consistent when making changes. Review the relevant page and component together, and check the resulting visualization in the browser. When moving or renaming files, update affected imports and preserve valid relative paths.

Review the existing Next.js, Tailwind, TypeScript, and package configuration before changing project settings. The documented commands support local development and a production build. No hosting provider or deployment configuration is specified, and the build command does not identify a separate publishing output directory.