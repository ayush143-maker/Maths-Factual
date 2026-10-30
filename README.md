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

## Asset and loading review checklist

This is a checklist of actions to perform, not a record of verified results.

- Inspect `app/`, `components/`, and `lib/` for local image, audio, font, or other media references. Check that each referenced file exists at the expected path and loads where used.
- Look for media files that are no longer referenced and remove only those confirmed to be unused. Size used media for its rendered role; avoid keeping unnecessarily large originals or duplicate variants.
- Review `package.json`, source imports, and the Next.js configuration for external font or script dependencies. Keep external requests only when intentional, and check that the page remains usable if an optional request is unavailable.
- After changing or moving assets, revisit the page and check that imports and relative paths still resolve.

## Manual review checklist

This is a checklist of actions to perform, not a record of verified results.

- Start the development server using the instructions above and open the local URL it prints. Review the app's initial page and its seahorse-inspired pattern.
- Try any interactions actually presented by the page or `PatternViewer`. Observe the effect on the pattern; do not assume controls that are not present.
- Inspect the rendered pattern and page at a narrow mobile-sized viewport and a wide desktop-sized viewport. Check that the visualisation and any visible controls fit and remain usable.
- After changing the pattern, review the rendered scene and check that its selection, parameters, and appearance remain consistent. If files were moved or renamed, check the affected imports and paths.

## Accessibility review checklist

These are future review checks, not verified accessibility results.

- Use Tab and Shift+Tab to check whether all controls actually presented by the page or `PatternViewer` can be reached and operated from the keyboard. Check that focus order is logical and that no interaction depends only on a pointer.
- Check that keyboard focus is clearly visible on each focused control and is not hidden by the rendered pattern or other content.
- Review visible controls for meaningful accessible names. Check whether the seahorse-inspired visualisation has an appropriate text description if it communicates information beyond its appearance, and whether purely decorative visual content is identified as such.
- Check text, labels, and control boundaries against their backgrounds for sufficient contrast in the rendered page; consider text placed over or near the pattern.
- If the visualisation moves or animates, check its behavior with the operating system's reduced-motion preference enabled and review whether the page remains usable with motion reduced.