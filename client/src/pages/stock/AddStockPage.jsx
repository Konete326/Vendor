import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { stockAPI, partsAPI } from '../../services/api'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const emptyItem = () => ({ part: '', quantity: '', unitCost: '' })

export default function AddStockPage() {
  const navigate = useNavigate()
  const [parts, setParts] = useState([])
  const [supplierName, setSupplierName] = useState('')
  const [invoiceRef, setInvoiceRef] = useState('')
  const [items, setItems] = useState([emptyItem()])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    partsAPI.getAll({ limit: 200 }).then(({ data }) => setParts(data.data?.parts ?? data.data ?? [])).catch(() => {})
  }, [])

  const partOptions = [{ value: '', label: 'Select Part' }, ...parts.map((p) => ({ value: p._id, label: `${p.name} (${p.sku})` }))]

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const addRow = () => setItems((prev) => [...prev, emptyItem()])
  const removeRow = (index) => setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))

  const totalCost = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0
    const cost = Number(item.unitCost) || 0
    return sum + qty * cost
  }, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const validItems = items.filter((item) => item.part && item.quantity)
    if (!supplierName || validItems.length === 0) {
      setError('Supplier and at least one part with quantity are required')
      return
    }
    setSubmitting(true)
    try {
      await stockAPI.create({
        supplierName,
        invoiceRef,
        items: validItems.map((item) => ({
          part: item.part,
          quantity: Number(item.quantity),
          unitCost: Number(item.unitCost) || 0,
        })),
      })
      navigate('/stock')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create stock entry')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/stock" className="inline-flex items-center gap-2 text-sm text-app-text-secondary hover:text-app-text transition-colors">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Stock
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-app-text">Add Stock Entry</h1>
        <p className="text-app-text-secondary text-sm mt-1">Log a bulk shipment with multiple parts.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Supplier Name" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} required placeholder="Supplier name" />
            <Input label="Invoice Reference" value={invoiceRef} onChange={(e) => setInvoiceRef(e.target.value)} placeholder="Invoice # (optional)" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-app-text-secondary">Shipment Items</label>
              <Button type="button" variant="secondary" size="sm" onClick={addRow} className="inline-flex items-center gap-1">
                <PlusIcon className="w-4 h-4" /> Add Row
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end p-3 rounded-lg bg-app-muted border border-app-border">
                  <div className="sm:col-span-5">
                    <Input type="select" label={index === 0 ? 'Part' : undefined} options={partOptions} value={item.part} onChange={(e) => updateItem(index, 'part', e.target.value)} />
                  </div>
                  <div className="sm:col-span-3">
                    <Input type="number" label={index === 0 ? 'Qty' : undefined} min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} placeholder="1" />
                  </div>
                  <div className="sm:col-span-3">
                    <Input type="number" label={index === 0 ? 'Unit Cost' : undefined} min="0" step="0.01" value={item.unitCost} onChange={(e) => updateItem(index, 'unitCost', e.target.value)} placeholder="0.00" />
                  </div>
                  <div className="sm:col-span-1 flex justify-end pb-1">
                    <button type="button" onClick={() => removeRow(index)} className="text-red-400 hover:text-red-300 p-2">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-app-muted rounded-lg px-4 py-3 border border-app-border">
            <span className="text-app-text-secondary font-medium">Total Shipment Cost</span>
            <span className="text-xl font-bold text-teal-500 dark:text-teal-400">${totalCost.toFixed(2)}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting} className="flex-1">{submitting ? 'Saving...' : 'Save Entry'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/stock')} disabled={submitting}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
