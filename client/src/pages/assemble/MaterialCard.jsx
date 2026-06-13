export default function MaterialCard({ material, selection, onSelectionChange }) {
  const isEnabled = !!selection?.enabled
  const selectedQual = material.qualities.find((q) => q.qualityName === selection?.qualityName)

  return (
    <div
      className={`bg-app-panel border rounded-xl p-4 flex flex-col justify-between shadow-sm transition-all ${
        isEnabled ? 'border-teal-500 ring-1 ring-teal-500/30' : 'border-app-border'
      }`}
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-app-bg border border-app-border rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
          {material.image?.url ? (
            <img src={material.image.url} alt={material.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-app-text-muted text-[10px] font-medium">No Image</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-app-text truncate">{material.name}</h4>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => onSelectionChange('enabled', e.target.checked)}
              className="w-4 h-4 accent-teal-500 cursor-pointer flex-shrink-0"
            />
          </div>
          <p className="text-[11px] text-app-text-secondary line-clamp-2 mt-0.5">
            Select quality grade and quantity required per assembly unit
          </p>
        </div>
      </div>

      {isEnabled && (
        <div className="mt-4 pt-3 border-t border-app-border space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-app-text-secondary">Quality Grade</label>
            <select
              value={selection?.qualityName || ''}
              onChange={(e) => onSelectionChange('qualityName', e.target.value)}
              className="w-full bg-app-bg border border-app-input-border text-app-text text-xs rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {material.qualities.map((q) => (
                <option key={q._id} value={q.qualityName}>
                  {q.qualityName} (Available: {q.quantity})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-app-text-secondary">Quantity per Unit:</span>
            <input
              type="number"
              value={selection?.usedQuantity || 1}
              onChange={(e) => onSelectionChange('usedQuantity', e.target.value)}
              className="w-20 bg-app-bg border border-app-input-border text-app-text text-xs rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 text-center font-semibold"
              min="1"
            />
          </div>
          {selectedQual && (
            <div className="text-[11px] text-app-text-muted flex justify-between">
              <span>Unit Cost: Rs. {selectedQual.price}</span>
              <span>Subtotal: Rs. {selectedQual.price * (selection?.usedQuantity || 1)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
