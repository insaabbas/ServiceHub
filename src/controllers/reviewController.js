const ServiceProvider = require("../models/ServiceProvider");

// Add review for a provider (no user required)
const addReview = async (req, res) => {
  try {
    const { providerId, rating, comment } = req.body;

    if (!providerId || !comment) {
      return res.status(400).json({ message: "Provider and comment are required" });
    }

    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Save review without user info
    const review = {
      rating: rating || 0, // optional
      comment
    };

    provider.reviews.push(review);

    // Update average rating if rating provided
    const ratings = provider.reviews.map(r => r.rating || 0);
    provider.rating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    await provider.save();

    res.status(201).json({ message: "Review added successfully", reviews: provider.reviews });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reviews for a provider
const getReviews = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.providerId);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(provider.reviews);
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addReview, getReviews };
