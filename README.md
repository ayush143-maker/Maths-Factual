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

## Configuration and data handling

The listed root files do not include a `.env.example` or `.env` file. Do not assume this project needs environment variables; check the relevant source and existing configuration before adding any. If local configuration is needed, keep real secrets out of tracked files and provide only a placeholder template when documenting required settings. Never put a secret in code or configuration that is delivered to the browser: browser-visible values are public, not secret.

Review changes to `next.config.mjs` and `tailwind.config.ts` before committing them, and avoid adding credentials or private data to tracked configuration or project content.

## Browser and platform reliability review checklist

This is a checklist for a future review, not a record of completed testing or verified results.

- Review the app in current desktop browsers relevant to your audience and on mobile browsers such as Safari on iOS and Chrome on Android where applicable. Identify the versions and devices you intend to support; no compatibility results are recorded here.
- Use browser developer tools while loading the page and trying its visible interactions. Inspect the console for runtime errors or WebGL warnings and the network panel for failed page, module, font, or other resource requests.
- Check the seahorse-inspired pattern and page at narrow mobile-sized and wide desktop-sized viewports. Look for clipping, unexpected scaling, or controls that are difficult to use. Where practical, compare with an actual mobile device.
- Inspect `app/`, `components/`, and `lib/` for local asset references and confirm that referenced files and imports resolve. Review `package.json`, source imports, and Next.js configuration for external font or script requests; check their status and whether the page remains usable if optional requests fail.
- After changing or moving assets, revisit the page and check the network panel and rendered result for broken paths. After changing the pattern, check that its selection, parameters, and appearance remain consistent.

## Manual review checklist

These are review steps, not verified results.

- Start the development server using the instructions above and review the initial page and seahorse-inspired pattern.
- Try interactions actually presented by the page or `PatternViewer`; do not assume controls that are not present.
- After pattern or layout changes, repeat the browser, network, and viewport checks above.

## Accessibility review checklist

These are future review checks, not verified accessibility results.

- Use Tab and Shift+Tab to check keyboard access, logical focus order, and visible focus indicators for controls actually presented by the page or `PatternViewer`.
- Review controls for meaningful accessible names. Check whether the visualisation needs a text description or is purely decorative.
- Check text, labels, and control boundaries for contrast against their backgrounds.
- If the visualisation moves or animates, check its behavior with the operating system's reduced-motion preference enabled.