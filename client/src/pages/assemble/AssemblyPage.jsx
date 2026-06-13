import { useState, useEffect } from 'react'
import { bikesAPI, rawMaterialsAPI, assemblesAPI } from '../../services/api'
import MaterialCard from './MaterialCard'

export default function AssemblyPage() {
  const [bikes, setBikes] = useState([])
  const [materials, setMaterials] = useState([])
  const [activeTab, setActiveTab] = useState('Front')
  const [selectedBike, setSelectedBike] = useState('')
  const [assemblyName, setAssemblyName] = useState('')
  const [totalQuantity, setTotalQuantity] = useState(1)
  const [selections, setSelections] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const bRes = await bikesAPI.getAll()
        const bikes = bRes.data?.data || bRes.data || []
        setBikes(bikes)
        if (bikes.length > 0) {
          setSelectedBike(bikes[0]._id)
        }
      } catch {
        setError('Error fetching initial assembly details')
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (!selectedBike) return
    const fetchMaterials = async () => {
      try {
        const mRes = await rawMaterialsAPI.getAll({ bike: selectedBike, partType: activeTab })
        const matList = mRes.data?.data || mRes.data || []
        setMaterials(matList)
        const newSelections = {}
        matList.forEach((m) => {
          newSelections[m._id] = {
            qualityName: m.qualities[0]?.qualityName || '',
            usedQuantity: 1,
            enabled: m.qualities.length > 0,
          }
        })
        setSelections(newSelections)
      } catch {
        setError('Error fetching raw materials for this category')
      }
    }
    fetchMaterials()
  }, [selectedBike, activeTab])

  const handleSelectionChange = (matId, field, val) => {
    setSelections({
      ...selections,
      [matId]: { ...selections[matId], [field]: val },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!selectedBike || totalQuantity <= 0) return setError('Please select a bike and set quantity')

    const items = Object.entries(selections)
      .filter(([_, sel]) => sel.enabled && sel.qualityName)
      .map(([matId, sel]) => ({
        material: matId,
        qualityName: sel.qualityName,
        usedQuantity: Math.max(1, parseInt(sel.usedQuantity) || 1),
      }))

    if (items.length === 0) return setError('Please choose at least one raw material for assembly')

    setSubmitting(true)
    const bikeObj = bikes.find((b) => b._id === selectedBike)
    try {
      await assemblesAPI.create({
        assemblyType: activeTab,
        assemblyName,
        bike: selectedBike,
        bikeCategory: bikeObj?.name || 'Bike',
        items,
        totalQuantity: Number(totalQuantity),
      })
      setSuccess('Assembly recorded successfully!')
      setAssemblyName('')
      setTotalQuantity(1)
      const freshMat = await rawMaterialsAPI.getAll({ bike: selectedBike, partType: activeTab })
      setMaterials(freshMat.data?.data || freshMat.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Error recording assembly')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-[calc(100vh-135px)] flex flex-col space-y-4 overflow-hidden">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-app-text">New Assembly</h1>
        <p className="text-app-text-secondary text-sm">Create and register finished goods assemblies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-1 bg-app-panel border border-app-border rounded-xl p-5 space-y-4 flex-shrink-0">
          <h2 className="text-lg font-bold text-app-text">Assembly Configuration</h2>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm">{success}</div>}

          <div className="space-y-1">
            <label className="text-sm font-medium text-app-text-secondary">Select Bike</label>
            <select value={selectedBike} onChange={(e) => setSelectedBike(e.target.value)} className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              {bikes.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-app-text-secondary">Assembly/Batch Name (Optional)</label>
            <input type="text" value={assemblyName} onChange={(e) => setAssemblyName(e.target.value)} className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. CD70 Front Wheel Hub" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-app-text-secondary">Units to Produce</label>
            <input type="number" value={totalQuantity} onChange={(e) => setTotalQuantity(Number(e.target.value))} className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" min="1" />
          </div>

          <button type="submit" disabled={submitting} className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer mt-4">
            {submitting ? 'Recording Production...' : 'Record Assembly'}
          </button>
        </form>

        <div className="lg:col-span-2 flex flex-col h-full min-h-0 space-y-4">
          <div className="border-b border-app-border flex gap-4 flex-shrink-0">
            {['Front', 'Rear', 'Brake Show'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === tab ? 'border-teal-500 text-teal-500' : 'border-transparent text-app-text-secondary'
                }`}
              >
                {tab} Materials
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            {materials.length === 0 ? (
              <div className="bg-app-panel border border-app-border rounded-xl p-6 text-center text-sm text-app-text-secondary">
                No raw materials configured for {activeTab} of this bike category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
                {materials.map((m) => (
                  <MaterialCard
                    key={m._id}
                    material={m}
                    selection={selections[m._id]}
                    onSelectionChange={(field, val) => handleSelectionChange(m._id, field, val)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
