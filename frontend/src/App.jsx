import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import AdminPage from "./Pages/adminPage";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import HomePage from "./Pages/homePage";
import TestPage from "./Pages/test";
import LoginPage from "./Pages/loginPage";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-[#FAF5FF] via-[#FCFAFF] to-[#F3E8FF] text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-950">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(14px)",
                color: "#581c87",
                border: "1px solid rgba(233, 213, 255, 0.8)",
                boxShadow: "0 10px 30px rgba(126, 34, 206, 0.12)",
                fontSize: "13px",
                fontWeight: 600,
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Navigate to="/login" replace />} />
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <AdminPage />
                </AdminProtectedRoute>
              }
            />
            <Route path="/test" element={<TestPage />} />
            <Route path="/*" element={<HomePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
