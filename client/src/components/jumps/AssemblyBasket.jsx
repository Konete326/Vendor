import { XMarkIcon } from '@heroicons/react/24/outline'
import Input from '../common/Input'
import Button from '../common/Button'
import { BIKE_CATEGORIES, QUALITY_GRADES } from '../../utils/partConstants'
import { getPartGradePrice } from '../../utils/partPricing'

export default function AssemblyBasket({
  basket,
  form,
  onFormChange,
  onUpdateItem,
  onRemoveItem,
  onSubmit,
  submitting,
  error,
}) {
  const total = basket.reduce(
    (sum, item) => sum + getPartGradePrice(item.part, item.qualityGrade) * item.quantity,
    0
  )

  return (
    <div className="flex flex-col h-full">
      <Input label="Ticket Name" name="name" value={form.name} onChange={onFormChange} required />
      <div className="grid grid-cols-2 gap-3 mt-3">
        <Input label="Bike Category" name="bikeCategory" type="select" value={form.bikeCategory} onChange={onFormChange} options={BIKE_CATEGORIES} />
        <Input label="Worker Name" name="assembledBy" value={form.assembledBy} onChange={onFormChange} required placeholder="Technician name" />
      </div>

      <div className="mt-4 flex-1 overflow-y-auto space-y-2 max-h-64">
        {basket.length === 0 ? (
          <p className="text-app-text-secondary text-sm text-center py-6">Select parts from the catalog</p>
        ) : (
          basket.map((item) => (
            <div key={item.part._id} className="flex items-center gap-2 p-2 rounded-lg bg-app-muted border border-app-border">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-app-text truncate">{item.part.name}</p>
                <select
                  value={item.qualityGrade}
                  onChange={(e) => onUpdateItem(item.part._id, 'qualityGrade', e.target.value)}
                  className="mt-1 w-full text-xs bg-app-panel border border-app-border rounded px-2 py-1 text-app-text"
                >
                  {QUALITY_GRADES.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateItem(item.part._id, 'quantity', Number(e.target.value))}
                className="w-14 text-center text-sm bg-app-panel border border-app-border rounded-lg py-1 text-app-text"
              />
              <span className="text-xs text-teal-500 dark:text-teal-400 w-16 text-right">
                ${(getPartGradePrice(item.part, item.qualityGrade) * item.quantity).toFixed(2)}
              </span>
              <button type="button" onClick={() => onRemoveItem(item.part._id)} className="text-red-400 hover:text-red-300">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-app-border">
        {error && <p className="text-red-400 text-sm mb-3 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
        <div className="flex items-center justify-between mb-4">
          <span className="text-app-text-secondary font-medium">Total Cost</span>
          <span className="text-xl font-bold text-teal-500 dark:text-teal-400">${total.toFixed(2)}</span>
        </div>
        <Button type="button" onClick={onSubmit} disabled={submitting || basket.length === 0} className="w-full">
          {submitting ? 'Creating...' : 'Create Assembly Ticket'}
        </Button>
      </div>
    </div>
  )
}
