import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { partsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { PART_CATEGORY_FILTER } from '../../utils/partConstants'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'
import PartCard from '../../components/parts/PartCard'

export default function PartsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [parts, setParts] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => { setPage(1) }, [debouncedSearch, category])

  const fetchParts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 9 }
      if (debouncedSearch) params.search = debouncedSearch
      if (category) params.category = category
      const { data } = await partsAPI.getAll(params)
      setParts(data.data?.parts ?? data.data ?? [])
      setPages(data.data?.pages ?? 1)
      setTotal(data.data?.total ?? 0)
    } catch {
      setParts([])
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, category])

  useEffect(() => { fetchParts() }, [fetchParts])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this part?')) return
    try {
      await partsAPI.delete(id)
      fetchParts()
    } catch {}
  }

  const canManage = user?.role === 'admin' || user?.role === 'vendor'

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-app-text">Parts Management</h1>
        <Button variant="primary" onClick={() => navigate('/parts/add')} className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Part
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-panel border border-app-border text-app-text rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-teal-400 transition-colors placeholder:text-app-text-muted"
          />
        </div>
        <Input type="select" value={category} onChange={(e) => setCategory(e.target.value)} options={PART_CATEGORY_FILTER} className="w-48" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : parts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-app-text-secondary text-lg">No parts found</p>
          <Button variant="primary" onClick={() => navigate('/parts/add')} className="flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Add your first part
          </Button>
        </div>
      ) : (
        <>
          <div className="text-app-text-secondary text-sm">{total} part{total !== 1 ? 's' : ''} found</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parts.map((part) => (
              <PartCard key={part._id} part={part} onEdit={(p) => navigate(`/parts/${p._id}/edit`)} onDelete={handleDelete} />
            ))}
          </div>
          {pages > 1 && (
            <div className="flex justify-center">
              <Pagination page={page} pages={pages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
