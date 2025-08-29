const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true
    },
    service: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    },
    // ✅ Price will be auto-filled from ServiceProvider
    price: {
      type: Number
    },
    paid: {
      type: Boolean,
      default: false
    },
    paymentId: {
      type: String
    },
    paymentMethod: {
      type: String // e.g. 'card', 'paypal', 'cash'
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
