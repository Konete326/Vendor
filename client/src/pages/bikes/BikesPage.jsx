import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { bikesAPI } from '../../services/api'

export default function BikesPage() {
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBike, setEditingBike] = useState(null)
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchBikes = async () => {
    try {
      setLoading(true)
      const res = await bikesAPI.getAll()
      setBikes(res.data?.data || res.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching bikes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBikes()
  }, [])

  const handleOpenModal = (bike = null) => {
    setEditingBike(bike)
    setName(bike ? bike.name : '')
    setImageFile(null)
    setModalOpen(true)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name) return setError('Name is required')
    setSubmitting(true)
    setError('')
    const formData = new FormData()
    formData.append('name', name)
    if (imageFile) formData.append('image', imageFile)

    try {
      if (editingBike) {
        await bikesAPI.update(editingBike._id, formData)
      } else {
        await bikesAPI.create(formData)
      }
      setModalOpen(false)
      fetchBikes()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving bike')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bike category?')) return
    try {
      await bikesAPI.delete(id)
      fetchBikes()
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting bike')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Bikes Category</h1>
          <p className="text-app-text-secondary text-sm">Manage bike categories and models</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" /> Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-app-text-secondary">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bikes.map((bike) => (
            <div key={bike._id} className="bg-app-panel border border-app-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div className="aspect-video bg-app-bg border border-app-border rounded-lg overflow-hidden flex items-center justify-center mb-4">
                {bike.image?.url ? (
                  <img src={bike.image.url} alt={bike.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-app-text-muted text-sm font-medium">No Image</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-app-text mb-1">{bike.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-500 font-semibold">{bike.category}</span>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-app-border">
                <button
                  onClick={() => handleOpenModal(bike)}
                  className="p-1.5 hover:bg-app-muted rounded-lg text-app-text-secondary hover:text-app-text transition-colors cursor-pointer"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(bike._id)}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-app-panel border border-app-border rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-app-text">{editingBike ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
              <div className="space-y-1">
                <label className="text-sm font-medium text-app-text-secondary">Bike Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Honda CD70"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-app-text-secondary">Image</label>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-app-text-secondary text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-500/10 file:text-teal-500 hover:file:bg-teal-500/20"
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
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
