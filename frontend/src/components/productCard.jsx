import { useState } from "react";
import { Star, Eye, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/useCart";
import toast from "react-hot-toast";

export default function ProductCard({
  productId,
  name,
  price,
  labelPrice,
  image,
  images,
  category,
  description,
  rating = 4.9,
  reviewsCount = 142,
  badge,
  onQuickView,
}) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const displayImage =
    image ||
    (images && images.length > 0 ? images[0] : null) ||
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80";

  function handleAddToCart(e) {
    e.stopPropagation();
    addToCart({
      productId: productId || name,
      name,
      price,
      labelPrice,
      image: displayImage,
      category,
      description,
    });
  }

  function toggleWishlist(e) {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from Wishlist" : `Added "${name}" to Wishlist!`, {
      icon: isWishlisted ? "🤍" : "💜",
    });
  }

  return (
    <div
      onClick={() => onQuickView && onQuickView({ productId, name, price, labelPrice, image: displayImage, images, category, description, rating, reviewsCount, badge })}
      className="glass-card group flex flex-col justify-between rounded-3xl p-3 sm:p-4 cursor-pointer relative overflow-hidden border border-purple-100/70 hover:border-purple-300"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-purple-50/40 mb-3 border border-white/80 shadow-xs">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Subtle glass gradient overlay at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {badge && (
            <span className="bg-white/90 backdrop-blur-md text-purple-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs border border-purple-200">
              {badge}
            </span>
          )}
          {category && (
            <span className="bg-purple-950/75 backdrop-blur-md text-purple-100 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
              {category}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-white transition-all shadow-xs"
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-purple-600 text-purple-600" : ""}`} />
        </button>

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView && onQuickView({ productId, name, price, labelPrice, image: displayImage, images, category, description, rating, reviewsCount, badge });
          }}
          className="absolute bottom-2.5 inset-x-3 py-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md border border-purple-100"
        >
          <Eye className="w-3.5 h-3.5 text-purple-600" /> Quick View
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-grow justify-between px-1">
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1 text-amber-500 text-[11px] font-medium mb-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
            <span className="text-slate-400">({reviewsCount})</span>
          </div>

          {/* Name */}
          <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Short description */}
          {description && (
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-purple-100/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-purple-950">
                ${Number(price).toFixed(2)}
              </span>
              {labelPrice && Number(labelPrice) > Number(price) && (
                <span className="text-[11px] text-slate-400 line-through">
                  ${Number(labelPrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl glass-btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
