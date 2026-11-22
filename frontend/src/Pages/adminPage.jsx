import { Navigate, NavLink, Route, Routes, Link } from "react-router-dom";
import { AdminProductPage } from "./admin/adminProductPage";
import { AdminAddNewProduct } from "./admin/adminAddNewProduct";
import { Sparkles, LayoutDashboard, ShoppingBag, Package, Users, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#FAF5FF] via-[#FCFAFF] to-[#F3E8FF] flex p-3 sm:p-4 gap-4 text-slate-800 overflow-hidden">
      {/* Ambient glowing blobs */}
      <div className="ambient-glow-purple w-96 h-96 -top-20 -left-20" />
      <div className="ambient-glow-indigo w-96 h-96 -bottom-20 -right-20" />

      {/* Glass Sidebar */}
      <div className="w-64 h-full glass-panel-strong rounded-3xl p-5 flex flex-col justify-between border border-purple-100/90 shadow-xl z-10">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-purple-100">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="block font-serif font-bold text-base text-slate-900">AMÉTHYSTE</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-600">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? "glass-btn-primary shadow-xs"
                    : "text-slate-600 hover:text-purple-700 hover:bg-white/70"
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? "glass-btn-primary shadow-xs"
                    : "text-slate-600 hover:text-purple-700 hover:bg-white/70"
                }`
              }
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? "glass-btn-primary shadow-xs"
                    : "text-slate-600 hover:text-purple-700 hover:bg-white/70"
                }`
              }
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? "glass-btn-primary shadow-xs"
                    : "text-slate-600 hover:text-purple-700 hover:bg-white/70"
                }`
              }
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
            </NavLink>
          </nav>
        </div>

        {/* Back to Boutique link */}
        <div className="pt-4 border-t border-purple-100">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Boutique
          </Link>
        </div>
      </div>

      {/* Main Glass Workspace */}
      <div className="flex-1 h-full glass-panel-strong rounded-3xl p-6 sm:p-8 overflow-y-auto border border-purple-100/90 shadow-2xl z-10">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-slate-900">Cosmetics Atelier Dashboard</h1>
                  <p className="text-xs text-slate-500 mt-1">Overview of luxury store acquisitions, catalog performance, and VIP patrons.</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl glass-panel space-y-1 border border-purple-100">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-purple-600">Total Acquisitions</span>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">$26,890.00</h3>
                    <p className="text-[11px] text-purple-700 font-medium">↑ 22.4% this quarter</p>
                  </div>
                  <div className="p-5 rounded-2xl glass-panel space-y-1 border border-purple-100">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-purple-600">Active Atelier SKUs</span>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">28 Creations</h3>
                    <p className="text-[11px] text-slate-500 font-medium">All in healthy stock</p>
                  </div>
                  <div className="p-5 rounded-2xl glass-panel space-y-1 border border-purple-100">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-purple-600">Bespoke Orders</span>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">518 Dispatched</h3>
                    <p className="text-[11px] text-purple-700 font-medium">100% white-glove delivery</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl glass-panel border border-purple-100 space-y-3">
                  <h3 className="font-serif font-bold text-base text-slate-900">Atelier Inventory Administration</h3>
                  <p className="text-xs text-slate-600">
                    Use the Products portal to review active amethyst formulations, adjust couture pricing, or introduce newly developed botanical creations.
                  </p>
                  <Link
                    to="/admin/products"
                    className="inline-block px-5 py-2.5 rounded-xl glass-btn-primary text-xs font-bold uppercase tracking-wider"
                  >
                    Manage Creations
                  </Link>
                </div>
              </div>
            }
          />
          <Route path="products" element={<AdminProductPage />} />
          <Route path="add-product" element={<AdminAddNewProduct />} />
          <Route
            path="orders"
            element={
              <div className="space-y-4">
                <h1 className="text-2xl font-serif font-bold text-slate-900">Orders</h1>
                <p className="text-xs text-slate-500">All luxury orders are actively fulfilled.</p>
              </div>
            }
          />
          <Route
            path="users"
            element={
              <div className="space-y-4">
                <h1 className="text-2xl font-serif font-bold text-slate-900">Registered Royal Patrons</h1>
                <p className="text-xs text-slate-500">All registered VIP members and subscribers appear here.</p>
              </div>
            }
          />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}
