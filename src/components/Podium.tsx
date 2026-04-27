import type { ComputedUser } from '../types'
import { PodiumColumn } from './PodiumColumn'

/**
 * Top-3 visualization. Ranks visually ordered as 2 / 1 / 3 (centerpiece is rank 1),
 * mirroring the original web part. If there are fewer than 3 users (e.g. heavy filter),
 * we render only what exists in the same left-to-right slots.
 */
export function Podium({ top3 }: { top3: ComputedUser[] }) {
  if (top3.length === 0) return null

  // Slots: [rank 2, rank 1, rank 3]
  const slots: Array<{ user: ComputedUser; rank: 1 | 2 | 3 }> = []
  if (top3[1]) slots.push({ user: top3[1], rank: 2 })
  if (top3[0]) slots.push({ user: top3[0], rank: 1 })
  if (top3[2]) slots.push({ user: top3[2], rank: 3 })

  return (
    <div className="flex items-end justify-center gap-4 mb-8 mt-2">
      {slots.map(({ user, rank }) => (
        <PodiumColumn key={user.user.id} user={user} rank={rank} />
      ))}
    </div>
  )
}
