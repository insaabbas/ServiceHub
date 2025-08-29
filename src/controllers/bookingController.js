// controllers/bookingController.js
const Booking = require("../models/Booking");
const ServiceProvider = require("../models/ServiceProvider");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ✅ Create Booking + PaymentIntent
const createBooking = async (req, res) => {
  try {
    const { provider: providerId, service, date } = req.body;
    const userId = req.user._id;

    // Find provider
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    if (!provider.price) {
      return res
        .status(400)
        .json({ message: "Provider does not have a price set" });
    }

    const price = Number(provider.price);

    // Step 1: Create booking in DB
    const booking = new Booking({
      user: userId,
      provider: providerId,
      service,
      date,
      price,
    });
    await booking.save();

    // Step 2: Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // in cents
      currency: "usd",
      metadata: { bookingId: booking._id.toString() },
    });

    // Step 3: Save Stripe paymentId + method into booking
    booking.paymentId = paymentIntent.id;
    booking.paymentMethod = "card";
    await booking.save();

    // Step 4: Populate booking for frontend
    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email")
      .populate("provider", "name email price");

    // Step 5: Return both bookingId + clientSecret explicitly
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      bookingId: populatedBooking._id, // ✅ important
      clientSecret: paymentIntent.client_secret, // ✅ important
      booking: {
        _id: populatedBooking._id,
        user: populatedBooking.user,
        provider: populatedBooking.provider,
        service: populatedBooking.service,
        date: populatedBooking.date,
        price: populatedBooking.price,
        status: populatedBooking.status,
        paid: populatedBooking.paid,
        paymentId: populatedBooking.paymentId,
        paymentMethod: populatedBooking.paymentMethod,
        createdAt: populatedBooking.createdAt,
        updatedAt: populatedBooking.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("provider", "name email price")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Provider Bookings
const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate("user", "name email")
      .populate("provider", "name email price")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get All Bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("provider", "name email price")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update Booking Status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("provider", "name email price");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "completed") {
      return res
        .status(400)
        .json({ message: "Completed bookings cannot be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getProviderBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
};
