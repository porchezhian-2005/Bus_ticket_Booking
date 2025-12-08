
import express from "express";
import  validateRequest  from "../middlewares/validationMiddleware.js";
import { createBookingSchema } from "../validator/busBookingValidator.js";
import {
  createBooking,
  viewBookingHistory,
} from "../controllers/busBookingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, validateRequest(createBookingSchema), createBooking);
router.get("/my-bookings", authMiddleware, viewBookingHistory);

export default router;
