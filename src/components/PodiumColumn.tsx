import type { ComputedUser } from '../types'
import { Avatar } from './Avatar'
import { TotalScore } from './TotalScore'

interface Props {
  user: ComputedUser
  rank: 1 | 2 | 3
}

const RANK_BADGE_BG: Record<1 | 2 | 3, string> = {
  1: 'bg-yellow-500',
  2: 'bg-slate-400',
  3: 'bg-amber-900',
}

const RANK_BLOCK: Record<1 | 2 | 3, string> = {
  1: 'h-44 bg-gradient-to-b from-amber-100 to-amber-200',
  2: 'h-32 bg-gradient-to-b from-slate-200 to-slate-300',
  3: 'h-32 bg-gradient-to-b from-slate-200 to-slate-300',
}

const AVATAR_RING: Record<1 | 2 | 3, string> = {
  1: 'ring-4 ring-yellow-400',
  2: '',
  3: '',
}

export function PodiumColumn({ user, rank }: Props) {
  return (
    <div className="flex flex-col items-center w-56">
      {/* Avatar with rank badge */}
      <div className="relative mb-3">
        <Avatar
          name={user.user.name}
          size="lg"
          className={AVATAR_RING[rank]}
          useAvatar={user.user.useAvatar}
        />
        <div
          className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${RANK_BADGE_BG[rank]}`}
          aria-label={`Rank ${rank}`}
        >
          {rank}
        </div>
      </div>
      {/* Name + role */}
      <div className="text-base font-bold text-slate-900 text-center px-2">
        {user.user.name}
      </div>
      <div className="text-xs text-slate-500 text-center mt-1 mb-3 px-2">
        {user.user.role}
      </div>
      {/* Total score pill */}
      <div className="rounded-full px-3 py-1.5 bg-slate-50 border border-slate-200">
        <TotalScore value={user.totalPoints} size="sm" />
      </div>
      {/* Block / pedestal with semi-transparent rank digit — sits flush under the pill */}
      <div
        className={`w-full mt-3 ${RANK_BLOCK[rank]} rounded-t-md flex items-center justify-center relative overflow-hidden`}
      >
        <span className="text-7xl font-black text-white/50 leading-none select-none">
          {rank}
        </span>
      </div>
    </div>
  )
}
