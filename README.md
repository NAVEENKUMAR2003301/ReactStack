# ReactStack

An interactive React curriculum — 20 topics from JSX to the render/commit
lifecycle, each with a plain-language explanation, a live interactive demo,
runnable code samples, and a short quiz. Built with React 19, React Router,
and Framer Motion, with a custom light/dark design system.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL and start at **Introduction & JSX**, or jump to
any topic from the sidebar.

## Structure

- `src/data/topics.js` — the topic list that drives the sidebar, home grid, and prev/next navigation.
- `src/pages/topics/*.jsx` — one file per topic (explanation + live demo + quiz).
- `src/components/` — reusable building blocks: `CodeBlock`, `DemoCard`, `Callout`, `FlowDiagram`, `Quiz`, `Sidebar`, `Topbar`.
- `src/theme/ThemeContext.jsx` — dark/light mode, persisted to `localStorage` and synced with the OS preference on first visit.
- `src/styles/` — the design system: spacing scale, color tokens (light + dark), layout, and component styles.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
