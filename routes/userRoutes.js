import express from "express";
import validateRequest from "../middlewares/validationMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import passport from "passport";

import {
  registerUser,
  loginController,
  logoutController,
  verifyEmail,
  forgotPassword,
  resetPassword,
  viewProfile,
  updateProfile,
  sendMobileOtp,
  resendOtpController,
  verifyMobileOtp,
} from "../controllers/userController.js";

import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  sendMobileOtpSchema,
  verifyMobileOtpSchema,
} from "../validator/authValidator.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);

router.post(
  "/login",
  validateRequest(loginSchema),
  passport.authenticate("local", { session: true }),
  loginController
);

router.get("/logout", logoutController);

router.post("/verify-email", validateRequest(verifyEmailSchema), verifyEmail);

router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword);

router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);

router.get("/profile", authMiddleware, viewProfile);

router.put("/update", authMiddleware, validateRequest(updateProfileSchema), updateProfile);

router.post("/send-mobile-otp", validateRequest(sendMobileOtpSchema), sendMobileOtp);

router.post("/resend-otp", validateRequest(forgotPasswordSchema), resendOtpController);

router.post("/verify-mobile-otp", validateRequest(verifyMobileOtpSchema), verifyMobileOtp);

export default router;
