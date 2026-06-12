import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { stockAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function StockPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ supplier: '', startDate: '', endDate: '' })

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (filters.supplier) params.supplier = filters.supplier
      if (filters.startDate) params.startDate = filters.startDate
      if (filters.endDate) params.endDate = filters.endDate
      const { data } = await stockAPI.getAll(params)
      setEntries(data.data?.entries ?? [])
      setPage(data.data?.page ?? 1)
      setPages(data.data?.pages ?? 1)
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const handleDelete = async (id) => {
    if (!confirm('Delete this stock entry? Stock will be reversed.')) return
    try {
      await stockAPI.delete(id)
      fetchEntries()
    } catch {}
  }

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-app-text">Stock Management</h1>
        <Button onClick={() => navigate('/stock/add')} className="inline-flex items-center">
          <PlusIcon className="w-4 h-4 mr-2" />Add Entry
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 bg-app-panel rounded-xl p-4 border border-app-border">
        <Input placeholder="Search supplier..." value={filters.supplier} onChange={(e) => updateFilter('supplier', e.target.value)} className="w-48" />
        <Input type="date" value={filters.startDate} onChange={(e) => updateFilter('startDate', e.target.value)} className="w-40" />
        <Input type="date" value={filters.endDate} onChange={(e) => updateFilter('endDate', e.target.value)} className="w-40" />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : entries.length === 0 ? (
        <p className="text-app-text-secondary text-center py-10">No stock entries found.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry._id} className="bg-app-panel rounded-xl border border-app-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-app-muted/50 border-b border-app-border">
                <div>
                  <p className="font-semibold text-app-text">{entry.supplierName}</p>
                  <p className="text-xs text-app-text-secondary">
                    {entry.invoiceRef ? `Invoice: ${entry.invoiceRef} · ` : ''}
                    {new Date(entry.createdAt).toLocaleDateString()} · {entry.items?.length || 0} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-teal-500 dark:text-teal-400 font-bold">${(entry.totalCost || 0).toFixed(2)}</span>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(entry._id)} className="text-red-400 hover:text-red-300">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-app-border">
                  {entry.items?.map((item, i) => (
                    <tr key={i} className="hover:bg-app-muted/30">
                      <td className="px-4 py-2 text-app-text">{item.part?.name || '—'}</td>
                      <td className="px-4 py-2 text-app-text-secondary">{item.part?.sku || '—'}</td>
                      <td className="px-4 py-2 text-app-text">{item.quantity}</td>
                      <td className="px-4 py-2 text-app-text-secondary">${(item.unitCost || 0).toFixed(2)}</td>
                      <td className="px-4 py-2 text-app-text font-medium">${((item.unitCost || 0) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </div>
  )
}
