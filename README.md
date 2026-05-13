# LIFE OS PRIME

A luxury-class personal performance dashboard — single user, no auth.
Built around three modules: **Onboarding · Dashboard · Habits**.

> Track daily habits · score your routine · get an AI-authored
> Life Status Overview · build elite systems.

---

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **React 19**
- **Tailwind v4** (CSS-first) + shadcn-style UI primitives
- **Supabase** — single-user Postgres (no auth, no RLS)
- **Anthropic SDK** — Claude Opus generates the Life Status Overview, with
  prompt caching on the persona system prompt
- **Recharts** for charts · **date-fns** · **next-themes** · **sonner**

---

## Running locally

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The app runs out-of-the-box on **demo data** —
no env vars required.

### Going live with Supabase + Claude

1. Create a Supabase project (free tier is fine).
2. Apply `supabase/migrations/0001_init.sql` via the Supabase SQL editor or
   `supabase db push`. It creates 6 tables and seeds the fixed
   `SINGLE_USER_ID` plus 10 default habits.
3. Copy `.env.example` → `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=sk-ant-...     # optional but recommended
```

4. Restart the dev server. Onboarding now persists, habit toggles save to
   Postgres, and the Claude-authored Life Status Overview is generated on
   onboarding completion and rendered on the dashboard.

If `ANTHROPIC_API_KEY` is missing the dashboard still works — scoring is
deterministic, and a hand-written sample overview ships with the demo data.

---

## Surface area

| Module | Route | What it does |
| --- | --- | --- |
| Marketing | `/` | Premium landing page with mock dashboard preview |
| Onboarding | `/onboarding` | 2-section wizard (basic life structure + daily routine), persists profile + computed scores, generates AI Life Status Overview |
| Dashboard | `/dashboard` | 6 KPIs (productivity / discipline / lifestyle / energy / focus / stress), balance ring, today's habits, 14-day energy curve, 12-week streak heatmap, AI overview |
| Habits | `/habits` | Tracker grid, streak counters, 30-day consistency, weekly habit report |

---

## Architecture notes

- **No auth.** Every row in Supabase is associated with `SINGLE_USER_ID`
  (`00000000-0000-0000-0000-000000000001`) defined in `src/lib/constants.ts`.
  Keep your Supabase project private; lock down anon key + service-role key.
- **Persona prompt** lives at `src/lib/persona.ts` and is injected as a cached
  system block into the Claude analysis call.
- **Deterministic scoring** (`src/lib/scoring.ts`) computes all 8 dashboard
  scores without an LLM — the dashboard renders instantly. AI is reserved
  for the narrative Life Status Overview.
- **Demo mode** (`src/lib/demo-data.ts` + `src/lib/data.ts`) auto-activates when
  Supabase isn't configured, so cloning the repo gives an immediately
  interactive preview.
