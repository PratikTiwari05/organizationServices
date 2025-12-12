// src/controllers/admin_login.js
const { getDB } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const adminCol = db.collection("admins");

    // 2. Find admin by email
    const admin = await adminCol.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Compare passwords
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        organization_name: admin.organization_name
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 5. Return token
    return res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    console.error("adminLogin ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
