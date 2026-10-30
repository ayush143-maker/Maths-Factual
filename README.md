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

The Next.js page is in `app/`, reusable components are in `components/`, and supporting logic is in `lib/`. For visible page text or composition, begin with the relevant page in `app/`; for the seahorse-inspired rendering, begin with `PatternViewer` in `components/` and follow supporting logic in `lib/`.

When changing the pattern, keep its selection, parameters, and rendered scene consistent. The root includes `tailwind.config.ts` and `next.config.mjs`; review their existing contents before changing styling or framework settings. If you move or rename files, update imports and preserve valid relative paths. The root `package.json` and TypeScript configuration describe project setup.

## Troubleshooting

Use these as diagnostic checks; they do not indicate known problems.

1. Confirm you are running the project from its root and opening the local URL printed by the development server. For page composition, check the relevant file in `app/`.
2. If a module or asset fails to load, check the import or relative path in `app/`, `components/`, or `lib/`, and confirm the referenced local file exists.
3. Inspect the browser console for runtime or WebGL errors and the network panel for failed page, module, or resource requests.
4. Check source imports and Next.js configuration to identify external resources. A failed external request is network-dependent; it is distinct from a missing local file or broken import.
5. After pattern changes, check that its selection, parameters, and rendered appearance still agree.

## Configuration and data handling

The listed root files do not include a `.env.example` or `.env` file. Do not assume this project needs environment variables; check the relevant source and existing configuration before adding any. If local configuration is needed, keep real secrets out of tracked files. Never put a secret in code or configuration delivered to the browser: browser-visible values are public, not secret.

Review changes to `next.config.mjs` and `tailwind.config.ts` before committing them, and avoid adding credentials or private data to tracked configuration or project content.

## Review checklist

These are review steps, not verified test results.

- Review the seahorse-inspired pattern at narrow and wide viewport sizes and try interactions actually presented by the page or `PatternViewer`.
- After changing assets or layout, repeat the path, console, and network checks above.

## Accessibility review checklist

These are future review checks, not verified accessibility results.

- Use Tab and Shift+Tab to check keyboard access, focus order, and visible focus indicators for controls actually presented by the page or `PatternViewer`.
- Review controls for meaningful accessible names and consider whether the visualisation needs a text description or is decorative.
- Check text, labels, and control boundaries for contrast against their backgrounds.
- If the visualisation moves or animates, check behavior with the operating system’s reduced-motion preference enabled.