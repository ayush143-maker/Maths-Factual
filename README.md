# Maths-Factual

A mathematical-pattern visualiser built with Next.js, React, and Three.js. It opens with a seahorse-inspired pattern rendered by the shared `PatternViewer` component.

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

## Project structure and customization

The Next.js page is in `app/`, reusable components are in `components/`, and supporting logic is in `lib/`. For visible page text or composition, begin with the relevant page in `app/`; for the seahorse-inspired rendering, begin with `PatternViewer` in `components/` and follow any supporting logic in `lib/`.

When changing the pattern, keep its selection, parameters, and rendered scene consistent. The root includes `tailwind.config.ts` and `next.config.mjs`; review their existing contents before changing styling or framework settings. If you move or rename files, update imports and preserve valid relative paths. The root `package.json` and TypeScript configuration describe project setup.