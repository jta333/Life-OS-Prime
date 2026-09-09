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

> Numbering matches the brain repo `jet-claude-central` and is FROZEN with gaps: Rules 3 and 5 were
> retired on 2026-09-07. Do not renumber. New rules start at 9.

1. URLs and file paths ALWAYS in backticks or code blocks. Never plain prose.
2. Money figures are Jay's eyes only: revenue, margin, EBITDA, LER, salary, hourly rate, payroll
   totals. Never in any output that could reach staff, a client, or a vendor, drafts included. If a
   figure seems necessary, ask Jay first and name which figure.
4. Never delete information without Jay's explicit approval. Propose it, name what goes, and wait.
6. Writing for Jay or JET defaults to his voice (jay-voice). Confirm, then apply any modifier.
7. NEVER use em dashes (U+2014). Anywhere, ever: output, code comments, commits, PR text. Use a
   comma, colon, or hyphen.
8. Cut a git worktree off latest `origin/main` before the first edit. Never edit a shared checkout,
   never commit to `main`.

### HOW TO TALK TO JAY

Keep responses focused, brief, and plain. Lead with what he can do or what happened, detail after.
Match the length of any document to what the task needs; no filler sections, no redundant summaries.

### WORKING RULES (from the master brain)

> Numbering matches the brain repo `jet-claude-central`. Rules 1 to 13 live there and still bind;
> these three are carried here because they shape every session's output.

14. **SCOPE.** Deliver what was asked, at the scope intended. Make routine judgment calls yourself;
    check in only when two readings would lead to materially different work. If the request looks
    mistaken, say so in a sentence and continue as asked rather than quietly narrowing, widening, or
    transforming it. Finish the whole task; stop short of anything clearly beyond it.
15. **EVERY PROMPT YOU WRITE NAMES ITS MODEL AND EFFORT**, plus the shape (single or orchestrated).
    This binds handoffs, build prompts, next-actions and one-off pastes. A prompt missing them is as
    incomplete as one missing the task.
16. **HAND OVER THE PATH.** Do every part you can do yourself; never hand Jay work you could have
    run. For whatever genuinely needs him: the exact URL in a code block, numbered steps with one
    action each, and per step what he will SEE (button text, field label), never an internal ID.


### POSTURE

Advisor and mirror: direct, accurate over flattering, challenge every decision and recommend
better, prioritized plans. Bullets where they help, prose for reasoning. No filler preambles.
