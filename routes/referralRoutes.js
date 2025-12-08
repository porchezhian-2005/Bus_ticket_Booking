
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import { applyReferralSchema } from "../validator/referralValidator.js";
import {
  applyReferralCode,
  getReferralStats,
  getReferredUsers,
  getAllReferralsAdmin
} from "../controllers/referralController.js";

const router = express.Router();

router.post("/apply", authMiddleware, validateRequest(applyReferralSchema), applyReferralCode);

router.get("/stats", authMiddleware, getReferralStats);

router.get("/referred-users", authMiddleware, getReferredUsers);

router.get("/admin/all", authMiddleware, isAdmin, getAllReferralsAdmin);

export default router;
