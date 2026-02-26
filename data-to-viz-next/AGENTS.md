# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js App Router project (`src/app`) for an interactive Data-to-Viz experience.
- `src/app`: routes and page entry points (for example `src/app/page.tsx`, `src/app/graph/*/page.tsx`).
- `src/components/ui`: shared Shadcn/Radix UI primitives.
- `src/components/viz`: visualization features (`tree`, `charts`, `story`, `icons`).
- `src/data`: static JSON decision-tree data sources.
- `src/lib`: utility helpers (for example tree transforms and shared helpers).
- `public`: static assets.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start local dev server at `http://localhost:3000`.
- `npm run build`: create production build.
- `npm run start`: run production server from build output.
- `npm run lint`: run ESLint (Next.js core-web-vitals + TypeScript rules).
- `npx tsc --noEmit`: optional strict type check before opening a PR.

## Coding Style & Naming Conventions
- Language: TypeScript + React function components.
- Indentation: 2 spaces; keep semicolons and single-quote style consistent with existing code.
- Prefer alias imports via `@/*` (configured in `tsconfig.json`) over long relative paths.
- Component files use PascalCase (for example `DecisionGraph.tsx`, `HistogramG2.tsx`).
- Route folders use lowercase segment names (for example `src/app/graph/scatter`).
- Styling is Tailwind-first in JSX; place reusable UI primitives in `src/components/ui`.

## Testing Guidelines
There is currently no dedicated automated test framework configured.
- At minimum, run `npm run lint` and `npx tsc --noEmit`.
- For UI changes, manually verify: home tab switching, decision-tree interaction (desktop/mobile), and affected graph detail pages.
- If you add tests, co-locate them as `*.test.ts(x)` near source files or in `src/__tests__/`.

## Commit & Pull Request Guidelines
Recent history favors short, focused commit subjects (examples: `fix links`, `boxplot revamp`, `翻译`).
- Keep commit titles concise, imperative, and scoped to one change.
- PRs should include: purpose, key file changes, validation steps, and linked issue (if any).
- For visual updates, include before/after screenshots or short recordings.
