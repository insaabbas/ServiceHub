import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const provider = location.state?.provider || null; // ✅ Safe default
  const token = localStorage.getItem("token");

  const [service, setService] = useState(provider?.categories?.[0] || "");
  const [date, setDate] = useState("");
  const [myBookings, setMyBookings] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch my bookings
  const fetchMyBookings = async () => {
    try {
      const res = await API.get("/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    if (provider && token) {
      fetchMyBookings();
    }
  }, [provider, token]);

  // Handle booking and navigate to Payment
  const handleBooking = async () => {
    if (!service || !date) {
      alert("Please select a service and date");
      return;
    }

    try {
      const bookingPayload = { provider: provider._id, service, date };

      const res = await API.post("/bookings", bookingPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const booking = res.data.booking;
      const clientSecret = res.data.clientSecret;

      if (!booking?._id || !clientSecret) {
        alert(
          "Booking created but missing ID or clientSecret. Check backend response."
        );
        return;
      }

      navigate("/payment", {
        state: { booking, clientSecret },
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (!provider) {
    return (
      <p className="p-6 text-center text-red-500">
        ⚠️ No provider data. Please go back to Dashboard and try again.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Provider Info */}
      <div
        className="w-full max-w-md p-6 mb-6 rounded-xl shadow-lg"
        style={{ background: "linear-gradient(135deg, #F9E3CA, #D3E3F1)" }}
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          {provider?.name || "Unnamed Provider"}
        </h1>
        <p className="text-gray-700 mb-2">Location: {provider?.location || "N/A"}</p>
        <p className="text-green-700 font-semibold">
          Price: {provider?.price ? `${provider.price} Rs` : "N/A"}
        </p>
      </div>

      {/* Booking Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mb-8 space-y-4">
        <label className="block font-semibold text-gray-700">Select Service</label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
        >
          {provider?.categories?.length > 0 ? (
            provider.categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))
          ) : (
            <option disabled>No services available</option>
          )}
        </select>

        <label className="block font-semibold text-gray-700">Select Date & Time</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
        />

        <button
          onClick={handleBooking}
          className="w-full px-4 py-2 bg-blue-200 text-blue-900 font-medium rounded-lg hover:bg-blue-300 transition"
        >
          Confirm Booking
        </button>

        {message && <p className="text-red-500 mt-2">{message}</p>}
      </div>

      {/* My Bookings */}
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Bookings</h2>
        {myBookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <div className="space-y-4">
            {myBookings.map((b) => (
              <div
                key={b._id}
                className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-all bg-white"
              >
                <p className="text-gray-800">
                  <strong>Service:</strong> {b.service}
                </p>
                <p className="text-gray-700">
                  <strong>Date:</strong> {new Date(b.date).toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Provider:</strong> {b.provider?.name || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong> {b.status}
                </p>
                <p className="text-gray-700">
                  <strong>Paid:</strong> {b.paid ? "Yes" : "No"}
                </p>
                <p className="text-gray-700">
                  <strong>Price:</strong> {b.price ? `${b.price} Rs` : "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;
