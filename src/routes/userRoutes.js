const express = require("express");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");
const ServiceProvider = require("../models/ServiceProvider");
const Review = require("../models/Review");

const router = express.Router();

// ==========================
// Public route: Get all providers
// ==========================
router.get("/providers", async (req, res) => {
  try {
    const providers = await ServiceProvider.find();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// Public route: Get single provider by ID + reviews
// ==========================
router.get("/providers/:id", async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    // Fetch reviews for this provider
    const reviews = await Review.find({ provider: req.params.id })
      .populate("user", "name email");

    res.json({ provider, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// Get logged-in user info
// ==========================
router.get("/me", protect, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// Get logged-in user's bookings
// ==========================
router.get("/bookings/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("provider", "name categories location");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// Create a new booking
// ==========================
router.post("/bookings", protect, async (req, res) => {
  try {
    const { provider, service, date } = req.body;
    if (!provider || !service || !date) {
      return res.status(400).json({ message: "All fields required" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      provider,
      service,
      date,
      status: "pending",
      paid: false,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// Admin-only route: get all bookings
// ==========================
router.get("/bookings", protect, allowRoles("admin"), async (req, res) => {
  try {
    const bookings = await Booking.find().populate("provider user", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// Reviews: Create a new review
// ==========================
router.post("/providers/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const review = await Review.create({
      user: req.user._id,
      provider: req.params.id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// Reviews: Get reviews for a provider
// ==========================
router.get("/providers/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.id })
      .populate("user", "name email");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
