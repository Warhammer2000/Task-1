import { StarIcon } from './icons'

interface Props {
  value: number
  size?: 'sm' | 'md' | 'lg'
}

export function TotalScore({ value, size = 'sm' }: Props) {
  const textCls = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'
  const iconCls = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className={`inline-flex items-center gap-1.5 text-sky-500 font-bold ${textCls}`}>
      <StarIcon className={iconCls} />
      <span>{value}</span>
    </div>
  )
}
