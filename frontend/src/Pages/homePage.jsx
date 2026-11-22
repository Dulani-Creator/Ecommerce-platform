import { useEffect, useState } from "react";
import { Link, Route, Routes, useSearchParams } from "react-router-dom";
import Header from "../components/header";
import ProductCard from "../components/productCard";
import ProductQuickView from "../components/ProductQuickView";
import CartDrawer from "../components/CartDrawer";
import { COSMETIC_PRODUCTS, COSMETIC_CATEGORIES } from "../data/cosmeticProducts";
import axios from "axios";
import toast from "react-hot-toast";
import { Sparkles, ShieldCheck, Heart, Leaf, Award, ArrowRight, Star, CheckCircle, Mail, MapPin, Phone } from "lucide-react";

// ==========================================
// 1. HERO & HOME CONTENT (Simple, Clean, Easy to Understand)
// ==========================================
function HomeContent({ products, onQuickView }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="ambient-glow-purple w-[550px] h-[550px] -top-32 -left-20" />
      <div className="ambient-glow-indigo w-[600px] h-[600px] top-96 -right-32" />
      <div className="ambient-glow-champagne w-[450px] h-[450px] top-[1400px] left-10" />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-12 pt-10 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Headline & Short Subtitle */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left z-10">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-purple-700 shadow-xs border border-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>100% Clean & Gentle on Skin</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight">
              Natural Glow for{" "}
              <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                Your Skin
              </span>
            </h1>

            {/* Subtitle - Short & Clear */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Organic skincare and beauty essentials crafted to keep your skin fresh, hydrated, and naturally radiant every day.
            </p>

            {/* Simple CTAs */}
            <div className="pt-2 flex flex-wrap gap-3.5 justify-center lg:justify-start">
              <Link
                to="/products"
                className="px-7 py-3 rounded-2xl glass-btn-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="px-7 py-3 rounded-2xl glass-btn-secondary font-bold text-xs uppercase tracking-wider"
              >
                Our Story
              </Link>
            </div>

            {/* Quick Trust Bar */}
            <div className="pt-4">
              <div className="p-3.5 sm:p-4 rounded-2xl glass-panel grid grid-cols-3 gap-2 text-center divide-x divide-purple-100 border border-purple-100">
                <div>
                  <span className="block text-lg sm:text-xl font-serif font-bold text-purple-950">50k+</span>
                  <span className="text-[10px] text-slate-500 font-medium">Happy Customers</span>
                </div>
                <div>
                  <span className="block text-lg sm:text-xl font-serif font-bold text-purple-950">100%</span>
                  <span className="text-[10px] text-slate-500 font-medium">Vegan & Clean</span>
                </div>
                <div>
                  <span className="block text-lg sm:text-xl font-serif font-bold text-purple-950">4.9★</span>
                  <span className="text-[10px] text-slate-500 font-medium">Top Rated</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Product Photo with Glass Badges */}
          <div className="lg:col-span-5 relative flex justify-center z-10">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl p-3 glass-panel-strong shadow-xl border border-purple-100/90">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
                alt="Glow Cosmetic"
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* Floating Top Badge */}
              <div className="absolute -top-3 -left-3 p-3 rounded-2xl glass-panel-strong border border-purple-100/90 shadow-lg flex items-center gap-2.5 animate-float max-w-[200px]">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">Hydra-Glow Serum</span>
                  <span className="text-[10px] text-purple-700 font-semibold">$48.00 ★ 4.9</span>
                </div>
              </div>

              {/* Floating Bottom Badge */}
              <div className="absolute -bottom-3 -right-3 p-3 rounded-2xl glass-panel-strong border border-purple-100/90 shadow-lg flex items-center gap-2.5 animate-float-delayed max-w-[190px]">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">Dermatologist Tested</span>
                  <span className="text-[10px] text-slate-500">Cruelty-Free</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto -mt-2 mb-10">
        <div className="p-2 rounded-2xl glass-panel flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar border border-purple-100">
          {COSMETIC_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "glass-btn-primary shadow-xs"
                    : "text-slate-600 hover:text-purple-700 hover:bg-white/70"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto pb-16">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-purple-600 font-bold">
              Trending Now
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-0.5">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 group"
          >
            <span>See All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl border border-purple-100">
            <p className="text-xs text-slate-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.productId}
                {...product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why People Love Us */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto pb-16">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-wider text-purple-600 font-bold">
            Our Promise
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Why People Love Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-card text-center space-y-2 border border-purple-100">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-slate-900">Clean Ingredients</h3>
            <p className="text-xs text-slate-500">Pure plant extracts that gently nourish your skin.</p>
          </div>

          <div className="p-5 rounded-2xl glass-card text-center space-y-2 border border-purple-100">
            <div className="w-10 h-10 mx-auto rounded-xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-slate-900">100% Cruelty-Free</h3>
            <p className="text-xs text-slate-500">Never tested on animals, certified by Leaping Bunny.</p>
          </div>

          <div className="p-5 rounded-2xl glass-card text-center space-y-2 border border-purple-100">
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-slate-900">Sensitive Skin Safe</h3>
            <p className="text-xs text-slate-500">Dermatologist tested and hypoallergenic formulas.</p>
          </div>

          <div className="p-5 rounded-2xl glass-card text-center space-y-2 border border-purple-100">
            <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-slate-900">Free Express Delivery</h3>
            <p className="text-xs text-slate-500">Fast and free shipping on all orders over $50.</p>
          </div>
        </div>
      </section>

      {/* Simple 3-Step Routine */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto pb-16">
        <div className="p-7 sm:p-10 rounded-3xl glass-panel-strong border border-purple-100 relative overflow-hidden">
          <div className="ambient-glow-purple w-72 h-72 -top-20 -right-20" />
          
          <div className="max-w-lg space-y-3 relative z-10">
            <span className="text-xs uppercase tracking-wider text-purple-600 font-bold">
              Easy Daily Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Simple 3-Step Routine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Cleanse, hydrate, and protect your skin in under two minutes for an all-day glow.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-purple-600" /> 1. Refresh
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-purple-600" /> 2. Hydrate
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-purple-600" /> 3. Protect
              </span>
            </div>

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl glass-btn-primary font-bold text-xs uppercase tracking-wider"
              >
                <span>Shop the Routine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto pb-16">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-wider text-purple-600 font-bold">
            Real Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Loved by Customers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl glass-card space-y-2.5 border border-purple-100">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "My skin feels so soft and looks hydrated all day long. The serum is truly my favorite!"
            </p>
            <div className="pt-1 border-t border-purple-100 text-xs flex justify-between">
              <span className="font-bold text-slate-900">Sophia M.</span>
              <span className="text-purple-700 font-semibold">Verified Buyer</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-card space-y-2.5 border border-purple-100">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "The lip oil gives a natural, glassy shine without feeling sticky. I carry it everywhere."
            </p>
            <div className="pt-1 border-t border-purple-100 text-xs flex justify-between">
              <span className="font-bold text-slate-900">Elena R.</span>
              <span className="text-purple-700 font-semibold">Verified Buyer</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-card space-y-2.5 border border-purple-100">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "The cream saved my dry sensitive skin. Super gentle and the packaging looks beautiful."
            </p>
            <div className="pt-1 border-t border-purple-100 text-xs flex justify-between">
              <span className="font-bold text-slate-900">Chloe T.</span>
              <span className="text-purple-700 font-semibold">Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-3xl mx-auto pb-16">
        <div className="p-7 sm:p-9 rounded-3xl glass-panel-strong border border-purple-100 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            Get 15% Off Your First Order
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Subscribe to our newsletter for exclusive offers and skincare tips.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Welcome! Your 15% discount code is ROYAL15.", { icon: "🎉" });
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-1"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl glass-btn-primary font-bold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer"
            >
              Get 15% Off
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}

// ==========================================
// 2. SHOP / PRODUCTS CATALOG PAGE
// ==========================================
function ProductsList({ products, onQuickView }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";
  const searchTerm = searchParams.get("search") || "";
  const [sortBy, setSortBy] = useState("featured");

  function handleCategoryChange(cat) {
    const next = new URLSearchParams(searchParams);
    if (cat === "All") {
      next.delete("category");
    } else {
      next.set("category", cat);
    }
    setSearchParams(next);
  }

  function handleSearchChange(term) {
    const next = new URLSearchParams(searchParams);
    if (!term) {
      next.delete("search");
    } else {
      next.set("search", term);
    }
    setSearchParams(next);
  }

  const filtered = products.filter((p) => {
    const matchesCategory =
      selectedCategory.toLowerCase() === "all" ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesSearch =
      searchTerm.trim() === "" ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
    return 0;
  });

  return (
    <div className="relative min-h-[80vh] px-4 sm:px-6 lg:px-12 py-10 max-w-7xl mx-auto">
      <div className="ambient-glow-purple w-[500px] h-[500px] -top-20 -right-20" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          All Products
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore our collection of clean skincare, lip oils, and cosmetics.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="p-3.5 rounded-2xl glass-panel mb-6 flex flex-col md:flex-row items-center justify-between gap-3 border border-purple-100">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {COSMETIC_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "glass-btn-primary shadow-xs"
                    : "text-slate-600 hover:text-purple-700 hover:bg-white/70"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 md:w-52 px-3 py-1.5 text-xs rounded-xl glass-input placeholder:text-slate-400"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl glass-input text-slate-700 cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Count Indicator */}
      <div className="flex justify-between items-center mb-5 text-xs text-slate-500 font-medium">
        <span>Showing {sorted.length} {sorted.length === 1 ? "product" : "products"}</span>
        {(searchTerm || selectedCategory !== "All") && (
          <button
            onClick={() => {
              handleCategoryChange("All");
              handleSearchChange("");
            }}
            className="text-purple-700 hover:underline font-semibold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {sorted.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl space-y-2 border border-purple-100">
          <p className="text-sm font-semibold text-slate-700">No products found</p>
          <p className="text-xs text-slate-500">Try searching for something else or reset filters.</p>
          <button
            onClick={() => {
              handleCategoryChange("All");
              handleSearchChange("");
            }}
            className="mt-2 px-5 py-2 rounded-xl glass-btn-primary text-xs font-bold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sorted.map((product) => (
            <ProductCard
              key={product.productId}
              {...product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. ABOUT US PAGE
// ==========================================
function AboutPage() {
  return (
    <div className="relative min-h-[75vh] px-4 sm:px-6 lg:px-12 py-12 max-w-3xl mx-auto space-y-8">
      <div className="ambient-glow-purple w-[500px] h-[500px] -top-20 -left-20" />

      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-wider text-purple-600 font-bold">
          Our Story
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Simple, Gentle Skincare
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          We created AMÉTHYSTE with one simple goal: to make daily beauty routines gentle, healthy, and easy for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="rounded-2xl overflow-hidden glass-panel-strong p-2 shadow-lg border border-purple-100">
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
            alt="Botanical Ingredients"
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif font-bold text-slate-900">
            Gentle on All Skin Types
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our products are formulated with botanical extracts, ceramides, and pure mineral waters. No harsh chemicals, no artificial dyes, and no heavy fragrances.
          </p>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-purple-600" /> 100% Cruelty-Free & Vegan
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-purple-600" /> Free from Parabens & Sulfates
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-purple-600" /> Recyclable Glass Bottles
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. CONTACT US PAGE
// ==========================================
function ContactPage() {
  return (
    <div className="relative min-h-[75vh] px-4 sm:px-6 lg:px-12 py-12 max-w-2xl mx-auto">
      <div className="ambient-glow-indigo w-[500px] h-[500px] -top-20 -right-20" />

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900">
          Contact Us
        </h1>
        <p className="text-xs text-slate-500">
          Have a question about your order or need product advice? Send us a message!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl glass-card text-center space-y-1 border border-purple-100">
          <Mail className="w-5 h-5 mx-auto text-purple-600" />
          <h4 className="text-xs font-bold text-slate-900">Email</h4>
          <p className="text-[10px] text-slate-500 truncate">support@amethyste.com</p>
        </div>
        <div className="p-4 rounded-xl glass-card text-center space-y-1 border border-purple-100">
          <Phone className="w-5 h-5 mx-auto text-purple-600" />
          <h4 className="text-xs font-bold text-slate-900">Phone</h4>
          <p className="text-[10px] text-slate-500">+1 (800) 555-GLOW</p>
        </div>
        <div className="p-4 rounded-xl glass-card text-center space-y-1 border border-purple-100">
          <MapPin className="w-5 h-5 mx-auto text-purple-600" />
          <h4 className="text-xs font-bold text-slate-900">Hours</h4>
          <p className="text-[10px] text-slate-500">Mon-Fri 9am-6pm</p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Thank you! Your message has been sent.", { icon: "🌸" });
        }}
        className="p-6 rounded-3xl glass-panel-strong border border-purple-100 space-y-3.5 shadow-lg"
      >
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            required
            placeholder="John Doe"
            className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-slate-800"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="john@example.com"
            className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-slate-800"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
            Message
          </label>
          <textarea
            rows="3"
            required
            placeholder="How can we help you?"
            className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-slate-800"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl glass-btn-primary font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

// ==========================================
// 5. MAIN HOMEPAGE WRAPPER
// ==========================================
export default function HomePage() {
  const [products, setProducts] = useState(COSMETIC_PRODUCTS);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/products`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const backendItems = res.data.map((p, idx) => ({
            productId: p.productId || `api-prod-${idx}`,
            name: p.name,
            category: p.category || "Cosmetics",
            price: Number(p.price) || 0,
            labelPrice: Number(p.labelPrice) || Number(p.price) * 1.25,
            rating: 4.9,
            reviewsCount: 150 + idx * 25,
            badge: idx % 2 === 0 ? "Bestseller" : "New",
            images: p.images && p.images.length > 0 ? p.images : [p.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"],
            description: p.description || "Gentle formula designed for healthy, glowing skin.",
            ingredients: "Plant Extracts, Hyaluronic Acid",
            benefits: "Daily hydration and dewy glow."
          }));
          setProducts(backendItems);
        }
      })
      .catch(() => {
        console.log("Using curated cosmetic catalog.");
      });
  }, [apiUrl]);

  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#FAF5FF] via-[#FCFAFF] to-[#F3E8FF] text-slate-900">
      <div>
        {/* Frosted Glass Header */}
        <Header />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomeContent products={products} onQuickView={setQuickViewProduct} />} />
          <Route path="products" element={<ProductsList products={products} onQuickView={setQuickViewProduct} />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="*"
            element={
              <div className="py-20 text-center space-y-3">
                <h2 className="text-xl font-serif font-bold text-slate-800">Page Not Found</h2>
                <Link to="/" className="inline-block px-5 py-2 rounded-xl glass-btn-primary text-xs font-bold uppercase tracking-wider">
                  Back to Home
                </Link>
              </div>
            }
          />
        </Routes>
      </div>

      {/* Slide-out Glass Cart Drawer */}
      <CartDrawer />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Clean Glass Footer */}
      <footer className="w-full glass-panel border-t border-purple-100 py-10 px-4 sm:px-6 lg:px-12 mt-12 text-slate-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-serif text-lg font-bold tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" /> AMÉTHYSTE
            </span>
            <p className="text-xs text-slate-500">
              Clean botanical skincare and beauty crafted for your natural daily glow.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-900 mb-2.5">Shop</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/products?category=Skincare" className="hover:text-purple-700">Skincare</Link></li>
              <li><Link to="/products?category=Lip Care" className="hover:text-purple-700">Lip Care</Link></li>
              <li><Link to="/products?category=Makeup" className="hover:text-purple-700">Makeup</Link></li>
              <li><Link to="/products?category=Fragrance & Body" className="hover:text-purple-700">Body & Mist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-900 mb-2.5">About</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/about" className="hover:text-purple-700">Our Story</Link></li>
              <li><Link to="/about" className="hover:text-purple-700">Clean Standards</Link></li>
              <li><Link to="/contact" className="hover:text-purple-700">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-900 mb-2.5">Help</h4>
            <p className="text-xs text-slate-500 mb-2">Questions? We are here for you.</p>
            <span className="text-xs font-bold text-purple-700">support@amethyste.com</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-5 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} AMÉTHYSTE Cosmetics. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-purple-700 cursor-pointer">Privacy</span>
            <span>&bull;</span>
            <span className="hover:text-purple-700 cursor-pointer">Terms</span>
            <span>&bull;</span>
            <span className="hover:text-purple-700 cursor-pointer">Shipping</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
