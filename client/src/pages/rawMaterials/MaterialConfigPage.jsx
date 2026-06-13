import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { rawMaterialsAPI, bikesAPI } from '../../services/api'
import MaterialFormModal from './MaterialFormModal'

export default function MaterialConfigPage() {
  const [materials, setMaterials] = useState([])
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterBike, setFilterBike] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)

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
      alert('Error fetching raw material configuration')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterBike])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return
    try {
      await rawMaterialsAPI.delete(id)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting material')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Material Configuration</h1>
          <p className="text-app-text-secondary text-sm">Configure materials, qualities, and pricing per bike category</p>
        </div>
        <button
          onClick={() => { setEditingMaterial(null); setModalOpen(true); }}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" /> Add Material
        </button>
      </div>

      <div className="bg-app-panel border border-app-border rounded-xl p-4 flex items-center gap-3">
        <FunnelIcon className="w-5 h-5 text-app-text-secondary" />
        <select
          value={filterBike}
          onChange={(e) => setFilterBike(e.target.value)}
          className="bg-app-bg border border-app-input-border text-app-text text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Bikes</option>
          {bikes.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-app-text-secondary">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((m) => (
            <div key={m._id} className="bg-app-panel border border-app-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-app-bg border border-app-border rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    {m.image?.url ? (
                      <img src={m.image.url} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-app-text-muted text-[10px]">No Image</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-app-text">{m.name}</h3>
                    <p className="text-xs text-app-text-secondary">Bike: {m.bike?.name || 'N/A'}</p>
                    <p className="text-xs text-app-text-secondary">Part Type: {m.partType}</p>
                  </div>
                </div>
                <div className="space-y-2 border-t border-app-border pt-3">
                  <p className="text-xs font-semibold text-app-text-secondary">Variations / Qualities:</p>
                  {m.qualities.length === 0 ? (
                    <p className="text-xs text-app-text-muted">No qualities configured</p>
                  ) : (
                    m.qualities.map((q) => (
                      <div key={q._id} className="flex justify-between text-xs bg-app-bg/50 px-2 py-1 rounded">
                        <span className="text-app-text">{q.qualityName}</span>
                        <span className="text-app-text-secondary">Rs. {q.price} (Thresh: {q.alertThreshold})</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-app-border">
                <button
                  onClick={() => { setEditingMaterial(m); setModalOpen(true); }}
                  className="p-1.5 hover:bg-app-muted rounded-lg text-app-text-secondary hover:text-app-text transition-colors cursor-pointer"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <MaterialFormModal
          material={editingMaterial}
          bikes={bikes}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetchData(); }}
        />
      )}
    </div>
  )
}
