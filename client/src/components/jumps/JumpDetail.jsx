import { useState, useEffect } from 'react'
import { jumpsAPI } from '../../services/api'
import { getPartGradePrice } from '../../utils/partPricing'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'
import Button from '../common/Button'

export default function JumpDetail({ isOpen, onClose, jumpId }) {
  const [assembly, setAssembly] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !jumpId) return
    setLoading(true)
    jumpsAPI.getById(jumpId)
      .then(({ data }) => setAssembly(data.data ?? data))
      .catch(() => setAssembly(null))
      .finally(() => setLoading(false))
  }, [isOpen, jumpId])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assembly Details">
      {loading ? (
        <LoadingSpinner />
      ) : !assembly ? (
        <p className="text-app-text-secondary text-center py-4">Assembly not found.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-app-text">{assembly.name}</h4>
            <span className="bg-teal-500/20 text-teal-500 dark:text-teal-400 rounded-full px-2 py-1 text-xs">{assembly.bikeCategory}</span>
          </div>

          <div className="text-sm text-app-text-secondary space-y-1">
            <p>Worker: <span className="text-app-text">{assembly.assembledBy || 'Unknown'}</span></p>
            <p>Status: <span className="text-app-text">{assembly.status}</span></p>
            <p>Created: <span className="text-app-text">{new Date(assembly.createdAt).toLocaleDateString()}</span></p>
          </div>

          <div className="bg-app-muted/30 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-app-muted/50 text-app-text-secondary">
                <tr>
                  <th className="text-left px-3 py-2">Part</th>
                  <th className="text-left px-3 py-2">Grade</th>
                  <th className="text-right px-3 py-2">Qty</th>
                  <th className="text-right px-3 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {assembly.parts?.map((p, i) => {
                  const price = getPartGradePrice(p.part, p.qualityGrade)
                  return (
                    <tr key={i}>
                      <td className="px-3 py-2 text-app-text">{p.part?.name || '—'}</td>
                      <td className="px-3 py-2 text-app-text-secondary">{p.qualityGrade || '—'}</td>
                      <td className="px-3 py-2 text-app-text text-right">{p.quantity}</td>
                      <td className="px-3 py-2 text-app-text text-right font-medium">${(price * p.quantity).toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between bg-app-muted/50 rounded-lg px-4 py-3">
            <span className="text-app-text-secondary font-medium">Total Cost</span>
            <span className="text-teal-500 dark:text-teal-400 text-lg font-bold">${(assembly.totalCost || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
