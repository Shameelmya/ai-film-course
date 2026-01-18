# AI Film Course — Vite + React + Tailwind Skeleton

This zip contains a minimal Vite + React + Tailwind project skeleton prepared so you can drop in your app code.
**Per your request, `src/App.jsx` is intentionally left empty for you to fill manually.**

## What is included
- `package.json` — scripts & dependencies
- `vite.config.js` — Vite config with React plugin
- `index.html`
- Tailwind and PostCSS config
- `src/main.jsx` — app bootstrap (imports `./App.jsx`)
- `src/App.jsx` — **LEFT EMPTY** (your job)
- `src/components/AIFilmCourse.jsx` — your provided component (kept as-is)
- `src/index.css` — Tailwind directives + base styles

## Quick local run (step-by-step)

1. Unzip the folder:
   ```bash
   unzip ai-film-course.zip -d ai-film-course
   cd ai-film-course
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```
   Open the URL shown (usually `http://localhost:5173`).

4. Build for production:
   ```bash
   npm run build
   ```

## Deploy to GitHub (two easy options)

### Option A — Deploy to Vercel (recommended, simplest)
1. Push the repo to GitHub.
2. Go to [Vercel](https://vercel.com), create a new project, import the GitHub repo.
3. Vercel detects Vite + React automatically. Use the default build command `npm run build` and `dist` as the output directory.
4. Deploy — Vercel will give a live URL.

### Option B — Deploy using GitHub Pages
(For Vite, a common approach is to use GitHub Actions or push the `dist` to `gh-pages` branch. Below are manual steps.)
1. Build: `npm run build`. This produces a `dist/` folder.
2. Create a branch `gh-pages` and copy `dist/` contents to root of that branch.
3. Push `gh-pages` and enable GitHub Pages from repository settings (use branch `gh-pages` / root).

## Where to put your app
- `src/App.jsx` is intentionally empty. Replace it with your main App wrapper or import `AIFilmCourse` from `./components/AIFilmCourse.jsx` when you're ready.

## Notes & troubleshooting
- If Tailwind classes don't apply, ensure `tailwind.config.cjs` `content` includes file paths (already configured).
- If you get JSX/syntax errors, ensure Node >=16 and npm up-to-date.
- If you want automatic deploy from GitHub to Pages, I can add a GitHub Actions workflow to the repo — tell me and I'll prepare it.

