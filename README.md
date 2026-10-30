# Maths-Factual

An interactive mathematical-pattern visualiser built with Next.js, React, and Three.js. It opens with a seahorse-inspired pattern rendered through the shared `PatternViewer` component.

## Run locally

Install dependencies and start the development server:

    npm install
    npm run dev

Build the production version with:

    npm run build

## Working with the patterns

The Next.js page lives under `app/`, reusable interface pieces under `components/`, and supporting logic under `lib/`. Preserve the relationship between the selected pattern, its parameters, and the rendered scene when extending the project.