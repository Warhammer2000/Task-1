// 80 Star Wars characters with deterministically-generated activities.
// Zero corporate Vention data lives in this file — all names, roles, location
// codes, activities, and dates are fictional, drawn from the Star Wars universe.
//
// Generation is seeded by character name → output is reproducible across builds.
// ~22 of 80 seeds are tagged `useAvatar: true` so they render unique DiceBear
// "bottts" droid avatars instead of initials placeholders — matching the original's
// mix of photo+initials avatars.
//
// Categories mirror the original web part's 3-category, 4-prefix structure:
//   Education             [LAB]           ⇢  Padawan Training      [KYB]
//   Public Speaking       [REG] / [EDU]   ⇢  Galactic Diplomacy    [OBI] / [SEN]
//   University Partnership [UNI]          ⇢  Temple Partnership    [TMP]

import type { Activity, CategoryId, User } from '../types'
import { CATEGORIES, CATEGORY_BY_ID } from './categories'

interface Seed {
  name: string
  role: string
  /** Bias which category(s) this character tilts into. */
  bias: CategoryId[]
  /** When true, render a deterministic DiceBear bottts droid avatar instead of initials. */
  useAvatar?: boolean
}

// ---------- PRNG + helpers ---------- //

function mulberry32(seed: number) {
  let s = seed >>> 0
  return function rng() {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/["'`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ---------- Activity templates ---------- //

const ACTIVITY_TEMPLATES: Record<CategoryId, string[]> = {
  'padawan-training': [
    'Saber form fundamentals drill',
    'Kyber crystal lab session',
    'Soresu defensive form practice',
    'Ataru acrobatics intensive',
    'Niman Form combination clinic',
    'Djem So Form V mentoring',
    'Padawan tutoring circle',
    'Force technique workshop',
    'Crystal calibration clinic',
    'Lightsaber assembly seminar',
    'Initiate combat orientation',
    'Apprentice form review',
    'Living Force harmonic exercise',
    'Force healing workshop',
    'Saber crystal alignment',
    'Cadet weapons orientation',
    'ARC trooper combat drill',
    'Mentorship lab audit',
    'Echani martial arts mentoring',
    'Form VII Juyo intensive',
    'Sparring tournament round',
  ],
  'galactic-diplomacy': [
    'Naboo trade dispute mediation',
    'Outer Rim sieges briefing',
    'Senate floor address',
    'Mandalore peace summit',
    'Ryloth liberation negotiation',
    'Coruscant trade alliance round',
    'Republic constitutional debate',
    "Twi'lek freedom resolution",
    'Rim diplomatic envoy mission',
    'Treaty of Coruscant amendment review',
    'Republic peacekeeping briefing',
    'Coruscant Order address',
    'Inter-system reconciliation forum',
    'Galactic charter ratification',
    'Outer rim humanitarian appeal',
    'Senate adjudication panel',
    'Mid-Rim ceasefire monitoring',
    'Holonet public broadcast',
    'Order council public statement',
  ],
  'temple-partnership': [
    'Lothal academy partnership review',
    'Coruscant-Tython exchange visit',
    'Yavin temple curriculum sync',
    'Padawan exchange program',
    'Cross-academy knowledge transfer',
    'Temple-to-temple audit',
    'Inter-Order liaison briefing',
    'Bear Clan tutorial',
    'Knowledge Sharing roundtable',
    'Order chronicle review',
    'Galactic library catalog refresh',
    'Apprentice mentorship audit',
    'Open archive day',
    'Records-room digitization sprint',
    'Cross-temple curriculum review',
  ],
}

// ---------- Character roster (80) ---------- //

const SEEDS: Seed[] = [
  // Council & senior Jedi (10)
  { name: 'Yoda', role: 'Grand Master (DGB.SWP.HRM)', bias: ['padawan-training', 'temple-partnership'], useAvatar: true },
  { name: 'Mace Windu', role: 'Jedi Master (CSN.JCN.HC)', bias: ['padawan-training'], useAvatar: true },
  { name: 'Obi-Wan Kenobi', role: 'Jedi Master (CSN.JCN.HC)', bias: ['padawan-training', 'galactic-diplomacy'], useAvatar: true },
  { name: 'Luke Skywalker', role: 'Jedi Master (TKN.NEW.JD)', bias: ['padawan-training', 'temple-partnership'], useAvatar: true },
  { name: 'Anakin Skywalker', role: 'Jedi Knight (CSN.JCN.NC)', bias: ['padawan-training'], useAvatar: true },
  { name: 'Ahsoka Tano', role: 'Jedi Padawan (CSN.JCN.NC)', bias: ['padawan-training'], useAvatar: true },
  { name: 'Plo Koon', role: 'Jedi Master (CSN.JCN.HC)', bias: ['padawan-training'], useAvatar: true },
  { name: 'Kit Fisto', role: 'Jedi Master (CSN.JCN.HC)', bias: ['padawan-training'], useAvatar: true },
  { name: 'Aayla Secura', role: 'Jedi Knight (CSN.JCN.NC)', bias: ['padawan-training'], useAvatar: true },
  { name: 'Shaak Ti', role: 'Jedi Master (KMN.GAR.MNT)', bias: ['temple-partnership', 'padawan-training'], useAvatar: true },
  // Senate (5)
  { name: 'Padmé Amidala', role: 'Senator (NBO.RYL.SEN)', bias: ['galactic-diplomacy'], useAvatar: true },
  { name: 'Bail Organa', role: 'Senator (ALD.RYL.SEN)', bias: ['galactic-diplomacy'] },
  { name: 'Mon Mothma', role: 'Senator (CHN.RYL.SEN)', bias: ['galactic-diplomacy'] },
  { name: 'Riyo Chuchi', role: 'Senator (PNT.RYL.SEN)', bias: ['galactic-diplomacy'] },
  { name: 'Leia Organa', role: 'Senator Princess (ALD.RYL.SEN)', bias: ['galactic-diplomacy'], useAvatar: true },
  // Clones (6)
  { name: 'CT-7567 Rex', role: 'Captain (KMN.GAR.501)', bias: ['padawan-training'], useAvatar: true },
  { name: 'CC-2224 Cody', role: 'Marshal Commander (KMN.GAR.212)', bias: ['padawan-training'], useAvatar: true },
  { name: 'CT-5555 Fives', role: 'ARC Trooper (KMN.GAR.501)', bias: ['padawan-training'] },
  { name: 'CC-1010 Fox', role: 'Commander (KMN.GAR.GRD)', bias: ['padawan-training'] },
  { name: 'CT-21-0408 Echo', role: 'ARC Trooper (KMN.GAR.501)', bias: ['padawan-training'] },
  { name: 'CC-3636 Wolffe', role: 'Commander (KMN.GAR.WLF)', bias: ['padawan-training'] },
  // Rebellion / heroes (9)
  { name: 'Han Solo', role: 'Captain (CRP.MFL.SMG)', bias: ['padawan-training', 'galactic-diplomacy'], useAvatar: true },
  { name: 'Cassian Andor', role: 'Intelligence Officer (FST.RBL.INT)', bias: ['padawan-training', 'galactic-diplomacy'], useAvatar: true },
  { name: 'Sabine Wren', role: 'Specialist (KRN.MND.RBL)', bias: ['padawan-training'], useAvatar: true },
  { name: 'Hera Syndulla', role: 'General (RYL.MFL.PHX)', bias: ['galactic-diplomacy', 'padawan-training'], useAvatar: true },
  { name: 'Jyn Erso', role: 'Sergeant (FST.RBL.INF)', bias: ['padawan-training'] },
  { name: 'Kanan Jarrus', role: 'Jedi Knight (LTH.GHO.SPC)', bias: ['padawan-training', 'temple-partnership'] },
  { name: 'Ezra Bridger', role: 'Padawan (LTH.GHO.SPC)', bias: ['padawan-training'] },
  { name: 'Saw Gerrera', role: 'Partisan Leader (ONR.PRT.GRR)', bias: ['padawan-training'] },
  { name: 'Bo-Katan Kryze', role: 'Mandalore (MND.NTC.NWA)', bias: ['padawan-training', 'galactic-diplomacy'] },
  // Bounty hunters (3)
  { name: 'Boba Fett', role: 'Bounty Hunter (TTN.BTC.PAL)', bias: ['padawan-training'], useAvatar: true },
  { name: 'Cad Bane', role: 'Bounty Hunter (DTM.BTC.SOL)', bias: ['padawan-training'] },
  { name: 'Embo', role: 'Bounty Hunter (PHL.BTC.SOL)', bias: ['padawan-training'] },
  // Sith / Imperials (4)
  { name: 'Darth Sidious', role: 'Galactic Emperor (CSN.IMP.OFC)', bias: ['galactic-diplomacy', 'padawan-training'], useAvatar: true },
  { name: 'Darth Maul', role: 'Sith Lord (DTM.SHA.RBL)', bias: ['padawan-training'], useAvatar: true },
  { name: 'Count Dooku', role: 'Sith Lord (SRN.SEP.LDR)', bias: ['padawan-training', 'galactic-diplomacy'] },
  { name: 'Asajj Ventress', role: 'Sith Apprentice (DTM.SHA.SOL)', bias: ['padawan-training'] },
  // Less famous Jedi (12)
  { name: 'Luminara Unduli', role: 'Jedi Master (CSN.JCN.GEN)', bias: ['padawan-training'] },
  { name: 'Barriss Offee', role: 'Jedi Knight (CSN.JCN.MED)', bias: ['temple-partnership', 'padawan-training'] },
  { name: 'Ki-Adi-Mundi', role: 'Jedi Master (CSN.JCN.HC)', bias: ['padawan-training'] },
  { name: 'Quinlan Vos', role: 'Jedi Master (CSN.JCN.NC)', bias: ['padawan-training'] },
  { name: 'Eeth Koth', role: 'Jedi Master (CSN.JCN.HC)', bias: ['padawan-training'] },
  { name: 'Saesee Tiin', role: 'Jedi Master (CSN.JCN.HC)', bias: ['padawan-training'] },
  { name: 'Adi Gallia', role: 'Jedi Master (CSN.JCN.HC)', bias: ['galactic-diplomacy'] },
  { name: 'Yarael Poof', role: 'Jedi Master (CSN.JCN.HC)', bias: ['padawan-training'] },
  { name: 'Even Piell', role: 'Jedi Master (CSN.JCN.HC)', bias: ['padawan-training'] },
  { name: 'Depa Billaba', role: 'Jedi Master (CSN.JCN.HC)', bias: ['padawan-training'] },
  { name: 'Tera Sinube', role: 'Jedi Master (CSN.JCN.ARC)', bias: ['temple-partnership'] },
  { name: 'Jocasta Nu', role: 'Chief Librarian (CSN.JCN.ARC)', bias: ['temple-partnership'] },
  // Officers (2)
  { name: 'Wilhuff Tarkin', role: 'Admiral (CSN.NAV.OFC)', bias: ['galactic-diplomacy'] },
  { name: 'Cham Syndulla', role: 'Resistance Leader (RYL.RBL.LDR)', bias: ['galactic-diplomacy'] },
  // Bear Clan padawans (6)
  { name: 'Petro', role: 'Bear Clan Initiate (CSN.JCN.YGL)', bias: ['temple-partnership'] },
  { name: 'Katooni', role: 'Bear Clan Initiate (CSN.JCN.YGL)', bias: ['temple-partnership'] },
  { name: 'Byph', role: 'Bear Clan Initiate (CSN.JCN.YGL)', bias: ['temple-partnership'] },
  { name: 'Ganodi', role: 'Bear Clan Initiate (CSN.JCN.YGL)', bias: ['temple-partnership'] },
  { name: 'Gungi', role: 'Bear Clan Initiate (CSN.JCN.YGL)', bias: ['temple-partnership'] },
  { name: 'Zatt', role: 'Bear Clan Initiate (CSN.JCN.YGL)', bias: ['temple-partnership'] },
  // OT / sequel supporting (8)
  { name: 'Lando Calrissian', role: 'Baron Administrator (BSP.CIT.GVN)', bias: ['galactic-diplomacy'] },
  { name: 'Wedge Antilles', role: 'Lieutenant (RYL.RGD.LED)', bias: ['padawan-training'] },
  { name: 'Biggs Darklighter', role: 'Lieutenant (RYL.RGD.LED)', bias: ['padawan-training'] },
  { name: 'Gial Ackbar', role: 'Admiral (DAC.MNC.OFC)', bias: ['galactic-diplomacy', 'padawan-training'] },
  { name: 'Rey Skywalker', role: 'Jedi Initiate (AHK.NEW.JD)', bias: ['padawan-training'], useAvatar: true },
  { name: 'Finn FN-2187', role: 'Defector (DQR.RES.SLD)', bias: ['padawan-training'] },
  { name: 'Poe Dameron', role: 'Captain (RES.RGD.LED)', bias: ['padawan-training'] },
  { name: 'Rose Tico', role: 'Mechanic (RES.RGD.MCH)', bias: ['temple-partnership'] },
  // Bad Batch (4)
  { name: 'CT-9904 Crosshair', role: 'Sniper (KMN.GAR.BAD)', bias: ['padawan-training'] },
  { name: 'CT-9901 Tech', role: 'Specialist (KMN.GAR.BAD)', bias: ['temple-partnership', 'padawan-training'] },
  { name: 'CT-9902 Wrecker', role: 'Heavy (KMN.GAR.BAD)', bias: ['padawan-training'] },
  { name: 'CT-99 Hunter', role: 'Sergeant (KMN.GAR.BAD)', bias: ['padawan-training'] },
  // Inquisitors (3)
  { name: 'Grand Inquisitor', role: 'Inquisitor (FRT.IMP.INQ)', bias: ['padawan-training'] },
  { name: 'Second Sister', role: 'Inquisitor (FRT.IMP.INQ)', bias: ['padawan-training'] },
  { name: 'Reva Sevander', role: 'Third Sister (FRT.IMP.INQ)', bias: ['padawan-training'] },
  // Senators / officials (4)
  { name: 'Orn Free Taa', role: 'Senator (RYL.RYL.SEN)', bias: ['galactic-diplomacy'] },
  { name: 'Halle Burtoni', role: 'Senator (KMN.RYL.SEN)', bias: ['galactic-diplomacy'] },
  { name: 'Mas Amedda', role: 'Vice Chair (CSN.RYL.OFC)', bias: ['galactic-diplomacy'] },
  { name: 'Lott Dod', role: 'Senator (NMD.TFD.SEN)', bias: ['galactic-diplomacy'] },
  // Mandalorians + extras (4)
  { name: 'Pre Vizsla', role: 'Mandalore (MND.DTH.WTC)', bias: ['padawan-training'] },
  { name: 'Din Djarin', role: 'Mandalorian (MND.NVA.HUN)', bias: ['padawan-training'] },
  { name: 'Sabé', role: 'Handmaiden (NBO.RYL.HAN)', bias: ['galactic-diplomacy'] },
  { name: 'Cin Drallig', role: 'Battlemaster (CSN.JCN.TMP)', bias: ['padawan-training'] },
]
// 10 + 5 + 6 + 9 + 3 + 4 + 12 + 2 + 6 + 8 + 4 + 3 + 4 + 4 = 80 ✓

// ---------- Generation ---------- //

function pickWeighted<T>(rng: () => number, weights: Array<[T, number]>): T {
  const total = weights.reduce((s, [, w]) => s + w, 0)
  let r = rng() * total
  for (const [item, w] of weights) {
    if ((r -= w) <= 0) return item
  }
  return weights[weights.length - 1][0]
}

function pickPoints(rng: () => number): number {
  return pickWeighted(rng, [
    [4, 0.3],
    [8, 0.25],
    [16, 0.25],
    [32, 0.13],
    [64, 0.07],
  ])
}

function pickDate(rng: () => number, isTopTier: boolean): string {
  // Top tier biased toward 2025 (current/most recent year)
  const yearRoll = rng()
  const year = isTopTier ? (yearRoll < 0.7 ? 2025 : 2024) : yearRoll < 0.55 ? 2025 : 2024
  const month = 1 + Math.floor(rng() * 12)
  const day = 1 + Math.floor(rng() * 28)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function pickCategory(rng: () => number, bias: CategoryId[]): CategoryId {
  // Tight bias — most users end up with just 1-2 visible category icons in
  // their row, matching the original web part's typical 1-2 icon shape per user.
  const r = rng()
  if (r < 0.85) return bias[0]
  if (bias.length > 1 && r < 0.97) return bias[1]
  return CATEGORIES[Math.floor(rng() * CATEGORIES.length)].id
}

function pickPrefixForCategory(rng: () => number, cat: CategoryId): string {
  const prefixes = CATEGORY_BY_ID[cat].prefixes
  return prefixes[Math.floor(rng() * prefixes.length)]
}

function activityShortDate(iso: string): string {
  // `2025-12-17` → `17.12.25` (mirrors the original web part's activity-name suffix shape)
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y.slice(2)}`
}

function buildUsers(): User[] {
  return SEEDS.map((seed, idx) => {
    const rng = mulberry32(hashString(seed.name))
    // Tiers chosen to produce a wide-but-believable spread of total points
    const tier = idx < 10 ? 'top' : idx < 30 ? 'mid-high' : idx < 60 ? 'mid-low' : 'bottom'
    const activityCount =
      tier === 'top'
        ? 18 + Math.floor(rng() * 8) // 18-25
        : tier === 'mid-high'
          ? 10 + Math.floor(rng() * 7) // 10-16
          : tier === 'mid-low'
            ? 4 + Math.floor(rng() * 6) // 4-9
            : 1 + Math.floor(rng() * 3) // 1-3

    const activities: Activity[] = []
    const usedTemplates = new Map<string, number>() // dedupe via #N suffix

    for (let i = 0; i < activityCount; i++) {
      const cat = pickCategory(rng, seed.bias)
      const prefix = pickPrefixForCategory(rng, cat)
      const templates = ACTIVITY_TEMPLATES[cat]
      const tpl = templates[Math.floor(rng() * templates.length)]
      // Keep duplicates rare-but-numbered so the list reads naturally
      const key = `${cat}::${tpl}`
      const seq = (usedTemplates.get(key) ?? 0) + 1
      usedTemplates.set(key, seq)
      const tplWithSeq = seq === 1 ? tpl : `${tpl} #${seq}`

      const date = pickDate(rng, tier === 'top')
      const points = pickPoints(rng)

      activities.push({
        id: `${slugify(seed.name)}-${i}`,
        name: `[${prefix}] ${tplWithSeq} ${activityShortDate(date)}`,
        category: cat,
        date,
        points,
      })
    }

    return {
      id: slugify(seed.name),
      name: seed.name,
      role: seed.role,
      useAvatar: seed.useAvatar,
      activities,
    }
  })
}

export const USERS: User[] = buildUsers()
