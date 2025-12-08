import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";

import {
  createCoupon,
  getAllCoupons,
  applyCoupon
} from "../controllers/couponController.js";

import {
  createCouponSchema,
  applyCouponSchema
} from "../validator/couponValidator.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  isAdmin,
  validateRequest(createCouponSchema),
  createCoupon
);

router.get(
  "/all",
  authMiddleware,
  isAdmin,
  getAllCoupons
);

router.post(
  "/apply",
  authMiddleware,
  validateRequest(applyCouponSchema),
  applyCoupon
);

export default router;
