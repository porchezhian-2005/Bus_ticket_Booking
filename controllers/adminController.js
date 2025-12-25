import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const registerAdmin = async (req, res) => {
  try {
    const { name, email, phone_no, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email: email.toLowerCase().trim(),
      phone_no,
      password: hashedPassword,
      isAdmin: true,
    });

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      },
      token
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

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

