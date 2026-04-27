import type { CategoryId } from '../types'
import { CategoryIconFor } from './icons'

export function CategoryStat({
  category,
  count,
}: {
  category: CategoryId
  count: number
}) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 text-slate-500 min-w-[28px]"
      aria-label={`${count} ${category} activities`}
    >
      <CategoryIconFor id={category} className="w-5 h-5" />
      <span className="text-xs font-medium text-slate-600">{count}</span>
    </div>
  )
}
