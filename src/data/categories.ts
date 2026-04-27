import type { Category, CategoryId } from '../types'

/**
 * Three categories — Star Wars-themed analogs of the original web part's exact
 * category structure (Education / Public Speaking / University Partnership).
 *
 * Activity-name prefixes mirror the original 1+2+1 distribution where one
 * category (Public Speaking → here Galactic Diplomacy) has two prefix variants
 * and the others have one each:
 *
 *   Original                        | Replica
 *   --------------------------------+------------------------------
 *   Education       [LAB]           | Padawan Training    [KYB]
 *   Public Speaking [REG] / [EDU]   | Galactic Diplomacy  [OBI] / [SEN]
 *   University Partnership [UNI]    | Temple Partnership  [TMP]
 */
export const CATEGORIES: Category[] = [
  {
    id: 'padawan-training',
    label: 'Padawan Training',
    prefixes: ['KYB'],
    iconType: 'training',
  },
  {
    id: 'galactic-diplomacy',
    label: 'Galactic Diplomacy',
    prefixes: ['OBI', 'SEN'],
    iconType: 'diplomacy',
  },
  {
    id: 'temple-partnership',
    label: 'Temple Partnership',
    prefixes: ['TMP'],
    iconType: 'temple',
  },
]

export const CATEGORY_BY_ID: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>
