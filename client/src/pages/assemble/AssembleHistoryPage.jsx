import { useState, useEffect } from 'react'
import { TrashIcon, PencilIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { assemblesAPI, bikesAPI } from '../../services/api'

export default function AssembleHistoryPage() {
  const [assemblies, setAssemblies] = useState([])
  const [bikes, setBikes] = useState([])
  const [filterBike, setFilterBike] = useState('')
  const [filterType, setFilterType] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingAssembly, setEditingAssembly] = useState(null)
  const [quantity, setQuantity] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filterBike) params.bike = filterBike
      if (filterType) params.assemblyType = filterType
      const [aRes, bRes] = await Promise.all([
        assemblesAPI.getAll(params),
        bikesAPI.getAll(),
      ])
      setAssemblies(aRes.data.data)
      setBikes(bRes.data.data)
    } catch {
      alert('Error fetching assembly logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterBike, filterType])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assembly? Linked stock will be restored!')) return
    try {
      await assemblesAPI.delete(id)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting assembly')
    }
  }

  const handleOpenEdit = (asm) => {
    setEditingAssembly(asm)
    setQuantity(asm.totalQuantity)
    setModalOpen(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await assemblesAPI.update(editingAssembly._id, { totalQuantity: quantity })
      setModalOpen(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating assembly quantity')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-app-text">Ready to Sale (Assembly Logs)</h1>
        <p className="text-app-text-secondary text-sm">View completed assemblies and manage production totals</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-app-panel border border-app-border rounded-xl p-4">
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
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-app-bg border border-app-input-border text-app-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Types</option>
            <option value="Front">Front</option>
            <option value="Rear">Rear</option>
            <option value="Brake Show">Brake Show</option>
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
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Bike Category</th>
                  <th className="px-6 py-4">Assembly Details</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Total Quantity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {assemblies.map((asm) => (
                  <tr key={asm._id} className="hover:bg-app-bg/50">
                    <td className="px-6 py-4 text-xs font-medium text-app-text-secondary">
                      {new Date(asm.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      <div className="text-[10px] text-app-text-muted mt-0.5">
                        {new Date(asm.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-app-text">{asm.bikeCategory}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-app-text text-sm">{asm.assemblyName || <span className="italic text-app-text-muted font-normal text-xs">Unnamed Batch</span>}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {asm.items.map((i, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-app-bg text-app-text-secondary border border-app-border font-medium">
                            {i.material?.name || 'Material'} ({i.qualityName}): x{i.usedQuantity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-500 border border-teal-500/20">{asm.assemblyType}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-app-text text-base">{asm.totalQuantity}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">Ready to Sale</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(asm)}
                          className="p-1.5 hover:bg-app-muted rounded-lg text-app-text-secondary hover:text-app-text transition-colors cursor-pointer"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(asm._id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-app-panel border border-app-border rounded-xl max-w-sm w-full p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-app-text">Edit Assembly Quantity</h2>
              <p className="text-xs text-app-text-secondary">{editingAssembly?.assemblyName || 'Assembly'}</p>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-app-text-secondary">Quantity Produced</label>
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
