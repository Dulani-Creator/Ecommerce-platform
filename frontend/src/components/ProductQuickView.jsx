import { useState } from "react";
import { X, Star, Sparkles, ShieldCheck, Heart, Droplets, Plus, Minus } from "lucide-react";
import { useCart } from "../context/useCart";
import toast from "react-hot-toast";

export default function ProductQuickView({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"];

  function handleAdd() {
    addToCart(product, quantity);
    onClose();
  }

  function toggleWishlist() {
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from Wishlist" : "Saved to your Wishlist!", {
      icon: isWishlisted ? "🤍" : "💜"
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Background Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-purple-950/30 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl glass-panel-strong rounded-3xl overflow-hidden shadow-2xl border border-purple-100/90 z-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-purple-900 flex items-center justify-center shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Images */}
          <div className="p-6 bg-gradient-to-br from-purple-50/60 via-white/40 to-indigo-50/40 flex flex-col justify-between">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden glass-panel border border-purple-100/80 shadow-inner group">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-purple-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs border border-purple-200">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-4 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? "border-purple-600 ring-2 ring-purple-300/40"
                        : "border-white/70 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs uppercase font-bold tracking-widest text-purple-600">
                  {product.category || "Cosmetics"}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-slate-400">({product.reviewsCount || 120} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mt-2">
                <span className="text-2xl font-bold text-purple-700">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.labelPrice && product.labelPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    ${Number(product.labelPrice).toFixed(2)}
                  </span>
                )}
                {product.labelPrice && product.labelPrice > product.price && (
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-200">
                    Save {(100 - (product.price / product.labelPrice) * 100).toFixed(0)}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Key Highlights */}
              <div className="mt-4 pt-4 border-t border-purple-100 space-y-2">
                {product.ingredients && (
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-0.5">
                      <Droplets className="w-3.5 h-3.5 text-purple-500" /> Key Ingredients:
                    </span>
                    <p className="text-slate-500 pl-5">{product.ingredients}</p>
                  </div>
                )}
                {product.benefits && (
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Benefits:
                    </span>
                    <p className="text-slate-500 pl-5">{product.benefits}</p>
                  </div>
                )}
              </div>

              {/* Clean Beauty Badges */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-purple-100">
                <span className="text-[10px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-purple-600" /> Dermatologist Tested
                </span>
                <span className="text-[10px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  🐰 100% Cruelty-Free
                </span>
                <span className="text-[10px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  🌿 100% Vegan
                </span>
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart */}
            <div className="pt-4 border-t border-purple-100 flex items-center gap-3">
              <div className="flex items-center border border-purple-200 rounded-xl bg-white/80 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-purple-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-purple-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 py-3 px-6 rounded-xl glass-btn-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> Add to Bag &bull; ${(product.price * quantity).toFixed(2)}
              </button>

              <button
                onClick={toggleWishlist}
                className={`p-3 rounded-xl border transition-all ${
                  isWishlisted
                    ? "bg-purple-50 border-purple-300 text-purple-600"
                    : "bg-white/80 border-purple-100 text-slate-400 hover:text-purple-600"
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-purple-600" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
