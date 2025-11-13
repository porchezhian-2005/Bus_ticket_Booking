import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT ||  587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS,
  },
});


const sendEmail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text, html });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, country_code, phone_no, password, confirm_password } = req.body;

    if (!name || !email || !country_code || !phone_no || !password || !confirm_password)
      return res.status(400).json({ message: "All fields are required" });

    const formattedEmail = email.toLowerCase().trim();
    if (!formattedEmail.includes("@")) 
      return res.status(400).json({ message: "Invalid email" });
    if (password !== confirm_password) 
      return res.status(400).json({ message: "Passwords do not match" });
    if (phone_no.length !== 10) 
      return res.status(400).json({ message: "Phone must be 10 digits" });

    const formattedPhone = `${country_code}${phone_no}`;
    const existingUser = await User.findOne({ $or: [{ email: formattedEmail }, { phone_no: formattedPhone }] });
    if (existingUser) 
      return res.status(400).json({ message: "User already exists" });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({ message: "Weak password format" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; 

    const newUser = await User.create({
      name,
      email: formattedEmail,
      country_code,
      phone_no: formattedPhone,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    await sendEmail({
      to: formattedEmail,
      subject: "Your verification OTP",
      text: `Your OTP: ${otp} (expires in 5 minutes)`,
    });

    return res.status(201).json({ message: "User created. OTP sent to email/phone.", userId: newUser._id });
  } catch (error) {
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) return res.status(400).json({ message: "userId and otp required" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (!user.otp || !user.otpExpires || Date.now() > user.otpExpires)
      return res.status(400).json({ message: "OTP expired or invalid" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export const loginSuccess = (req, res) => {
  return res.status(200).json({
    message: "Login successful",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone_no: req.user.phone_no,
    },
  });
};

export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => res.status(200).json({ message: "Logged out" }));
  });
};

export const getProfile = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const { _id, name, email, country_code, phone_no } = req.user;
  return res.status(200).json({ user: { id: _id, name, email, country_code, phone_no } });
};

export const updateProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const updates = {};
  const allowed = ["name", "email", "country_code", "phone_no"];
  allowed.forEach((k) => { if (req.body[k]) updates[k] = req.body[k]; });

  if (updates.email) updates.email = updates.email.toLowerCase().trim();

  try {
    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password -otp");
    return res.status(200).json({ message: "Profile updated", user: updated });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; 
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}&id=${user._id}`;

    await sendEmail({
      to: user.email,
      subject: "Password reset",
      text: `Reset your password: ${resetUrl}`,
    });

    return res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;
    if (!userId || !token || !newPassword) return res.status(400).json({ message: "Required fields missing" });

    const user = await User.findOne({ _id: userId, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(newPassword)) return res.status(400).json({ message: "Weak password format" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
};
