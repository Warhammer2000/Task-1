import type { Activity } from '../types'
import { CategoryBadge } from './CategoryBadge'
import { formatActivityDate } from '../lib/dates'

export function ExpandedActivities({ activities }: { activities: Activity[] }) {
  return (
    <div className="px-8 pb-6 pt-2 border-t border-slate-100">
      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">
        Recent Activity
      </div>
      {activities.length === 0 ? (
        <div className="text-sm text-slate-500 italic py-4">
          No activities under the current filters.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <th className="text-left font-medium pb-2">Activity</th>
              <th className="text-left font-medium pb-2 w-44">Category</th>
              <th className="text-left font-medium pb-2 w-32">Date</th>
              <th className="text-right font-medium pb-2 w-20">Points</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.id} className="border-b border-slate-50 last:border-b-0">
                <td className="py-2.5 text-slate-900">{a.name}</td>
                <td className="py-2.5">
                  <CategoryBadge category={a.category} />
                </td>
                <td className="py-2.5 text-slate-500 text-sm">
                  {formatActivityDate(a.date)}
                </td>
                <td className="py-2.5 text-right text-sky-500 font-semibold">
                  +{a.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
