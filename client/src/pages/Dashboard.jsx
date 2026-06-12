import { useState, useEffect } from 'react'
import { WrenchScrewdriverIcon, ArrowUpIcon, BoltIcon } from '@heroicons/react/24/outline'
import { partsAPI, stockAPI, jumpsAPI } from '../services/api'
import Card from '../components/common/Card'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalParts: 0,
    stockInToday: 0,
    activeAssemblies: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const today = new Date().toISOString().split('T')[0]
        const [partsRes, stockRes, jumpsRes] = await Promise.all([
          partsAPI.getAll({ limit: 1 }),
          stockAPI.getAll({ startDate: today, endDate: today, limit: 1 }),
          jumpsAPI.getAll({ limit: 1000 }),
        ])
        const totalParts = partsRes.data.data?.total || 0
        const stockInToday = stockRes.data.data?.total || 0
        const allJumps = jumpsRes.data.data?.jumps || []
        const activeAssemblies = allJumps.filter((j) => j.status === 'Pending').length
        setStats({ totalParts, stockInToday, stockOutToday: 0, activeAssemblies })
      } catch {
        setStats({ totalParts: 0, stockInToday: 0, activeAssemblies: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Parts', icon: WrenchScrewdriverIcon, count: stats.totalParts },
    { label: 'Shipments Today', icon: ArrowUpIcon, count: stats.stockInToday },
    { label: 'Pending Assemblies', icon: BoltIcon, count: stats.activeAssemblies },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-app-text mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.label}>
            <div className="flex items-center gap-4">
              <card.icon className="w-8 h-8 text-teal-400" />
              <div>
                <p className="text-app-text-secondary text-sm">{card.label}</p>
                <p className="text-3xl font-bold text-app-text">{card.count}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
