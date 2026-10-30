# Maths-Factual

Maths-Factual is an interactive mathematical-pattern visualiser built with **Next.js, React, and Three.js**. It shares the same general viewing approach as the other Maths pattern experiments, while opening with a seahorse-inspired pattern in the shared PatternViewer.

## Run locally

Install dependencies and start the development server:

    npm install
    npm run dev

Build the production version with:

    npm run build

## Working with the patterns

The Next.js page lives under app/, reusable interface pieces live in components/, and supporting logic is kept in lib/. The PatternViewer component is the natural starting point for changes to the visualisation. Preserve the relationship between the selected pattern, its parameters, and the rendered scene when extending the project.
