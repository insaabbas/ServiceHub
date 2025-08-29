import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function ProviderList() {
  const [providers, setProviders] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await API.get("/providers");
        setProviders(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load providers");
      }
    };
    fetchProviders();
  }, []);

  const viewReviews = (id) => navigate(`/reviews/${id}`);
  const bookProvider = (id) => navigate(`/booking/${id}`);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Providers</h1>
      {message && <p className="text-red-500 text-center">{message}</p>}
      <ul className="space-y-4 max-w-3xl mx-auto">
        {providers.map((p) => (
          <li
            key={p._id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">{p.name}</p>
              <p className="text-gray-700">
                Categories: {p.categories.join(", ")}
              </p>
              <p className="text-gray-700">Location: {p.location}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => bookProvider(p._id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Book
              </button>
              <button
                onClick={() => viewReviews(p._id)}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Reviews
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProviderList;
