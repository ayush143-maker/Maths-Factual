# Maths-Factual

Maths-Factual is a mathematical-pattern visualiser built with Next.js, React, and Three.js. Its initial seahorse-inspired pattern is rendered by the shared `PatternViewer` component.

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

## Project structure

- `app/` — Next.js pages and page composition.
- `components/` — reusable components, including `PatternViewer`.
- `lib/` — supporting application logic.
- `package.json` — dependencies and declared scripts.
- `next.config.mjs` and `tailwind.config.ts` — framework and styling configuration.

Start with the relevant file in `app/` to change visible text or page composition. For the seahorse-inspired rendering, inspect `PatternViewer` in `components/` and follow the supporting logic in `lib/`.

## Changing the pattern

Keep the pattern selection, its parameters, and the rendered scene consistent when making changes. Review the relevant page and component together, and check the resulting visualization in the browser. When moving or renaming files, update affected imports and preserve valid relative paths.

Review the existing Next.js, Tailwind, TypeScript, and package configuration before changing project settings. The documented commands support local development and a production build. No hosting provider or deployment configuration is specified, and the build command does not identify a separate publishing output directory.