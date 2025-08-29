require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

connectDB();

const app = express();

// --- CORS setup using .env
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : "*", // fallback to * if none defined
  credentials: true,
}));

// --- middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.set("trust proxy", 1);

// --- rate limiting (general)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// --- health route
app.get("/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "dev", time: new Date().toISOString() });
});

// --- API routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/providers", require("./routes/serviceProviderRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// --- 404 + error handlers
app.use((req, res) => res.status(404).json({ message: "Not Found" }));
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// --- start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 API listening on http://localhost:${port}`));
