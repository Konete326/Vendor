import { useState, useEffect } from 'react'
import { ShoppingCartIcon, CurrencyDollarIcon, CreditCardIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { salesAPI, bikesAPI, rawMaterialsAPI } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalDue: 0,
    totalBikes: 0,
    lowStockCount: 0,
  })
  const [recentSales, setRecentSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [salesRes, bikesRes, materialsRes] = await Promise.all([
          salesAPI.getAll(),
          bikesAPI.getAll(),
          rawMaterialsAPI.getAll(),
        ])

        const salesData = salesRes.data.data
        const bikesData = bikesRes.data.data
        const materialsData = materialsRes.data.data

        // Calculate low stock items
        let lowStockCount = 0
        materialsData.forEach((m) => {
          m.qualities.forEach((q) => {
            if (q.quantity <= q.alertThreshold) {
              lowStockCount++
            }
          })
        })

        setStats({
          totalSales: salesData.totalSales || 0,
          totalOrders: salesData.sales?.length || 0,
          totalDue: salesData.totalDue || 0,
          totalBikes: bikesData?.length || 0,
          lowStockCount,
        })
        setRecentSales(salesData.sales?.slice(0, 5) || [])
      } catch {
        alert('Error loading dashboard stats')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  const cards = [
    { label: 'Total Sales Revenue', icon: CurrencyDollarIcon, val: `Rs. ${stats.totalSales}`, color: 'text-teal-400' },
    { label: 'Total Invoices', icon: ShoppingCartIcon, val: stats.totalOrders, color: 'text-blue-400' },
    { label: 'Outstanding Balance (Due)', icon: CreditCardIcon, val: `Rs. ${stats.totalDue}`, color: 'text-rose-400' },
    { label: 'Bike Models', icon: WrenchScrewdriverIcon, val: stats.totalBikes, color: 'text-purple-400' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-app-text">Dashboard</h1>
        <p className="text-app-text-secondary text-sm">Welcome back! Here is a summary of your operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-app-panel border border-app-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <c.icon className={`w-10 h-10 ${c.color}`} />
            <div>
              <p className="text-xs text-app-text-secondary font-medium uppercase">{c.label}</p>
              <p className="text-2xl font-bold text-app-text">{c.val}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.lowStockCount > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-semibold">
          Warning: There are {stats.lowStockCount} raw material qualities running low on stock. Please review Stock Control.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-app-panel border border-app-border rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-app-text">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-app-text border-collapse">
              <thead className="bg-app-bg border-b border-app-border text-app-text-secondary text-xs uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Bike Model</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {recentSales.map((s) => (
                  <tr key={s._id} className="hover:bg-app-bg/50">
                    <td className="px-4 py-3 font-medium">{s.customerName}</td>
                    <td className="px-4 py-3">{s.bikeName || 'N/A'}</td>
                    <td className="px-4 py-3 font-bold">Rs. {s.totalAmount}</td>
                    <td className={`px-4 py-3 font-bold ${s.dueAmount > 0 ? 'text-rose-400' : 'text-app-text-muted'}`}>Rs. {s.dueAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 bg-app-panel border border-app-border rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-app-text">Operations Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-app-border pb-2 text-app-text-secondary">
              <span>Low Stock Alerts:</span>
              <span className={`font-bold ${stats.lowStockCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{stats.lowStockCount}</span>
            </div>
            <div className="flex justify-between border-b border-app-border pb-2 text-app-text-secondary">
              <span>Bikes Categories:</span>
              <span className="font-bold text-app-text">{stats.totalBikes}</span>
            </div>
            <div className="flex justify-between text-app-text-secondary">
              <span>Active Assemblies:</span>
              <span className="font-bold text-teal-400">{stats.totalOrders}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
