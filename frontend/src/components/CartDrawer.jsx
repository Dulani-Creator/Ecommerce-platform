import { useState } from "react";
import { useCart } from "../context/useCart";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Free shipping threshold
  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  // Promo code handler
  function handleApplyPromo(e) {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === "ROYAL15" || code === "GLOW15") {
      setAppliedDiscount(0.15);
      toast.success("Promo code applied: 15% Royal Privilege Discount!", { icon: "👑" });
    } else if (code === "WELCOME10") {
      setAppliedDiscount(0.10);
      toast.success("Promo code applied: 10% OFF!", { icon: "✨" });
    } else {
      toast.error("Invalid code. Try 'ROYAL15'!");
    }
  }

  const discountAmount = subtotal * appliedDiscount;
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 5.00;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  function handleCheckout() {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 1200);
  }

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        onClick={() => {
          setIsCartOpen(false);
          setOrderComplete(false);
        }}
        className="absolute inset-0 bg-purple-950/25 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel-strong shadow-2xl flex flex-col justify-between border-l border-purple-100/90">
          
          {/* Header */}
          <div className="p-6 border-b border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Beauty Bag</h2>
                <p className="text-xs text-purple-600 font-semibold">
                  {cart.length} {cart.length === 1 ? "luxury item" : "luxury items"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setOrderComplete(false);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-purple-100 text-slate-500 hover:text-purple-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Banner */}
          <div className="px-6 py-3.5 bg-gradient-to-r from-purple-50/90 via-fuchsia-50/70 to-indigo-50/90 border-b border-purple-100">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-1.5 font-medium">
              <span>
                {amountNeeded === 0 ? (
                  <span className="text-purple-700 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> You unlocked Complimentary Express Shipping!
                  </span>
                ) : (
                  <>Add <span className="text-purple-700 font-bold">${amountNeeded.toFixed(2)}</span> more for Free Shipping</>
                )}
              </span>
              <span className="text-[11px] text-purple-600 font-bold">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full bg-purple-200/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orderComplete ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900">Thank You for Your Order</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Your luxury formulations are being hand-packed in sustainable amethyst glass with silk tissue. We've sent details to your email.
                </p>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    setIsCartOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-xl glass-btn-primary text-xs font-bold uppercase tracking-wider"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-50 text-purple-300 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-700">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Discover our amethyst serums and peptide lip oils to begin your ritual.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 px-6 py-2.5 rounded-xl glass-btn-primary text-xs font-bold uppercase tracking-wider"
                >
                  Explore Atelier
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-3.5 rounded-2xl glass-panel flex items-center gap-4 border border-purple-100/90 hover:border-purple-200 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-purple-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs font-bold text-purple-950 mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-purple-200 rounded-lg bg-white/80 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="px-2 py-1 text-slate-600 hover:bg-purple-100 text-xs transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-purple-100 text-xs transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-slate-400 hover:text-purple-600 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {cart.length > 0 && !orderComplete && (
            <div className="p-6 border-t border-purple-100 bg-white/60 backdrop-blur-md space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Privilege code (try ROYAL15)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl glass-input placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Price Details */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-purple-700 font-medium">
                    <span>Privilege Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <strong className="text-purple-700 font-semibold">FREE EXPRESS</strong> : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="pt-2 border-t border-purple-200/60 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Investment</span>
                  <span className="text-base text-purple-700 font-serif">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 rounded-xl glass-btn-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Preparing Luxury Packaging...</span>
                ) : (
                  <>
                    <span>Complete Purchase</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
