import type { ComputedUser } from '../types'
import { UserRow } from './UserRow'

interface Props {
  users: ComputedUser[]
  expandedIds: Set<string>
  onToggle: (id: string) => void
}

export function LeaderboardList({ users, expandedIds, onToggle }: Props) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card p-8 text-center text-slate-500 text-sm">
        No employees match the current filters.
      </div>
    )
  }
  return (
    <div>
      {users.map((u, i) => (
        <UserRow
          key={u.user.id}
          user={u}
          rank={i + 1}
          expanded={expandedIds.has(u.user.id)}
          onToggle={() => onToggle(u.user.id)}
        />
      ))}
    </div>
  )
}
