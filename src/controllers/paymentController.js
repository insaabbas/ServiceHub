const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");

// ✅ Create Stripe payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: "usd",
      metadata: { bookingId: booking._id.toString() },
    });

    // Save payment info (not marking paid yet)
    booking.paymentId = paymentIntent.id;
    booking.paymentMethod = paymentMethod || "card";
    await booking.save();

    // ✅ Return BOTH bookingId + Stripe clientSecret
    res.json({
      bookingId: booking._id,
      clientSecret: paymentIntent.client_secret,
      amount,
      paymentMethod: booking.paymentMethod,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Mark booking as paid after confirmation (Webhook or manual call)
const markBookingPaid = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const booking = await Booking.findOne({ paymentId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paid = true;
    await booking.save();

    res.json({ message: "Booking marked as paid", booking });
  } catch (error) {
    console.error("Mark Paid Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent, markBookingPaid };
