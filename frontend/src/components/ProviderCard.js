// frontend/src/components/ProviderCard.js
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

function ProviderCard({ provider }) {
  // Helper to render 5 stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const halfStar = rating - fullStars >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500 inline" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500 inline" />);
      }
    }
    return stars;
  };

  return (
    <div
      className="rounded-2xl p-6 shadow-md hover:shadow-lg transition transform hover:scale-105"
      style={{ background: "linear-gradient(135deg, #F9E3CA, #D3E3F1)" }}
    >
      <h3 className="text-xl font-bold text-gray-800">{provider.name}</h3>
      <p className="text-gray-700 mt-2">{provider.description}</p>
      <p className="mt-2 text-gray-800 font-medium">
        <strong>Location:</strong> {provider.location}
      </p>
      <p className="text-gray-800 font-medium">
        <strong>Price:</strong> {provider.price || "N/A"}
      </p>

      {/* Rating */}
      <div className="mt-2">
        {renderStars(provider.rating)}{" "}
        <span className="text-gray-800 ml-2">
          {provider.rating ? provider.rating.toFixed(1) : "No rating yet"}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Link
          to={`/booking/${provider._id}`}
          className="px-4 py-2 bg-blue-200 text-blue-900 font-medium rounded-lg hover:bg-blue-300 transition"
        >
          Book Now
        </Link>
        <Link
          to={`/reviews/${provider._id}`}
          className="px-4 py-2 bg-blue-200 text-blue-900 font-medium rounded-lg hover:bg-blue-300 transition"
        >
          View/Add Reviews
        </Link>
      </div>
    </div>
  );
}

export default ProviderCard;
