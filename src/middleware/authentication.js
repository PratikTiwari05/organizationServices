// src/middleware/auth.js
const jwt = require("jsonwebtoken");

// middleware: verifies JWT and attaches admin info to req.admin
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "secretkey"; // use .env in real project
    const payload = jwt.verify(token, secret);
    // payload should contain adminId and organization_name
    req.admin = {
      id: payload.adminId || payload.id,
      organization_name: payload.organization_name || payload.org
    };
    return next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
