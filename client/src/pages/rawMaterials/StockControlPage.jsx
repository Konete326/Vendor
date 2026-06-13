import { useState, useEffect } from 'react'
import { PlusIcon, PencilSquareIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { rawMaterialsAPI, bikesAPI } from '../../services/api'

export default function StockControlPage() {
  const [materials, setMaterials] = useState([])
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterBike, setFilterBike] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [selectedQuality, setSelectedQuality] = useState('')
  const [adjustMode, setAdjustMode] = useState('add')
  const [quantity, setQuantity] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [mRes, bRes] = await Promise.all([
        rawMaterialsAPI.getAll(filterBike ? { bike: filterBike } : {}),
        bikesAPI.getAll(),
      ])
      setMaterials(mRes.data?.data || mRes.data || [])
      setBikes(bRes.data?.data || bRes.data || [])
    } catch {
      alert('Error fetching inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterBike])

  const handleOpenAdjust = (material, quality, mode) => {
    setSelectedMaterial(material)
    setSelectedQuality(quality)
    setAdjustMode(mode)
    setQuantity(mode === 'add' ? 10 : quality.quantity)
    setModalOpen(true)
  }

  const handleAdjustSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await rawMaterialsAPI.adjustStock(selectedMaterial._id, {
        qualityName: selectedQuality.qualityName,
        quantity: quantity,
        mode: adjustMode,
      })
      setModalOpen(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating stock')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-app-text">Stock Control</h1>
        <p className="text-app-text-secondary text-sm">Update and manage inventory quantities for all raw materials</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-app-panel border border-app-border rounded-xl p-4">
        <div className="flex-1 flex items-center gap-2 bg-app-bg border border-app-input-border rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-teal-500">
          <MagnifyingGlassIcon className="w-5 h-5 text-app-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search materials..."
            className="bg-transparent border-0 text-app-text text-sm w-full focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-app-text-secondary" />
          <select
            value={filterBike}
            onChange={(e) => setFilterBike(e.target.value)}
            className="bg-app-bg border border-app-input-border text-app-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Bikes</option>
            {bikes.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-app-text-secondary">Loading...</p>
      ) : (
        <div className="bg-app-panel border border-app-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-app-text border-collapse">
              <thead className="bg-app-bg border-b border-app-border text-app-text-secondary text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Material Name</th>
                  <th className="px-6 py-4">Bike Model</th>
                  <th className="px-6 py-4">Quality Name</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {filteredMaterials.flatMap((m) =>
                  m.qualities.map((q) => {
                    const isLow = q.quantity <= q.alertThreshold
                    return (
                      <tr key={`${m._id}-${q.qualityName}`} className="hover:bg-app-bg/50">
                        <td className="px-6 py-4 font-medium">{m.name}</td>
                        <td className="px-6 py-4">{m.bike?.name || 'N/A'}</td>
                        <td className="px-6 py-4">{q.qualityName}</td>
                        <td className="px-6 py-4 font-bold">{q.quantity}</td>
                        <td className="px-6 py-4">
                          {isLow ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/10 text-red-400">Low Stock</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400">Healthy</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenAdjust(m, q, 'add')}
                              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-500 text-xs font-bold px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <PlusIcon className="w-3.5 h-3.5" /> Add
                            </button>
                            <button
                              onClick={() => handleOpenAdjust(m, q, 'edit')}
                              className="bg-app-muted hover:bg-app-muted/80 text-app-text text-xs font-bold px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-app-panel border border-app-border rounded-xl max-w-sm w-full p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-app-text">{adjustMode === 'add' ? 'Add Incoming Stock' : 'Edit Stock Balance'}</h2>
              <p className="text-xs text-app-text-secondary">{selectedMaterial?.name} ({selectedQuality?.qualityName})</p>
            </div>
            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-app-text-secondary">{adjustMode === 'add' ? 'Quantity to Add' : 'New Balance'}</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-app-border text-app-text-secondary hover:text-app-text hover:bg-app-muted rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  {submitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
