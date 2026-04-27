import type { Filters } from '../types'
import { CATEGORIES } from '../data/categories'
import { SearchIcon } from './icons'

interface Props {
  filters: Filters
  onChange: (next: Filters) => void
  availableYears: number[]
}

export function FilterBar({ filters, onChange, availableYears }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-card px-6 py-5 mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          ariaLabel="Filter by year"
          value={filters.year === 'all' ? 'all' : String(filters.year)}
          onChange={(v) =>
            onChange({ ...filters, year: v === 'all' ? 'all' : Number(v) })
          }
          options={[
            { value: 'all', label: 'All Years' },
            ...availableYears.map((y) => ({ value: String(y), label: String(y) })),
          ]}
          width="w-32"
        />
        <Select
          ariaLabel="Filter by quarter"
          value={filters.quarter === 'all' ? 'all' : String(filters.quarter)}
          onChange={(v) =>
            onChange({
              ...filters,
              quarter: v === 'all' ? 'all' : (Number(v) as 1 | 2 | 3 | 4),
            })
          }
          options={[
            { value: 'all', label: 'All Quarters' },
            { value: '1', label: 'Q1' },
            { value: '2', label: 'Q2' },
            { value: '3', label: 'Q3' },
            { value: '4', label: 'Q4' },
          ]}
          width="w-32"
        />
        <Select
          ariaLabel="Filter by category"
          value={filters.category}
          onChange={(v) =>
            onChange({ ...filters, category: v as Filters['category'] })
          }
          options={[
            { value: 'all', label: 'All Categories' },
            ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
          ]}
          width="w-44"
        />
        <div className="relative flex-1 min-w-[16rem]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search employee..."
            aria-label="Search employee"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 text-sm bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          />
        </div>
      </div>
    </div>
  )
}

interface SelectProps {
  ariaLabel: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
  width: string
}

function Select({ ariaLabel, value, onChange, options, width }: SelectProps) {
  return (
    <div className={`relative ${width}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  )
}
