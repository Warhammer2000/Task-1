/**
 * Extract up to 2 initials from a name.
 * Handles canonical Star Wars name shapes: `Luke Skywalker` → `LS`, `CT-7567 Rex` → `CR`,
 * `Bo-Katan Kryze` → `BK`, `Yoda` → `YO`.
 */
export function getInitials(name: string): string {
  // Strip nicknames in any kind of quote
  const cleaned = name.replace(/["'`].+?["'`]/g, '').trim()
  // Split on whitespace OR hyphen — `Bo-Katan` reads as Bo + Katan
  const parts = cleaned.split(/[\s\-]+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const PALETTE: Array<{ bg: string; text: string }> = [
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-amber-100', text: 'text-amber-800' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-sky-100', text: 'text-sky-700' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
]

/**
 * Deterministic pastel-bg + readable-fg color pair from a name.
 * Same name → always same color across reloads.
 */
export function getAvatarColor(name: string): { bg: string; text: string } {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0
  }
  return PALETTE[h % PALETTE.length]
}
