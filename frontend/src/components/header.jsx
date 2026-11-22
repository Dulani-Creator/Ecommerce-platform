import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, ShoppingBag, User, Menu, X, Search, ShieldCheck } from "lucide-react";
import { useCart } from "../context/useCart";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored) user = JSON.parse(stored);
  } catch {
    user = null;
  }

  const role = user?.role ?? user?.Role;
  const isAdmin = typeof role === "string" && role.trim().toLowerCase() === "admin";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop All", path: "/products" },
    { name: "Skincare", path: "/products?category=Skincare" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-purple-100 text-[11px] font-medium py-1.5 px-4 text-center tracking-wider flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>Free Express Shipping on orders over $50</span>
        <span className="text-purple-300">•</span>
        <span
          className="font-bold text-amber-300 underline cursor-pointer hover:text-amber-200"
          onClick={() => setIsCartOpen(true)}
        >
          Use code ROYAL15 for 15% off
        </span>
      </div>

      {/* Main Sticky Glass Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-100/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 p-0.5 shadow-md shadow-purple-200 group-hover:rotate-6 transition-transform">
              <div className="w-full h-full bg-white/95 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-slate-900 flex items-center gap-1">
                AMÉTHYSTE
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-purple-600 font-semibold -mt-1">
                Haute Cosmetics & Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path && !link.path.includes("?");
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-200 relative py-1 ${
                    isActive ? "text-purple-700 font-bold" : "text-slate-600 hover:text-purple-600"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Search, User, Cart, Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 sm:p-2.5 rounded-full hover:bg-white/80 text-slate-600 hover:text-purple-600 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Admin Badge if Admin */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-purple-800 bg-purple-100 border border-purple-200 hover:bg-purple-200 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </Link>
            )}

            {/* User / Login */}
            {token ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                  Hi, {user?.firstName || user?.name || "Client"}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-white/80 border border-purple-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-purple-700 glass-pill hover:bg-white transition-all shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart Button with Luxury Glass Pill */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full glass-btn-primary shadow-md cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold">{totalItems}</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-white/70 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>

        </div>

        {/* Search Bar Slide-Down Popup */}
        {searchOpen && (
          <div className="border-t border-purple-100/70 p-4 bg-white/85 backdrop-blur-md">
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Search amethyst serums, peptide lip oils, velvet cushions, botanical night oils..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl glass-btn-primary text-xs font-bold uppercase tracking-wider"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-100/70 bg-white/95 backdrop-blur-xl px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-wider font-semibold text-slate-700 hover:text-purple-700 py-1"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-purple-100 flex flex-col gap-2">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-xs font-bold text-purple-700 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                </Link>
              )}
              {token ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 text-xs font-semibold text-purple-700"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-xs font-semibold text-purple-700 flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" /> Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
