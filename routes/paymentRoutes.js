import express from "express";
import passport from "passport";

import {
  createRazorpayOrder,
  verifyPaymentAndConfirmBooking
} from "../controllers/paymentController.js";

import validateRequest from "../middlewares/validationMiddleware.js";
import {
  razorpayOrderSchema,
  razorpayVerifySchema
} from "../validator/paymentValidation.js";

const paymentRouter = express.Router();

const authenticateJWT = passport.authenticate("jwt", { session: false });

paymentRouter.post(
  "/create-order",
  authenticateJWT,
  validateRequest(razorpayOrderSchema),
  createRazorpayOrder
);

paymentRouter.post(
  "/verify-payment",
  validateRequest(razorpayVerifySchema),
  verifyPaymentAndConfirmBooking
);

export default paymentRouter;
