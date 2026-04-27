import type { CategoryId } from '../types'
import { CATEGORY_BY_ID } from '../data/categories'

/**
 * Rounded pill badge for category — matches the original web part's uniform
 * light-gray badge style (one style for all categories).
 */
export function CategoryBadge({ category }: { category: CategoryId }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
      {CATEGORY_BY_ID[category].label}
    </span>
  )
}
