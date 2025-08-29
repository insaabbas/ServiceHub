const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createPaymentIntent } = require("../controllers/paymentController");

const router = express.Router();

// Create payment intent for booking
router.post("/", protect, createPaymentIntent);

module.exports = router;
