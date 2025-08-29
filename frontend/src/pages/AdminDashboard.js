import { useState, useEffect } from "react";
import API from "../api/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all data
  const fetchData = async () => {
    try {
      const [usersRes, providersRes, bookingsRes, reviewsRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/providers"),
        API.get("/admin/bookings"),
        API.get("/admin/reviews"),
      ]);
      setUsers(usersRes.data);
      setProviders(providersRes.data);
      setBookings(bookingsRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete functions
  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      await API.delete(`/admin/${type}/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  return (
    <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Users */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.role}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteItem("users", u._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Providers */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Providers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Categories</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-2 px-4">{p.name}</td>
                  <td className="py-2 px-4">{p.categories.join(", ")}</td>
                  <td className="py-2 px-4">{p.location}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteItem("providers", p._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bookings */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Service</th>
                <th className="py-2 px-4">Provider</th>
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Paid</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b">
                  <td className="py-2 px-4">{b.service}</td>
                  <td className="py-2 px-4">{b.provider.name || b.provider}</td>
                  <td className="py-2 px-4">{b.user.name || b.user}</td>
                  <td className="py-2 px-4">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{b.status}</td>
                  <td className="py-2 px-4">{b.paid ? "Yes" : "No"}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteItem("bookings", b._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reviews */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {reviews.length === 0 && <p className="text-center text-gray-600">No reviews yet.</p>}
          {reviews.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded-lg shadow">
              <p className="font-semibold">{r.user?.name || "Anonymous"} | Rating: {r.rating}</p>
              <p className="text-gray-700">{r.comment}</p>
              <button
                onClick={() => deleteItem("reviews", r._id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
    </div>
  );
}

export default AdminDashboard;
