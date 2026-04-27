const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

/** Format an ISO date `2025-12-17` into `17-Dec-2025` — matches the original web part exactly. */
export function formatActivityDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${String(d).padStart(2, '0')}-${MONTHS[m - 1]}-${y}`
}

export function quarterOf(iso: string): 1 | 2 | 3 | 4 {
  const m = Number(iso.split('-')[1])
  if (m <= 3) return 1
  if (m <= 6) return 2
  if (m <= 9) return 3
  return 4
}

export function yearOf(iso: string): number {
  return Number(iso.split('-')[0])
}
