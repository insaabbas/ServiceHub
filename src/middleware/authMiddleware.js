const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - ensure user is logged in
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // attach user to request
      next();
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

// Role-based access control
exports.allowRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "User not found in request" });

  const userRole = req.user.role || "user"; // default to 'user'
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "Forbidden: insufficient permissions" });
  }

  next();
};
