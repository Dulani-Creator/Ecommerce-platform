import { Navigate, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    const stored = localStorage.getItem("user");
    if (stored) user = JSON.parse(stored);
  } catch {
    user = null;
  }

  const role = (user?.role || user?.Role || "").toString().trim().toLowerCase();

  // 1. If not logged in at all, redirect to login page
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ fromAdmin: true }} />;
  }

  // 2. If logged in as customer, strictly block access to admin panel!
  if (role !== "admin") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-[#FAF5FF] via-[#FCFAFF] to-[#F3E8FF] text-slate-800">
        <div className="max-w-md w-full glass-panel-strong rounded-3xl p-8 border border-purple-100 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Access Restricted
            </span>
            <h2 className="text-2xl font-serif font-bold text-slate-900 pt-2">
              Customer Account Detected
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            You are currently signed in as a <span className="font-bold text-purple-700">Customer</span> (
            <span className="text-slate-800 font-semibold">{user.email || user.firstName}</span>). Customer accounts are not permitted to access or modify the Atelier Admin Management Portal.
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/"
              className="w-full py-3.5 rounded-xl glass-btn-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Customer Boutique
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="w-full py-2.5 rounded-xl glass-btn-secondary font-semibold text-xs text-slate-600 hover:text-purple-700 cursor-pointer"
            >
              Sign Out & Switch to Admin Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is verified Admin, grant access
  return children;
}
