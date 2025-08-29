import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function Reviews() {
  const { id: providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  // Fetch provider details including reviews
  const fetchProvider = async () => {
    try {
      const res = await API.get(`/reviews/${providerId}`);
      setProvider(res.data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load provider reviews");
    }
  };

  useEffect(() => {
    fetchProvider();
  }, [providerId]);

  // Submit a new review
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/reviews`, { provider: providerId, rating: Number(rating), comment });
      setRating("");
      setComment("");

      // Show success popup for 1 minute
      setMessage("✅ Review submitted! Thanks for your review.");
      setTimeout(() => setMessage(""), 60000);

      // Refresh provider info after short delay
      setTimeout(fetchProvider, 300);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (!provider) return <p className="text-center mt-6 text-gray-700">Loading...</p>;

  return (
    <div className="reviews-container p-6 bg-gray-50 min-h-screen">
      {/* Provider Info */}
      <div
        className="max-w-2xl mx-auto p-6 rounded-xl shadow-lg mb-6 text-center"
        style={{ background: "linear-gradient(135deg, #F9E3CA, #D3E3F1)" }}
      >
        <h2 className="text-3xl font-bold mb-2 text-gray-800">{provider.name}</h2>
        <p className="text-gray-700 mb-2">
          <strong>Description:</strong> {provider.description || "N/A"}
        </p>
        <p className="text-yellow-600 font-semibold">
          Rating: {provider.rating ? provider.rating.toFixed(1) : "N/A"} ⭐
        </p>
      </div>

      {/* Review Form */}
      <form
        onSubmit={submitReview}
        className="bg-white p-6 rounded-xl shadow-lg mb-6 max-w-lg mx-auto space-y-4"
      >
        <label className="block font-semibold text-gray-700">Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
          required
        />

        <label className="block font-semibold text-gray-700">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-200 text-blue-900 font-medium rounded-lg hover:bg-blue-300 transition"
        >
          Submit Review
        </button>
      </form>

      {/* Success/Failure Message */}
      {message && (
        <p className="mt-4 text-center text-green-600 font-semibold transition-opacity duration-500 opacity-100">
          {message}
        </p>
      )}

      {/* Reviews List */}
      <div className="max-w-2xl mx-auto space-y-4">
        {provider.reviews && provider.reviews.length > 0 ? (
          provider.reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-all bg-white"
            >
              <p className="font-semibold text-gray-800">
                {r.user ? r.user.name : "Anonymous"} | Rating: {r.rating} ⭐
              </p>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default Reviews;
