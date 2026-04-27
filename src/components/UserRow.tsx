import type { ComputedUser } from '../types'
import { Avatar } from './Avatar'
import { CategoryStat } from './CategoryStat'
import { TotalScore } from './TotalScore'
import { ChevronDownIcon, ChevronUpIcon } from './icons'
import { ExpandedActivities } from './ExpandedActivities'

interface Props {
  user: ComputedUser
  rank: number
  expanded: boolean
  onToggle: () => void
}

export function UserRow({ user, rank, expanded, onToggle }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-card mb-3 overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="w-10 text-center text-2xl font-light text-slate-400 shrink-0">
          {rank}
        </div>
        <Avatar name={user.user.name} size="sm" useAvatar={user.user.useAvatar} />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-slate-900 truncate">
            {user.user.name}
          </div>
          <div className="text-xs text-slate-500 truncate">{user.user.role}</div>
        </div>
        <div className="flex items-center gap-3">
          {user.categoryStats.map((s) => (
            <CategoryStat key={s.category} category={s.category} count={s.count} />
          ))}
        </div>
        <div className="text-right shrink-0 min-w-[64px]">
          <div className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">
            Total
          </div>
          <TotalScore value={user.totalPoints} size="md" />
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse' : 'Expand'}
          className="w-9 h-9 rounded-full bg-sky-50 hover:bg-sky-100 flex items-center justify-center text-sky-500 transition-colors shrink-0"
        >
          {expanded ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
      </div>
      {expanded && <ExpandedActivities activities={user.filteredActivities} />}
    </div>
  )
}
