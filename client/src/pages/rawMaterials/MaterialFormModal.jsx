import { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { rawMaterialsAPI } from '../../services/api'

export default function MaterialFormModal({ material, bikes, onClose, onSaved }) {
  const [name, setName] = useState('')
  const [bikeId, setBikeId] = useState('')
  const [partType, setPartType] = useState('None')
  const [imageFile, setImageFile] = useState(null)
  const [qualities, setQualities] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (material) {
      setName(material.name)
      setBikeId(material.bike?._id || material.bike || '')
      setPartType(material.partType || 'None')
      setQualities(material.qualities.map((q) => ({ qualityName: q.qualityName, price: q.price, alertThreshold: q.alertThreshold })))
    } else {
      setName('')
      setBikeId(bikes[0]?._id || '')
      setPartType('None')
      setQualities([{ qualityName: 'Quality A', price: 0, alertThreshold: 5 }])
    }
  }, [material, bikes])

  const handleQualityChange = (idx, field, val) => {
    const updated = [...qualities]
    updated[idx][field] = field === 'qualityName' ? val : Number(val)
    setQualities(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !bikeId) return setError('Name and Bike Category are required')
    if (qualities.some((q) => !q.qualityName)) return setError('All qualities must have a name')
    setSubmitting(true)
    setError('')
    const formData = new FormData()
    formData.append('name', name)
    formData.append('bike', bikeId)
    formData.append('partType', partType)
    formData.append('qualities', JSON.stringify(qualities))
    if (imageFile) formData.append('image', imageFile)

    try {
      if (material) {
        await rawMaterialsAPI.update(material._id, formData)
      } else {
        await rawMaterialsAPI.create(formData)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving material config')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-app-panel border border-app-border rounded-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-app-text">{material ? 'Edit Material' : 'Add Material'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-app-text-secondary">Material Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Rim" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-app-text-secondary">Bike Category</label>
              <select value={bikeId} onChange={(e) => setBikeId(e.target.value)} className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">Select Bike</option>
                {bikes.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-app-text-secondary">Part Type</label>
              <select value={partType} onChange={(e) => setPartType(e.target.value)} className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="Front">Front</option>
                <option value="Rear">Rear</option>
                <option value="Brake Show">Brake Show</option>
                <option value="None">None</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-app-text-secondary">Image</label>
              <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-app-text-secondary text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-500/10 file:text-teal-500 hover:file:bg-teal-500/20" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-app-text">Qualities & Variations</span>
              <button type="button" onClick={() => setQualities([...qualities, { qualityName: '', price: 0, alertThreshold: 5 }])} className="text-teal-500 hover:text-teal-600 flex items-center gap-1 text-xs font-semibold cursor-pointer">
                <PlusIcon className="w-4 h-4" /> Add Quality
              </button>
            </div>
            <div className="space-y-2">
              {qualities.map((q, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input type="text" placeholder="Name (e.g. Quality A)" value={q.qualityName} onChange={(e) => handleQualityChange(idx, 'qualityName', e.target.value)} className="flex-1 bg-app-bg border border-app-input-border text-app-text rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="number" placeholder="Price" value={q.price} onChange={(e) => handleQualityChange(idx, 'price', e.target.value)} className="w-20 bg-app-bg border border-app-input-border text-app-text rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="number" placeholder="Alert Thresh" value={q.alertThreshold} onChange={(e) => handleQualityChange(idx, 'alertThreshold', e.target.value)} className="w-24 bg-app-bg border border-app-input-border text-app-text rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <button type="button" onClick={() => setQualities(qualities.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-500 p-1 cursor-pointer">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-app-border">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-app-border text-app-text-secondary hover:text-app-text hover:bg-app-muted rounded-lg text-sm font-semibold cursor-pointer">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-semibold cursor-pointer">{submitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
