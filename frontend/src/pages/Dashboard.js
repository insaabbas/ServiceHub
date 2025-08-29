import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaStar, FaRegStar, FaStarHalfAlt, FaMapMarkerAlt, FaDollarSign, 
  FaTags, FaCalendarAlt, FaComment, FaTools, FaWallet, FaCheckCircle 
} from "react-icons/fa";
import API from "../api/api";

function Dashboard() {
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Map provider names to their respective image paths
  const providerImagesMap = {
    "fresh bloom florists": "/florist.jpg",
    "elite tutors academy": "/tutors.jpg",
    "spark plumbing solutions": "/plumber.jpg",
    "swift movers": "/movers.png",
    "luxury chauffeur service": "/logistics.png",
    "fitness pro trainers": "/fitness.jpg",
    "luxury spa and massage": "/spa.jpg",
    "happy kids daycare": "/daycare.jpg",
    "quick electric repairs": "/electric-repairs.jpg",
    "bright future tutors": "/tutorss.jpg",
    "pet care express": "/pet-care.jpg",
    "sparkling car wash": "/car-wash.jpg",
    "event masters": "/event-manage.jpg",
    "green garden landscaping": "/gardening.jpg",
    "home painting experts": "/painter.jpg",
    "healthy life nutritionists": "/nutritionist.jpg",
    "fashion forward boutique": "/tailor.jpg",
    "gourmet catering services": "/food.jpg",
    "royal photography": "/photographer.jpg",
    "bright minds counseling": "/mental-health.jpg",
    "techfix it solutions": "/network-repair.jpg",
    "techfix computer repairs": "/computer-repairs.jpg",
    "elite home cleaning": "/home-cleaner.jpg",
    "healthy bites nutritionists": "/nutri.jpg",
    "royal event planners": "/royal-event-planner.jpg",
    "glamour hair salon": "/hair-dresser.jpg"
  };

  // Normalize provider name to match map keys
  const formatName = (name) =>
    name
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/&/g, 'and')
      .trim();

  const fetchProviders = async () => {
    try {
      const res = await API.get("/providers");
      setProviders(res.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load providers");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get("/users/me");
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load bookings");
    }
  };

  const viewReviews = (providerId) => {
    navigate(`/reviews/${providerId}`);
  };

  useEffect(() => {
    fetchProviders();
    fetchBookings();
  }, []);

  // Render 5-star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const decimal = (rating || 0) - fullStars;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<FaStar key={i} className="text-yellow-500 inline" />);
      else if (i === fullStars && decimal >= 0.25 && decimal < 0.75)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500 inline" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-500 inline" />);
    }
    return stars;
  };

  const gradients = [
    "linear-gradient(135deg, #F9E3CA, #D3E3F1)",
    "linear-gradient(135deg, #E3F9F1, #F3E3F9)",
    "linear-gradient(135deg, #F3F9E3, #E3E3F9)"
  ];

  return (
    <div className="dashboard-container p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Dashboard</h1>

      {/* Providers Section */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Available Providers</h2>
      {providers.length === 0 && <p>No providers found</p>}

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {providers.map((provider, idx) => (
          <div
            key={provider._id}
            className="break-inside-avoid p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            style={{ background: gradients[idx % gradients.length] }}
          >
            <div className="mb-4">
              <img
                src={providerImagesMap[formatName(provider.name)] || "/default.jpg"}
                alt={provider.name}
                className="rounded-xl w-full h-48 object-cover shadow-lg"
              />
            </div>

            <h3 className="text-xl font-bold mb-2 text-gray-800">{provider.name}</h3>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-2">
              {provider.categories.map((cat, i) => (
                <span
                  key={i}
                  className="bg-white bg-opacity-50 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                >
                  <FaTags className="inline" /> {cat}
                </span>
              ))}
            </div>

            <p className="text-gray-700 mb-1 flex items-center gap-1">
              <FaMapMarkerAlt /> {provider.location}
            </p>
            <p className="text-gray-700 mb-1 flex items-center gap-1">
              <FaDollarSign /> {provider.price || "N/A"}
            </p>
            <p className="text-gray-800 mb-3"><strong>Description:</strong> {provider.description || "N/A"}</p>

            {/* Stars */}
            <div className="mb-4">
              {renderStars(provider.rating)}{" "}
              <span className="text-gray-800 ml-2">{provider.rating ? provider.rating.toFixed(1) : "No rating yet"}</span>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link
                to={`/booking/${provider._id}`}
                state={{ provider }}
                className="px-4 py-2 bg-blue-200 text-blue-900 font-medium rounded-lg hover:bg-blue-300 transition flex items-center gap-1"
              >
                <FaCalendarAlt /> Book Now
              </Link>

              <button
                onClick={() => viewReviews(provider._id)}
                className="px-4 py-2 bg-blue-200 text-blue-900 font-medium rounded-lg hover:bg-blue-300 transition flex items-center gap-1"
              >
                <FaComment /> View/Add Reviews
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Section */}
      <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-700">My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet</p>}

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="break-inside-avoid p-4 rounded-xl shadow-md bg-white hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <div className="mb-2">
              <img
                src={providerImagesMap[formatName(b.provider.name)] || "/default.jpg"}
                alt={b.service}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            <p className="text-gray-800 mb-1 flex items-center gap-1">
              <FaTools /> {b.service} | <FaMapMarkerAlt /> {b.provider.name || b.provider}
            </p>
            <p className="text-gray-700 flex flex-col gap-1">
              <span><FaCalendarAlt /> {new Date(b.date).toLocaleDateString()}</span>
              <span><FaCheckCircle /> Status: {b.status}</span>
              <span><FaWallet /> Paid: {b.paid ? "Yes" : "No"}</span>
            </p>
          </div>
        ))}
      </div>

      {message && <p className="mt-6 text-red-500">{message}</p>}
    </div>
  );
}

export default Dashboard;
