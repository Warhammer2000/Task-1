# Leaderboard — Reverse-engineered spec

> ⚠️ **RAI**: этот файл описывает **только структуру** оригинала Vention EDU Leaderboard. Никакие реальные имена, titles, department codes, photos сюда не попали и не попадут. Всё data в нашей реплике — fully synthetic (Star Wars themed).
>
> Источник: SharePoint custom SPFx web part `LeaderboardWebPart`. Анализ — DOM inspection через Claude in Chrome (DOM tree + computed styles, без копирования контента).

---

## 1. Page-level

| Property | Value |
|----------|-------|
| Title | `Leaderboard` (h2, 30px, weight 700, slate-900) |
| Subtitle | one short sentence about top performers (p, 14px, weight 400, slate-500) |
| Page background | `slate-50` (#f8fafc) |
| Card background | `white` (#fff) |
| Card border-radius | `12px` |
| Card shadow | soft (`0 1px 3px rgba(0,0,0,0.1)`) |
| Card padding | `20px 24px` |
| Font family | `"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif` |

---

## 2. Filter Bar (sticky-ish above podium)

В одной горизонтальной строке, в карточке:

| # | Control | Type | Width | Default | Source of options |
|---|---------|------|-------|---------|--------------------|
| 1 | Years filter | combobox dropdown | 120px | `All Years` | year list (ascending or descending) |
| 2 | Quarters filter | combobox dropdown | 120px | `All Quarters` | `Q1 / Q2 / Q3 / Q4` |
| 3 | Categories filter | combobox dropdown | 150px | `All Categories` | `Education`, `Public Speaking`, `University Partners…` (есть и другие — точное число не критично, наша реплика будет иметь сопоставимый набор) |
| 4 | Search input | `<input type="text">` | flex | empty | placeholder: `Search employee...` (с иконкой 🔍 слева) |

**Поведение**:
- Все 4 контроля работают **в AND**: filter by year × quarter × category × search query
- Любая комбинация валидна, нет mutual exclusion
- Search фильтрует по name (case-insensitive contains)
- Меняя filter — list ниже ререндерится мгновенно (нет «Apply» кнопки)
- Default state: всё «All», поиск пустой — показывает все 227 записей

**Sort UI отсутствует** — порядок фиксирован: descending by total points. На UI есть только нумерация рангов слева.

---

## 3. Podium (top-3 visualization)

3 колонки **слева-направо в порядке 2 / 1 / 3** (центр выше, как реальный пьедестал).

Каждая колонка содержит:
1. **Avatar круглый** (~96px), у топ-1 — c золотой обводкой
2. **Rank badge** — маленький круг с цифрой `1 / 2 / 3` поверх правого нижнего угла аватара
   - Rank 1: `bg yellow-500` (#eab308)
   - Rank 2: `bg slate-400` (#94a3b8)
   - Rank 3: `bg amber-900` (#92400e)
3. **Name** (большой, weight 700)
4. **Role + (LOCATION.UNIT.GROUP)** code в скобках — secondary text
5. **Total ★** в pill: иконка звезды `sky-500` + число
6. **Block / постамент** (ниже) — большой блок с цифрой ранга на нём
   - Rank 1: gradient `amber-100 (#fef3c7) → amber-200 (#fde68a)` — золото; высота больше others
   - Rank 2 и 3: gradient `slate-200 (#e2e8f0) → slate-300 (#cbd5e1)` — серый
   - На блоке огромная полупрозрачная цифра `1 / 2 / 3`

---

## 4. List (entries 1..N)

Под подиумом — **полный список ВСЕХ users** (включая top-3, они дублируются — на подиуме и в списке). Total ~227 записей.

### Collapsed row layout (height ~95px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [Rank]  [Avatar]  Name (bold)                  [icon][N]  [⭐]  TOTAL   ▼ │
│           round    Role (sec.text)             [icon][N]  N       N      │
└────────────────────────────────────────────────────────────────────────────┘
```

| Element | Position | Notes |
|---------|----------|-------|
| `rank` | left, large gray digit | `1`, `2`, … `227` |
| `avatar` | round, ~50px | image OR initials fallback (light blue circle с инициалами если no photo) |
| `info.name` | bold, slate-900 | — |
| `info.role` | secondary, slate-500 | format: `JobTitle (LOCATION.UNIT.GROUP[.OPTIONALSUBTEAM])` |
| `categoryStats` | per-category mini-stats | 1+ icon-with-count clusters (тот же icon = категория, число = activities count); hidden если 0 |
| `totalSection` | label `TOTAL` (caps, small) + `★ N` (sky-500 star + bold number) | — |
| `expandButton` | round 36×36 button с chevron (▼) | aria-label `Expand`; flips to ▲ when expanded |

### Category icons (visible в category stats)

Из визуального осмотра — несколько fluent / icon types (точные имена SVG не критичны):
- **Education** — graduation cap 🎓
- **Public Speaking** — lectern / podium icon 🎙️
- **University Partners** — иконка похожая на партнёрство / handshake
- (возможно ещё 1-2)

В нашей реплике: 4-5 категорий со своими SVG icons, цвет иконок — slate-500/slate-600.

### Expanded row (height ~1185px на full activities)

При клике expandButton — раскрывается section ниже row:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [Rank]  [Avatar]  Name                            [icons]  ⭐ N   ▲      │
├────────────────────────────────────────────────────────────────────────────┤
│  RECENT ACTIVITY                                                           │
│  ───────────────────────────────────────────────────────────────────────── │
│  ACTIVITY                              CATEGORY        DATE       POINTS   │
│  Activity name here                    [Cat badge]     17-Dec-25  +64      │
│  Another activity                      [Cat badge]     16-Dec-25  +8       │
│  …                                                                         │
└────────────────────────────────────────────────────────────────────────────┘
```

| Column | Style |
|--------|-------|
| `RECENT ACTIVITY` | section heading, all-caps, small, slate-500 |
| `ACTIVITY` | left-aligned, slate-900 text |
| `CATEGORY` | center-ish; rounded pill badge (light bg, dark text); 1 colour-class per category |
| `DATE` | format: `DD-MMM-YYYY` (e.g. `17-Dec-2025`) |
| `POINTS` | right-aligned, blue (`sky-500`-ish), prefixed with `+` |

Activities list — **все** activities этого user'а (у топ-1 видно 17 строк). Order — chronological descending (newest first).

---

## 5. Behaviors / state

| Action | Result |
|--------|--------|
| Click any filter | List + podium ререндерятся мгновенно под combined filters |
| Type in search | Same — instant filter by name |
| Click row's expand ▼ | Row expands inline (others stay as is — multi-row expand allowed) |
| Click expanded row's ▲ | Row collapses |
| Click podium item | (наблюдалось — ничего; не drill-in) |
| Click row body (не button) | Ничего; only the explicit expand button reacts |

**Empty / no-results state**: filters can produce zero matches — нужно обработать (likely просто пустой list + сохранение podium либо тоже пустого).

---

## 6. Дата / номер семантика

- Total points = sum activity points в текущем filter scope
- Категория stat count в row — число activities этой категории под текущим filter
- Year filter — год активностей (NOT год регистрации user'а)
- Quarter filter — квартал активностей

---

## 7. Что МЫ не делаем (R2: NO extras)

- ❌ Не добавляем sort dropdown (его нет)
- ❌ Не добавляем экспорт / share buttons
- ❌ Не добавляем dark mode toggle
- ❌ Не добавляем pagination (один большой scroll, как в оригинале)
- ❌ Не добавляем «View profile» / drill-in cards
- ❌ Не добавляем animations за пределами того что есть (rows expand — без animation в оригинале)
- ❌ Не меняем тип контролов (combobox остаётся combobox, не превращаем в multi-select tags)

---

## 8. Synthetic data plan (R3: no real corporate data)

**Тематика**: Star Wars (отвечает на «The Clone Wars» в названии task'а).

| Original field | Synthetic replacement |
|----------------|----------------------|
| Person name | Star Wars character name (`Luke Skywalker`, `Leia Organa`, `Mace Windu`, `Plo Koon`, `Ahsoka Tano`, `Cassian Andor`, …) — балансим знаменитых и менее известных |
| Job title | Star Wars rank/role: `Jedi Knight`, `Jedi Master`, `Padawan`, `Sith Lord`, `Clone Trooper`, `Senator`, `Commander`, `Bounty Hunter` |
| Location code | Star Wars planet/base codes: `(CSN.JT.HC)` = Coruscant.Jedi Temple.High Council; `(KMN.CF.AT)` = Kamino.Cloning Facility.Arc Trooper; `(TTN.MOS.JG)` = Tatooine.Mos Espa.Jundland Guards; etc. |
| Activity name | Star Wars-themed: `[OBI] Lightsaber Form III workshop 18.12.25`, `[OBI] Holocron archive maintenance`, `[OBI] Force meditation session #7`, etc. |
| Category | Map onto Vention's 4-5 categories with neutral names: `Combat Training`, `Force Studies`, `Galactic Diplomacy`, `Cloning Research`, `Public Holocron` |
| Quantity | ~50-100 entries (less than original 227 — proves structure без burden of generating massive dataset) |

**Generation method**: prompt to Claude/Cursor для генерации JSON dataset с этой схемой. Никаких real names в промпт не попадает.

**Avatars**: round placeholder с initials (как fallback в оригинале) или free Star Wars character images из public commons.

---

## 9. Stack рекомендация

Учитывая:
- ~50-227 entries в DOM (не миллион — virtual scroll не нужен)
- 3 dropdowns + 1 search + expandable rows = умеренная state-логика
- Tailwind palette уже identified — использовать Tailwind напрямую = pixel-perfect copy
- GitHub Pages deploy (static)
- Disciplined vibe coding — короткие итерации, AI-driven

**Рекомендация: Vite + React 18 + TypeScript + Tailwind CSS**.
- Component-based — natural fit для row / podium / filter components
- TypeScript — type-safe data shape
- Tailwind — direct mapping на Tailwind palette из original
- Vite — single command deploy на GH Pages с `vite.config.ts` `base: '/<repo>/'`
- Деплой: `gh-pages` npm package или GitHub Action `actions/deploy-pages`

**Альтернатива** (если хотим менее ramp): plain HTML + Tailwind CDN + vanilla JS. Меньше moving parts, но усложняет state-management для 3 filters + search.

Решение: **React + Vite + TS + Tailwind**.

---

## 10. Files / artifacts produced during reconnaissance

- Screenshots (in-memory only, не сохранены в repo): podium top, ranks 12-19, expanded row, categories dropdown
- DOM tree analysis (in-memory only): structure, classes, computed styles
- This file (`leaderboard-spec.md`) — **только структурная информация, без single реального имени / title / department**

After reconnaissance: tabs `391170739` (newtab) и `391170727` (leaderboard) **должны быть закрыты** через MCP cleanup чтобы не оставлять corporate page open под automation control.
