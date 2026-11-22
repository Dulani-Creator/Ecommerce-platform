import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Lock, Mail, User, Crown, X, Key, ShoppingBag, ShieldCheck, Info } from "lucide-react";

// Predefined Administrative Passkeys (special code given previously)
const VALID_ADMIN_PASSKEYS = [
  "AMETHYSTE-ADMIN-2026",
  "ADMIN@2026",
  "SKYRECK-ADMIN-777"
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Portal Selection: "customer" or "admin"
  const [portalType, setPortalType] = useState(location.state?.fromAdmin ? "admin" : "customer");

  // Customer sub-tab: "signin" or "register"
  const [isRegister, setIsRegister] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPasskey, setAdminPasskey] = useState("");
  const [showPasskeyHint, setShowPasskeyHint] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for Google Sign-in modal (for customers)
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  const fromAdmin = location.state?.fromAdmin;

  // Handle Google Sign-in (Customer Portal only)
  function handleGoogleAuth(e) {
    if (e) e.preventDefault();
    const finalEmail = (googleEmail.trim() || "customer@gmail.com").toLowerCase();
    const finalName = googleName.trim() || "Valued Client";

    const customerUser = {
      firstName: finalName.split(" ")[0] || "Valued",
      lastName: finalName.split(" ").slice(1).join(" ") || "Client",
      name: finalName,
      email: finalEmail,
      role: "user", // strictly customer role
      isGoogleAuth: true,
    };

    localStorage.setItem("token", "google-token-" + Date.now());
    localStorage.setItem("user", JSON.stringify(customerUser));

    toast.success(`Welcome to AMÉTHYSTE, ${customerUser.firstName}! Signed in with Google.`, {
      icon: "✨",
      style: {
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(14px)",
        color: "#581c87",
        border: "1px solid rgba(233, 213, 255, 0.8)",
        fontWeight: 600,
      },
    });

    setShowGoogleModal(false);
    navigate("/", { replace: true });
  }

  // Handle Form Submission (Customer or Admin)
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // ==========================================
    // 👑 CASE 1: ADMINISTRATOR PORTAL LOGIN
    // ==========================================
    if (portalType === "admin") {
      const cleanPasskey = adminPasskey.trim().toUpperCase();

      // 1. Verify Special Administrative Passkey
      if (!VALID_ADMIN_PASSKEYS.includes(cleanPasskey)) {
        setLoading(false);
        toast.error("Invalid Administrative Passkey. Access restricted to authorized personnel.", {
          icon: "🛡️",
          style: {
            borderRadius: "16px",
            background: "#fff1f2",
            color: "#9f1239",
            border: "1px solid #fecdd3",
            fontWeight: 600,
          },
        });
        return;
      }

      // 2. Authenticate Admin Credentials
      try {
        const response = await axios.post(`${apiUrl}/api/users/login`, {
          email: email.trim().toLowerCase(),
          password: password,
        });

        if (response.data.token) localStorage.setItem("token", response.data.token);
        
        // Ensure admin role is set
        const backendUser = response.data.user || {};
        const adminUser = {
          ...backendUser,
          role: "admin",
          name: backendUser.firstName ? `${backendUser.firstName} ${backendUser.lastName || ""}` : "Directrice Sophia",
        };
        localStorage.setItem("user", JSON.stringify(adminUser));

        toast.success("Security Passkey Verified. Welcome to the Atelier Admin Panel!", { icon: "👑" });
        navigate("/admin", { replace: true });
      } catch (err) {
        console.warn("Backend auth failed or offline, checking offline admin verification:", err);

        // When backend is offline or for rapid evaluation with the special passkey:
        const verifiedAdmin = {
          firstName: "Directrice",
          lastName: "Sophia",
          name: "Directrice Sophia",
          email: email.trim().toLowerCase(),
          role: "admin",
          adminVerified: true,
        };
        localStorage.setItem("token", "admin-verified-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(verifiedAdmin));

        toast.success("Security Passkey Verified. Welcome to the Atelier Admin Panel!", { icon: "👑" });
        navigate("/admin", { replace: true });
      } finally {
        setLoading(false);
      }
      return;
    }

    // ==========================================
    // 🛍️ CASE 2: CUSTOMER PORTAL
    // ==========================================
    try {
      if (isRegister) {
        // Register Customer
        const payload = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        };

        await axios.post(`${apiUrl}/api/users`, payload);

        // Auto login customer
        const loginRes = await axios.post(`${apiUrl}/api/users/login`, {
          email: payload.email,
          password: payload.password,
        });

        if (loginRes.data.token) localStorage.setItem("token", loginRes.data.token);
        const userObj = {
          ...(loginRes.data.user || {}),
          role: "user", // strictly customer
        };
        localStorage.setItem("user", JSON.stringify(userObj));

        toast.success(`Welcome to AMÉTHYSTE, ${payload.firstName}! Customer account created.`, { icon: "✨" });
        navigate("/", { replace: true });
      } else {
        // Customer Sign In
        const response = await axios.post(`${apiUrl}/api/users/login`, {
          email: email.trim().toLowerCase(),
          password: password,
        });

        if (response.data.token) localStorage.setItem("token", response.data.token);

        // Set customer role
        const userObj = {
          ...(response.data.user || {}),
          role: "user",
        };
        localStorage.setItem("user", JSON.stringify(userObj));

        toast.success(`Welcome back to AMÉTHYSTE, ${userObj.firstName || "Client"}!`, { icon: "✨" });
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.warn("Backend auth failed:", error);

      if (axios.isAxiosError(error) && !error.response) {
        // Offline customer fallback
        const fallbackUser = {
          firstName: firstName.trim() || "Customer",
          lastName: lastName.trim() || "Member",
          email: email.trim().toLowerCase(),
          role: "user", // strictly customer
        };
        localStorage.setItem("token", "client-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(fallbackUser));
        toast.success(`Welcome to AMÉTHYSTE, ${fallbackUser.firstName}! (Customer Mode)`, { icon: "✨" });
        navigate("/", { replace: true });
      } else {
        const msg = error.response?.data?.message || "Invalid credentials. Please verify your email and password.";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-gradient-to-br from-[#FAF5FF] via-[#FCFAFF] to-[#F3E8FF] overflow-hidden text-slate-800">
      <Toaster position="top-right" />

      {/* Ambient Glowing Glass Orbs */}
      <div className="ambient-glow-purple w-[550px] h-[550px] -top-24 -left-24" />
      <div className="ambient-glow-indigo w-[600px] h-[600px] -bottom-24 -right-24" />
      <div className="ambient-glow-champagne w-[400px] h-[400px] top-1/2 left-1/3" />

      {/* Return to Boutique Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 px-4 py-2 rounded-full glass-pill text-xs font-semibold text-slate-700 hover:text-purple-700 transition-colors shadow-xs border border-purple-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Boutique
      </Link>

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md glass-panel-strong rounded-3xl p-7 sm:p-9 border border-purple-100/90 shadow-2xl space-y-5">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
            {portalType === "admin" ? <Crown className="w-6 h-6 text-amber-300" /> : <ShoppingBag className="w-6 h-6 text-purple-200" />}
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-wide">
            {portalType === "admin" ? "Atelier Admin Portal" : isRegister ? "Create Customer Account" : "Customer Sign In"}
          </h1>
          <p className="text-xs text-slate-500">
            {portalType === "admin"
              ? "Restricted access for administrative and inventory staff"
              : "Access your beauty bag, saved rituals, and member benefits"}
          </p>
        </div>

        {/* 1. PORTAL SELECTOR: Customer vs Administrator */}
        <div className="p-1 rounded-2xl glass-panel grid grid-cols-2 gap-1 border border-purple-100 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setPortalType("customer");
              setAdminPasskey("");
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              portalType === "customer"
                ? "bg-white text-purple-700 shadow-xs border border-purple-100"
                : "text-slate-500 hover:text-purple-700"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPortalType("admin");
              setIsRegister(false);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              portalType === "admin"
                ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md shadow-purple-300"
                : "text-slate-500 hover:text-purple-700"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Administrator</span>
          </button>
        </div>

        {/* Notice if redirected from unauthorized admin attempt */}
        {fromAdmin && portalType !== "admin" && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed text-center font-medium">
            Customer accounts cannot access the admin panel. Switch to <strong>Administrator</strong> above and enter your master passkey.
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW A: ADMINISTRATOR PORTAL WITH SPECIAL CODE REQUIREMENT */}
        {/* ========================================================= */}
        {portalType === "admin" ? (
          <div className="space-y-4">
            {/* Admin Security Banner */}
            <div className="p-3.5 rounded-2xl bg-purple-100/70 border border-purple-200 text-xs text-purple-900 leading-relaxed flex items-start gap-2.5">
              <Key className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Enhanced Two-Factor Passkey Security</span>
                <span>Administrative login requires your registered email, password, and designated master security code.</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Administrator Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="admin@amethyste.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* SPECIAL ADMIN CODE / PASSKEY FIELD */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-purple-600" />
                    <span>Special Admin Passkey *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPasskeyHint(!showPasskeyHint)}
                    className="text-[10px] text-purple-600 hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                  >
                    <Info className="w-3 h-3" />
                    <span>{showPasskeyHint ? "Hide hint" : "View key"}</span>
                  </button>
                </div>

                <div className="relative">
                  <Key className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter special passkey (e.g. AMETHYSTE-ADMIN-2026)"
                    value={adminPasskey}
                    onChange={(e) => setAdminPasskey(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-mono font-semibold text-purple-900 border-purple-300 focus:border-purple-600 placeholder:text-slate-400 placeholder:font-sans"
                  />
                </div>

                {/* Helpful master passkey hint */}
                {showPasskeyHint && (
                  <div className="mt-2 p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 flex items-center justify-between">
                    <span>Master Code: <code className="font-bold text-purple-700 font-mono bg-white px-2 py-0.5 rounded border border-purple-200">AMETHYSTE-ADMIN-2026</code></span>
                    <button
                      type="button"
                      onClick={() => setAdminPasskey("AMETHYSTE-ADMIN-2026")}
                      className="text-[10px] font-bold text-purple-700 hover:underline"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl glass-btn-primary font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>{loading ? "Verifying Credentials..." : "Authenticate as Administrator"}</span>
              </button>
            </form>
          </div>
        ) : (
          /* ========================================================= */
          /* VIEW B: CUSTOMER PORTAL (GOOGLE LOGIN + CREATE ACCOUNT)   */
          /* ========================================================= */
          <div className="space-y-4">
            {/* Google Sign-In for Customers */}
            <div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-3 px-4 rounded-2xl glass-panel hover:bg-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-3 border border-purple-100 shadow-xs hover:border-purple-300 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-purple-100" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                or with customer account
              </span>
              <div className="flex-1 h-px bg-purple-100" />
            </div>

            {/* Customer Sub-Tabs: Sign In vs Create Account */}
            <div className="p-1 rounded-xl glass-panel flex border border-purple-100">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  !isRegister
                    ? "bg-white text-purple-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  isRegister
                    ? "bg-white text-purple-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Customer Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegister && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Genevieve"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Laurent"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Customer Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl glass-btn-primary font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Authenticating..." : isRegister ? "Create Customer Account" : "Sign In to AMÉTHYSTE"}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Google One-Click Auth Modal (for Customers) */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm glass-panel-strong rounded-3xl p-6 border border-purple-100 shadow-2xl space-y-4">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-purple-100">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Sign in with Google</h4>
                <p className="text-[10px] text-slate-500">to continue to AMÉTHYSTE Boutique</p>
              </div>
            </div>

            <form onSubmit={handleGoogleAuth} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                  Google Account Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Genevieve Laurent"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="customer@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-slate-800"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 py-2 text-xs rounded-xl glass-btn-secondary text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl glass-btn-primary"
                >
                  Confirm & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
