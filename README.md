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

The Next.js page is in `app/`, reusable components are in `components/`, and supporting logic is in `lib/`. For visible text or page composition, start with the relevant page in `app/`; for the seahorse-inspired rendering, start with `PatternViewer` in `components/` and follow supporting logic in `lib/`.

When changing the pattern, keep its selection, parameters, and rendered scene consistent. The root includes `tailwind.config.ts` and `next.config.mjs`; review their existing contents before changing styling or framework settings. The root `package.json` and TypeScript configuration describe project setup. If you move or rename files, update imports and preserve valid relative paths.

## Deployment-readiness checklist

The checks below are recommendations, not verified deployment results. The repository information here does not specify a publishing provider, a deployment, or a configured output directory.

### Confirm the project root and published output

- [ ] Run the publishing workflow from the project root—the directory containing `package.json`, `next.config.mjs`, and `app/`—unless that workflow explicitly requires another working directory.
- [ ] Check the existing Next.js configuration and the publishing workflow you choose to determine which build output it expects. Do not assume that the repository root, `app/`, or a particular generated directory is the published output.
- [ ] Confirm that the workflow uses the expected build process and publishes the output it produces. The documented local production-build command is `npm run build`; that command alone does not identify what a separate publishing workflow should publish.
- [ ] If the publishing workflow has an output-directory setting, verify it against the framework configuration and the actual build result before publishing. Do not guess a directory name.

### Check asset and route paths

- [ ] Review asset references used by the page, `components/`, and `lib/`. Confirm each referenced local file exists and that its path is correct from the code that uses it.
- [ ] Check that relative references still resolve after any files or folders are moved or renamed; update imports and asset references affected by those changes.
- [ ] Review asset and navigation URLs for assumptions about the site being served from the domain root. If the chosen publishing setup serves the site under a path prefix, verify those URLs and page routes in that context.
- [ ] After publishing, check the browser network panel for failed page, module, or resource requests. Distinguish missing local files or broken paths from requests that fail because of external network access.

### Review configuration and sensitive data

- [ ] Review `next.config.mjs`, `tailwind.config.ts`, and any relevant project configuration for settings that affect the build or served paths.
- [ ] The listed root files do not include a `.env.example` or `.env` file. Do not assume environment variables are required; inspect the relevant source and existing configuration before adding any.
- [ ] Keep real secrets out of tracked files. Never put secrets in code or configuration delivered to the browser: browser-visible values are public, not secret.
- [ ] Before publishing, check changes to configuration and project content for credentials or private data.

### Preview after publishing

- [ ] After the publishing workflow completes, open the resulting preview or published URL supplied by that workflow. Do not treat a successful local build as a substitute for reviewing the published result.
- [ ] Check the page at narrow and wide viewport sizes. Confirm the seahorse-inspired pattern renders and that any controls or interactions actually presented by the page work as expected.
- [ ] Review the browser console and network panel for runtime errors, WebGL errors, and failed page, module, or resource requests.
- [ ] If a published issue appears, compare the served paths and configuration with the project files, make a correction, and review the newly published result again.

## Troubleshooting

These are diagnostic checks, not reports of known problems.

1. Confirm you are running the project from its root and opening the local URL printed by the development server. For page composition, check the relevant file in `app/`.
2. If a module or asset fails to load, check its import or relative path in `app/`, `components/`, or `lib/`, and confirm the referenced local file exists.
3. Inspect the browser console for runtime or WebGL errors and the network panel for failed page, module, or resource requests.
4. Check source imports and Next.js configuration to identify external resources. A failed external request is network-dependent and differs from a missing local file or broken import.
5. After pattern changes, check that the selection, parameters, and rendered appearance still agree.

## Contributor handoff

Keep changes scoped to the intended page, component, or pattern. Preserve filenames and relative references, or update the references affected by a rename or move. Before publishing, briefly describe what changed and manually review the rendered result and relevant paths. This is a handoff checklist, not a record of completed checks.

## Accessibility review checklist

These are future review checks, not verified accessibility results.

- Use Tab and Shift+Tab to check keyboard access, focus order, and visible focus indicators for controls actually presented by the page or `PatternViewer`.
- Review controls for meaningful accessible names and consider whether the visualisation needs a text description or is decorative.
- Check text, labels, and control boundaries for contrast against their backgrounds.
- If the visualisation moves or animates, check behavior with the operating system’s reduced-motion preference enabled.

## Final release review

- Confirm the documented starting point still matches the files present at the repository root.
- Check the scripts and dependency versions in `package.json`; use the repository's declared workflow rather than assuming a generic build command.
- Review the published result once on a narrow screen and once on a wider screen; treat this as a release check, not an automated test report.

## Repository map

- `app` — application directory.
- `components` — component directory.
- `lib` — shared library or utility directory.
- `package.json` — package manifest, dependency list, and declared scripts.
