const ServiceProvider = require("../models/ServiceProvider");

// ==========================
// Create a new service provider
// ==========================
const createProvider = async (req, res) => {
  try {
    const { name, categories, location, price, description, image } = req.body;

    if (!name || !categories || !location || !price) {
      return res.status(400).json({ message: "Name, categories, location, and price are required" });
    }

    // Check if the provider already exists for this user
    const providerExists = await ServiceProvider.findOne({ user: req.user._id });
    if (providerExists) {
      return res.status(400).json({ message: "Provider already exists for this user" });
    }

    const provider = await ServiceProvider.create({
      user: req.user._id,
      name,
      categories,
      location,
      price,
      description,
      image
    });

    res.status(201).json(provider);
  } catch (error) {
    console.error("ServiceProvider Create Error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ==========================
// Get all providers (public route)
// ==========================
const getProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find()
      .populate("user", "name email") // attach user info
      .sort({ createdAt: -1 }); // latest first

    res.json(providers);
  } catch (error) {
    console.error("Get Providers Error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { createProvider, getProviders };
