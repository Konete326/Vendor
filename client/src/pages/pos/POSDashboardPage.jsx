import { useState, useEffect } from 'react'
import { rawMaterialsAPI, assemblesAPI, bikesAPI, salesAPI } from '../../services/api'
import POSCart from './POSCart'
import CheckoutModal from './CheckoutModal'

export default function POSDashboardPage() {
  const [bikes, setBikes] = useState([])
  const [materials, setMaterials] = useState([])
  const [assemblies, setAssemblies] = useState([])
  const [cart, setCart] = useState([])
  const [selectedBike, setSelectedBike] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // Checkout Form
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [receivedAmount, setReceivedAmount] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [bRes, mRes, aRes] = await Promise.all([
        bikesAPI.getAll(),
        rawMaterialsAPI.getAll(selectedBike ? { bike: selectedBike } : {}),
        assemblesAPI.getAll(selectedBike ? { bike: selectedBike } : {}),
      ])
      setBikes(bRes.data.data)
      setMaterials(mRes.data.data)
      setAssemblies(aRes.data.data)
    } catch {
      alert('Error fetching POS data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedBike])

  const calcAsmPrice = (asm) => {
    return asm.items.reduce((total, i) => {
      const q = i.material?.qualities?.find((x) => x.qualityName === i.qualityName)
      return total + ((q?.price || 0) * i.usedQuantity)
    }, 0)
  }

  const addToCart = (item) => {
    const existing = cart.find((x) => x.cartId === item.cartId)
    if (existing) {
      if (existing.quantity >= item.stock) return alert('Cannot exceed available stock!')
      setCart(cart.map((x) => x.cartId === item.cartId ? { ...x, quantity: x.quantity + 1 } : x))
    } else {
      if (item.stock <= 0) return alert('Item is out of stock!')
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const updateCartQty = (cartId, val) => {
    const item = cart.find((x) => x.cartId === cartId)
    if (!item) return
    const newQty = item.quantity + val
    if (newQty <= 0) {
      setCart(cart.filter((x) => x.cartId !== cartId))
    } else {
      if (newQty > item.stock) return alert('Cannot exceed available stock!')
      setCart(cart.map((x) => x.cartId === cartId ? { ...x, quantity: newQty } : x))
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const dueAmount = Math.max(0, cartTotal - receivedAmount)

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!customerName) return alert('Customer Name is required')
    setSubmitting(true)
    const items = cart.map((c) => ({
      source: c.source,
      itemRef: c.itemRef,
      qualityName: c.qualityName,
      name: c.name,
      quantity: c.quantity,
      price: c.price,
    }))

    try {
      await salesAPI.create({
        items,
        totalAmount: cartTotal,
        receivedAmount: Number(receivedAmount),
        dueAmount: Number(dueAmount),
        paymentMethod,
        customerName,
        bikeId: selectedBike || null,
        bikeName: bikes.find((b) => b._id === selectedBike)?.name || '',
      })
      setCart([])
      setCheckoutOpen(false)
      setCustomerName('')
      setReceivedAmount(0)
      fetchData()
      alert('Checkout completed successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing checkout')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-[calc(100vh-135px)] flex flex-col space-y-4 overflow-hidden">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-app-text">POS Billing</h1>
          <p className="text-app-text-secondary text-sm">Sell raw materials and ready assemblies directly</p>
        </div>
        <select value={selectedBike} onChange={(e) => setSelectedBike(e.target.value)} className="bg-app-panel border border-app-border text-app-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="">All Bikes</option>
          {bikes.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 flex flex-col h-full min-h-0 space-y-4">
          <div className="border-b border-app-border flex gap-4 flex-shrink-0">
            {['All', 'Raw Material', 'Ready to Sale'].map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`py-2 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === tab ? 'border-teal-500 text-teal-500' : 'border-transparent text-app-text-secondary'}`}>
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-app-text-secondary text-sm">Loading items...</p>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-max pb-4">
              {(activeTab === 'All' || activeTab === 'Raw Material') &&
                materials.flatMap((m) =>
                  m.qualities.map((q) => (
                    <div key={`${m._id}-${q.qualityName}`} onClick={() => addToCart({ cartId: `${m._id}-${q.qualityName}`, source: 'Raw Material', itemRef: m._id, qualityName: q.qualityName, name: `${m.name} (${q.qualityName})`, price: q.price, stock: q.quantity })} className="bg-app-panel border border-app-border rounded-xl p-3 flex gap-3 shadow-sm cursor-pointer hover:border-teal-500/50 transition-all items-center">
                      <div className="w-12 h-12 bg-app-bg border border-app-border rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                        {m.image?.url ? (
                          <img src={m.image.url} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-app-text-muted text-[9px] font-medium">No Image</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-app-text text-sm truncate">{m.name}</h4>
                        <p className="text-xs text-app-text-secondary">Quality: {q.qualityName}</p>
                        <p className="text-xs text-app-text-muted truncate">Bike: {m.bike?.name || 'N/A'}</p>
                        <div className="flex justify-between items-center mt-2 pt-1 border-t border-app-border/40">
                          <span className="text-sm font-extrabold text-teal-500">Rs. {q.price}</span>
                          <span className="text-[10px] text-app-text-muted">Stock: {q.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              {(activeTab === 'All' || activeTab === 'Ready to Sale') &&
                assemblies.filter((a) => a.totalQuantity > 0).map((a) => {
                  const price = calcAsmPrice(a)
                  const firstItemImage = a.items?.find((i) => i.material?.image?.url)?.material?.image?.url
                  return (
                    <div key={a._id} onClick={() => addToCart({ cartId: a._id, source: 'Ready to Sale', itemRef: a._id, name: `${a.assemblyName || 'Assembly'} (Ready)`, price, stock: a.totalQuantity })} className="bg-app-panel border border-teal-500/20 rounded-xl p-3 flex gap-3 shadow-sm cursor-pointer hover:border-teal-500 transition-all items-center">
                      <div className="w-12 h-12 bg-app-bg border border-teal-500/10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                        {firstItemImage ? (
                          <img src={firstItemImage} alt={a.assemblyName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-teal-500/60 text-[9px] font-bold">READY</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-500 font-semibold uppercase">{a.assemblyType}</span>
                        <h4 className="font-bold text-app-text text-sm truncate mt-1">{a.assemblyName || 'Unnamed Hub'}</h4>
                        <p className="text-xs text-app-text-muted">Bike: {a.bikeCategory}</p>
                        <div className="flex justify-between items-center mt-2 pt-1 border-t border-teal-500/10">
                          <span className="text-sm font-extrabold text-teal-500">Rs. {price}</span>
                          <span className="text-[10px] text-app-text-muted">Stock: {a.totalQuantity}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>

        <POSCart
          cart={cart}
          updateCartQty={updateCartQty}
          setCart={setCart}
          cartTotal={cartTotal}
          onCheckoutTrigger={() => setCheckoutOpen(true)}
        />
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSubmit={handleCheckout}
        customerName={customerName}
        setCustomerName={setCustomerName}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        receivedAmount={receivedAmount}
        setReceivedAmount={setReceivedAmount}
        cartTotal={cartTotal}
        dueAmount={dueAmount}
        submitting={submitting}
      />
    </div>
  )
}
