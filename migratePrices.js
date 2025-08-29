// migratePrices.js
const mongoose = require("mongoose");
const ServiceProvider = require("./src/models/ServiceProvider");


require("dotenv").config();

const migratePrices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Find all service providers
    const providers = await ServiceProvider.find();

    for (let provider of providers) {
      if (typeof provider.price === "string") {
        // Extract numbers from "3500 Rs"
        const numericPrice = parseInt(provider.price.replace(/[^\d]/g, ""), 10);

        if (!isNaN(numericPrice)) {
          provider.price = numericPrice; // update to number
          await provider.save();
          console.log(`✅ Updated: ${provider.name} → ${numericPrice}`);
        } else {
          console.log(`⚠️ Skipped: ${provider.name}, invalid price format`);
        }
      }
    }

    console.log("🎉 Migration completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during migration:", err);
    process.exit(1);
  }
};

migratePrices();
