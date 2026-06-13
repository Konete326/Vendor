import { ShoppingCartIcon, PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function POSCart({ cart, updateCartQty, setCart, cartTotal, onCheckoutTrigger }) {
  return (
    <div className="lg:col-span-1 bg-app-panel border border-app-border rounded-xl p-4 flex flex-col justify-between h-full min-h-0 shadow-sm">
      <div className="flex flex-col flex-1 min-h-0 space-y-4">
        <h2 className="text-lg font-bold text-app-text flex items-center gap-2 flex-shrink-0">
          <ShoppingCartIcon className="w-5 h-5 text-teal-500" /> Cart ({cart.length})
        </h2>
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {cart.length === 0 ? (
            <p className="text-sm text-app-text-secondary">Cart is empty. Click items to add.</p>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex items-center justify-between p-2 bg-app-bg border border-app-border rounded-xl text-xs gap-2">
                <div className="flex-1 min-w-0 pr-1">
                  <p className="font-bold text-app-text truncate" title={item.name}>{item.name}</p>
                  <p className="text-teal-500 font-bold mt-0.5">Rs. {item.price}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="flex items-center border border-app-border rounded-lg overflow-hidden bg-app-panel">
                    <button type="button" onClick={() => updateCartQty(item.cartId, -1)} className="px-1.5 py-1 hover:bg-app-muted text-app-text-secondary border-0 focus:outline-none flex items-center justify-center cursor-pointer">
                      <MinusIcon className="w-3 h-3" />
                    </button>
                    <span className="px-1.5 text-xs font-bold text-app-text bg-app-bg border-x border-app-border min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button type="button" onClick={() => updateCartQty(item.cartId, 1)} className="px-1.5 py-1 hover:bg-app-muted text-app-text-secondary border-0 focus:outline-none flex items-center justify-center cursor-pointer">
                      <PlusIcon className="w-3 h-3" />
                    </button>
                  </div>
                  <button type="button" onClick={() => setCart(cart.filter((x) => x.cartId !== item.cartId))} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-500 border-0 focus:outline-none flex items-center justify-center cursor-pointer">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-app-border pt-4 mt-4 space-y-3 flex-shrink-0">
        <div className="flex justify-between font-bold text-app-text">
          <span>Total Bill:</span>
          <span className="text-teal-500 text-lg">Rs. {cartTotal}</span>
        </div>
        <button onClick={onCheckoutTrigger} disabled={cart.length === 0} className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 disabled:bg-app-muted disabled:text-app-text-secondary text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer flex justify-center items-center gap-1">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}
