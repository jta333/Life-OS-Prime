# CLAUDE.md

Guidance for working in this repo (humans and AI assistants).

## What this is

**LIFE OS PRIME**, a personal performance dashboard. Next.js 15 (App Router) +
TypeScript + React 19 + Tailwind v4 + shadcn-style UI, with Supabase (Postgres +
auth) and the Anthropic SDK for AI features. Runs on demo data with no env vars.

Modules: landing, auth (sign in/up), onboarding, dashboard, habits, check-in,
goals, health, routine, AI coach, weekly/monthly reviews, settings.

## Running locally

**Use npm.** It is the supported, friction-free path on Windows/macOS/Linux.
Requires Node.js LTS (v20+); npm comes bundled with it.

```
npm install
npm run dev
```

Then open http://localhost:3000. Stop the dev server with Ctrl+C.

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

## Why not pnpm

This project intentionally documents **npm** as the primary tool. pnpm **v11**
blocks dependency build scripts (`sharp`, `unrs-resolver`) and fails with
`ERR_PNPM_IGNORED_BUILDS` before `dev`/`build` will run, even when those packages
are whitelisted in `pnpm-workspace.yaml` (that whitelist is honored by pnpm v10
but not reliably by v11). npm has no such gate and just works.

If you must use pnpm v11, approve the build scripts once, interactively:

```
pnpm approve-builds
```

Select all (press `a`), Enter, then `y`. (`pnpm-workspace.yaml` is kept in the
repo for pnpm v10 users.)

## Going live (Supabase + AI)

1. Create a Supabase project (free tier is fine).
2. Apply `supabase/migrations/0001_init.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and fill in the values.
4. Restart the dev server.

Without `ANTHROPIC_API_KEY` the app still runs, scoring is deterministic and the
AI coach/insights are disabled. Never commit `.env.local` or real keys; `.env*`
files are gitignored.

## Pasting multi-line commands on Windows PowerShell

PowerShell 5.x does **not** support `&&` to chain commands. Either paste each
command on its own line (PowerShell runs pasted lines sequentially), or use `;`
between them. The snippets above are safe to paste together as separate lines.

## JET operating rules

# Full brain: `https://github.com/jta333/jet-claude-central`

This repo follows JET's standing rules. Full context, voice, and memory live in the
jet-claude-central repo above. Read it if this session has access to it.

### HARD RULES, NEVER BREAK THESE

1. URLs and file paths ALWAYS in backticks or code blocks. Never plain prose.
2. JET revenue and individual comp are confidential. Never in any output. Ask Jay first.
3. Never overwrite Jay's hand-edited docs without explicit permission.
4. Never delete information without Jay's explicit approval.
5. No profanity in any output, ever.
6. Writing for Jay or JET defaults to his voice (jay-voice). Confirm, then apply any modifier.
7. NEVER use em dashes (U+2014). Anywhere, ever. Use a comma, colon, or hyphen.

### POSTURE

Advisor and mirror: direct, accurate over flattering, challenge every decision and recommend
better, prioritized plans. Bullets where they help, prose for reasoning. No filler preambles.
