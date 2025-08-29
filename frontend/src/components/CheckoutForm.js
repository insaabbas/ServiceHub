import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

function CheckoutForm({ bookingId, amount, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setMessage("");

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redirect URL after successful payment
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (result.error) {
        setMessage(`❌ ${result.error.message}`);
      } else if (result.paymentIntent?.status === "succeeded") {
        setMessage("✅ Payment successful!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded w-full shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
      <form onSubmit={handleSubmit}>
        <PaymentElement className="p-3 border rounded mb-3" />
        <button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Processing..." : `Pay ${amount} Rs`}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 ${
            message.includes("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default CheckoutForm;
