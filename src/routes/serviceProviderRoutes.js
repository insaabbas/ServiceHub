const express = require("express");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const { createProvider, getProviders } = require("../controllers/serviceProviderController");
const Booking = require("../models/Booking");

const router = express.Router();

// ==========================
// Get bookings for logged-in provider
// ==========================
router.get("/bookings", protect, allowRoles("provider"), async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate("user", "name email");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// ==========================
// Update booking status (provider)
// ==========================
router.patch("/bookings/:id", protect, allowRoles("provider"), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.provider.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const { status } = req.body;
    if (status) booking.status = status;

    await booking.save();
    res.json({ message: "Booking status updated", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update booking status" });
  }
});

// ==========================
// Create new provider (only admin or user can create their own)
// ==========================
router.post("/", protect, async (req, res) => {
  try {
    const { name, categories, location, price, description, image } = req.body;

    if (!name || !categories || !location || !price) {
      return res.status(400).json({ message: "Name, categories, location, and price are required" });
    }

    const provider = await createProvider({
      user: req.user._id,
      name,
      categories,
      location,
      price,
      description,
      image
    });

    res.status(201).json(provider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create provider" });
  }
});

// ==========================
// Get all providers (public route)
// ==========================
router.get("/", getProviders);

module.exports = router;
