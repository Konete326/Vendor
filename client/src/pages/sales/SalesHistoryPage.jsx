import { useState, useEffect } from 'react'
import { FunnelIcon, CalendarIcon, CurrencyDollarIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { salesAPI, bikesAPI, extractArray } from '../../services/api'

export default function SalesHistoryPage() {
  const [sales, setSales] = useState([])
  const [bikes, setBikes] = useState([])
  const [aggregates, setAggregates] = useState({ totalSales: 0, totalReceived: 0, totalDue: 0 })
  const [loading, setLoading] = useState(true)

  // Filters
  const [filterBike, setFilterBike] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterYear, setFilterYear] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filterBike) params.bikeId = filterBike
      if (filterStatus) params.paymentStatus = filterStatus
      if (filterDate) params.date = filterDate
      if (filterMonth && filterYear) {
        params.month = filterMonth
        params.year = filterYear
      } else if (filterYear) {
        params.year = filterYear
      }

      const [sRes, bRes] = await Promise.all([
        salesAPI.getAll(params),
        bikesAPI.getAll(),
      ])

      const salesData = sRes.data?.data || sRes.data || {}
      setSales(salesData.sales || [])
      setAggregates({
        totalSales: salesData.totalSales || 0,
        totalReceived: salesData.totalReceived || 0,
        totalDue: salesData.totalDue || 0,
      })
      setBikes(extractArray(bRes))
    } catch {
      alert('Error fetching sales history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterBike, filterStatus, filterDate, filterMonth, filterYear])

  const clearFilters = () => {
    setFilterBike('')
    setFilterStatus('')
    setFilterDate('')
    setFilterMonth('')
    setFilterYear('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-app-text">Sales History</h1>
        <p className="text-app-text-secondary text-sm">View sales records, revenues, and pending customer due accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-app-panel border border-app-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <CurrencyDollarIcon className="w-10 h-10 text-teal-400" />
          <div>
            <p className="text-xs text-app-text-secondary font-medium uppercase">Total Revenue</p>
            <p className="text-2xl font-bold text-app-text">Rs. {aggregates.totalSales}</p>
          </div>
        </div>
        <div className="bg-app-panel border border-app-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <CreditCardIcon className="w-10 h-10 text-emerald-400" />
          <div>
            <p className="text-xs text-app-text-secondary font-medium uppercase">Total Received</p>
            <p className="text-2xl font-bold text-app-text">Rs. {aggregates.totalReceived}</p>
          </div>
        </div>
        <div className="bg-app-panel border border-app-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <FunnelIcon className="w-10 h-10 text-rose-400" />
          <div>
            <p className="text-xs text-app-text-secondary font-medium uppercase">Total Outstanding (Udhaar)</p>
            <p className="text-2xl font-bold text-app-text text-rose-400">Rs. {aggregates.totalDue}</p>
          </div>
        </div>
      </div>

      <div className="bg-app-panel border border-app-border rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <select value={filterBike} onChange={(e) => setFilterBike(e.target.value)} className="bg-app-bg border border-app-input-border text-app-text text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">All Bikes</option>
            {bikes.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-app-bg border border-app-input-border text-app-text text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">All Payment Status</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due / Outstanding</option>
          </select>
          <div className="flex items-center gap-1.5 bg-app-bg border border-app-input-border rounded-lg px-2.5 py-1 focus-within:ring-2 focus-within:ring-teal-500">
            <CalendarIcon className="w-4 h-4 text-app-text-secondary" />
            <input type="date" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setFilterMonth(''); setFilterYear(''); }} className="bg-transparent border-0 text-app-text text-xs focus:outline-none" />
          </div>
          <div className="flex gap-1.5 items-center">
            <select value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setFilterDate(''); }} className="bg-app-bg border border-app-input-border text-app-text text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
            </select>
            <select value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setFilterDate(''); }} className="bg-app-bg border border-app-input-border text-app-text text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select Year</option>
              {['2024', '2025', '2026', '2027'].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <button onClick={clearFilters} className="text-xs text-teal-500 hover:text-teal-600 font-semibold cursor-pointer">Clear Filters</button>
      </div>

      {loading ? (
        <p className="text-app-text-secondary">Loading...</p>
      ) : (
        <div className="bg-app-panel border border-app-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-app-text border-collapse">
              <thead className="bg-app-bg border-b border-app-border text-app-text-secondary text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Bike Category</th>
                  <th className="px-6 py-4">Items Sold</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Received Amount</th>
                  <th className="px-6 py-4">Due (Udhaar)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-app-bg/50">
                    <td className="px-6 py-4 text-xs text-app-text-secondary">{new Date(sale.saleDate).toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold">{sale.customerName}</td>
                    <td className="px-6 py-4">{sale.bikeName || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <ul className="list-disc pl-4 text-xs text-app-text-secondary space-y-0.5">
                        {sale.items.map((i, idx) => (
                          <li key={idx}>
                            {i.name} x{i.quantity} (Rs. {i.price})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 font-bold">Rs. {sale.totalAmount}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">Rs. {sale.receivedAmount}</td>
                    <td className={`px-6 py-4 font-bold ${sale.dueAmount > 0 ? 'text-rose-400' : 'text-app-text-muted'}`}>Rs. {sale.dueAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
