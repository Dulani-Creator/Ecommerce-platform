import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { COSMETIC_PRODUCTS } from "../../data/cosmeticProducts";

export function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    let isMounted = true;

    axios
      .get(`${apiUrl}/api/products`)
      .then((response) => {
        if (isMounted) {
          if (Array.isArray(response.data) && response.data.length > 0) {
            setProducts(response.data);
          } else {
            setProducts(COSMETIC_PRODUCTS);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn("Backend products fetch failed, using fallback cosmetic catalog:", err);
          setProducts(COSMETIC_PRODUCTS);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  async function handleDelete(productId) {
    if (!window.confirm(`Are you sure you want to delete product "${productId}"?`)) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${apiUrl}/api/products/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((item) => item.productId !== productId));
    } catch {
      // In demo mode or if backend deletion fails, update UI state directly
      setProducts((prev) => prev.filter((item) => item.productId !== productId));
      toast.success("Product removed from view.");
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Cosmetics Catalog Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage beauty inventory, prices, and product availability.</p>
        </div>
        <Link
          to="/admin/add-product"
          className="flex items-center gap-2 px-5 py-2.5 glass-btn-primary font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add New Cosmetic
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Loading luxury catalog...</div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl text-slate-500 text-xs border border-purple-100">
          No cosmetics currently in catalog.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border border-purple-100/90 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-purple-100 bg-purple-50/50 text-purple-950 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60">
                {products.map((p) => {
                  const image =
                    (p.images && p.images.length > 0 ? p.images[0] : p.image) ||
                    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80";

                  return (
                    <tr key={p.productId} className="hover:bg-white/60 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-purple-50"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 block">{p.name}</span>
                          <span className="text-[10px] text-slate-400">ID: {p.productId}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                          {p.category || "Cosmetics"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-purple-950">
                        ${Number(p.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-purple-700 font-semibold text-[11px] flex items-center gap-1">
                          ● In Healthy Stock
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(p.productId)}
                          className="p-2 rounded-xl text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
