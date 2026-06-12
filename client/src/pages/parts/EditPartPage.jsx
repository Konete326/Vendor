import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { partsAPI } from '../../services/api'
import { partToForm, buildPartFormData } from '../../utils/partFormHelpers'
import PartFormFields from '../../components/parts/PartFormFields'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function EditPartPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [image, setImage] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    partsAPI.getById(id)
      .then(({ data }) => {
        const part = data.data ?? data
        setForm(partToForm(part))
        setExistingImageUrl(part.image?.url ?? '')
      })
      .catch(() => setError('Part not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await partsAPI.update(id, buildPartFormData(form, image))
      navigate('/parts')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to update part')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!form) return <p className="text-app-text-secondary text-center py-10">{error || 'Part not found'}</p>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/parts" className="inline-flex items-center gap-2 text-sm text-app-text-secondary hover:text-app-text transition-colors">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Parts
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-app-text">Edit Part</h1>
        <p className="text-app-text-secondary text-sm mt-1">Update part details and pricing.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <PartFormFields
            form={form}
            onChange={handleChange}
            image={image}
            onImageChange={setImage}
            existingImageUrl={existingImageUrl}
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting} className="flex-1">{submitting ? 'Saving...' : 'Update Part'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/parts')} disabled={submitting}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
