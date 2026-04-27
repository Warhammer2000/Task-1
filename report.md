# Task 1 — The Clone Wars · Report

> **Live**: <https://warhammer2000.github.io/Task-1/>
> **Source**: <https://github.com/Warhammer2000/Task-1>
> **Cross-task working repo**: <https://github.com/Warhammer2000/ai-challenge-2026>
> **Brief theme**: vibe coding — replicate the internal Leaderboard exactly,
> with all data replaced.

---

## 1. How I approached the task

The brief looked deceptively simple ("just clone the leaderboard"), but two
clauses turned it into a discipline exercise rather than a coding sprint:

1. *"replicate the original **exactly** — all UI elements, filters, sorting,
   and other functionality. **No extra features**"* — every element of the
   replica must mirror the source, and every "improvement" I'd be tempted to add
   becomes a violation.
2. *"do not feed any corporate data … into AI tools"* — I needed to understand
   the original's structure deeply, while never letting any real names, photos,
   or department codes touch a model's prompt or persist into my codebase.

So I split the work into three disciplined phases:

### Phase 1 — Reconnaissance, not data collection

Before writing a single component, I spent ~30 minutes inspecting the original
SharePoint web part through Chrome DevTools-style DOM exploration (via the
`Claude in Chrome` MCP), capturing only **structural** information:

- DOM tree, class taxonomy, computed styles (palette, typography, radii,
  shadows), web part identifier (`LeaderboardWebPart`)
- Number and shape of filter controls (3 dropdowns + search input, no sort UI)
- Podium layout (top-3 with center=#1, gold/silver/bronze ranks)
- Row anatomy: `rank → avatar → info → categoryStats → total → expandButton`
- Expanded state schema: `RECENT ACTIVITY` table with `Activity / Category / Date / Points`
- Date format (`DD-MMM-YYYY`), points format (`+N`), badge style (uniform
  light-gray pill)
- Behaviors: instant filter rerender, multi-row expand, fixed sort by total desc

I wrote this up in [`leaderboard-spec.md`](./leaderboard-spec.md) before
touching the React project. **Crucially, no real names, photos, titles or
department names were captured**: the spec contains only types, layouts, and
Tailwind palette values — anyone reading it learns the structure but learns
nothing about Vention's people.

### Phase 2 — Build, with vibe-coding discipline

> "Vibe coding" ≠ random prompting. It is *disciplined iteration with short
> cycles, focused on the feel of the result.*

Concretely that meant:

- **Big iterations, small prompts.** I asked Claude Code (Opus 4.7) for narrow
  things — "scaffold a `PodiumColumn` for rank N" — rather than "write me the
  whole leaderboard."
- **Spec-first, code-second.** Every component matched a row in the recon spec.
  When I noticed something wasn't in the spec ("should I add a sort dropdown?")
  the answer was always *no* — the brief forbids extras.
- **Test the feel.** Loaded the dev server through Claude in Chrome at every
  meaningful step, took screenshots, and visually compared to the original.
- **Stop when done, not when fancy.** I refused several improvements I caught
  myself wanting (column sort, date range picker, dark mode toggle, animations)
  — they would all be R2 ("no extra features") violations.

### Phase 3 — Deploy and audit

Built with `vite build`, deployed to `gh-pages` branch under `/task-1/` using
the `gh-pages` npm package, then verified the live URL in incognito.

Every brief requirement was extracted into [`SELF-REVIEW.md`](./SELF-REVIEW.md)
as a checkbox grid (R1–R10), gated against the one-shot rule.

---

## 2. Tools and techniques

| Tool | Used for |
|------|----------|
| **Claude Code (Opus 4.7)** | Primary IDE / agent — scaffolding, component generation, refactors |
| **`Claude in Chrome` MCP** | DOM inspection of the original; visual side-by-side checks of the dev build |
| **Vite 8 + React 19 + TypeScript 6** | Build / app — chosen so the Tailwind palette of the original maps 1-to-1 |
| **Tailwind CSS 3.4** | Styling — original is built on Tailwind primitives (slate / sky / amber / yellow), so nothing custom is needed |
| **`gh-pages` npm package** | Deploy to GitHub Pages under `/task-1/` path so each task can live in the same repo without colliding |

### Prompting techniques that mattered

- **Reconnaissance prompts that refuse data**: every Chrome MCP query returned
  *structural* shape only — `bodyHTML.length`, `classes`, `computed styles`,
  *iframe metadata* — but never `textContent` of names or photos.
- **Spec-as-prompt-context**: I kept `leaderboard-spec.md` open and referenced
  it in every component-generation prompt. The model never had to guess what an
  element should look like.
- **Tight scope per turn**: "build `<X>` matching section §N of the spec" beat
  "build the leaderboard."
- **Verification-loop**: build → screenshot → diff vs original mentally →
  refine. Two rounds of polish on the podium were enough.

---

## 3. Data replacement strategy

The brief mandates **no real data** and themes the task as `The Clone Wars`
(epigraph: *"200,000 units are ready, with a million more well on the way…"* —
Lama Su, *Attack of the Clones*). I treated this as a strong hint and went
fully Star Wars.

### Generation, not collection

All data is generated in [`src/data/users.ts`](./app/src/data/users.ts) at
module-load time using a **seeded PRNG (mulberry32)**, so the dataset is
identical across builds and reloads — no flicker, no surprise rerankings.

Inputs:
- 80 hand-picked Star Wars character seeds, each with a canonical name, role,
  and `(LOC.UNIT.GROUP)` location code (`(CSN.JCN.HC)` for the Jedi High
  Council on Coruscant, `(KMN.GAR.501)` for the 501st clones on Kamino, etc.).
- 4 categories — analogs of the original's 4 categories:
  `Combat Training`, `Galactic Diplomacy`, `Force Studies`, `Holocron Sharing`.
- ~70 thematic activity templates spanning lightsaber forms, Senate sessions,
  meditation circles, and holocron preservation.

Output:
- Each seed produces 1–25 activities (top tier biased recent), totaling
  ~600 activities across 80 users.
- Activity names mirror the original's `[TAG] <activity> DD.MM.YY` shape, e.g.
  `[CMB] Soresu Form III sparring drill 18.12.25`.
- Category bias per character keeps things believable — Yoda tilts toward
  Force Studies and Holocron Sharing, Rex tilts toward Combat Training.

### RAI compliance

Concretely:
- **Zero real corporate names / titles / departments / photos** anywhere in the
  source, generated data, commits, or deployed assets — verifiable by reading
  `src/data/users.ts` end-to-end.
- **Avatars are initials placeholders only** (deterministic pastel-bg + 2
  letters from the Star Wars name). No external photo URLs are loaded — both
  for RAI safety and because the original itself shows initials when a person
  has no photo, so this is structurally faithful.
- **Original was inspected, not ingested** — I used Claude in Chrome for DOM
  shape + computed styles, but never let any model see real names, photos, or
  department lists. The `leaderboard-spec.md` file is the only artifact derived
  from the original, and contains zero such data.

---

## 4. Architecture (one-screen)

```
┌─────────────────────────────────────────────────────────────────┐
│  App.tsx                                                        │
│   ├─ filters state (year / quarter / category / search)         │
│   ├─ expandedIds state (Set<string>, multi-row expand)          │
│   ├─ useMemo: USERS → computeUserUnderFilters → sort → ranked   │
│   │                                                             │
│   ├─ <FilterBar>          3 selects + search input              │
│   ├─ <Podium>             top-3 (visual order 2 / 1 / 3)        │
│   │   └─ <PodiumColumn>×3                                       │
│   └─ <LeaderboardList>                                          │
│       └─ <UserRow>×N                                            │
│           ├─ <Avatar>                                           │
│           ├─ <CategoryStat>×k    icons + counts                 │
│           ├─ <TotalScore>                                       │
│           └─ <ExpandedActivities> (when expanded)               │
│               └─ table: Activity | Category | Date | Points     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                        src/data/users.ts
                  (deterministic PRNG → 80 users)
```

Pure data flow, no global state library, no async — `USERS` is a plain
in-memory array. Filter rerenders are sub-millisecond at this dataset size.

---

## 5. Decisions worth calling out

| Decision | Rationale |
|----------|-----------|
| Skip `react-router` / pagination / infinite scroll | Original has none — adding any would be an R2 violation |
| Initials avatars instead of stock photos | RAI-clean by construction; original shows initials too when no photo |
| Single-style category badges (light slate pill) | Original uses one badge style for all categories; recreating that |
| In-memory generated dataset, not a JSON fixture | Smaller, deterministic, easier to reason about; no need for a build step that bakes JSON |
| TypeScript strict | One-shot rule means I can't afford a runtime issue at the judges' incognito browser; types catch them at build |
| Vite `base: '/ai-challenge-2026/task-1/'` | Lets all 4 tasks share one repo and one `gh-pages` branch without colliding paths |

---

## 6. What I deliberately did **not** do

- ❌ Add a "Sort by total / name / date" dropdown (original has fixed sort)
- ❌ Add infinite scroll or pagination (original uses one long scroll)
- ❌ Add a date-range picker (original only has year + quarter)
- ❌ Add hover animations beyond what the original has
- ❌ Add a dark-mode toggle
- ❌ Add export / share / PDF buttons
- ❌ Add a "View profile" detail page
- ❌ Use stock photo APIs for character avatars

Each of these would have made my submission *technically nicer* and *factually
not a replica* — bonus 0 under the one-shot rule.

---

## 7. Run locally

```bash
npm install
npm run dev
# open http://localhost:5173/Task-1/
```

Build: `npm run build` → `dist/`. Deploy: `npm run deploy`.
