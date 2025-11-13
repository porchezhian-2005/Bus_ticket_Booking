import express from "express";
import passport from "passport";
import {
  registerUser,
  verifyOtp,
  loginSuccess,
  logoutUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);

router.post("/login", passport.authenticate("local"), loginSuccess);

router.get("/logout", logoutUser);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
