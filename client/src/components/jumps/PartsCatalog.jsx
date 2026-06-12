import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { partsAPI } from '../../services/api'
import { PART_CATEGORY_FILTER } from '../../utils/partConstants'
import Input from '../common/Input'
import LoadingSpinner from '../common/LoadingSpinner'

export default function PartsCatalog({ onAddPart, basketIds }) {
  const [parts, setParts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const params = { limit: 50 }
        if (search) params.search = search
        if (category) params.category = category
        const { data } = await partsAPI.getAll(params)
        setParts(data.data?.parts ?? data.data ?? [])
      } catch {
        setParts([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [search, category])

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parts..."
            className="w-full bg-app-muted border border-app-border text-app-text rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-teal-400"
          />
        </div>
        <Input type="select" value={category} onChange={(e) => setCategory(e.target.value)} options={PART_CATEGORY_FILTER} className="w-36" />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto flex-1 max-h-[calc(100vh-16rem)]">
          {parts.map((part) => (
            <button
              key={part._id}
              type="button"
              disabled={basketIds.has(part._id)}
              onClick={() => onAddPart(part)}
              className="text-left p-3 rounded-lg border border-app-border bg-app-panel hover:border-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <p className="font-medium text-app-text text-sm">{part.name}</p>
              <p className="text-xs text-app-text-secondary">{part.sku} · Stock: {part.stock ?? 0}</p>
              <p className="text-xs text-teal-500 dark:text-teal-400 mt-1">${(part.price ?? 0).toFixed(2)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
