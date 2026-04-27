// Domain types for the Star Wars-themed leaderboard.
// All types describe pure structure — no real corporate data lives here.

export type CategoryId =
  | 'padawan-training'
  | 'galactic-diplomacy'
  | 'temple-partnership'

export interface Category {
  id: CategoryId
  /** Display label used in dropdown, badges, screen-reader text. */
  label: string
  /**
   * Activity-name prefixes that map to this category. The original web part
   * has 4 prefixes ([LAB], [REG], [UNI], [EDU]) covering 3 categories — i.e.
   * one category can have multiple prefixes. We mirror that 1+2+1 distribution.
   */
  prefixes: string[]
  /** Identifier of the SVG icon variant rendered in the row's category-stats cluster. */
  iconType: 'training' | 'diplomacy' | 'temple'
}

export interface Activity {
  id: string
  /** Human-readable name including the [TAG] prefix and date short-form, e.g. `[KYB] Saber form fundamentals 18.12.25`. */
  name: string
  category: CategoryId
  /** ISO date string `yyyy-mm-dd`. Display format `DD-MMM-YYYY` is computed at render time. */
  date: string
  /** Awarded points — typically 4 / 8 / 16 / 32 / 64. */
  points: number
}

export interface User {
  id: string
  name: string
  /** Job title plus `(LOC.UNIT.GROUP)` code, mirroring the original web part's role string shape. */
  role: string
  /** When true, render a unique DiceBear bottts droid avatar instead of initials. */
  useAvatar?: boolean
  activities: Activity[]
}

export interface Filters {
  year: 'all' | number
  quarter: 'all' | 1 | 2 | 3 | 4
  category: 'all' | CategoryId
  /** Free-text search applied to user name (case-insensitive contains). */
  search: string
}

export interface CategoryStat {
  category: CategoryId
  count: number
}

/** A user augmented with stats computed under the current filter selection. */
export interface ComputedUser {
  user: User
  totalPoints: number
  categoryStats: CategoryStat[]
  filteredActivities: Activity[]
}
