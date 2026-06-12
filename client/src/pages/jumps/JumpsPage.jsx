import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'
import { jumpsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { BIKE_CATEGORIES, JUMP_STATUSES } from '../../utils/partConstants'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import JumpDetail from '../../components/jumps/JumpDetail'

const statusColors = {
  Pending: 'bg-yellow-500/20 text-yellow-500',
  Ready: 'bg-green-500/20 text-green-400',
}

export default function JumpsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [jumps, setJumps] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ bikeCategory: '', status: '' })
  const [viewJumpId, setViewJumpId] = useState(null)

  const fetchJumps = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 9 }
      if (filters.bikeCategory) params.bikeCategory = filters.bikeCategory
      if (filters.status) params.status = filters.status
      const { data } = await jumpsAPI.getAll(params)
      setJumps(data.data?.jumps ?? [])
      setPage(data.data?.page ?? 1)
      setPages(data.data?.pages ?? 1)
    } catch {
      setJumps([])
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { fetchJumps() }, [fetchJumps])

  const handleDelete = async (id) => {
    if (!confirm('Delete this assembly?')) return
    try { await jumpsAPI.delete(id); fetchJumps() } catch {}
  }

  const markReady = async (id) => {
    try {
      await jumpsAPI.updateStatus(id, 'Ready')
      fetchJumps()
    } catch {}
  }

  const updateFilter = (key, value) => { setFilters((p) => ({ ...p, [key]: value })); setPage(1) }

  const categoryFilter = [{ value: '', label: 'All Categories' }, ...BIKE_CATEGORIES]
  const statusFilter = [{ value: '', label: 'All Statuses' }, ...JUMP_STATUSES]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-app-text">Jump Assemblies</h1>
        <Button onClick={() => navigate('/jumps/add')} className="inline-flex items-center">
          <PlusIcon className="w-4 h-4 mr-2" />New Assembly
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 bg-app-panel rounded-xl p-4 border border-app-border">
        <div className="w-48"><Input type="select" options={categoryFilter} value={filters.bikeCategory} onChange={(e) => updateFilter('bikeCategory', e.target.value)} /></div>
        <div className="w-44"><Input type="select" options={statusFilter} value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} /></div>
      </div>

      {loading ? <LoadingSpinner /> : jumps.length === 0 ? (
        <p className="text-app-text-secondary text-center py-10">No assemblies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jumps.map((jump) => (
            <Card key={jump._id} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-app-text">{jump.name}</h3>
                  <span className="bg-teal-500/20 text-teal-500 dark:text-teal-400 rounded-full px-2 py-1 text-xs">{jump.bikeCategory}</span>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[jump.status]}`}>{jump.status}</span>
                <p className="text-app-text-secondary text-sm">{jump.parts?.length || 0} parts</p>
                <p className="text-lg font-bold text-teal-500 dark:text-teal-400">${(jump.totalCost || 0).toFixed(2)}</p>
                <p className="text-app-text-secondary text-xs">Worker: {jump.assembledBy || 'Unknown'}</p>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-app-border">
                <button onClick={() => setViewJumpId(jump._id)} className="p-2 rounded-lg text-app-text-secondary hover:text-app-text hover:bg-app-muted transition-colors"><EyeIcon className="w-4 h-4" /></button>
                {(user?.role === 'admin' || user?.role === 'vendor') && jump.status === 'Pending' && (
                  <Button size="sm" variant="secondary" onClick={() => markReady(jump._id)} className="text-xs">Mark Ready</Button>
                )}
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(jump._id)} className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-app-muted transition-colors ml-auto"><TrashIcon className="w-4 h-4" /></button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center"><Pagination page={page} pages={pages} onPageChange={setPage} /></div>
      <JumpDetail isOpen={!!viewJumpId} onClose={() => setViewJumpId(null)} jumpId={viewJumpId} />
    </div>
  )
}
