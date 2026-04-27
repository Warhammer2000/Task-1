import { useMemo, useState } from 'react'
import { USERS } from './data/users'
import {
  compareForLeaderboard,
  computeUserUnderFilters,
  passesSearch,
  uniqueYears,
} from './lib/computed'
import type { Filters } from './types'
import { FilterBar } from './components/FilterBar'
import { Podium } from './components/Podium'
import { LeaderboardList } from './components/LeaderboardList'

const INITIAL_FILTERS: Filters = {
  year: 'all',
  quarter: 'all',
  category: 'all',
  search: '',
}

function App() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const availableYears = useMemo(() => uniqueYears(USERS), [])

  const computed = useMemo(() => {
    const all = USERS.map((u) => computeUserUnderFilters(u, filters))
    const filteredByName = all.filter((c) =>
      passesSearch(c.user.name, filters.search),
    )
    return [...filteredByName].sort(compareForLeaderboard)
  }, [filters])

  const top3 = useMemo(() => computed.slice(0, 3), [computed])

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Leaderboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Top performers based on contributions and activity
          </p>
        </header>
        <FilterBar
          filters={filters}
          onChange={setFilters}
          availableYears={availableYears}
        />
        <Podium top3={top3} />
        <LeaderboardList
          users={computed}
          expandedIds={expandedIds}
          onToggle={toggleExpand}
        />
      </main>
    </div>
  )
}

export default App
