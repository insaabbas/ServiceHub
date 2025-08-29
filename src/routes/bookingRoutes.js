const express = require("express");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const {
  createBooking,
  getUserBookings,
  getProviderBookings,
  getAllBookings
} = require("../controllers/bookingController");

const router = express.Router();

// Create booking (logged-in users)
router.post("/", protect, allowRoles("user"), createBooking);

// User view own bookings
router.get("/my", protect, allowRoles("user"), getUserBookings);

// Provider view own bookings
router.get("/provider", protect, allowRoles("provider"), getProviderBookings);

// Admin view all bookings
router.get("/all", protect, allowRoles("admin"), getAllBookings);
// Mark booking as paid (for testing)
router.patch("/mark-paid/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paid = true;
    await booking.save();

    res.json({ message: "Booking marked as paid", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
