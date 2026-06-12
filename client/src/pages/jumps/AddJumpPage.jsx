import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { jumpsAPI } from '../../services/api'
import PartsCatalog from '../../components/jumps/PartsCatalog'
import AssemblyBasket from '../../components/jumps/AssemblyBasket'
import Card from '../../components/common/Card'

export default function AddJumpPage() {
  const navigate = useNavigate()
  const [basket, setBasket] = useState([])
  const [form, setForm] = useState({ name: '', bikeCategory: '125cc', assembledBy: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const basketIds = new Set(basket.map((b) => b.part._id))

  const handleAddPart = (part) => {
    setBasket((prev) => [...prev, { part, quantity: 1, qualityGrade: 'Grade B' }])
  }

  const handleUpdateItem = (partId, field, value) => {
    setBasket((prev) =>
      prev.map((item) =>
        item.part._id === partId ? { ...item, [field]: field === 'quantity' ? Math.max(1, value) : value } : item
      )
    )
  }

  const handleRemoveItem = (partId) => {
    setBasket((prev) => prev.filter((item) => item.part._id !== partId))
  }

  const handleFormChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.assembledBy || basket.length === 0) {
      setError('Name, worker, and at least one part are required')
      return
    }
    setSubmitting(true)
    try {
      await jumpsAPI.create({
        name: form.name,
        bikeCategory: form.bikeCategory,
        assembledBy: form.assembledBy,
        parts: basket.map((item) => ({
          part: item.part._id,
          quantity: item.quantity,
          qualityGrade: item.qualityGrade,
        })),
      })
      navigate('/jumps')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assembly')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link to="/jumps" className="inline-flex items-center gap-2 text-sm text-app-text-secondary hover:text-app-text transition-colors">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Assemblies
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-app-text">New Assembly Ticket</h1>
        <p className="text-app-text-secondary text-sm mt-1">Select parts and build a jump assembly ticket.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[32rem]">
        <Card className="flex flex-col">
          <h2 className="text-lg font-semibold text-app-text mb-4">Parts Catalog</h2>
          <PartsCatalog onAddPart={handleAddPart} basketIds={basketIds} />
        </Card>
        <Card className="flex flex-col">
          <h2 className="text-lg font-semibold text-app-text mb-4">Assembly Basket</h2>
          <AssemblyBasket
            basket={basket}
            form={form}
            onFormChange={handleFormChange}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
          />
        </Card>
      </div>
    </div>
  )
}
