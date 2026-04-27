import { useState } from 'react'
import { getAvatarColor, getInitials } from '../lib/initials'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /**
   * When true, render a deterministic DiceBear `bottts` droid SVG instead of
   * an initials placeholder. The seed is the user's name, so reloads are stable.
   * Falls back to the initials placeholder if the SVG fails to load (CDN
   * outage, network blip), so the visual replica never breaks on external
   * dependency failure.
   */
  useAvatar?: boolean
}

const SIZE_CLASS: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-12 h-12 text-sm',
  md: 'w-14 h-14 text-base',
  lg: 'w-24 h-24 text-2xl',
}

/**
 * Avatar with two render modes:
 *   - `useAvatar: true`  → DiceBear bottts droid SVG (Star Wars-themed)
 *   - default            → colored initials placeholder (deterministic per name)
 *
 * Both are RAI-clean: no real human photographs, no corporate identifiers.
 * If a DiceBear request fails, we transparently degrade to initials so the
 * visual replica never shows a broken image.
 */
export function Avatar({
  name,
  size = 'sm',
  className = '',
  useAvatar = false,
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const color = getAvatarColor(name)
  const initials = getInitials(name)

  if (useAvatar && !imageFailed) {
    const url = `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(name)}`
    return (
      <img
        src={url}
        alt={name}
        loading="lazy"
        onError={() => setImageFailed(true)}
        className={`${SIZE_CLASS[size]} ${className} rounded-full bg-slate-100 object-cover shrink-0 select-none`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={name}
      className={`${SIZE_CLASS[size]} ${color.bg} ${color.text} ${className} rounded-full flex items-center justify-center font-semibold select-none shrink-0`}
    >
      {initials}
    </div>
  )
}
