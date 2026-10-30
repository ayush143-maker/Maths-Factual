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

## Project structure

The Next.js page is in `app/`, reusable components are in `components/`, and supporting logic is in `lib/`. When extending the project, preserve the relationship between the selected pattern, its parameters, and the rendered scene. The root `package.json` and Next.js and TypeScript configuration files describe the project setup.