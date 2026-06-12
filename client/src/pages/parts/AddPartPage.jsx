import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { partsAPI } from '../../services/api'
import { EMPTY_PART_FORM } from '../../utils/partConstants'
import { buildPartFormData } from '../../utils/partFormHelpers'
import PartFormFields from '../../components/parts/PartFormFields'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function AddPartPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...EMPTY_PART_FORM })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await partsAPI.create(buildPartFormData(form, image))
      navigate('/parts')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to create part')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/parts" className="inline-flex items-center gap-2 text-sm text-app-text-secondary hover:text-app-text transition-colors">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Parts
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-app-text">Add Part</h1>
        <p className="text-app-text-secondary text-sm mt-1">Add a new component to the parts catalog.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <PartFormFields form={form} onChange={handleChange} image={image} onImageChange={setImage} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Saving...' : 'Add Part'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/parts')} disabled={loading}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
