import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the booked provider from location.state
  const booking = location.state?.booking;
  const provider = booking?.provider || null;

  const handleGoToBooking = () => {
    if (!provider) {
      // Fallback: navigate to providers page if provider is missing
      navigate("/providers");
      return;
    }
    navigate("/booking/" + provider._id, { state: { provider } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div
        className="p-8 rounded-2xl shadow-lg text-center max-w-md transform hover:scale-105 transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #F9E3CA, #D3E3F1)"
        }}
      >
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Payment Successful!
        </h1>
        <p className="mb-6 text-gray-800">
          Your booking has been confirmed and payment received.
        </p>
        <button
          onClick={handleGoToBooking}
          className="px-6 py-2 bg-blue-200 text-blue-900 font-medium rounded-lg hover:bg-blue-300 transition"
        >
          Go to Booking
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
