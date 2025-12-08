import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const registerAdmin = async (req, res) => {
  try {
    const { name, email, phone_no, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Admin already exists." });

    const admin = await Admin.create({
      name,
      email,
      phone_no,
      password,
      isAdmin: true,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      }
    });
  } catch (err) {
    console.error("Admin Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟦 Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({ message: "Admin not found." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { _id: admin._id, isAdmin: admin.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Admin logged in successfully",
      token
    });

  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const viewAdminProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    res.status(200).json({
      message: "Admin profile fetched successfully",
      admin: req.user
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

