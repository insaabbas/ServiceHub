const express = require("express");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");
const Booking = require("../models/Booking");

const router = express.Router();

// ✅ Admin-only test
router.get("/dashboard", protect, allowRoles("admin"), (req, res) => {
  res.json({ message: "Admin dashboard accessed!", user: req.user });
});

// ✅ Users management
router.get("/users", protect, allowRoles("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.delete("/users/:id", protect, allowRoles("admin"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// ✅ Providers management
router.get("/providers", protect, allowRoles("admin"), async (req, res) => {
  const providers = await ServiceProvider.find();
  res.json(providers);
});

router.post("/providers", protect, allowRoles("admin"), async (req, res) => {
  const { name, location, categories } = req.body;
  const provider = await ServiceProvider.create({ name, location, categories });
  res.status(201).json(provider);
});

router.delete("/providers/:id", protect, allowRoles("admin"), async (req, res) => {
  await ServiceProvider.findByIdAndDelete(req.params.id);
  res.json({ message: "Provider deleted" });
});

// ✅ Bookings management
router.get("/bookings", protect, allowRoles("admin"), async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email")
    .populate("provider", "name categories location");
  res.json(bookings);
});

router.patch("/bookings/:id", protect, allowRoles("admin"), async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const { status, paid } = req.body;
  if (status) booking.status = status;
  if (paid !== undefined) booking.paid = paid;

  await booking.save();
  res.json({ message: "Booking updated", booking });
});

module.exports = router;
