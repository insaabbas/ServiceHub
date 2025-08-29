const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true, // ✅ removes accidental spaces
    },
    categories: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number, // ✅ fixed (was String before)
      required: true,
      min: 0,       // ✅ prevents negative prices
    },
    available: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5, // ✅ ensures valid ratings
    },
    reviews: [
      {
        user: {
          type: String,
          default: "Anonymous",
          trim: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const ServiceProvider = mongoose.model("ServiceProvider", serviceProviderSchema);
module.exports = ServiceProvider;
