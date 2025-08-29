import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";

// Stripe public key
const stripePromise = loadStripe(
  "pk_test_51RyfZB2a6kXwnikkxuGZYIPbScCIOMoeiz1o8QmyiyddnOXSMWKzmovXkKYRzbM1d6K7vLo4f10Rkg0rKRWlIpBU00OJI0R84z"
);

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Receive booking and clientSecret from navigation state
  const { booking, clientSecret } = location.state || {};

  // Show error if data missing
  if (!booking || !booking._id || !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <p className="text-center text-red-500 mb-4">
          ❌ Missing booking or payment information.
        </p>
        <button
          onClick={() => navigate("/bookings")}
          className="px-4 py-2 bg-blue-200 text-blue-900 font-medium rounded-lg hover:bg-blue-300 transition"
        >
          Go Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen items-start bg-gray-50 p-6">
      <div
        className="w-full max-w-md p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
        style={{ background: "linear-gradient(135deg, #F9E3CA, #D3E3F1)" }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Payment for Booking
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Amount to pay: <strong>{booking.price} Rs</strong>
        </p>

        {/* Pass clientSecret to CheckoutForm */}
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            bookingId={booking._id}
            amount={booking.price}
            clientSecret={clientSecret}
          />
        </Elements>
      </div>
    </div>
  );
}

export default PaymentPage;
