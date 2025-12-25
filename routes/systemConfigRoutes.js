import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";

import {
  updateWalletConfigSchema,
  updateReferralConfigSchema
} from "../validator/systemConfigValidator.js";

import {
  getSystemConfig,
  updateWalletConfig,
  updateReferralConfig
} from "../controllers/systemConfigController.js";

const router = express.Router();

router.get("/", authMiddleware, isAdmin, getSystemConfig);

router.patch(
  "/wallet",
  authMiddleware,
  isAdmin,
  validateRequest(updateWalletConfigSchema),
  updateWalletConfig
);

router.patch(
  "/referral",
  authMiddleware,
  isAdmin,
  validateRequest(updateReferralConfigSchema),
  updateReferralConfig
);

export default router;
