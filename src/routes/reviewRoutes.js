const express = require("express");
const ServiceProvider = require("../models/ServiceProvider");

const router = express.Router();

// Add a review
router.post("/", async (req, res) => {
  const { provider, rating, comment } = req.body;

  try {
    const serviceProvider = await ServiceProvider.findById(provider);
    if (!serviceProvider) return res.status(404).json({ message: "Provider not found" });

    serviceProvider.reviews.push({
      user: "Anonymous", // always anonymous now
      rating,
      comment
    });

    // Update average rating
    serviceProvider.rating =
      serviceProvider.reviews.reduce((acc, r) => acc + r.rating, 0) /
      serviceProvider.reviews.length;

    await serviceProvider.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get provider including reviews
router.get("/:providerId", async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
