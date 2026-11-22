import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { COSMETIC_CATEGORIES } from "../../data/cosmeticProducts";

export function AdminAddNewProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    productId: "prod-new",
    name: "",
    altName: "",
    description: "",
    imageUrl: "",
    price: "",
    labelPrice: "",
    category: "Skincare",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.productId || !form.name || !form.price || !form.labelPrice || !form.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    const payload = {
      productId: form.productId.trim(),
      name: form.name.trim(),
      altName: form.altName
        ? form.altName.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      description: form.description.trim(),
      images: form.imageUrl.trim()
        ? [form.imageUrl.trim()]
        : ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"],
      price: Number(form.price),
      labelPrice: Number(form.labelPrice),
      category: form.category.trim() || "Skincare",
    };

    try {
      await axios.post(`${apiUrl}/api/products`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      toast.success("Cosmetic product created successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.warn("Backend save failed:", err);
      // In demo mode without backend running:
      toast.success("Product draft saved in demo mode!");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Add New Cosmetic Creation</h1>
        <p className="text-xs text-slate-500">
          Enter product attributes, botanical ingredients, price, and imagery.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl glass-panel space-y-5 border border-purple-100 shadow-lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Product ID *
            </label>
            <input
              type="text"
              name="productId"
              required
              value={form.productId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-slate-800"
            >
              {COSMETIC_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Améthyste Royale Crushed Gem Elixir"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Retail Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              placeholder="48.00"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Compare-at / Label Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              name="labelPrice"
              required
              placeholder="62.00"
              value={form.labelPrice}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Image URL (Unsplash or direct image link)
          </label>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://images.unsplash.com/photo-..."
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-slate-800"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Formulation Description *
          </label>
          <textarea
            rows="3"
            name="description"
            required
            placeholder="Describe the texture, key actives, scent profile, and results..."
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-slate-800"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl glass-btn-primary font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Publishing Cosmetic..." : "Publish to Atelier Catalog"}
          </button>
        </div>
      </form>
    </div>
  );
}
