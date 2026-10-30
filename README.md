# Maths-Factual

An interactive mathematical-pattern visualiser built with Next.js, React, and Three.js. It opens with a seahorse-inspired pattern rendered through the shared `PatternViewer`, which presents the visualisation for visitors to explore. Specific interaction controls are not described here.

## Run locally

From the project folder, install dependencies and start the development server:

    npm install
    npm run dev

Open the local URL printed by the server in your browser. To build the production version, run:

    npm run build

## Working with the patterns

The Next.js page is under `app/`, reusable interface pieces are under `components/`, and supporting logic is under `lib/`. Preserve the relationship between the selected pattern, its parameters, and the rendered scene when extending the project. The root also contains `package.json` and Next.js and TypeScript configuration files.