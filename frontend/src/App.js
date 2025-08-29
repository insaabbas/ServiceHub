import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "./api/api";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Reviews from "./pages/Reviews";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";

import PrivateRoute from "./components/PrivateRoute";
import ProviderCard from "./components/ProviderCard";

// ✅ Stripe Payment
import PaymentPage from "./pages/PaymentPage";

function App() {
  const [user, setUser] = useState(null);
  const [providers, setProviders] = useState([]);

  // Load user from token on refresh
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await API.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
        localStorage.removeItem("token");
      }
    };
    loadUser();
  }, []);

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await API.get("/providers");
        setProviders(res.data);
      } catch (err) {
        console.error("Error fetching providers:", err);
      }
    };
    fetchProviders();
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Providers */}
        <Route
          path="/providers"
          element={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {providers.length > 0 ? (
                providers.map((p) => <ProviderCard key={p._id} provider={p} />)
              ) : (
                <p className="text-gray-500">No providers found...</p>
              )}
            </div>
          }
        />

        {/* Booking & Reviews */}
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/reviews/:id" element={<Reviews />} />
<Route path="/payment-success" element={<PaymentSuccess />} />

        {/* ✅ Payment Page */}
        <Route path="/payment" element={<PaymentPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute user={user}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute user={user} adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
